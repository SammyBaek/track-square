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
    const {startTrackingPosDisp} = this.props;
    e.preventDefault();
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        this.updateTrackingPos,
        (err) => {
          console.log("error tracking", err);
        },
        positionOptions,
      );
      startTrackingPosDisp(watchId);
    } else {
      console.log("geolocation unavailable");
    }
  }

  render() {
    const {
      getCurrentPosDisp,
      currentPos,
      stopTrackingPosDisp,
      clearTrackingPosDisp,
      watchId,
    } = this.props;
    let text = "";

    const date = new Date();

    if (currentPos !== null) {
      text = `current location: ${currentPos.coords.latitude} : ${currentPos.coords.longitude}`;
    }

    let trackBtn = null;
    if (watchId !== null) {
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

    return (
      <div>
        <Row>
          <Col xs={4}>{date.getTime()}</Col>
          <Col xs={4}>
            <Button variant="success" onClick={getCurrentPosDisp}>
              Get Current Location
            </Button>
          </Col>
          <Col xs={4}>
            <div>{text}</div>
          </Col>
        </Row>
        <Row>
          <Col>{trackBtn}</Col>
          <Col>
            <Button variant="danger" onClick={clearTrackingPosDisp}>
              Clear Track History
            </Button>
          </Col>
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
  currentPos: PropTypes.object,
  watchId: PropTypes.number,
};

const mapStateToProps = state => ({
  currentPos: state.geolocation.currentPos,
  text: state.geolocation.text,
  watchId: state.geolocation.watchId,
  err: state.geolocation.err,
  errMsg: state.geolocation.errMsg,
});

const mapDispatchToProps = dispatch => ({
  getCurrentPosDisp: () => dispatch(getCurrentPos()),
  startTrackingPosDisp: (watchId) => dispatch(startTrackingPos(watchId)),
  stopTrackingPosDisp: () => dispatch(stopTrackingPos()),
  clearTrackingPosDisp: () => dispatch(clearTrackingPos()),
  updateTrackingPosDisp: (pos) => dispatch(updateTrackingPos(pos)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);