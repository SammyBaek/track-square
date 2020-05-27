from flask import Flask, request, jsonify, Blueprint
from time import time
from server.geoposition import GeoPosition
from server.database import mongo

api = Blueprint('api', __name__)

@api.route('/hello')
def hello_world():
    return 'Hello world!!'


@api.route('/finish', methods=['POST'])
def finish_run():
    content = request.get_json()
    locations_json = content.get('locations')
    locations = [GeoPosition(loc) for loc in locations_json]
    res = [{'lat': geo.latitude+0.0001, 'lng': geo.longitude} for geo in locations]
    runs = mongo.db['runs']
    timestamp = int(time())
    run = {
        # TODO: create and get username
        'user': 'samm',
        'timestamp': timestamp,
        'locations': locations_json
    }
    doc = runs.insert_one(run)

    return jsonify(res)
