require('dotenv').config();

const AWS = require('aws-sdk');
const AWSIoTData = require('aws-iot-device-sdk');
const AWSConfiguration = {
  host: process.env.REACT_APP_ENDPOINT,
  region: process.env.REACT_APP_REGION,
  poolId: process.env.REACT_APP_SOIL_POOL_ID,
  topic: process.env.REACT_APP_SOIL_TOPIC,
}

const clientId = `mqtt-explorer-${Math.floor((Math.random() * 100000) + 1)}`;

AWS.config.region = AWSConfiguration.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
   IdentityPoolId: AWSConfiguration.poolId
});

const mqttClient = AWSIoTData.device({
   region: AWS.config.region,
   host:AWSConfiguration.host,
   clientId: clientId,
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
      cognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
         if (!err) {
            //
            // Update our latest AWS credentials; the MQTT client will use these
            // during its next reconnect attempt.
            //
            mqttClient.updateWebSocketCredentials(data.Credentials.AccessKeyId,
               data.Credentials.SecretKey,
               data.Credentials.SessionToken);
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

export default { client: mqttClient, config: AWSConfiguration };
