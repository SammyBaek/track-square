from os import environ
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from server.api import api
from server.database import mongo

def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    path = join(dirname(__file__), '../.env')
    load_dotenv(path)
    mongo_uri = environ.get('MONGO_URI')
    mongo.init_app(app, mongo_uri)

    app.register_blueprint(api, url_prefix='/api')

    return app
