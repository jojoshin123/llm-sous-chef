import json

from flask import Blueprint, request, jsonify

from llm_sous_chef.auth import require_auth
from llm_sous_chef.service.user_service import get_users, add_users, login
from llm_sous_chef.service.recipe_service import generate_recipe, create_cookbook

main = Blueprint("main", __name__)

### User endpoints

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
    if result:
        return jsonify({"token": str(result)}), 200
    else:
        return jsonify({"error": "Unauthorized"}), 401

### Recipe endpoints

@main.route("/recipes/process")
@require_auth
def index():
    url = request.headers.get("url")
    response = generate_recipe(url)
    return json.loads(response)


@main.route("/recipes/create-cookbook", methods=["POST"])
@require_auth
def add_user_cookbook_endpoint():
    cookbook_name = request.headers.get("cookbook-name")
    user_id = request.user["user_id"]
    cookbook_id = create_cookbook(user_id, cookbook_name)
    if cookbook_id:
        return jsonify({"cookbook_id": cookbook_id}), 200
    else:
        return jsonify({"error": "Error creating cookbook"}), 500


@main.route("/recipes/get-cookbook", methods=["GET"])
@require_auth
def get_user_cookbook_endpoint():

    return None


@main.route("/recipes/add", methods=["POST"])
@require_auth
def add_user_recipe_endpoint():

    return None
