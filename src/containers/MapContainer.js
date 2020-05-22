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
    const {google, pathCoords, currentPos} = this.props;
    let curLatLng = null
    if (currentPos !== null) {
      curLatLng = {
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude,
      }
    };

    const containerStyle = {
      position: "relative",
      height: "80vh",
    };

    return (
      <div style={containerStyle}>
        <Map
          google={google}
          center={curLatLng}
          zoom={19}
        >
          <Marker position={curLatLng} />
          <Polyline
            path={pathCoords}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
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
  currentPos: PropTypes.object,
};

const mapStateToProps = state => ({
  pathCoords: state.geolocation.pathCoords,
  currentPos: state.geolocation.currentPos,
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