import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {Map, GoogleApiWrapper, Polyline, Marker} from "google-maps-react";
import {getCurrentPos} from "../actions/simpleAction";

export class MapContainer extends React.PureComponent {

  componentDidMount() {
    const {getCurrentPosDisp} = this.props;
    getCurrentPosDisp();
  }

  render() {
    const {google, pathCoords, currentPos, optimizedPathCoords} = this.props;
    let curLatLng = null
    if (currentPos !== null) {
      curLatLng = {
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude,
      }
    };

    const containerStyle = {
      position: "relative",
      height: "90vh",
    };

    return (
      <div style={containerStyle}>
        <Map
          google={google}
          center={curLatLng}
          zoom={19}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          <Marker position={curLatLng} />
          <Polyline
            path={pathCoords}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
          />
          <Polyline
            path={optimizedPathCoords}
            strokeColor="#00FF00"
            strokeOpacity={0.7}
            strokeWeight={2}
          />
        </Map>
      </div>
    );
  }
}

MapContainer.defaultProps = {
  currentPos: null,
};

MapContainer.propTypes = {
  getCurrentPosDisp: PropTypes.func.isRequired,
  google: PropTypes.object.isRequired,
  pathCoords: PropTypes.array.isRequired,
  optimizedPathCoords: PropTypes.array.isRequired,
  currentPos: PropTypes.object,
};

const mapStateToProps = state => ({
  pathCoords: state.geolocation.pathCoords,
  currentPos: state.geolocation.currentPos,
  optimizedPathCoords: state.geolocation.optimizedPathCoords,
});

const mapDispatchToProps = dispatch => ({
  getCurrentPosDisp: () => dispatch(getCurrentPos()),
});

const WrappedContainer = GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_G_MAPS),
})(MapContainer)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedContainer);