import os
from functools import wraps
import jwt
from datetime import datetime, timedelta
from flask import request, jsonify

from llm_sous_chef.db.db import conn
from llm_sous_chef.service.recipe_service import get_cookbook_id

EXPIRATION_MINUTES = 120
SECRET_KEY = os.getenv("JWT_SECRET")

def create_jwt(data: dict) -> str:
    data_copy = data.copy() # To add "expire" field for jwt
    data_copy["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)

    return jwt.encode(data_copy, SECRET_KEY, algorithm="HS256")

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
    return wrapper

def check_cookbook_access(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = request.user["user_id"]
        # cookbook_name = request.headers.get("cookbook-name")
        cookbook_id = request.headers.get("cookbook-id")

        with conn.cursor() as cur:
            # Get cookbook_id
            # cookbook_id = get_cookbook_id(cur, cookbook_name)
            try:
                print(f"{user_id},{cookbook_id}")
                cur.execute("""
                            SELECT * from cookbook_user_map
                            WHERE user_id=%s AND cookbook_id=%s
                            """,
                        (user_id,cookbook_id)
                    )
                result = cur.fetchone()
                print(result)
                if not result:
                    return jsonify({"error": "User has no access to cookbook"}), 401
            except Exception as e:
                print("Error checking cookbook access:", e)
                return jsonify({"error": f"Error checking cookbook access:{e}"}), 500

        return func(*args, **kwargs)
    return wrapper

# User payload looks like:
# {'user_id': 69, 'exp': 1745286354}