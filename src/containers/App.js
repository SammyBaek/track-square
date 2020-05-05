import React from "react";

import "./App.css";
import Container from "react-bootstrap/Container";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
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

export default App;
