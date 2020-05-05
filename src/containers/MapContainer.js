import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Map, GoogleApiWrapper, Polyline, Marker} from 'google-maps-react';

export class MapContainer extends React.PureComponent {
  render() {
    const {google, pathCoords, currentPos} = this.props;
    let curLatLng = null
    if (currentPos !== null) {
      curLatLng = {
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude
      }
    };

    return (
      <Map
        google={google}
        center={curLatLng}
        zoom={18}
      >
        <Marker position={curLatLng} />
        <Polyline
          path={pathCoords}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
        />
      </Map>
    );
  }
}

MapContainer.propTypes = {
  google: PropTypes.object.isRequired,
  pathCoords: PropTypes.array.isRequired,
  currentPos: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  pathCoords: state.geolocation.pathCoords,
  currentPos: state.geolocation.currentPos
});

const WrappedContainer = GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_G_MAPS)
})(MapContainer)

export default connect(
  mapStateToProps,
  null
)(WrappedContainer);