import json

from flask import Blueprint, request, jsonify

from llm_sous_chef.auth import require_auth, check_cookbook_access
from llm_sous_chef.service.user_service import get_users, add_users, login
from llm_sous_chef.service.recipe_service import generate_recipe, create_cookbook, add_recipe_to_cookbook, get_cookbook, \
    share_cookbook

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


@main.route("/recipes/add-recipe-to-cookbook", methods=["POST"])
@require_auth
def add_recipe_to_cookbook_endpoint():
    recipe = request.get_json()
    url = recipe["url"]
    cookbook_name = request.headers.get("cookbook-name")
    user_id = request.user["user_id"]
    recipe_id = add_recipe_to_cookbook(user_id, cookbook_name, recipe, url)
    if recipe_id:
        return jsonify({"recipe_id": recipe_id}), 200
    else:
        return jsonify({"error": "Error creating recipe"}), 500

@main.route("/recipes/get-recipes-in-cookbook", methods=["GET"])
@require_auth
@check_cookbook_access
def get_user_cookbook_endpoint():
    cookbook_name = request.headers.get("cookbook-name")
    recipes = get_cookbook(cookbook_name)
    if recipes:
        return jsonify({"recipes": recipes}), 200
    elif len(recipes) == 0:
        return jsonify({"error": f"No Recipes found in cookbook {cookbook_name}"}), 200
    else:
        return jsonify({"error": "Error fetching recipes in cookbook"}), 500

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


@main.route("/recipes/share-cookbook", methods=["POST"])
@require_auth
@check_cookbook_access
def share_cookbook_endpoint():
    # Get username or email
    new_user = request.headers.get("new-user-username") \
        if request.headers.get("new-user-username") \
        else request.headers.get("new-user-email")

    cookbook_name = request.headers.get("cookbook-name")
    user_id = request.user["user_id"]

    cookbook_map_id = share_cookbook(cookbook_name, new_user)
    if cookbook_map_id:
        return jsonify({"cookbook_map_id": cookbook_map_id}), 200
    else:
        return jsonify({"error": "Error sharing cookbook with new user"}), 500


@main.route("/recipes/add", methods=["POST"])
@require_auth
def add_user_recipe_endpoint():

    return None
