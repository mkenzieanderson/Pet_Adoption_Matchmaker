# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import annotations

import logging
import os
import json
import requests
import sqlalchemy
import bcrypt
from jose import jwt

from dotenv import load_dotenv
from six.moves.urllib.request import urlopen
from jose import jwt
from authlib.integrations.flask_client import OAuth
from flask import Flask, request, jsonify, send_file
from connect_connector import connect_with_connector
from google.cloud import storage


load_dotenv()

# Global endpoint names
PETS = "pets"
PET_DISPOSITIONS  = 'pet_dispositions'
SHELTERS = "shelters"
FAVORITES = "favorites"
USERS = "users"

PET_PIC_BUCKET = "cap_pet_photos"

#global secrets for auth
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
DOMAIN = os.getenv("DOMAIN")

ERROR_NOT_FOUND = {'Error' : 'Not Found'}

app = Flask(__name__)
logger = logging.getLogger()

ALGORITHMS = ["RS256"]
oauth = OAuth(app)

auth0 = oauth.register(
    'auth0',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    api_base_url="https://" + DOMAIN,
    access_token_url="https://" + DOMAIN + "/oauth/token",
    authorize_url="https://" + DOMAIN + "/authorize",
    client_kwargs={
        'scope': 'openid profile email',
    },
)

# This code is adapted from https://auth0.com/docs/quickstart/backend/python/01-authorization?_ga=2.46956069.349333901.1589042886-466012638.1589042885#create-the-jwt-validation-decorator

class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Verify the JWT in the request's Authorization header
def verify_jwt(request):
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization'].split()
        token = auth_header[1]
    else:
        raise AuthError({"code": "no auth header",
                            "description":
                                "Authorization header is missing"}, 401)

    jsonurl = urlopen("https://"+ DOMAIN+"/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())
    try:
        unverified_header = jwt.get_unverified_header(token)
    except jwt.JWTError:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Invalid header. "
                            "Use an RS256 signed JWT Access Token"}, 401)
    if unverified_header["alg"] == "HS256":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Invalid header. "
                            "Use an RS256 signed JWT Access Token"}, 401)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=CLIENT_ID,
                issuer="https://"+ DOMAIN+"/"
            )
        except jwt.ExpiredSignatureError:
            raise AuthError({"code": "token_expired",
                            "description": "token is expired"}, 401)
        except jwt.JWTClaimsError:
            raise AuthError({"code": "invalid_claims",
                            "description":
                                "incorrect claims,"
                                " please check the audience and issuer"}, 401)
        except Exception:
            raise AuthError({"code": "invalid_header",
                            "description":
                                "Unable to parse authentication"
                                " token."}, 401)

        return payload
    else:
        raise AuthError({"code": "no_rsa_key",
                            "description":
                                "No RSA key in JWKS"}, 401)

# Sets up connection pool for the app
def init_connection_pool() -> sqlalchemy.engine.base.Engine:
    if os.environ.get('INSTANCE_CONNECTION_NAME'):
        return connect_with_connector()

    raise ValueError(
        'Missing database connection type. Please define INSTANCE_CONNECTION_NAME'
    )

# This global variable is declared with a value of `None`
db = None

# Initiates connection to database
def init_db():
    global db
    db = init_connection_pool()

def create_table(db: sqlalchemy.engine.base.Engine) -> None:
    with db.connect() as conn:

        # Create the users table
        conn.execute(
            sqlalchemy.text(
               '''CREATE TABLE IF NOT EXISTS users (
                    user_id BIGINT AUTO_INCREMENT NOT NULL,
                    sub VARCHAR(255) UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    phone_number VARCHAR(15),
                    name VARCHAR(100),
                    role ENUM('user', 'admin') NOT NULL,
                    PRIMARY KEY (user_id)
                );
                '''
            )
        )

        conn.execute(
            sqlalchemy.text(
                '''
                CREATE TABLE IF NOT EXISTS shelters (
                    shelter_id BIGINT AUTO_INCREMENT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    zip_code VARCHAR(10),
                    user_id BIGINT NOT NULL,
                    PRIMARY KEY (shelter_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                );
                '''
            )
        )

        conn.execute(
            sqlalchemy.text(
                '''
                CREATE TABLE IF NOT EXISTS pets (
                    pet_id BIGINT AUTO_INCREMENT NOT NULL,
                    name VARCHAR(100),
                    type ENUM('dog', 'cat', 'other'),
                    gender ENUM('male', 'female', 'unknown'),
                    news_item VARCHAR(255),
                    date_created DATETIME NOT NULL,
                    age INT,
                    breed VARCHAR(100),
                    description VARCHAR(255),
                    availability ENUM('available', 'not available', 'adopted', 'pending') NOT NULL,
                    picture_url VARCHAR(255),
                    shelter_id BIGINT,
                    PRIMARY KEY (pet_id),
                    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id) ON DELETE SET NULL
                );
                '''
            )
        )

        conn.execute(
            sqlalchemy.text(
                '''
                CREATE TABLE IF NOT EXISTS favorites (
                    id BIGINT AUTO_INCREMENT NOT NULL,
                    favorited_at DATETIME NOT NULL,
                    pet_id BIGINT NOT NULL,
                    user_id BIGINT NOT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id),
                    FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
                );
                '''
            )
        )
        conn.execute(
            sqlalchemy.text(
                '''
                CREATE TABLE IF NOT EXISTS pet_dispositions (
                    disposition VARCHAR(255) NOT NULL,
                    pet_id BIGINT NOT NULL,
                    FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
                );
                '''
            )
        )

        conn.commit()

def get_error_message(status_code):
    """Return a JSON error message for a given response status code."""
    error_messages = {
        400: {"Error": "The request body is invalid"},
        401: {"Error": "Unauthorized"},
        403: {"Error": "You don't have permission on this resource"},
        404: {"Error": "Not found"},
        409: {"Error": "data is invalid"}
    }
    return error_messages.get(status_code, {"Error": "Unknown error code"})


@app.route('/')
def index():
    return 'Please navigate to /pets to use this API'

@app.route('/'+ USERS + '/login', methods=['POST'])
def login_user():
    try:
        content = request.get_json()

        if not content or not all(key in content for key in ["email", "password"]):
            raise ValueError(400)

        email = content["email"]
        password = content["password"]

        body = {'grant_type':'password',
                'username':email, #Auth0 Setup with username. Using email address as username
                'password':password,
                'client_id':CLIENT_ID,
                'client_secret':CLIENT_SECRET
                }

        headers = { 'content-type': 'application/json' }
        url = 'https://' + DOMAIN + '/oauth/token'

        r = requests.post(url, json=body, headers=headers)

        if r.status_code != 200:
            raise ValueError(401)
        token = r.json().get('id_token')
        return jsonify({"token": token}), 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code

@app.route('/'+USERS, methods = ['GET'])
def get_all_users():
    """Returns a list of all users if the provided JWT is type admin"""
    try:
        payload = verify_jwt(request)
        if not payload:  # Handle missing or invalid JWT
            raise ValueError(401)

        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT role, email FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()
            user = result._asdict()
            role = user['role']
            if role != 'admin':
                raise ValueError(403)

            users_stmt = sqlalchemy.text (
                'SELECT user_id, email, name, role, sub from users'
            )
            users_result = conn.execute(users_stmt)
            users = [row._asdict() for row in users_result]

            for user in users:
                user['self'] = f"{request.host_url.rstrip('/')}/{USERS}/{user['user_id']}"

            response = {
                'users':users
            }

            return response, 200
    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code


@app.route('/'+USERS+'/<int:user_id>', methods = ['GET'])
def get_user(user_id):
    """Gets a user provided the id of the user"""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        with db.connect() as conn:
            stmt =sqlalchemy.text(
                '''SELECT email, name, phone_number, role, user_id
                FROM users WHERE user_id = :user_id'''
            )
            result = conn.execute(stmt, parameters={'user_id':user_id}).one_or_none()
        if result is None:
            raise ValueError(404)

        user = result._asdict()
        if user['user_id'] != user_id and user['role'] != "admin":
            raise ValueError(403)

        user = {
            'user_id':user['user_id'],
            'email':user['email'],
            'name':user['name'],
            'phone_number':user['phone_number'],
            'role':user['role']
        }

        return user
    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+PETS, methods = ['POST'])
def add_pet():
    """Adds a pet to the database"""
    try:

        #verify uploader is an admin
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)
        owner_sub = payload['sub']

        with db.connect() as conn:
            stmt = sqlalchemy.text (
                'SELECT role FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()

        user = result._asdict()
        role = user['role']
        if role != 'admin':
            raise ValueError(403)

        content = request.get_json()

        #check required fields
        if not content or not all(key in content for key in ["name", "type", "gender", "age", "breed","description", "availability", "shelter_id"]):
            print('gey')
            raise ValueError(400)

        with db.connect() as conn:
            stmt = sqlalchemy.text (
                '''
                INSERT INTO pets (name, type, gender, news_item, date_created, age, breed,
                                description, availability, shelter_id)
                VALUES (:name, :type, :gender, :news_item, NOW(), :age, :breed,
                        :description, :availability, :shelter_id)
                '''
            )
            conn.execute(
                stmt,
                {
                    'name': content['name'],
                    'type': content['type'],
                    'gender': content['gender'],
                    'news_item': content.get('news_item', None),  # Optional field
                    'age': content['age'],
                    'breed': content['breed'],
                    'description': content['description'],
                    'availability': content['availability'],
                    'shelter_id': content['shelter_id'],
                }
            )
            stmt2 = sqlalchemy.text('SELECT last_insert_id()')
            pet_id = conn.execute(stmt2).scalar()

            conn.commit()

        response = {
                'pet_id': pet_id,
                'name': content['name'],
                'type': content['type'],
                'gender': content['gender'],
                'age': content['age'],
                'breed': content['breed'],
                'description': content['description'],
                'availability': content['availability'],
                'shelter_id': content['shelter_id']
            }
        if content.get('news_item'):
                response['news_item'] = content['news_item']
        return response, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + PETS, methods=['GET'])
def get_all_pets():
    """Returns a list of all pets or a filtered list based on shelter_id."""
    try:
        # Get shelter_id from query parameters (e.g., /pets?shelter_id=123)
        print(f"Received query params: {request.args}")

        shelter_id = request.args.get('shelter_id')
        print(shelter_id)

        with db.connect() as conn:
            if shelter_id is not None:
                shelter_check_stmt = sqlalchemy.text(
                    'SELECT COUNT(*) FROM shelters WHERE shelter_id = :shelter_id'
                )
                shelter_exists = conn.execute(shelter_check_stmt, {'shelter_id': shelter_id}).scalar()

                if shelter_exists == 0:
                    return {'Error': 'Shelter not found'}, 404  # Shelter does not exist

                stmt = sqlalchemy.text('SELECT * FROM pets WHERE shelter_id = :shelter_id')
                pet_result = conn.execute(stmt, {'shelter_id': shelter_id})
            else:
                stmt = sqlalchemy.text('SELECT * FROM pets')
                pet_result = conn.execute(stmt)


            pets = [row._asdict() for row in pet_result]

            if not pets:
                return {'message': 'No pets found'}, 204

            for pet in pets:
                pet['self'] = f"{request.host_url.rstrip('/')}/{PETS}/{pet['pet_id']}"

            return {'pets': pets}, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code
    except Exception as e:
        print(e)

@app.route('/'+PETS+'/<int:pet_id>', methods = ['GET'])
def get_pet(pet_id):
    """Gets a pet provided the id of the pet"""
    try:

        with db.connect() as conn:

            stmt = sqlalchemy.text (
                'SELECT * FROM pets where pet_id = :pet_id'
            )
            pet_result = conn.execute(stmt, parameters={'pet_id': pet_id}).one_or_none()
            print(pet_result)
            if pet_result is None:
                raise ValueError(404)


            pet = [row._asdict() for row in pet_result]

            return pet, 200


    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code


if __name__ == '__main__':
    init_db()
    create_table(db)
    app.run(host='0.0.0.0', port=8080, debug=True)
