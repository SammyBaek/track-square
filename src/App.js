import React from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      count: 0,
      position: null,
      text: "",
    };
    this.handleGetLocation = this.handleGetLocation.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    this.renderTableData = this.renderTableData.bind(this);

    this.positionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
  }

  getPosition(pos) {
    console.log(pos);
    this.setState({
      position: pos,
      text: pos.coords.latitude + " : " + pos.coords.longitude,
      locations: [...this.state.locations, pos],
    });
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

  handleGetLocation(e) {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getPosition,
        this.errorMessage,
        this.positionOptions
      );
    } else {
      this.setState({text: "unavailable"});
    }
  }

  renderTableData() {
    return this.state.locations.reverse().map((pos, index) => {
      const {timestamp, coords} = pos;
      const {accuracy, longitude, latitude, altitude} = coords;
      return (
        <tr key={index}>
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
    return (
      <Container fluid>
        <Row>
          <Col xs={4}>{date.getTime()}</Col>
          <Col xs={4}>
            <Button variant="primary" onClick={this.handleGetLocation}>
              Get Location
            </Button>
          </Col>
          <Col xs={4}>
            <div>{this.state.text}</div>
          </Col>
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

export default App;
