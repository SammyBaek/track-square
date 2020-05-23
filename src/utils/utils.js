/**
 * Copies HTML5 GeolocationPosition object to a normal object
 * because JS is unable to serialize it otherwise (turns into empty {})
 * 
 * @param {GeolocationPosition} geoposition 
 */
const copyGeopos = (geoposition) =>{
  return {
    timestamp: geoposition.timestamp,
    coords: {
      accuracy: geoposition.coords.accuracy,
      altitude: geoposition.coords.altitude,
      altitudeAccuracy: geoposition.coords.altitudeAccuracy,
      heading: geoposition.coords.heading,
      latitude: geoposition.coords.latitude,
      longitude: geoposition.coords.longitude,
      speed: geoposition.coords.speed,
    },
  };
};

export default copyGeopos;