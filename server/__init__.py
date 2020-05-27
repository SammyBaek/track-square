from flask import Flask
from flask_cors import CORS
from server.api import api

def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.register_blueprint(api, url_prefix='/api')

    return app
