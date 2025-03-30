from flask import Blueprint, request
from llm_sous_chef.get_video_data import download_video

main = Blueprint("main", __name__)


@main.route("/transcribe")
def index():
    url = request.headers.get("url")
    data = download_video(url)
    return data

