import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./App.css";
import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Toast from "react-bootstrap/Toast";
import GMapContainer from "./MapContainer";
import HomeContainer from "./HomeContainer";
import HistoryLogContainer from "./HistoryLogContainer";

import {errorToastHide} from "../actions/simpleAction";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "home",
    };
  }

  render() {
    const {err, errMsg, errorToastHideDisp} = this.props;
    const {tabKey} = this.state;

    let errStackTrace = "";
    if (err) {
      errStackTrace = err.stack;
    }

    const errorToast = (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          right: "50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            minWidth: "250px",
            top: 0,
            right: 0,
          }}
        >
          <Toast onClose={errorToastHideDisp} show={!!err} delay={10000} autohide>
            <Toast.Header>
              <strong className="mr-auto">{errMsg}</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body>{errStackTrace}</Toast.Body>
          </Toast>
        </div>
      </div>
    );


    return (
      <Container>
        {errorToast}
        <Tabs
          id="controlled-tab-example"
          activeKey={tabKey}
          onSelect={(k) => this.setState({tabKey: k})}
        >
          <Tab eventKey="home" title="Home">
            <HomeContainer />
          </Tab>
          <Tab eventKey="map" title="Map">
            <GMapContainer />
          </Tab>
          <Tab eventKey="history" title="History">
            <HistoryLogContainer />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

App.defaultProps = {
  err: null,
};

App.propTypes = {
  err: PropTypes.object,
  errMsg: PropTypes.string.isRequired,
  errorToastHideDisp: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  err: state.geolocation.err,
  errMsg: state.geolocation.errMsg,
});

const mapDispatchToProps = dispatch => ({
  errorToastHideDisp: () => dispatch(errorToastHide()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
