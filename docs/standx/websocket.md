## StandX Perps WebSocket API List

The WebSocket API provides two streams: **Market Stream** for market data and user account updates, and **Order Response Stream** for asynchronous order creation responses.

⚠️ This document is under construction.

## Connection Management

Both WebSocket streams implement the following connection management behavior:

### Connection Duration Limit

- **Maximum Duration**: A single WebSocket connection can be maintained for a maximum of **24 hours**
- After 24 hours, the connection will be automatically terminated
- Clients should implement reconnection logic to handle this gracefully

### Ping/Pong Mechanism

- **Server Ping Interval**: The server sends a WebSocket Ping frame every 10 seconds
- **Client Response**: Clients must respond with a Pong frame when receiving a Ping
- **Timeout**: If the server does not receive a Ping/Pong response within 5 minutes, the connection will be terminated with error:
	```
	{
	  "code": 408,
	  "message": "disconnecting due to not receive Pong within 5 minute period"
	}
	```

**Note**: Most modern browsers and WebSocket libraries automatically handle ping/pong frames, so you might not need to implement this manually. However, if your environment doesn’t support automatic ping/pong handling, you can proactively send ping frames to the server. Example using the npm `ws` library:

```
import WebSocket from "ws";
// ...
private ws: WebSocket;
//...
ping(): void {
  this.lastPingTime = Date.now();
  this.ws.ping();
  console.log(\`[${new Date().toISOString()}] Ping server\`);
}
```

## Market Stream

Base Endpoint: `wss://perps.standx.com/ws-stream/v1`

### Available Channels

```
[
  // public channels
  { channel: "price", symbol: "<symbol>" },
  { channel: "depth_book", symbol: "<symbol>" },
  { channel: "public_trade", symbol: "<symbol>" },
  // user-level authenticated channels
  { channel: "order" },
  { channel: "position" },
  { channel: "balance" },
  { channel: "trade" },
]
```

### Subscribe to Depth Book

**⚠️ Note: The sequence of price levels in the asks and bids arrays is not guaranteed. Please implement local sorting on the client side based on your specific requirements.**

- Request:
- Response:
	```
	{
	  "seq": 3,
	  "channel": "depth_book",
	  "symbol": "BTC-USD",
	  "data": {
	    "asks": [
	      ["121896.02", "0.839"],
	      ["121896.32", "1.051"]
	    ],
	    "bids": [
	      ["121884.22", "0.001"],
	      ["121884.52", "0.001"]
	    ],
	    "symbol": "BTC-USD"
	  }
	}
	```

### Subscribe to Symbol Price

- Request:
- Response:
	```
	{
	  "seq": 13,
	  "channel": "price",
	  "symbol": "BTC-USD",
	  "data": {
	    "base": "BTC",
	    "index_price": "121890.651250",
	    "last_price": "121897.95",
	    "mark_price": "121897.56",
	    "mid_price": "121898.00",
	    "quote": "DUSD",
	    "spread": ["121897.95", "121898.05"],
	    "symbol": "BTC-USD",
	    "time": "2025-08-11T07:23:50.923602474Z"
	  }
	}
	```

### Authentication Request

#### Log in with JWT

- Request:
	```
	{
	  "auth": {
	    "token": "<your_jwt_token>",
	    "streams": [{ "channel": "order" }]
	  }
	}
	```

> `auth.streams` is **Optional**, which enables the user to subscribe to specific channels right after authentication.

- Response:
	```
	{ "seq": 1, "channel": "auth", "data": { "code": 200, "msg": "success" } }
	```

#### User Orders Subscription

- Request:
- Response:
	```
	{
	  "seq": 35,
	  "channel": "order",
	  "data": {
	    "avail_locked": "0",
	    "cl_ord_id": "01K2C9H93Y42RW8KD6RSVWVDVV",
	    "closed_block": -1,
	    "created_at": "2025-08-11T10:06:37.182464902Z",
	    "created_block": -1,
	    "fill_avg_price": "121245.21",
	    "fill_qty": "1.000",
	    "id": 2547027,
	    "leverage": "15",
	    "liq_id": 0,
	    "margin": "8083.013333334",
	    "order_type": "market",
	    "payload": null,
	    "position_id": 15,
	    "price": "121245.20",
	    "qty": "1.000",
	    "reduce_only": false,
	    "remark": "",
	    "side": "buy",
	    "source": "user",
	    "status": "filled",
	    "symbol": "BTC-USD",
	    "time_in_force": "ioc",
	    "updated_at": "2025-08-11T10:06:37.182465022Z",
	    "user": "bsc_0x..."
	  }
	}
	```

#### User Position Subscription

- Request:
- Response:
	```
	{
	  "seq": 36,
	  "channel": "position",
	  "data": {
	    "created_at": "2025-08-10T09:05:50.265265Z",
	    "entry_price": "121677.65",
	    "entry_value": "2879988.1154631481396099405228",
	    "id": 15,
	    "initial_margin": "191999.219856667",
	    "leverage": "15",
	    "margin_asset": "DUSD",
	    "margin_mode": "isolated",
	    "qty": "23.669",
	    "realized_pnl": "158.197103148",
	    "status": "open",
	    "symbol": "BTC-USD",
	    "updated_at": "2025-08-10T09:05:50.265265Z",
	    "user": "bsc_0x..."
	  }
	}
	```

#### User Balance Subscription

- Request:
- Response:
	```
	{
	  "seq": 37,
	  "channel": "balance",
	  "data": {
	    "account_type": "perps",
	    "created_at": "2025-08-09T09:36:54.504639Z",
	    "free": "906946.976225666",
	    "id": "bsc_0x...",
	    "inbound": "0",
	    "is_enabled": true,
	    "kind": "user",
	    "last_tx": "",
	    "last_tx_updated_at": 0,
	    "locked": "0.000000000",
	    "occupied": "0",
	    "outbound": "0",
	    "ref_id": 0,
	    "token": "DUSD",
	    "total": "923207.752500717",
	    "updated_at": "2025-08-09T09:36:54.504639Z",
	    "version": 0,
	    "wallet_id": "bsc_0x..."
	  }
	}
	```

## Order Response Stream

This WebSocket channel provides real-time order status updates for the `new order` API. Since order creation is asynchronous, this channel notifies clients about order responses, including ALO order rejections.

**Base Endpoint:**`wss://perps.standx.com/ws-api/v1`

### Request Structure

All WebSocket requests follow this structure:

**Fields:**

- `session_id`: UUID that remains consistent throughout the session
- `request_id`: Unique UUID for each request
- `method`: Operation to perform (`auth:login`, `order:new`, `order:cancel`)
- `header`: Required for `order:new` and `order:cancel` methods (authentication headers)
- `params`: JSON-stringified parameters specific to the method

### Methods

#### auth:login

Authenticate using JWT token.

**Parameters:**

```
{ "token": "<jwt>" }
```

**Example Request:**

#### order:new

Create a new order. Parameters are the same as the HTTP API `new_order` payload.

#### order:cancel

Cancel an existing order. Parameters are the same as the HTTP API `cancel_order` payload.

### Order Response Format

**Success Response:**

```
{
  "code": 0,
  "message": "success",
  "request_id": "bccc2b23-03dc-4c2b-912f-4315ebbbb7e0"
}
```

**Rejection Response:**

```
{
  "code": 400,
  "message": "alo order rejected",
  "request_id": "1187e114-1914-4111-8da1-2aaaa86bb1b9"
}
```

Last updated on

[Perps HTTP API](https://docs.standx.com/standx-api/perps-http "Perps HTTP API") [Perps Reference](https://docs.standx.com/standx-api/perps-reference "Perps Reference")