## StandX Perps HTTP API List

⚠️ This document is under construction.

## API Overview

### Base URL

```
https://perps.standx.com
```

### Authentication

All endpoints except **public endpoints** require JWT authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

**Token Validity**: 7 days

#### Body Signature

Some endpoints require body signature. Add the following headers to signed requests:

```
x-request-sign-version: v1
x-request-id: <random_string>
x-request-timestamp: <timestamp_in_milliseconds>
x-request-signature: <your_body_signature>
```

See [Authentication Guide](https://docs.standx.com/standx-api/perps-auth) for implementation details.

#### Session ID

For `new_order` and `cancel_order` requests, you will want to know the results of these requests after actual matching. To obtain these results, you need to add the following information to the header in these interface requests:

```
x-session-id: <your_custom_session_id>
```

Note that this session\_id needs to be consistent with the session\_id used in your ws-client.

### Request Format

- **`int` parameters** (e.g., timestamp) are expected as JSON integers, not strings
- **`decimal` parameters** (e.g., price) are expected as JSON strings, not floats

## Trade Endpoints

### Create New Order

`POST /api/new_order`

**Note**: A successful response indicates the order was submitted, not necessarily executed. Some orders (e.g., ALO) may be rejected during matching if conditions are not met. Subscribe to [Order Response Stream](https://docs.standx.com/standx-api/perps-ws#order-response-stream) for real-time execution status.

To receive order updates via [Order Response Stream](https://docs.standx.com/standx-api/perps-ws#order-response-stream), add the `x-session-id` header to your request. This session\_id must be consistent with the session\_id used in your ws-client.

**Authentication Required** • **Body Signature Required**

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| side | enum | Order side (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| order\_type | enum | Order type (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| qty | decimal | Order quantity |
| time\_in\_force | enum | Time in force (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| reduce\_only | boolean | Only reduce position if `true` |

**Optional Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| price | decimal | Order price (required for limit orders) |
| cl\_ord\_id | string | Client order ID (auto-generated if omitted) |
| margin\_mode | enum | Margin mode (see [Reference](https://docs.standx.com/standx-api/perps-reference)). Must match position |
| leverage | int | Leverage value. Must match position |

**Request Example**:

```
{
  "symbol": "BTC-USD",
  "side": "buy",
  "order_type": "limit",
  "qty": "0.1",
  "price": "50000",
  "time_in_force": "gtc",
  "reduce_only": false
}
```

**Response Example**:

```
{
  "code": 0,
  "message": "success",
  "request_id": "xxx-xxx-xxx"
}
```

### Cancel Order

`POST /api/cancel_order`

To receive order updates via [Order Response Stream](https://docs.standx.com/standx-api/perps-ws#order-response-stream), add the `x-session-id` header to your request. This session\_id must be consistent with the session\_id used in your ws-client.

**Authentication Required** • **Body Signature Required**

**Parameters**

> At least one of `order_id` or `cl_ord_id` is required.

| Parameter | Type | Description |
| --- | --- | --- |
| order\_id | int | Order ID to cancel |
| cl\_ord\_id | string | Client order ID to cancel |

**Request Example**:

```
{
  "order_id": 2424844
}
```

**Response Example**:

```
{
  "code": 0,
  "message": "success",
  "request_id": "xxx-xxx-xxx"
}
```

### Cancel Multiple Orders

`POST /api/cancel_orders`

**Authentication Required** • **Body Signature Required**

**Parameters**

> At least one of `order_id_list` or `cl_ord_id_list` is required.

| Parameter | Type | Description |
| --- | --- | --- |
| order\_id\_list | int\[\] | Order IDs to cancel |
| cl\_ord\_id\_list | string\[\] | Client order IDs to cancel |

**Request Example**:

```
{
  "order_id_list": [2424844]
}
```

**Response Example**:

```
[]
```

### Change Leverage

`POST /api/change_leverage`

**Authentication Required** • **Body Signature Required**

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| leverage | int | New leverage value |

**Request Example**:

```
{
  "symbol": "BTC-USD",
  "leverage": 10
}
```

**Response Example**:

```
{
  "code": 0,
  "message": "success",
  "request_id": "xxx-xxx-xxx"
}
```

### Change Margin Mode

`POST /api/change_margin_mode`

**Authentication Required** • **Body Signature Required**

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| margin\_mode | enum | Margin mode (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Request Example**:

```
{
  "symbol": "BTC-USD",
  "margin_mode": "cross"
}
```

**Response Example**:

```
{
  "code": 0,
  "message": "success",
  "request_id": "xxx-xxx-xxx"
}
```

## User Endpoints

### Transfer Margin

`POST /api/transfer_margin`

**Authentication Required** • **Body Signature Required**

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| amount\_in | decimal | Amount to transfer |

**Request Example**:

```
{
  "symbol": "BTC-USD",
  "amount_in": "1000.0"
}
```

**Response Example**:

```
{
  "code": 0,
  "message": "success",
  "request_id": "xxx-xxx-xxx"
}
```

### Query Order

`GET /api/query_order`

**⚠️ NOTE**: Orders may be rejected due mis-qualification due async matching network structure. To receive the order updates in real-time, please check [Order Response Stream](https://docs.standx.com/standx-api/perps-ws#order-response-stream).

**Authentication Required**

**Query Parameters**

> At least one of `order_id` or `cl_ord_id` is required.

| Parameter | Type | Description |
| --- | --- | --- |
| order\_id | int | Order ID to query |
| cl\_ord\_id | string | Client order ID to query |

**Response Example**:

```
{
  "avail_locked": "3.071880000",
  "cl_ord_id": "01K2BK4ZKQE0C308SRD39P8N9Z",
  "closed_block": -1,
  "created_at": "2025-08-11T03:35:25.559151Z",
  "created_block": -1,
  "fill_avg_price": "0",
  "fill_qty": "0",
  "id": 1820682,
  "leverage": "10",
  "liq_id": 0,
  "margin": "0",
  "order_type": "limit",
  "payload": null,
  "position_id": 15,
  "price": "121900.00",
  "qty": "0.060",
  "reduce_only": false,
  "remark": "",
  "side": "sell",
  "source": "user",
  "status": "open",
  "symbol": "BTC-USD",
  "time_in_force": "gtc",
  "updated_at": "2025-08-11T03:35:25.559151Z",
  "user": "bsc_0x..."
}
```

### Query User Orders

`GET /api/query_orders`

**Authentication Required**

**Query Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| status | enum | Order status (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| order\_type | enum | Order type (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| start | string | Start time in ISO 8601 format |
| end | string | End time in ISO 8601 format |
| last\_id | number | Last order ID for pagination |
| limit | number | Results limit (default: 100, max: 500) |

**Response Example**:

```
{
  "page_size": 1,
  "result": [
    {
      "avail_locked": "3.071880000",
      "cl_ord_id": "01K2BK4ZKQE0C308SRD39P8N9Z",
      "closed_block": -1,
      "created_at": "2025-08-11T03:35:25.559151Z",
      "created_block": -1,
      "fill_avg_price": "0",
      "fill_qty": "0",
      "id": 1820682,
      "leverage": "10",
      "liq_id": 0,
      "margin": "0",
      "order_type": "limit",
      "payload": null,
      "position_id": 15,
      "price": "121900.00",
      "qty": "0.060",
      "reduce_only": false,
      "remark": "",
      "side": "sell",
      "source": "user",
      "status": "new",
      "symbol": "BTC-USD",
      "time_in_force": "gtc",
      "updated_at": "2025-08-11T03:35:25.559151Z",
      "user": "bsc_0x..."
    }
  ],
  "total": 1
}
```

### Query User All Open Orders

`GET /api/query_open_orders`

**Authentication Required**

**Query Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| limit | number | Results limit (default: 500, max: 1200) |

**Response Example**:

```
{
  "page_size": 1,
  "result": [
    {
      "avail_locked": "3.071880000",
      "cl_ord_id": "01K2BK4ZKQE0C308SRD39P8N9Z",
      "closed_block": -1,
      "created_at": "2025-08-11T03:35:25.559151Z",
      "created_block": -1,
      "fill_avg_price": "0",
      "fill_qty": "0",
      "id": 1820682,
      "leverage": "10",
      "liq_id": 0,
      "margin": "0",
      "order_type": "limit",
      "payload": null,
      "position_id": 15,
      "price": "121900.00",
      "qty": "0.060",
      "reduce_only": false,
      "remark": "",
      "side": "sell",
      "source": "user",
      "status": "new",
      "symbol": "BTC-USD",
      "time_in_force": "gtc",
      "updated_at": "2025-08-11T03:35:25.559151Z",
      "user": "bsc_0x..."
    }
  ],
  "total": 1
}
```

### Query User Trades

`GET /api/query_trades`

**Authentication Required**

**Query Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| last\_id | number | Last trade ID for pagination |
| side | string | Order side (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| start | string | Start time in ISO 8601 format |
| end | string | End time in ISO 8601 format |
| limit | number | Results limit (default: 100, max: 500) |

**Response Example**:

```
{
  "page_size": 1,
  "result": [
    {
      "created_at": "2025-08-11T03:36:19.352620Z",
      "fee_asset": "DUSD",
      "fee_qty": "0.121900",
      "id": 409870,
      "order_id": 1820682,
      "pnl": "1.62040",
      "price": "121900",
      "qty": "0.01",
      "side": "sell",
      "symbol": "BTC-USD",
      "updated_at": "2025-08-11T03:36:19.352620Z",
      "user": "bsc_0x...",
      "value": "1219.00"
    }
  ],
  "total": 1
}
```

### Query Position Config

`GET /api/query_position_config`

**Authentication Required**

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
{
  "symbol": "BTC-USD",
  "leverage": 10,
  "margin_mode": "cross"
}
```

### Query User Positions

`GET /api/query_positions`

**Authentication Required**

**Query Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
[
  {
    "bankruptcy_price": "109608.01",
    "created_at": "2025-08-10T09:05:50.265265Z",
    "entry_price": "121737.96",
    "entry_value": "114433.68240",
    "holding_margin": "11443.3682400",
    "id": 15,
    "initial_margin": "11443.36824",
    "leverage": "10",
    "liq_price": "112373.50",
    "maint_margin": "2860.30367500",
    "margin_asset": "DUSD",
    "margin_mode": "isolated",
    "mark_price": "121715.05",
    "mmr": "3.993223845366698695025800014",
    "position_value": "114412.14700",
    "qty": "0.940",
    "realized_pnl": "31.61532",
    "status": "open",
    "symbol": "BTC-USD",
    "time": "2025-08-11T03:41:40.922818Z",
    "updated_at": "2025-08-10T09:05:50.265265Z",
    "upnl": "-21.53540",
    "user": "bsc_0x..."
  }
]
```

### Query User Balances

- **Endpoint**: `/api/query_balance`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Unified balance snapshot.
- **Response Fields**:
	| Name | Type | Description |
	| --- | --- | --- |
	| isolated\_balance | decimal | Isolated wallet total |
	| isolated\_upnl | decimal | Isolated unrealized PnL |
	| cross\_balance | decimal | Cross wallet free balance |
	| cross\_margin | decimal | Cross margin used (executed positions only) |
	| cross\_upnl | decimal | Cross unrealized PnL |
	| locked | decimal | Order lock (margin + fee), already includes safety factor b |
	| cross\_available | decimal | cross\_balance - cross\_margin - locked + cross\_upnl |
	| balance | decimal | Total account assets = cross\_balance + isolated\_balance |
	| upnl | decimal | Total unrealized PnL = cross\_upnl + isolated\_upnl |
	| equity | decimal | Account equity = balance + upnl |
	| pnl\_freeze | decimal | 24h realized PnL (for display) |
- **Response Example**:
	```
	{
	  "isolated_balance": "11443.3682400",
	  "isolated_upnl": "-21.53540",
	  "cross_balance": "1088575.259316737",
	  "cross_margin": "2860.30367500",
	  "cross_upnl": "31.61532",
	  "locked": "0.000000000",
	  "cross_available": "1085746.571",
	  "balance": "1100018.627556737",
	  "upnl": "10.07992",
	  "equity": "1100028.707476657",
	  "pnl_freeze": "31.61532"
	}
	```

> Notes:
> 
> - `cross_available` may be negative depending on PnL and locks;

## Public Endpoints

### Query Symbol Info

`GET /api/query_symbol_info`

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
[
  {
    "base_asset": "BTC",
    "base_decimals": 9,
    "created_at": "2025-07-10T05:15:32.089568Z",
    "def_leverage": "10",
    "depth_ticks": "0.01,0.1,1",
    "enabled": true,
    "maker_fee": "0.0001",
    "max_leverage": "20",
    "max_open_orders": "100",
    "max_order_qty": "100",
    "max_position_size": "1000",
    "min_order_qty": "0.001",
    "price_cap_ratio": "0.3",
    "price_floor_ratio": "0.3",
    "price_tick_decimals": 2,
    "qty_tick_decimals": 3,
    "quote_asset": "DUSD",
    "quote_decimals": 9,
    "symbol": "BTC-USD",
    "taker_fee": "0.0004",
    "updated_at": "2025-07-10T05:15:32.089568Z"
  }
]
```

### Query Symbol Market

`GET /api/query_symbol_market`

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
{
  "base": "BTC",
  "funding_rate": "0.00010000",
  "high_price_24h": "122164.08",
  "index_price": "121601.158461",
  "last_price": "121599.94",
  "low_price_24h": "114098.44",
  "mark_price": "121602.43",
  "mid_price": "121599.99",
  "next_funding_time": "2025-08-11T08:00:00Z",
  "open_interest": "15.948",
  "quote": "DUSD",
  "spread": ["121599.94", "121600.04"],
  "symbol": "BTC-USD",
  "time": "2025-08-11T03:44:40.922233Z",
  "volume_24h": "9030.51800000000002509"
}
```

### Query Symbol Price

`GET /api/query_symbol_price`

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
{
  "base": "BTC",
  "index_price": "121601.158461",
  "last_price": "121599.94",
  "mark_price": "121602.43",
  "mid_price": "121599.99",
  "quote": "DUSD",
  "spread_ask": "121600.04",
  "spread_bid": "121599.94",
  "symbol": "BTC-USD",
  "time": "2025-08-11T03:44:40.922233Z"
}
```

> **Note**: `last_price`, `mid_price`, `spread_ask`, `spread_bid` may be null if no recent trades.

### Query Depth Book

`GET /api/query_depth_book`

**⚠️ Note: The sequence of price levels in the asks and bids arrays is not guaranteed. Please implement local sorting on the client side based on your specific requirements.**

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
{
  "asks": [
    ["121895.81", "0.843"],
    ["121896.11", "0.96"]
  ],
  "bids": [
    ["121884.01", "0.001"],
    ["121884.31", "0.001"]
  ],
  "symbol": "BTC-USD"
}
```

`GET /api/query_recent_trades`

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Response Example**:

```
[
  {
    "is_buyer_taker": true,
    "price": "121720.18",
    "qty": "0.01",
    "quote_qty": "1217.2018",
    "symbol": "BTC-USD",
    "time": "2025-08-11T03:48:47.086505Z"
  },
  {
    "is_buyer_taker": true,
    "price": "121720.18",
    "qty": "0.01",
    "quote_qty": "1217.2018",
    "symbol": "BTC-USD",
    "time": "2025-08-11T03:48:46.850415Z"
  }
]
```

### Query Funding Rates

`GET /api/query_funding_rates`

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| start\_time | int | Start time in milliseconds |
| end\_time | int | End time in milliseconds |

**Response Example**:

```
[
  {
    "id": 1,
    "symbol": "BTC-USD",
    "funding_rate": "0.0001",
    "index_price": "121601.158461",
    "mark_price": "121602.43",
    "premium": "0.0001",
    "time": "2025-08-11T03:48:47.086505Z",
    "created_at": "2025-08-11T03:48:47.086505Z",
    "updated_at": "2025-08-11T03:48:47.086505Z"
  }
]
```

## Kline Endpoints

### Get Server Time

`GET /api/kline/time`

**Response Example**:

```
1620000000
```

### Get Kline History

`GET /api/kline/history`

**Required Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| symbol | string | Trading pair (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |
| from | u64 | Unix timestamp in seconds |
| to | u64 | Unix timestamp in seconds |
| resolution | enum | Resolution (see [Reference](https://docs.standx.com/standx-api/perps-reference)) |

**Optional Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| countback | u64 | The required amount of bars to load |

**Response Example**:

```
{
  "s": "ok",
  "t": [1754897028, 1754897031],
  "c": [121897.95, 121903.04],
  "o": [121896.02, 121898.05],
  "h": [121897.95, 121903.15],
  "l": [121895.92, 121898.05],
  "v": [0.09, 10.542]
}
```

## Health Check

### Health

`GET /api/health`

**Response**:

```
OK
```

## Misc

### Region and Server Time

`GET https://geo.standx.com/v1/region`

**Response Example**:

```
{
  "systemTime": 1761970177865,
  "region": "jp"
}
```

## Reference

For enums, constants, and error codes, see [API Reference](https://docs.standx.com/standx-api/perps-reference).

Last updated on

[Perps Auth SVM Example](https://docs.standx.com/standx-api/perps-auth-svm-example "Perps Auth SVM Example") [Perps WebSocket API](https://docs.standx.com/standx-api/perps-ws "Perps WebSocket API")