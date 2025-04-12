import json

from flask import Blueprint, request, jsonify

from llm_sous_chef.auth import require_auth
from llm_sous_chef.service.user_service import get_users, add_users, login
from llm_sous_chef.service.recipe_service import generate_recipe

main = Blueprint("main", __name__)

@main.route("/transcribe")
@require_auth
def index():
    url = request.headers.get("url")
    response = generate_recipe(url)
    return json.loads(response)

@main.route("/get-users")
def get_users_endpoint():
    return get_users()

@main.route("/signup", methods=["POST"])
def signup_endpoint():
    user_id = add_users(request.headers.get("username"),
                     request.headers.get("email"),
                     request.headers.get("password"))
    if user_id:
        return jsonify({"userId": user_id }), 200
    else:
        return jsonify({"error": "User already exists" }), 409

@main.route("/login", methods=["POST"])
def login_endpoint():
    # Get username or email
    user = request.headers.get("username") if request.headers.get("username") else request.headers.get("email")
    pwd = request.headers.get("password")
    result = login(user, pwd)

    return str(result)
