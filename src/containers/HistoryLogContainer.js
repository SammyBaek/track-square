import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

class HistoryLogContainer extends React.PureComponent {
  render() {
    const {locations} = this.props;
    const table = locations.reverse().map((pos) => {
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