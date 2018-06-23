import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import mqttClient from './soil.js';

var currentlySubscribedTopic = '$aws/things/ss-1/shadow/update/accepted';
class App extends Component {
  constructor() {
    super();
    this.state = { fetched: false };
  }
  componentDidMount = () => {
    mqttClient.on('connect', this.handleConnect);
    mqttClient.on('message', this.handleMessage);
  }
  handleConnect = () => {
    console.log('connected');
    this.setState({ connected: true });
    mqttClient.subscribe(currentlySubscribedTopic);
  }
  handleMessage = (topic, payload) => {
    const { state: { reported: { moisture } }, timestamp } = JSON.parse(payload.toString());
    console.log(timestamp)
    console.log('moisture', moisture);
    const d = new Date(0)
    d.setUTCSeconds(timestamp)
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = d.toLocaleDateString('en-US', opts);
    this.setState({ moisture, date })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Soil Moisture</h1>
        </header>
        <h1 style={{ fontSize: '7em', margin: 0 }}>{this.state.moisture && this.state.moisture}</h1>
        <h3>{this.state.date}</h3>
      </div>
    );
  }
}

export default App;
