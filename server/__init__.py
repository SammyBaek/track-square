import time
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    @app.route('/')
    def index():
        return 'Hello world!!!'

    @app.route('/api/finish', methods=['POST'])
    def finish_run():
        content = request.get_json()
        locations = content.get('locations')
        return jsonify(locations)

    return app
