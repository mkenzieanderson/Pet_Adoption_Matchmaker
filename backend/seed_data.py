#This file imports seed data into the db for testing

from connect_connector import connect_with_connector
import os
import sqlalchemy
from datetime import datetime


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


users_data = [
    {
        "sub": "auth0|6747a3e6d11685c7abf3a387",
        "email": "admin1@osu.com",
        "password_hash": "b'$2b$12$PLig3AwQHmRh8ZVNz3YvhuluritYF7ahT8WnWwe9qxO11kQzfx0Gi'",
        "phone_number": "2068963354",
        "name": "Admin John",
        "role": "admin"
    },
    {
        "sub": "auth0|6794182d788c35ba1afc038c",
        "email": "admin2@osu.com",
        "password_hash": "b'$2b$12$PLig3AwQHmRh8ZVNz3YvhuluritYF7ahT8WnWwe9qxO11kQzfx0Gi'",
        "phone_number": "2064539874",
        "name": "Admin Jane",
        "role": "admin"
    },
    {
        "sub": "auth0|67941846c0ddc509d68306ad",
        "email": "adopter1@osu.com",
        "password_hash": "b'$2b$12$PLig3AwQHmRh8ZVNz3YvhuluritYF7ahT8WnWwe9qxO11kQzfx0Gi'",
        "phone_number": "2064685546",
        "name": "Adopter Lois",
        "role": "user"
    },
    {
        "sub": "auth0|679418613fe2ab75df251d0e",
        "email": "adopter2@osu.com",
        "password_hash": "b'$2b$12$PLig3AwQHmRh8ZVNz3YvhuluritYF7ahT8WnWwe9qxO11kQzfx0Gi'",
        "phone_number": "2064685546",
        "name": "Adopter Brynn",
        "role": "user"
    },
    {
        "sub": "auth0|6794186e42447beb032189f0",
        "email": "adopter3@osu.com",
        "password_hash": "b'$2b$12$PLig3AwQHmRh8ZVNz3YvhuluritYF7ahT8WnWwe9qxO11kQzfx0Gi'",
        "phone_number": "2064684322",
        "name": "Adopter Blake",
        "role": "user"
    },
    {
        "sub": "auth0|6794187f3fe2ab75df251d26",
        "email": "adopter4@osu.com",
        "password_hash": "b'$2b$12$PLig3AwQHmRh8ZVNz3YvhuluritYF7ahT8WnWwe9qxO11kQzfx0Gi'",
        "phone_number": "2064321123",
        "name": "Adopter Don",
        "role": "user"
    },
]

pets_data = [
{
        'name': 'Buddy',
        'type': 'dog',
        'gender': 'male',
        'news_item': 'Looking for a new home!',
        'date_created': '2025-01-26 12:00:00',
        'age': 3,
        'breed': 'Labrador Retriever',
        'description': 'Loves to play fetch and enjoys long walks.',
        'availability': 'available',
        'picture_url': 'https://example.com/images/buddy.jpg',
        'shelter_id': 1
    },
    {
        'name': 'Whiskers',
        'type': 'cat',
        'gender': 'female',
        'news_item': 'Needs a calm home environment.',
        'date_created': '2025-01-26 12:00:00',
        'age': 2,
        'breed': 'Siamese',
        'description': 'A bit shy, but loves to cuddle once comfortable.',
        'availability': 'adopted',
        'picture_url': 'https://example.com/images/whiskers.jpg',
        'shelter_id': 2
    },
    {
        'name': 'Fluffy',
        'type': 'other',
        'gender': 'unknown',
        'news_item': 'Has a lot of energy!',
        'date_created': '2025-01-26 12:00:00',
        'age': 1,
        'breed': 'Rabbit',
        'description': 'Loves to hop around and explore.',
        'availability': 'pending',
        'picture_url': 'https://example.com/images/fluffy.jpg',
        'shelter_id': 3
    }
]

shelters_data = [
    {
        'name': 'Happy Tails Shelter',
        'zip_code': '98101',
        'user_id': 1
    },
    {
        'name': 'Paws and Claws Rescue',
        'zip_code': '98102',
        'user_id': 2
    },
    {
        'name': 'Furry Friends Haven',
        'zip_code': '98103',
        'user_id': 1
    }
]

pet_dispositions_seed_data = [
    {
        'disposition': 'friendly',
        'pet_id': 1
    },
    {
        'disposition': 'shy',
        'pet_id': 1
    },
    {
        'disposition': 'energetic',
        'pet_id': 2
    },
    {
        'disposition': 'playful',
        'pet_id': 3
    }
]

favorites_seed_data = [
    {
        'favorited_at': '2025-01-25 14:30:00',
        'pet_id': 3,
        'user_id': 3
    },
    {
        'favorited_at': '2025-01-25 15:00:00',
        'pet_id': 3,
        'user_id': 4
    },
    {
        'favorited_at': '2025-01-25 16:30:00',
        'pet_id': 1,
        'user_id': 5
    },
    {
        'favorited_at': '2025-01-25 17:00:00',
        'pet_id': 2,
        'user_id': 3
    }
]

def insert_seed_data(db: sqlalchemy.engine.base.Engine) -> None:
    with db.connect() as conn:

        conn.execute(sqlalchemy.text('DELETE FROM favorites'))
        conn.execute(sqlalchemy.text('DELETE FROM pet_dispositions'))
        conn.execute(sqlalchemy.text('DELETE FROM pets'))
        conn.execute(sqlalchemy.text('DELETE FROM shelters'))
        conn.execute(sqlalchemy.text('DELETE FROM users'))


        conn.execute(sqlalchemy.text('ALTER TABLE favorites AUTO_INCREMENT = 1'))
        conn.execute(sqlalchemy.text('ALTER TABLE pet_dispositions AUTO_INCREMENT = 1'))
        conn.execute(sqlalchemy.text('ALTER TABLE pets AUTO_INCREMENT = 1'))
        conn.execute(sqlalchemy.text('ALTER TABLE shelters AUTO_INCREMENT = 1'))
        conn.execute(sqlalchemy.text('ALTER TABLE users AUTO_INCREMENT = 1'))

        # # Insert seed data for users
        for user_data in users_data:
            conn.execute(
                sqlalchemy.text(
                    '''
                    INSERT INTO users (sub, email, password_hash, phone_number, name, role)
                    VALUES (:sub, :email, :password_hash, :phone_number, :name, :role);
                    '''
                ),
                {
                    "sub": user_data['sub'],
                    "email": user_data['email'],
                    "password_hash": user_data['password_hash'],
                    "phone_number": user_data['phone_number'],
                    "name": user_data['name'],
                    "role": user_data['role']
                }
            )
        conn.commit()


        # Insert seed data for shelters
        for shelter_data in shelters_data:
            conn.execute(
                sqlalchemy.text(
                    '''
                    INSERT INTO shelters (name, zip_code, user_id)
                    VALUES (:name, :zip_code, :user_id);
                    '''
                ),
                {
                    "name": shelter_data['name'],
                    "zip_code": shelter_data['zip_code'],
                    "user_id": shelter_data['user_id']
                }
            )
        conn.commit()


        # Insert seed data for pets
        for pet_data in pets_data:
            conn.execute(
                sqlalchemy.text(
                    '''
                    INSERT INTO pets (name, type, gender, news_item, date_created, age, breed, description, availability, picture_url, shelter_id)
                    VALUES (:name, :type, :gender, :news_item, :date_created, :age, :breed, :description, :availability, :picture_url, :shelter_id);
                    '''
                ),
                {
                    "name": pet_data['name'],
                    "type": pet_data['type'],
                    "gender": pet_data['gender'],
                    "news_item": pet_data['news_item'],
                    "date_created": datetime.strptime(pet_data['date_created'], "%Y-%m-%d %H:%M:%S"),
                    "age": pet_data['age'],
                    "breed": pet_data['breed'],
                    "description": pet_data['description'],
                    "availability": pet_data['availability'],
                    "picture_url": pet_data['picture_url'],
                    "shelter_id": pet_data['shelter_id']
                }
            )
            conn.commit()

        # Insert seed data for pet_dispositions
        for disposition_data in pet_dispositions_seed_data:
            conn.execute(
                sqlalchemy.text(
                    '''
                    INSERT INTO pet_dispositions (disposition, pet_id)
                    VALUES (:disposition, :pet_id);
                    '''
                ),
                {"disposition": disposition_data['disposition'], "pet_id": disposition_data['pet_id']}
            )
            conn.commit()

        # # Insert seed data for favorites
        for favorite_data in favorites_seed_data:
            conn.execute(
                sqlalchemy.text(
                    '''
                    INSERT INTO favorites (favorited_at, pet_id, user_id)
                    VALUES (:favorited_at, :pet_id, :user_id);
                    '''
                ),
                {
                    "favorited_at": datetime.strptime(favorite_data['favorited_at'], "%Y-%m-%d %H:%M:%S"),
                    "pet_id": favorite_data['pet_id'],
                    "user_id": favorite_data['user_id']
                }
            )

        conn.commit()





# def create_table(db: sqlalchemy.engine.base.Engine) -> None:
#     with db.connect() as conn:
if __name__ == '__main__':
    init_db()
    insert_seed_data(db)

