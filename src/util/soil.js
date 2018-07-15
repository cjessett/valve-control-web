require('dotenv').config();

const AWS = require('aws-sdk');
const AWSIoTData = require('aws-iot-device-sdk');

const topic = name => `$aws/things/${name}/shadow/update/accepted`

function Client({ name, onConnect, onMessage }) {
  this.config = {
    host: process.env.REACT_APP_ENDPOINT,
    region: process.env.REACT_APP_REGION,
    poolId: process.env.REACT_APP_SOIL_POOL_ID,
  }

  const clientId = `mqtt-${name}-${Math.floor((Math.random() * 100000) + 1)}`;

  AWS.config.region = this.config.region;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
     IdentityPoolId: this.config.poolId
  });

  this.client = AWSIoTData.device({
     region: AWS.config.region,
     host: this.config.host,
     clientId,
     protocol: 'wss',
     maximumReconnectTimeMs: 8000,
     debug: true,
     accessKeyId: '',
     secretKey: '',
     sessionToken: ''
  });

  const cognitoIdentity = new AWS.CognitoIdentity();
  AWS.config.credentials.get((err, data) => {
     if (!err) {
        console.log('retrieved identity: ' + AWS.config.credentials.identityId);
        var params = {
           IdentityId: AWS.config.credentials.identityId
        };
        cognitoIdentity.getCredentialsForIdentity(params, (err, data) => {
           if (!err) {
              //
              // Update our latest AWS credentials; the MQTT client will use these
              // during its next reconnect attempt.
              //
              this.client.updateWebSocketCredentials(
                data.Credentials.AccessKeyId,
                data.Credentials.SecretKey,
                data.Credentials.SessionToken
              );
           } else {
              console.log('error retrieving credentials: ' + err);
              alert('error retrieving credentials: ' + err);
           }
        });
     } else {
        console.log('error retrieving identity:' + err);
        alert('error retrieving identity: ' + err);
     }
  });

  this.client.on('connect', onConnect);
  this.client.on('message', onMessage);
  this.client.subscribe(topic(name));
}

export default function (name) {
  return new Client(name)
}
