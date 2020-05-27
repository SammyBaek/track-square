"""
Copy of HTML5 GeolocationPosition object
"""
class GeoPosition:
    # TODO: make this encodable to store in MongoDB
    def __init__(self, geo_position_json):
        self.timestamp = geo_position_json.get('timestamp')

        coords = geo_position_json.get('coords')
        self.accuracy = coords.get('accuracy')
        self.altitude = coords.get('accuracy')
        self.altitudeAccuracy = coords.get('altitudeAccuracy')
        self.heading = coords.get('heading')
        self.latitude = coords.get('latitude')
        self.longitude = coords.get('longitude')
        self.speed = coords.get('speed')

        self.coords = coords
        

    def __str__(self):
        return 'GeoPosition -  timestamp: {}, coords: {}'.format(self.timestamp, self.coords)
