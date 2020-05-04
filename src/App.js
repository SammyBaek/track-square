import React from "react";
import { connect } from 'react-redux';

import "./App.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { simpleAction } from './actions/simpleAction';
import GMapContainer from "./MapContainer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      position: null,
      text: "",
      watchId: null,
    };
    this.handleGetCurLocation = this.handleGetCurLocation.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.handleClearHistory = this.handleClearHistory.bind(this);

    this.positionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
  }

  getLocation(cb) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        cb,
        this.errorMessage,
        this.positionOptions
      );
    } else {
      this.setState({text: "unavailable"});
    }
  }

  handleClearHistory(e) {
    e.preventDefault();
    this.setState({locations: []});
  }

  stopTracking(e) {
    e.preventDefault();
    const {watchId} = this.state;
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    this.setState({watchId: null});
  }

  errorMessage(error) {
    let text = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        text = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        text = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        text = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        text = "An unknown error occurred.";
        break;
      default:
        text = "Some error has occurred during getting location.";
        break;
    }
    this.setState({text});
  }

  startTracking(e) {
    e.preventDefault();
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        let lastPos = null;
        const {locations} = this.state;
        if (locations.length > 0) {
          lastPos = locations[locations.length - 1];
        }
        if (lastPos !== null && lastPos.timestamp === pos.timestamp) {
          return;
        }
        this.setState({
          position: pos,
          text: "",
          locations: [...locations, pos],
        });
      }, this.errorMessage, this.positionOptions
    );
    this.setState({watchId});
  }

  handleGetCurLocation(e) {
    e.preventDefault();
    this.getLocation((pos) => {
      this.setState({
        position: pos,
        text: "",
      });
    });
  }

  renderTableData() {
    const {locations} = this.state;
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

  render() {
    const date = new Date();
    const {position, watchId} = this.state;
    let {text} = this.state;
    if (position !== null) {
      text = `current location: ${position.coords.latitude} : ${position.coords.longitude}`;
    }

    let trackBtn = null;
    if (watchId !== null) {
      trackBtn = (
        <Button variant="warning" onClick={this.stopTracking}>
          Pause Tracking Location
        </Button>
      );
    } else {
      trackBtn = (
        <Button variant="primary" onClick={this.startTracking}>
          Start Tracking Location
        </Button>
      );
    }

    return (
      <Container fluid>
        <Row>
          <Col xs={4}>{date.getTime()}</Col>
          <Col xs={4}>
            <Button variant="success" onClick={this.handleGetCurLocation}>
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
            <Button variant="danger" onClick={this.handleClearHistory}>
              Clear Track History
            </Button>
          </Col>
        </Row>
        <Row>
          <GMapContainer />
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>LONGITUDE</th>
                  <th>LATITUDE</th>
                  <th>ALTITUDE</th>
                  <th>ACCURACY</th>
                </tr>
              </thead>
              <tbody>{this.renderTableData()}</tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ...state
 });

 const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
 });


export default connect(mapStateToProps, mapDispatchToProps)(App);
