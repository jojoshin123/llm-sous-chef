from flask import Blueprint, request, jsonify
from llm_sous_chef.get_video_data import download_video
from llm_sous_chef.get_recipe import get_recipe
from llm_sous_chef.db.create import get_users, add_users

main = Blueprint("main", __name__)

@main.route("/transcribe")
def index():
    url = request.headers.get("url")
    data = download_video(url)
    response = get_recipe(data)
    return response

@main.route("/get-users")
def get_users_endpoint():
    return get_users()

@main.route("/signup", methods=["POST"])
def add_user_endpoint():
    user_id = add_users(request.headers.get("username"),
                     request.headers.get("email"),
                     request.headers.get("password"))
    if user_id:
        return jsonify({"userId": user_id }), 200
    else:
        return jsonify({"error": "User already exists" }), 409

# @main.route("/login", methods=["POST"])
# def add_user_endpoint():
#     return login(request.headers.get("username"),
#                      request.headers.get("password"))