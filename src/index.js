import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './SoilApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App name="ss-1" />, document.getElementById('root'));
registerServiceWorker();
