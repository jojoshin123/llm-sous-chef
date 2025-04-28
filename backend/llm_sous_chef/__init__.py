from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS


def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000"])

    from .routes import main
    app.register_blueprint(main)

    return app