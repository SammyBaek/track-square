import React from "react";
import { connect } from 'react-redux';

import "./App.css";
import Container from "react-bootstrap/Container";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { simpleAction } from '../actions/simpleAction';
import GMapContainer from "./MapContainer";
import HomeContainer from "./HomeContainer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "home",
    };
  }

  render() {
    const {tabKey} = this.state;

    return (
      <Container fluid>
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
        </Tabs>
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
