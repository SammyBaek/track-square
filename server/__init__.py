import time
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from server.geoposition import GeoPosition

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
        locations_json = content.get('locations')
        locations = [GeoPosition(loc) for loc in locations_json]
        res = [{'lat': geo.latitude+0.0001, 'lng': geo.longitude} for geo in locations]
        return jsonify(res)

    return app
