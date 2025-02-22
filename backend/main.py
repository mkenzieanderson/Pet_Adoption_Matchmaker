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
import io

from dotenv import load_dotenv
from six.moves.urllib.request import urlopen
from jose import jwt
from authlib.integrations.flask_client import OAuth
from flask import Flask, request, jsonify, send_file
from connect_connector import connect_with_connector
from google.cloud import storage
from flask_cors import CORS


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
CORS(app)

ALGORITHMS = ["RS256"]
oauth = OAuth(app)

#   domain =  'YOUR_DOMAIN'

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
                    name VARCHAR(255) NOT NULL,
                    zip_code VARCHAR(10),
                    address VARCHAR(255),
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
                    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id) ON DELETE CASCADE
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
                    pet_id BIGINT,
                    user_id BIGINT NOT NULL,
                    PRIMARY KEY (id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE SET NULL
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
                    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
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

        # Extract user_id for the response
        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT user_id FROM users WHERE email = :email')
            result = conn.execute(stmt, {'email': email}).fetchone()
            user_id = result[0] if result else None

        return jsonify({"token": token, "user_id": user_id}), 200

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
    """Gets a user provided the id of the user. JWT must match the user_id or be and admin"""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT * FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()
            user = result._asdict()
            if result is None:
                raise ValueError(404)

            role = user['role']
            owner_user_id = user['user_id']
            if role != 'admin' and owner_user_id != user_id:
                raise ValueError(403)

            stmt =sqlalchemy.text(
                '''SELECT email, name, phone_number, role, user_id
                FROM users WHERE user_id = :user_id'''
            )
            result = conn.execute(stmt, parameters={'user_id':user_id}).one_or_none()
        if result is None:
            raise ValueError(404)

        user = result._asdict()

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

@app.route('/' + USERS + '/<int:user_id>', methods = ['PATCH'])
def update_user(user_id):
    """Updates the given user and returns the updated fields. If no values are
    specified to be updated, the user info is simply returned"""
    try:
        payload = verify_jwt(request)
        if not payload:  # Handle missing or invalid JWT
            raise ValueError(401)

        #check the modifier is an admin or the user
        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT * FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()
            user = result._asdict()
            if result is None:
                raise ValueError(404)

            role = user['role']
            owner_user_id = user['user_id']
            if role != 'admin' and owner_user_id != user_id:
                raise ValueError(403)

        #check for optional fields
        content = request.get_json()

        expected_types = {
            "email": str,
            "name": str,
            "phone_number": str,
        }
        for key, value in content.items():
            if key not in expected_types:
                raise ValueError(400)
            if not isinstance(value, expected_types[key]):
                raise ValueError(400)

        #get the values to update, if any
        phone_number = content.get("phone_number")
        name = content.get("name")

        #update and get new user details
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                '''UPDATE users
                SET
                    name = COALESCE(:name, name),
                    phone_number = COALESCE(:phone_number, phone_number)
                WHERE user_id = :user_id;
                '''
            )
            conn.execute(stmt, {"name": name, "phone_number": phone_number, "user_id": user_id})

            stmt =sqlalchemy.text(
                '''SELECT email, name, phone_number, role, user_id
                FROM users WHERE user_id = :user_id'''
            )
            result = conn.execute(stmt, parameters={'user_id':user_id}).one_or_none()
            conn.commit()

        if result is None:
            raise ValueError(404)

        user = result._asdict()

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
            raise ValueError(400)

        valid_types = ['dog', 'cat', 'other']
        valid_genders = ['male', 'female', 'unknown']
        valid_availability = ['available', 'not available', 'adopted', 'pending']

        if content['type'] not in valid_types:
            raise ValueError(400)
        if content['gender'] not in valid_genders:
            raise ValueError(400)
        if content['availability'] not in valid_availability:
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

@app.route('/'+PETS+'/<int:pet_id>', methods = ['GET'])
def get_pet(pet_id):
    """Gets a pet provided the id of the pet"""
    try:

        with db.connect() as conn:

            stmt = sqlalchemy.text (
                'SELECT * FROM pets where pet_id = :pet_id'
            )
            pet_result = conn.execute(stmt, parameters={'pet_id': pet_id}).one_or_none()
            if pet_result is None:
                raise ValueError(404)


            pet = pet_result._asdict()

            return pet,200


    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+ PETS, methods=['GET'])
def get_pets():
    """Returns a list of pets based on filtered attributes"""
    try:

        age = request.args.get('age', type=int)
        gender = request.args.get('gender', type=str)
        pet_type = request.args.get('type', type=str)
        availability = request.args.get('availability', type=str)
        shelter_id = request.args.get('shelter_id')

        if gender and gender not in ['male', 'female', 'unknown']:
            raise ValueError("Invalid gender value. Must be 'male', 'female', or 'unknown'.")
        if pet_type and pet_type not in ['dog', 'cat', 'other']:
            raise ValueError("Invalid type value. Must be 'dog', 'cat', or 'other'.")
        if availability and availability not in ['available', 'not available', 'adopted', 'pending']:
            raise ValueError("Invalid availability value. Must be 'available', 'not available', 'adopted', or 'pending'.")


        query = sqlalchemy.text('SELECT * FROM pets WHERE 1=1')

        filters = []
        if age:
            filters.append("age = :age")
        if gender:
            filters.append("gender = :gender")
        if pet_type:
            filters.append("type = :type")
        if availability:
            filters.append("availability = :availability")
        if shelter_id:
            filters.append("shelter_id = :shelter_id")

        if filters:
            query = sqlalchemy.text(f"{query} AND {' AND '.join(filters)}")

        print(query)

        with db.connect() as conn:
            if shelter_id is not None:
                shelter_check_stmt = sqlalchemy.text(
                    'SELECT COUNT(*) FROM shelters WHERE shelter_id = :shelter_id'
                )
                shelter_exists = conn.execute(shelter_check_stmt, {'shelter_id': shelter_id}).scalar()

                if shelter_exists == 0:
                    return {'Error': 'Shelter not found'}, 404  # Shelter does not exist

            result = conn.execute(query, {
                'age': age,
                'gender': gender,
                'type': pet_type,
                'availability': availability,
                'shelter_id' : shelter_id
            }).fetchall()

            pets = [row._asdict() for row in result]

            return jsonify({'pets': pets}), 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+PETS+'/<int:pet_id>/avatar', methods = ['POST'])
def upload_pet_avatar(pet_id):
    """Upload a picture for the pet"""
    try:
       if 'file' not in request.files:
            raise ValueError(400)

       with db.connect() as conn:

            stmt = sqlalchemy.text (
                'SELECT * FROM pets where pet_id = :pet_id'
            )
            pet_result = conn.execute(stmt, parameters={'pet_id': pet_id}).one_or_none()
            if pet_result is None:
                raise ValueError(404)
       pet = pet_result._asdict()


       file_obj = request.files['file']
       storage_client = storage.Client()
       bucket = storage_client.get_bucket(PET_PIC_BUCKET)
        # Create a blob object for the bucket with the name of the file
       blob = bucket.blob(file_obj.filename)
        # Position the file_obj to its beginning
       file_obj.seek(0)
        # Upload the file into Cloud Storage
       blob.upload_from_file(file_obj)

       with db.connect() as conn:

            stmt = sqlalchemy.text (
                'UPDATE pets SET picture_url = :picture_url WHERE pet_id = :pet_id'
            )
            conn.execute(stmt, parameters={'picture_url':file_obj.filename,
                                                        'pet_id': pet_id})
            conn.commit()

       pet['picture_url'] = file_obj.filename

       return ({'picture_url':f"{request.host_url.rstrip('/')}/pets/{pet_id}/avatar"},200)

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+PETS+'/<int:pet_id>/avatar', methods = ['GET'])
def get_pet_avatar(pet_id):
    try:
        with db.connect() as conn:

            stmt = sqlalchemy.text (
                'SELECT * FROM pets where pet_id = :pet_id'
            )
            pet_result = conn.execute(stmt, parameters={'pet_id': pet_id}).one_or_none()
            if pet_result is None:
                raise ValueError(404)
        pet = pet_result._asdict()
        file_name = pet['picture_url']
        if not file_name:
            raise ValueError(404)

        storage_client = storage.Client()
        bucket = storage_client.get_bucket(PET_PIC_BUCKET)
        # Create a blob with the given file name
        blob = bucket.blob(file_name)
        # Create a file object in memory using Python io package
        file_obj = io.BytesIO()
        # Download the file from Cloud Storage to the file_obj variable
        blob.download_to_file(file_obj)
        # Position the file_obj to its beginning
        file_obj.seek(0)
        # Send the object as a file in the response with the correct MIME type and file
        # name
        return send_file(file_obj, mimetype='image/png', download_name=file_name)

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + PETS + '/<int:pet_id>', methods = ['PATCH'])
def update_pet(pet_id):
    """Updates the given pet and returns the updated fields. If no values are
    specified to be updated, the pet info is simply returned"""
    try:
        payload = verify_jwt(request)
        if not payload:  # Handle missing or invalid JWT
            raise ValueError(401)

        #check the modifier is an admin
        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT * FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()
            user = result._asdict()
            if result is None:
                raise ValueError(404)

            role = user['role']
            if role != 'admin':
                raise ValueError(403)

        #check for optional fields
        content = request.get_json()

        valid_types = ['dog', 'cat', 'other']
        valid_genders = ['male', 'female', 'unknown']
        valid_availabilities = ['available', 'not available', 'adopted', 'pending']

        expected_types = {
            "age": int,
            "availability": str,
            "breed": str,
            "description": str,
            "gender": str,
            "name": str,
            "news_item": str,
            "type": str,
        }
        for key, value in content.items():
            if key not in expected_types:
                raise ValueError(400)
            if not isinstance(value, expected_types[key]):
                raise ValueError(400)

        if 'type' in content and content['type'] not in valid_types:
            raise ValueError(400)  # Invalid pet type
        if 'gender' in content and content['gender'] not in valid_genders:
            raise ValueError(400)  # Invalid gender
        if 'availability' in content and content['availability'] not in valid_availabilities:
            raise ValueError(400)  # Invalid availability


         # Get the values to update, if any
        age = content.get("age")
        name = content.get("name")
        breed = content.get("breed")
        description = content.get("description")
        gender = content.get("gender")
        availability = content.get("availability")
        type_ = content.get("type")
        news_item = content.get("news_item")

        # Update the pet and get the new details
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                '''UPDATE pets
                SET
                    age = COALESCE(:age, age),
                    name = COALESCE(:name, name),
                    breed = COALESCE(:breed, breed),
                    description = COALESCE(:description, description),
                    gender = COALESCE(:gender, gender),
                    availability = COALESCE(:availability, availability),
                    type = COALESCE(:type, type),
                    news_item = COALESCE(:news_item, news_item)
                WHERE pet_id = :pet_id;
                '''
            )
            conn.execute(stmt, {
                "age": age,
                "name": name,
                "breed": breed,
                "description": description,
                "gender": gender,
                "availability": availability,
                "type": type_,
                "news_item": news_item,
                "pet_id": pet_id
            })

            # Fetch the updated pet details
            stmt = sqlalchemy.text(
                '''SELECT pet_id, name, age, breed, description, gender, availability, type, news_item
                FROM pets WHERE pet_id = :pet_id
                '''
            )
            result = conn.execute(stmt, parameters={'pet_id': pet_id}).one_or_none()

            if result is None:
                raise ValueError(404)

            pet = result._asdict()
            conn.commit()

        return pet

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + PETS + '/<int:pet_id>', methods = ['DELETE'])
def delete_pet(pet_id):
    """Deletes the given pet and returns a confirmation message."""
    try:
        # Verify JWT token and get user info
        payload = verify_jwt(request)
        if not payload:  # Handle missing or invalid JWT
            raise ValueError(401)

        # Check if the user is an admin
        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT * FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()
            user = result._asdict() if result else None
            if user is None:
                raise ValueError(404)

            role = user['role']
            if role != 'admin':
                raise ValueError(403)

        # Check if the pet exists
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT * FROM pets WHERE pet_id = :pet_id'
            )
            result = conn.execute(stmt, parameters={'pet_id': pet_id}).one_or_none()

            if result is None:
                raise ValueError(404)  # Pet not found

            # Delete the pet
            stmt = sqlalchemy.text(
                'DELETE FROM pets WHERE pet_id = :pet_id'
            )
            conn.execute(stmt, parameters={'pet_id': pet_id})
            conn.commit()

        return {'message': f'Pet with ID {pet_id} deleted successfully'}, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + SHELTERS, methods=['GET'])
def get_all_shelters():
    """Returns a list of all shelters, optionally filtered by user_id"""
    try:
        payload = verify_jwt(request)
        if not payload:  # Handle missing or invalid JWT
            raise ValueError(401)

        user_id = request.args.get('user_id')  # Get user_id from query parameters (optional)

        with db.connect() as conn:
            if user_id:
                stmt = sqlalchemy.text('SELECT * FROM shelters WHERE user_id = :user_id')
                result = conn.execute(stmt, {'user_id': user_id})
            else:
                stmt = sqlalchemy.text('SELECT * FROM shelters')
                result = conn.execute(stmt)

            shelters = [row._asdict() for row in result]

            for shelter in shelters:
                shelter['self'] = f"{request.host_url.rstrip('/')}/{SHELTERS}/{shelter['shelter_id']}"

            response = {'shelters': shelters}

            return response, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code


# @app.route('/'+SHELTERS, methods = ['GET'])
# def get_all_shelters():
#     """Returns a list of all shelters"""
#     try:
#         payload = verify_jwt(request)
#         if not payload:  # Handle missing or invalid JWT
#             raise ValueError(401)

#         with db.connect() as conn:

#             stmt = sqlalchemy.text (
#                 'SELECT * FROM shelters'
#             )
#             result = conn.execute(stmt)
#             shelters = [row._asdict() for row in result]

#             for shelter in shelters:
#                 shelter['self'] = f"{request.host_url.rstrip('/')}/{SHELTERS}/{shelter['shelter_id']}"

#             response = {
#                 'shelters':shelters
#             }

#             return response, 200
#     except ValueError as e:
#         status_code = int(str(e))
#         return get_error_message(status_code), status_code
#     except AuthError as e:
#         _, status_code = e.args
#         return get_error_message(status_code), status_code

@app.route('/'+SHELTERS+'/<int:shelter_id>', methods = ['GET'])
def get_shelter(shelter_id):
    """Gets a shelter provided the id of the shelter"""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        with db.connect() as conn:
            stmt =sqlalchemy.text(
                '''SELECT * FROM shelters WHERE shelter_id = :shelter_id'''
            )
            result = conn.execute(stmt, parameters={'shelter_id':shelter_id}).one_or_none()
        if result is None:
            raise ValueError(404)

        shelter = result._asdict()

        shelter = {
            'shelter_id':shelter['shelter_id'],
            'name':shelter['name'],
            'user_id':shelter['user_id'],
            'zip_code':shelter['zip_code']
            }

        return shelter
    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + SHELTERS + '/<int:shelter_id>', methods=['DELETE'])
def delete_shelter(shelter_id):
    """Deletes a shelter from the database"""
    try:
        # Verify that the user is an admin
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        owner_sub = payload['sub']

        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT role FROM users WHERE sub = :sub')
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()

        user = result._asdict()
        role = user['role']
        if role != 'admin':
            raise ValueError(403)

        # Check if the shelter exists
        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT * FROM shelters WHERE shelter_id = :shelter_id')
            shelter = conn.execute(stmt, {'shelter_id': shelter_id}).fetchone()

        if not shelter:
            raise ValueError(404) # Shelter not found

        # Delete the shelter (pets will be deleted automatically due to ON DELETE CASCADE)
        with db.connect() as conn:
            stmt = sqlalchemy.text('DELETE FROM shelters WHERE shelter_id = :shelter_id')
            conn.execute(stmt, {'shelter_id': shelter_id})
            conn.commit()

        # Commit the changes


        return jsonify({'message': f'Shelter {shelter_id} has been successfully deleted.'}), 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except Exception as e:
        return get_error_message(500), 500  # Internal server error

@app.route('/' + SHELTERS, methods=['POST'])
def add_shelter():
    """Adds a new shelter to the database"""
    try:
        # Verify that the user is an admin
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        owner_sub = payload['sub']

        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT role, user_id FROM users WHERE sub = :sub')
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()

        user = result._asdict()
        role = user['role']
        user_id = user['user_id']
        if role != 'admin':
            raise ValueError(403)

        content = request.get_json()

        if not content or not all(key in content for key in ["name", "address", "zip_code"]):
            raise ValueError(400)

        with db.connect() as conn:
            stmt = sqlalchemy.text('''
                INSERT INTO shelters (name, address, zip_code, user_id)
                VALUES (:name, :address, :zip_code, :user_id)
            ''')
            conn.execute(
                stmt,
                {
                    'name': content['name'],
                    'address': content['address'],
                    'zip_code': content['zip_code'],
                    'user_id': user_id,
                }
            )
            stmt2 = sqlalchemy.text('SELECT last_insert_id()')
            shelter_id = conn.execute(stmt2).scalar()

            conn.commit()

        # Prepare the response
        response = {
            'shelter_id': shelter_id,
            'name': content['name'],
            'address': content['address'],
            'zip_code': content['zip_code'],
            'user_id': user_id
        }

        return jsonify(response), 201

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + SHELTERS + '/<int:shelter_id>', methods = ['PATCH'])
def update_shelter(shelter_id):
    """Updates the given shelter and returns the updated fields. If no values are
    specified to be updated, the shelter info is simply returned"""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        #check the modifier is an admin
        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text(
                'SELECT * FROM users WHERE sub = :sub'
            )
            result = conn.execute(stmt, parameters={'sub': owner_sub}).one_or_none()
            user = result._asdict()
            if result is None:
                raise ValueError(404)

            role = user['role']
            if role != 'admin':
                raise ValueError(403)

        #check for optional fields
        content = request.get_json()

        expected_types = {
            "name" : str,
            "user_id" : int,
            "zip_code" : str
        }
        for key, value in content.items():
            if key not in expected_types:
                raise ValueError(400)
            if not isinstance(value, expected_types[key]):
                raise ValueError(400)

         # Get the values to update, if any
        name = content.get("name")
        user_id = content.get("user_id")
        zip_code = content.get("zip_code")

        with db.connect() as conn:
            #check that a given user id exists and belongs to an admin
            if user_id:
                stmt = sqlalchemy.text(
                    'SELECT role FROM users WHERE user_id = :user_id'
                )
                result = conn.execute(stmt, parameters={'user_id': user_id}).one_or_none()
                if result is None:
                    return {"Error" : "user_id does not match to existing user"}, 404

                user = result._asdict()
                role = user['role']
                if role != 'admin':
                    return {"Error" : "user_id for a Shelter must have role admin"}

            stmt = sqlalchemy.text(
                '''UPDATE shelters
                SET
                    name = COALESCE(:name, name),
                    user_id = COALESCE(:user_id, user_id),
                    zip_code = COALESCE(:zip_code, zip_code)
                WHERE shelter_id = :shelter_id
                '''
            )
            conn.execute(stmt, {
                "name": name,
                "user_id": user_id,
                "zip_code": zip_code,
                "shelter_id" : shelter_id
            })

            # Fetch the updated pet details
            stmt = sqlalchemy.text(
                '''SELECT *
                FROM shelters WHERE shelter_id = :shelter_id
                '''
            )
            result = conn.execute(stmt, parameters={'shelter_id': shelter_id}).one_or_none()

            if result is None:
                raise ValueError(404)

            shelter = result._asdict()
            conn.commit()

        return shelter

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+FAVORITES+'/<int:user_id>', methods = ['GET'])
def get_user_favorites(user_id):
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        with db.connect() as conn:
            stmt =sqlalchemy.text(
                '''SELECT * FROM favorites WHERE user_id = :user_id'''
            )
            result = conn.execute(stmt, parameters={'user_id':user_id}).fetchall()
        if not result:
            return {"Error":"No favorites found for given user ID"},404

        favorites = [row._asdict() for row in result]
#
        response = {
                'favorites':favorites
            }

        return response, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+FAVORITES, methods=['POST'])
def add_favorite():
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        content = request.get_json()

        if not content or not all(key in content for key in ["user_id", "pet_id"]):
            raise ValueError(400)

        user_id = request.json.get('user_id')
        pet_id = request.json.get('pet_id')

        if not user_id or not pet_id:
            return jsonify({"Error": "User ID and Pet ID are required"}), 400

        # Check if user exists
        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT * FROM users WHERE user_id = :user_id')
            user_result = conn.execute(stmt, {'user_id': user_id}).fetchone()

        if user_result is None:
            return jsonify({"Error": "User not found"}), 404

        # Check if pet exists
        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT * FROM pets WHERE pet_id = :pet_id')
            pet_result = conn.execute(stmt, {'pet_id': pet_id}).fetchone()

        if pet_result is None:
            return jsonify({"Error": "Pet not found"}), 404

        # Add pet to favorites
        with db.connect() as conn:
            stmt = sqlalchemy.text('''
                INSERT INTO favorites (user_id, pet_id, favorited_at)
                VALUES (:user_id, :pet_id, NOW())
            ''')
            conn.execute(stmt, {'user_id': user_id, 'pet_id': pet_id})
            new_favorite_id = conn.execute(sqlalchemy.text('SELECT LAST_INSERT_ID()')).scalar()

        return jsonify(
            {
                "id": new_favorite_id,
                "user_id": user_id,
                "pet_id": pet_id,
            }
        ), 201

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+ FAVORITES + '/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    """Deletes a favorite from a user's list if they are the owner."""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        user_sub = payload['sub']

        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT user_id FROM users WHERE sub = :sub')
            result = conn.execute(stmt, {'sub': user_sub}).one_or_none()

            if result is None:
                raise ValueError(404)

            user_id = result.user_id

            # Check if the favorite exists and belongs to the user
            stmt = sqlalchemy.text('SELECT id FROM favorites WHERE id = :favorite_id AND user_id = :user_id')
            result = conn.execute(stmt, {'favorite_id': favorite_id, 'user_id': user_id}).one_or_none()

            if result is None:
                raise ValueError(403)

            stmt = sqlalchemy.text('DELETE FROM favorites WHERE id = :favorite_id')
            conn.execute(stmt, {'favorite_id': favorite_id})
            conn.commit()

        return {"message": "Favorite successfully deleted"}, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/'+ PET_DISPOSITIONS +'/<int:pet_id>', methods=['GET'])
def get_pet_dispositions(pet_id):
    """Retrieve all dispositions for a given pet."""

    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        with db.connect() as conn:
            stmt = sqlalchemy.text(
                '''SELECT disposition FROM pet_dispositions WHERE pet_id = :pet_id'''
            )
            result = conn.execute(stmt, {'pet_id': pet_id})

            rows = result.fetchall()  # Fetch all rows

            if not rows:
                raise ValueError(404)

            # Extract only the 'disposition' values correctly
            dispositions = [row._mapping["disposition"] for row in rows]  # Correct way to access named columns

            return {"pet_id": pet_id, "dispositions": dispositions}, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + PET_DISPOSITIONS + '/<int:pet_id>', methods=['POST'])
def add_pet_disposition(pet_id):
    """Adds a disposition to a pet."""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        owner_sub = payload['sub']
        with db.connect() as conn:
            stmt = sqlalchemy.text('SELECT role FROM users WHERE sub = :sub')
            result = conn.execute(stmt, {'sub': owner_sub}).one_or_none()
            user = result._asdict()

            if user is None or user['role'] != 'admin':
                raise ValueError(403)

            # Check if pet exists
            stmt = sqlalchemy.text('SELECT pet_id FROM pets WHERE pet_id = :pet_id')
            pet_result = conn.execute(stmt, {'pet_id': pet_id}).one_or_none()
            if pet_result is None:
                raise ValueError(404)

            content = request.get_json()
            disposition = content.get("disposition")
            if not disposition:
                raise ValueError(400)

            # Insert disposition
            stmt = sqlalchemy.text(
                'INSERT INTO pet_dispositions (disposition, pet_id) VALUES (:disposition, :pet_id)'
            )
            conn.execute(stmt, {'disposition': disposition, 'pet_id': pet_id})
            conn.commit()

        return {"message": "Disposition added successfully."}, 201

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code

@app.route('/' + PET_DISPOSITIONS + '/<int:pet_id>', methods=['DELETE'])
def delete_pet_disposition(pet_id):
    """Delete a specific disposition for a given pet."""
    try:
        payload = verify_jwt(request)
        if not payload:
            raise ValueError(401)

        content = request.get_json()
        if "disposition" not in content:
            raise ValueError(400)

        disposition = content["disposition"]

        with db.connect() as conn:
            # Check if the disposition exists
            stmt_check = sqlalchemy.text(
                '''SELECT * FROM pet_dispositions WHERE pet_id = :pet_id AND disposition = :disposition'''
            )
            result = conn.execute(stmt_check, {'pet_id': pet_id, 'disposition': disposition}).fetchone()

            if result is None:
                return {"message": "Disposition not found"}, 404

            # Delete the disposition
            stmt_delete = sqlalchemy.text(
                '''DELETE FROM pet_dispositions WHERE pet_id = :pet_id AND disposition = :disposition'''
            )
            conn.execute(stmt_delete, {'pet_id': pet_id, 'disposition': disposition})
            conn.commit()

        return {"message": f"Disposition '{disposition}' deleted successfully"}, 200

    except ValueError as e:
        status_code = int(str(e))
        return get_error_message(status_code), status_code
    except AuthError as e:
        _, status_code = e.args
        return get_error_message(status_code), status_code



init_db()
create_table(db)

if __name__ == '__main__':
    init_db()
    create_table(db)
    app.run(host='0.0.0.0', port=8080, debug=True)
