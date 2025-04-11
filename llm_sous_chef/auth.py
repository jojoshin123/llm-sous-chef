import os
import jwt
from datetime import datetime, timedelta

EXPIRATION_MINUTES = 120

def create_jwt(data: dict):
    data_copy = data.copy() # To add "expire" field for jwt
    secret = os.getenv("JWT_SECRET")
    data_copy["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)

    return jwt.encode(data_copy, secret, algorithm="HS256")

# TODO: create @require_auth annotation for protected endpoints

