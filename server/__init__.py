from os import environ
from flask import Flask
from flask_cors import CORS
from server.api import api
from server.database import mongo

def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'
    mongo.init_app(app, environ.get('MONGO_URI'))
    app.register_blueprint(api, url_prefix='/api')

    return app
