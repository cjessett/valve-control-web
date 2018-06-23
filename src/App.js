import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import thing from './thing.js';

class App extends Component {
  constructor() {
    super();
    this.state = { fetched: false };
  }
  componentDidMount = () => {
    return thing.isValveOpen().then(isOpen => this.setState({ isOpen, fetched: true }))
  }
  handleChange = ({ target: { checked }}) => {
    const desiredValveState = checked ? 'open' : 'closed';
    thing.toggleValve(desiredValveState).then(() => this.setState({ isOpen: checked }))
  }
  updateFirmware = () => thing.updateFirmware();
  render() {
    const { fetched, isOpen } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button onClick={this.updateFirmware}>Update Firmware</button>
        <h1>Valve</h1>
        {fetched &&
        <label className="switch">
          <input type="checkbox" checked={isOpen} onChange={this.handleChange}/>
          <span className="slider round"></span>
        </label>
        }
        <h3>{fetched && (isOpen ? 'open' : 'closed')}</h3>
      </div>
    );
  }
}

export default App;
