import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {
  getCurrentPos,
  startTrackingPos,
  stopTrackingPos,
  clearTrackingPos,
  updateTrackingPos,
  positionOptions,
  sendTrackingPos,
  errorToastShow,
} from "../actions/simpleAction";

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartTracking = this.handleStartTracking.bind(this);
    this.updateTrackingPos = this.updateTrackingPos.bind(this);
  }

  static renderTableData (locations) {
    return locations.reverse().map((pos) => {
      const {timestamp, coords} = pos;
      const {accuracy, longitude, latitude, altitude} = coords;
      return (
        <tr key={timestamp}>
          <td>{timestamp}</td>
          <td>{longitude}</td>
          <td>{latitude}</td>
          <td>{altitude}</td>
          <td>{accuracy}</td>
        </tr>
      );
    });
  }

  updateTrackingPos(pos) {
    const {updateTrackingPosDisp} = this.props;
    updateTrackingPosDisp(pos);
  }

  handleStartTracking(e) {
    // TODO: need to move this logic to redux (simpleAction) like the rest
    const {startTrackingPosDisp, errorToastShowDisp} = this.props;
    e.preventDefault();
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        this.updateTrackingPos,
        (err) => {
          const errMsg = "Error while tracking position";
          errorToastShowDisp(err, errMsg);
        },
        positionOptions,
      );
      startTrackingPosDisp(watchId);
    } else {
      const err = new Error("Geolocation unavailable on this device!");
      const errMsg = "Geolocation unavailable";
      errorToastShowDisp(err, errMsg);
    }
  }

  render() {
    const {
      getCurrentPosDisp,
      currentPos,
      stopTrackingPosDisp,
      clearTrackingPosDisp,
      sendTrackingPosDisp,
      watchId,
      locations,
    } = this.props;

    let text = "";
    let timestamp = "";

    if (currentPos) {
      text = `Current Location: ${currentPos.coords.latitude} : ${currentPos.coords.longitude}`;
      timestamp = currentPos.timestamp;
    }

    let trackBtn = null;
    if (watchId) {
      trackBtn = (
        <Button variant="warning" onClick={stopTrackingPosDisp}>
          Pause Tracking Location
        </Button>
      );
    } else {
      trackBtn = (
        <Button variant="primary" onClick={this.handleStartTracking}>
          Start Tracking Location
        </Button>
      );
    }

    let sendBtn = null;
    let clearBtn = null;
    if (locations.length > 0) {
      sendBtn = (
        <Button variant="success" onClick={() => sendTrackingPosDisp(locations)}>
          Send Track History
        </Button>
      );
      clearBtn = (
        <Button variant="danger" onClick={clearTrackingPosDisp}>
          Clear Track History
        </Button>
      );
    }

    return (
      <div>
        <Row>
          <Col>
            Current Timestamp: 
            {timestamp}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="success" onClick={getCurrentPosDisp}>
              Get Current Location
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{text}</Col>
        </Row>
        <Row>
          <Col>{trackBtn}</Col>
        </Row>
        <Row>
          <Col>{sendBtn}</Col>
        </Row>
        <Row>
          <Col>{clearBtn}</Col>
        </Row>
      </div>
    );
  }
}

HomeContainer.defaultProps = {
  currentPos: null,
  watchId: null,
};

HomeContainer.propTypes = {
  getCurrentPosDisp: PropTypes.func.isRequired,
  startTrackingPosDisp: PropTypes.func.isRequired,
  stopTrackingPosDisp: PropTypes.func.isRequired,
  updateTrackingPosDisp: PropTypes.func.isRequired,
  clearTrackingPosDisp: PropTypes.func.isRequired,
  sendTrackingPosDisp: PropTypes.func.isRequired,
  errorToastShowDisp: PropTypes.func.isRequired,
  currentPos: PropTypes.object,
  watchId: PropTypes.number,
  locations: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  currentPos: state.geolocation.currentPos,
  text: state.geolocation.text,
  watchId: state.geolocation.watchId,
  err: state.geolocation.err,
  errMsg: state.geolocation.errMsg,
  locations: state.geolocation.locations,
});

const mapDispatchToProps = dispatch => ({
  getCurrentPosDisp: () => dispatch(getCurrentPos()),
  startTrackingPosDisp: (watchId) => dispatch(startTrackingPos(watchId)),
  stopTrackingPosDisp: () => dispatch(stopTrackingPos()),
  clearTrackingPosDisp: () => dispatch(clearTrackingPos()),
  updateTrackingPosDisp: (pos) => dispatch(updateTrackingPos(pos)),
  sendTrackingPosDisp: (locations) => dispatch(sendTrackingPos(locations)),
  errorToastShowDisp: (err, errMsg) => dispatch(errorToastShow(err, errMsg)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);