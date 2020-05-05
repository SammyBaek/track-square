import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class HistoryLogContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numOfRows: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    this.setState({numOfRows: form.elements.rowsInput.value});
  }

  render() {
    const {locations} = this.props;
    const {numOfRows} = this.state;

    const ind = numOfRows > 0 ? Math.max(0, locations.length - numOfRows) : 0;
    const table = locations
        .slice(ind, locations.length)
        .reverse()
        .map((pos) => {
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

    return (
      <div>
        <Row>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group as={Row} controlId="formNumOfRows">
              <Form.Label column sm={4}>
                Number of Rows
              </Form.Label>
              <Col sm={4}>
                <Form.Control size="sm" type="number" name="rowsInput" defaultValue={numOfRows} />
              </Col>
              <Col sm={4}>
                <Button variant="primary" type="submit">Update</Button>
              </Col>
            </Form.Group>
          </Form>
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
              <tbody>{table}</tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

HistoryLogContainer.propTypes = {
  locations: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  locations: state.geolocation.locations
});

export default connect(mapStateToProps, null)(HistoryLogContainer);