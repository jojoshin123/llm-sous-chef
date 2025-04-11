import os
from functools import wraps
import jwt
from datetime import datetime, timedelta
from flask import request, jsonify

EXPIRATION_MINUTES = 120
SECRET_KEY = os.getenv("JWT_SECRET")

def create_jwt(data: dict):
    data_copy = data.copy() # To add "expire" field for jwt
    data_copy["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)

    return jwt.encode(data_copy, SECRET_KEY, algorithm="HS256")

# TODO: create @require_auth annotation for protected endpoints

def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer"):
            return jsonify({"Error": "Invalid Bearer token"}), 401

        token = auth_header.split(" ")[1]
        try:
            user_payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"Error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        # Attach user payload to request object
        request.user = user_payload
        return func(*args, **kwargs)