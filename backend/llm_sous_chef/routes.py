import json

from flask import Blueprint, request, jsonify

from llm_sous_chef.auth import require_auth, check_cookbook_access
from llm_sous_chef.db.db import get_cookbook_name
from llm_sous_chef.service.user_service import get_users, add_users, login
from llm_sous_chef.service.recipe_service import generate_recipe, create_cookbook, add_recipe_to_cookbook, \
    get_recipes_in_cookbook, \
    share_cookbook, delete_recipe_from_cookbook, get_cookbooks

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
    user = request.headers.get("user-id")
    pwd = request.headers.get("password")
    result = login(user, pwd)
    if result:
        return result, 200
    else:
        return jsonify({"error": "Unauthorized"}), 401

### Recipe endpoints

@main.route("/recipes/process")
@require_auth
def index():
    url = request.headers.get("url")
    response = generate_recipe(url)
    return json.loads(response)


@main.route("/recipes/add-recipe", methods=["POST"])
@require_auth
def add_recipe_to_cookbook_endpoint():
    recipe = request.get_json()
    url = recipe["url"]
    cookbook_id = request.headers.get("cookbook-id")
    user_id = request.user["user_id"]
    recipe_id = add_recipe_to_cookbook(user_id, cookbook_id, recipe, url)
    if recipe_id:
        return jsonify({"recipe_id": recipe_id}), 200
    else:
        return jsonify({"error": "Error creating recipe"}), 500

@main.route("/recipes/delete-recipe", methods=["POST"])
@require_auth
@check_cookbook_access
def delete_user_recipe_endpoint():
    cookbook_id = request.headers.get("cookbook-id")
    recipe_id = request.headers.get("recipe-id")
    rows_deleted = delete_recipe_from_cookbook(cookbook_id, recipe_id)
    if rows_deleted:
        return jsonify({"message": "Successfully deleted recipe"}), 200
    elif rows_deleted == 0:
        return jsonify({"error": "Recipe not found in cookbook"}), 500
    else:
        return jsonify({"error": "Error deleting recipe"}), 500


@main.route("/recipes/get-recipes", methods=["GET"])
@require_auth
@check_cookbook_access
def get_user_cookbook_endpoint():
    cookbook_id = request.headers.get("cookbook-id")
    recipes = get_recipes_in_cookbook(cookbook_id)

    cookbook_name = get_cookbook_name(cookbook_id)
    if recipes:
        return jsonify({"name": cookbook_name,"recipes": recipes}), 200
    elif len(recipes) == 0:
        return jsonify({"error": f"No Recipes found in cookbook {cookbook_name}"}), 200
    else:
        return jsonify({"error": "Error fetching recipes in cookbook"}), 500

@main.route("/recipes/get-cookbooks", methods=["GET"])
@require_auth
def get_cookbooks_endpoint():
    user_id = request.user["user_id"]
    cookbooks = get_cookbooks(user_id)
    if cookbooks:
        return cookbooks, 200
    elif len(cookbooks) == 0:
        return jsonify({"error": "No cookbooks found"}), 204
    else:
        return jsonify({"error": "Error creating cookbook"}), 500


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

    cookbook_id = request.headers.get("cookbook-id")

    cookbook_map_id = share_cookbook(cookbook_id, new_user)
    if cookbook_map_id:
        return jsonify({"cookbook_map_id": cookbook_map_id}), 200
    else:
        return jsonify({"error": "Error sharing cookbook with new user"}), 500

