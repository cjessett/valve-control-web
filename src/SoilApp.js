import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import client from './util/soil.js';

export default class SoilApp extends Component {
  constructor(props) {
    super(props);
    this.state = { connected: false };
    this.client = client({ name: props.name, onConnect: this.handleConnect, onMessage: this.handleMessage });
  }
  handleConnect = () => {
    this.setState({ connected: true });
  }
  handleMessage = (topic, payload) => {
    const { state: { reported: { moisture } }, timestamp } = JSON.parse(payload.toString());
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
          <span>{this.state.connected ? 'connected' : 'connecting'}</span>
        </header>
        <h1 style={{ fontSize: '7em', margin: 0 }}>{this.state.moisture && this.state.moisture}</h1>
        <h3>{this.state.date}</h3>
      </div>
    );
  }
}
