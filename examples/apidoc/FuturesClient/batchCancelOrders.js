const { FuturesClient } = require('kucoin-api');

  // This example shows how to call this kucoin API endpoint with either node.js, javascript (js) or typescript (ts) with the npm module "kucoin-api" for kucoin exchange
  // This kucoin API SDK is available on npm via "npm install kucoin-api"
  // ENDPOINT: api/v1/orders/multi-cancel
  // METHOD: DELETE
  // PUBLIC: NO

const client = new FuturesClient({
  apiKey: 'apiKeyHere',
  apiSecret: 'apiSecretHere',
  apiPassphrase: 'apiPassPhraseHere',
});

client.batchCancelOrders(params)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
