# Node.js & JavaScript SDK for Kucoin REST APIs, WebSockets & WebSocket API

<p align="center">
  <a href="https://www.npmjs.com/package/kucoin-api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/tiagosiebler/kucoin-api/blob/master/docs/images/logoDarkMode2.svg?raw=true#gh-dark-mode-only">
      <img alt="SDK Logo" src="https://github.com/tiagosiebler/kucoin-api/blob/master/docs/images/logoBrightMode2.svg?raw=true#gh-light-mode-only">
    </picture>
  </a>
</p>

[![npm version](https://img.shields.io/npm/v/kucoin-api)][1]
[![npm size](https://img.shields.io/bundlephobia/min/kucoin-api/latest)][1]
[![npm downloads](https://img.shields.io/npm/dt/kucoin-api)][1]
[![Build & Test](https://github.com/tiagosiebler/kucoin-api/actions/workflows/e2etest.yml/badge.svg?branch=master)](https://github.com/tiagosiebler/kucoin-api/actions/workflows/e2etest.yml)
[![last commit](https://img.shields.io/github/last-commit/tiagosiebler/kucoin-api)][1]
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/nodetraders)

[1]: https://www.npmjs.com/package/kucoin-api

Updated & performant JavaScript & Node.js SDK for the Kucoin REST APIs and WebSockets:

- Complete integration with all Kucoin REST APIs and WebSockets.
- TypeScript support (with type declarations for most API requests & responses)
- Robust WebSocket integration with configurable connection heartbeats & automatic reconnect then resubscribe workflows.
- Browser-friendly HMAC signature mechanism.
- Automatically supports both ESM and CJS projects.
- Proxy support via axios integration.
- Active community support & collaboration in telegram: [Node.js Algo Traders](https://t.me/nodetraders).

## Installation

`npm install --save kucoin-api`

## Issues & Discussion

- Issues? Check the [issues tab](https://github.com/tiagosiebler/kucoin-api/issues).
- Discuss & collaborate with other node devs? Join our [Node.js Algo Traders](https://t.me/nodetraders) engineering community on telegram.

<!-- template_related_projects -->

klasnmflkasjnfalksdnf

<!-- template_related_projects_end -->

## Documentation

Most methods accept JS objects. These can be populated using parameters specified by gateio's API documentation.

- [Kucoin API Documentation](https://www.kucoin.com/docs/rest/account/basic-info/get-account-summary-info).
- Node.js Quick Start Guides
  - [Spot Node.js Quick Start Kucoin](./examples/rest-spot-orders-guide.ts)
  - [Futures Node.js Quick Start Kucoin](./examples/rest-futures-orders-guide.ts)
- [TSDoc Documentation (autogenerated using typedoc)](https://tsdocs.dev/docs/kucoin-api)

## Structure

This project uses typescript. Resources are stored in 2 key structures:

- [src](./src) - the whole connector written in typescript
- [examples](./examples) - some implementation examples & demonstrations. Contributions are welcome!

---

# Usage

Create API credentials

- [Kucoin API Key Management](https://www.kucoin.com/account/api)

### REST API

To use any of Gate.io's REST APIs in JavaScript/TypeScript/Node.js, import (or require) the `RestClient`:

```javascript
const { RestClient } = require('kucoin-api');

const API_KEY = 'xxx';
const PRIVATE_KEY = 'yyy';

const client = new RestClient({
  apiKey: API_KEY,
  apiSecret: PRIVATE_KEY,
});

client
  .getSpotTicker()
  .then((result) => {
    console.log('all spot tickers result: ', result);
  })
  .catch((err) => {
    console.error('spot ticker error: ', err);
  });

client
  .getSpotOrders({
    currency_pair: 'BTC_USDT', // Specify the currency pair
    status: 'open', // Specify the status of the orders to fetch
  })
  .then((result) => {
    console.log('getSpotOrders result: ', result);
  })
  .catch((err) => {
    console.error('getSpotOrders error: ', err);
  });
```

See [RestClient](./src/RestClient.ts) for further information, or the [examples](./examples/) for lots of usage examples.

## WebSockets

All available WebSockets can be used via a shared `WebsocketClient`. The WebSocket client will automatically open/track/manage connections as needed. Each unique connection (one per server URL) is tracked using a WsKey (each WsKey is a string - see [WS_KEY_MAP](src/lib/websocket/websocket-util.ts) for a list of supported values).

Any subscribe/unsubscribe events will need to include a WsKey, so the WebSocket client understands which connection the event should be routed to. See examples below or in the [examples](./examples/) folder on GitHub.

Data events are emitted from the WebsocketClient via the `update` event, see example below:

```javascript
const { WebsocketClient } = require('kucoin-api');

const API_KEY = 'xxx';
const PRIVATE_KEY = 'yyy';

const wsConfig = {
  apiKey: API_KEY,
  apiSecret: PRIVATE_KEY,

  /*
    The following parameters are optional:
  */

  // Livenet is used by default, use this to enable testnet:
  // useTestnet: true

  // how long to wait (in ms) before deciding the connection should be terminated & reconnected
  // pongTimeout: 1000,

  // how often to check (in ms) that WS connection is still alive
  // pingInterval: 10000,

  // how long to wait before attempting to reconnect (in ms) after connection is closed
  // reconnectTimeout: 500,

  // config options sent to RestClient (used for time sync). See RestClient docs.
  // restOptions: { },

  // config for axios used for HTTP requests. E.g for proxy support
  // requestOptions: { }
};

const ws = new WebsocketClient(wsConfig);

/**
 * Subscribing to data:
 **/

const userOrders = {
  topic: 'spot.orders',
  payload: ['BTC_USDT', 'ETH_USDT', 'MATIC_USDT'],
};

const userTrades = {
  topic: 'spot.usertrades',
  payload: ['BTC_USDT', 'ETH_USDT', 'MATIC_USDT'],
};

const userPriceOrders = {
  topic: 'spot.priceorders',
  payload: ['!all'],
};

// subscribe to multiple topics at once
ws.subscribe([userOrders, userTrades, userPriceOrders], 'spotV4');

// and/or subscribe to individual topics on demand
ws.subscribe(
  {
    topic: 'spot.priceorders',
    payload: ['!all'],
  },
  'spotV4',
);

// Some topics don't need params, for those you can just subscribe with a string (or use a topic + payload object as above)
ws.subscribe('spot.balances', 'spotV4');

/**
 * Handling events:
 **/

// Listen to events coming from websockets. This is the primary data source
ws.on('update', (data) => {
  console.log('data', data);
});

// Optional: Listen to websocket connection open event (automatic after subscribing to one or more topics)
ws.on('open', ({ wsKey, event }) => {
  console.log('connection open for websocket with ID: ' + wsKey);
});

// Optional: Listen to responses to websocket queries (e.g. the reply after subscribing to a topic)
ws.on('response', (response) => {
  console.log('response', response);
});

// Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
ws.on('close', () => {
  console.log('connection closed');
});

// Optional: listen to internal exceptions. Useful for debugging if something weird happens
ws.on('exception', (data) => {
  console.error('exception: ', data);
});

// Optional: Listen to raw error events.
ws.on('error', (err) => {
  console.error('ERR', err);
});
```

See [WebsocketClient](./src/WebsocketClient.ts) for further information and make sure to check the [examples](./examples/) folder for much more detail.

---

## Customise Logging

Pass a custom logger which supports the log methods `silly`, `debug`, `notice`, `info`, `warning` and `error`, or override methods from the default logger as desired.

```javascript
const { WebsocketClient, DefaultLogger } = require('kucoin-api');

// Disable all logging on the silly level
DefaultLogger.silly = () => {};

const ws = new WebsocketClient({ key: 'xxx', secret: 'yyy' }, DefaultLogger);
```

---

<!-- template_contributions -->

Have my projects helped you? Share the love, there are many ways you can show your thanks:

- Star & share my projects.
- Are my projects useful? Sponsor me on Github and support my effort to maintain & improve them: https://github.com/sponsors/tiagosiebler
- Have an interesting project? Get in touch & invite me to it.
- Or buy me all the coffee:
  - ETH(ERC20): `0xA3Bda8BecaB4DCdA539Dc16F9C54a592553Be06C` <!-- metamask -->

<!---
old ones:
  - BTC: `1C6GWZL1XW3jrjpPTS863XtZiXL1aTK7Jk`
  - BTC(SegWit): `bc1ql64wr9z3khp2gy7dqlmqw7cp6h0lcusz0zjtls`
  - ETH(ERC20): `0xe0bbbc805e0e83341fadc210d6202f4022e50992`
  - USDT(TRC20): `TA18VUywcNEM9ahh3TTWF3sFpt9rkLnnQa
-->

<!-- template_contributions_end -->

### Contributions & Pull Requests

Contributions are encouraged, I will review any incoming pull requests. See the issues tab for todo items.

<!-- template_star_history -->

<!-- template_star_history_end -->
