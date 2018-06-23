const AWS = require('aws-sdk');

const { REACT_APP_ENDPOINT, REACT_APP_REGION, REACT_APP_IDENTITY_POOL_ID, REACT_APP_UPDATE_TOPIC } = process.env;

// Initialize the Amazon Cognito credentials provider
AWS.config.region = REACT_APP_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: REACT_APP_IDENTITY_POOL_ID });

const iotData = new AWS.IotData({ endpoint: REACT_APP_ENDPOINT, region: REACT_APP_REGION });

const errorHandler = err => console.error(err, err.stack);

module.exports = {
  isValveOpen: () => {
    return iotData.getThingShadow({ thingName: 'proto_valve' })
      .promise()
      .then(data => {
        const { state: { reported: { valve } } } = JSON.parse(data.payload);
        return valve === 'open';
      })
      .catch(errorHandler);
  },
  toggleValve: (valve) => {
    if (!(valve === 'open' || valve === 'closed')) throw new Error('Argument error');
    const shadowPayload = JSON.stringify({ state: { desired: { valve } } });
    const updatePayload = JSON.stringify({ desired: valve });
    const update = iotData.updateThingShadow({ payload: shadowPayload, thingName: 'proto_valve' })
      .promise()
      .catch(errorHandler);
    const publishUpdate = iotData.publish({ payload: updatePayload, topic: REACT_APP_UPDATE_TOPIC })
      .promise()
      .then(console.log)
      .catch(errorHandler);
    return Promise.all([update, publishUpdate]).then(console.log)
  },
  updateFirmware: () => {
    return iotData.publish({ topic: "/things/proto_valve/firmware/update" }).promise().then(console.log);
  }
};
