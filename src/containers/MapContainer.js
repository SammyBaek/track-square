import React from "react";
import PropTypes from 'prop-types';
import {Map, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curPos: {
        lat: 40.854885,
        lng: -88.081807
      },
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({
          curPos: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
        });
      });
    }
  }

  render() {
    const {google} = this.props;
    const {curPos} = this.state;
    return (
      <Map
        google={google}
        center={curPos}
        zoom={18}
      />
    );
  }
}

MapContainer.propTypes = {
  google: PropTypes.object.isRequired,
};

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_G_MAPS)
})(MapContainer)
