import os

from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS


def create_app():
    load_dotenv()
    app = Flask(__name__)
    origins_env = os.getenv("ORIGINS")
    CORS(app, origins=origins_env)

    from .routes import main
    app.register_blueprint(main)

    return app