# Spot API Overview

* This document lists the base URL for the API endpoints: [**https://sapi.asterdex.com**](https://sapi.asterdex.com)  
* All API responses are in JSON format.  
* All times and timestamps are in UNIX time, in **milliseconds**.

## API Key settings

* Many endpoints require an API Key to access.  
* When setting the API Key, for security reasons it is recommended to set an IP access whitelist.  
* **Never reveal your API key/secret to anyone.**

If an API Key is accidentally exposed, immediately delete that Key and generate a new one.

### Attention
* TESTUSDT or any other symbols starting with TEST are symbols used for Aster’s INTERNAL TESTING ONLY. Please DO NOT trade on these symbols starting with TEST. Aster does not hold any accountability for loss of funds due to trading on these symbols. However, if you run into issues, you may contact support about this any time, we will try to help you recover your funds.

### HTTP return codes

* HTTP `4XX` status codes are used to indicate errors in the request content, behavior, or format. The problem lies with the requester.  
* HTTP `403` status code indicates a violation of WAF restrictions (Web Application Firewall).  
* HTTP `429` error code indicates a warning that the access frequency limit has been exceeded and the IP is about to be blocked.  
* HTTP `418` indicates that after receiving a 429 you continued to access, so the IP has been blocked.  
* HTTP `5XX` error codes are used to indicate issues on the Aster service side.

### API error codes

* When using the endpoint `/api/v1`, any endpoint may throw exceptions;

The API error codes are returned in the following format:

```javascript
{
  "code": -1121,
  "msg": "Invalid symbol."
}
```

### Basic information about the endpoint

* Endpoints with the `GET` method must send parameters in the `query string`.  
* For `POST`, `PUT`, and `DELETE` endpoints, parameters can be sent in the `query string` with content type `application/x-www-form-urlencoded` , or in the `request body`.  
* The order of parameters is not required.

---

## Access restrictions

### Basic information on access restrictions

* The `rateLimits` array in `/api/v1/exchangeInfo` contains objects related to REQUEST\_WEIGHT and ORDERS rate limits for trading. These are further defined in the `enum definitions` section under `rateLimitType`.  
* A 429 will be returned when any of the rate limits are violated.

### IP access limits

* Each request will include a header named `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` that contains the used weight of all requests from the current IP.  
* Each endpoint has a corresponding weight, and some endpoints may have different weights depending on their parameters. The more resources an endpoint consumes, the higher its weight will be.  
* Upon receiving a 429, you are responsible for stopping requests and must not abuse the API.  
* **If you continue to violate access limits after receiving a 429, your IP will be banned and you will receive a 418 error code.**  
* Repeated violations of the limits will result in progressively longer bans, **from a minimum of 2 minutes up to a maximum of 3 days**.  
* The `Retry-After` header will be sent with responses bearing 418 or 429, and will give the wait time **in seconds** (if 429\) to avoid the ban, or, if 418, until the ban ends.  
* **Access restrictions are based on IP, not API Key**

You are advised to use WebSocket messages to obtain the corresponding data as much as possible to reduce the load and rate-limit pressure from requests.

### Order rate limits

* Each successful order response will include a `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` header containing the number of order limit units currently used by the account.  
* When the number of orders exceeds the limit, you will receive a response with status 429 but without the `Retry-After` header. Please check the order rate limits in `GET api/v1/exchangeInfo` (rateLimitType \= ORDERS) and wait until the ban period ends.  
* Rejected or unsuccessful orders are not guaranteed to include the above header in the response.  
* **Order placement rate limits are counted per account.**

### WebSocket connection limits

* The WebSocket server accepts a maximum of 5 messages per second. Messages include:  
  * PING frame  
  * PONG frame  
  * Messages in JSON format, such as subscribe and unsubscribe.  
* If a user sends messages that exceed the limit, the connection will be terminated. IPs that are repeatedly disconnected may be blocked by the server.  
* A single connection can subscribe to up to **1024** Streams.

---

## API authentication types

* Each API has its own authentication type, which determines what kind of authentication should be performed when accessing it.  
* The authentication type will be indicated next to each endpoint name in this document; if not specifically stated, it defaults to `NONE`.  
* If API keys are required, they should be passed in the HTTP header using the `X-MBX-APIKEY` field.  
* API keys and secret keys are **case-sensitive**.   
* By default, API keys have access to all authenticated routes.

| Authentication type | Description |
| :---- | :---- |
| NONE | APIs that do not require authentication |
| TRADE | A valid API-Key and signature are required |
| USER\_DATA | A valid API-Key and signature are required |
| USER\_STREAM | A valid API-Key is required |
| MARKET\_DATA | A valid API-Key is required |

* The `TRADE` and `USER_DATA` endpoints are signed (SIGNED) endpoints.

---

## SIGNED (TRADE AND USER\_DATA) Endpoint security

* When calling a `SIGNED` endpoint, in addition to the parameters required by the endpoint itself, you must also pass a `signature` parameter in the `query string` or `request body`.  
* The signature uses the `HMAC SHA256` algorithm. The API-Secret corresponding to the API-KEY is used as the key for `HMAC SHA256`, and all other parameters are used as the data for the `HMAC SHA256` operation; the output is the signature.  
* The `signature` is **case-insensitive**.  
* "totalParams" is defined as the "query string" concatenated with the "request body".

### Time synchronization safety

* Signed endpoints must include the `timestamp` parameter, whose value should be the unix timestamp (milliseconds) at the moment the request is sent.  
* When the server receives a request it will check the timestamp; if it was sent more than 5,000 milliseconds earlier, the request will be considered invalid. This time window value can be defined by sending the optional `recvWindow` parameter.

The logical pseudocode is as follows:

```javascript
  if (timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow)
  {
    // process request
  } 
  else 
  {
    // reject request
  }
```

**About trade timeliness** Internet conditions are not completely stable or reliable, so the latency from your client to Aster's servers will experience jitter. This is why we provide `recvWindow`; if you engage in high-frequency trading and have strict requirements for timeliness, you can adjust `recvWindow` flexibly to meet your needs.

It is recommended to use a recvWindow of under 5 seconds. It must not exceed 60 seconds.

### Example of POST /api/v1/order

Below is an example of placing an order by calling the API using echo, openssl, and curl tools in a Linux bash environment. The apiKey and secretKey are for demonstration only.

| Key | Value |
| :---- | :---- |
| apiKey | 4452d7e2ed4da80b74105e02d06328c71a34488c9fdd60a5a0900d42d584b795 |
| secretKey | fdde510a2b71fa43a43bff3e3cf7819c8c66df34633d338050f4f59664b3b313 |

| Parameters | Values |
| :---- | :---- |
| symbol | BNBUSDT |
| side | BUY |
| type | LIMIT |
| timeInForce | GTC |
| quantity | 5 |
| price | 1.1 |
| recvWindow | 5000 |
| timestamp | 1756187806000 |

#### Example 1: All parameters are sent through the request body

**Example 1** **HMAC SHA256 signature:**

```shell
    $ echo -n "symbol=BNBUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=5&price=1.1&recvWindow=5000&timestamp=1756187806000" | openssl dgst -sha256 -hmac "fdde510a2b71fa43a43bff3e3cf7819c8c66df34633d338050f4f59664b3b313"
    (stdin)= e09169bf6c02ec4b29fa1bdc3a967f92c8c6cfcde0551ba1d477b2d3cf4c51b0
```

**curl command:**

```shell
    (HMAC SHA256)
    $ curl -H "X-MBX-APIKEY: 4452d7e2ed4da80b74105e02d06328c71a34488c9fdd60a5a0900d42d584b795" -X POST 'https://sapi.asterdex.com/api/v1/order' -d 'symbol=BNBUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=5&price=1.1&recvWindow=5000&timestamp=1756187806000&signature=e09169bf6c02ec4b29fa1bdc3a967f92c8c6cfcde0551ba1d477b2d3cf4c51b0'
```

* **requestBody:**

symbol=BNBUSDT \&side=BUY \&type=LIMIT \&timeInForce=GTC \&quantity=5 \&price=1.1 \&recvWindow=5000 \&timestamp=1756187806000

#### Example 2: All parameters sent through the query string

**Example 2** **HMAC SHA256 signature:**

```shell
    $ echo -n "symbol=BNBUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=5&price=1.1&recvWindow=5000&timestamp=1756187806000" | openssl dgst -sha256 -hmac "fdde510a2b71fa43a43bff3e3cf7819c8c66df34633d338050f4f59664b3b313"
    (stdin)= e09169bf6c02ec4b29fa1bdc3a967f92c8c6cfcde0551ba1d477b2d3cf4c51b0 
```

**curl command:**

```shell
    (HMAC SHA256)
   $ curl -H "X-MBX-APIKEY: 4452d7e2ed4da80b74105e02d06328c71a34488c9fdd60a5a0900d42d584b795" -X POST 'https://sapi.asterdex.com/api/v1/order?symbol=BNBUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=5&price=1.1&recvWindow=5000&timestamp=1756187806000&signature=e09169bf6c02ec4b29fa1bdc3a967f92c8c6cfcde0551ba1d477b2d3cf4c51b0'
```

* **queryString:**

symbol=BNBUSDT \&side=BUY \&type=LIMIT \&timeInForce=GTC \&quantity=5 \&price=1.1 \&recvWindow=5000 \&timestamp=1756187806000

---

## Public API parameters

### Terminology

The terminology in this section applies throughout the document. New users are encouraged to read it carefully for better understanding.

* `base asset` refers to the asset being traded in a trading pair, i.e., the asset name written first; for example, in `BTCUSDT`, `BTC` is the `base asset`.  
* `quote asset` refers to the pricing asset of a trading pair, i.e., the asset name written at the latter part; for example, in `BTCUSDT`, `USDT` is the `quote asset`.

### Enumeration definition

**Trading pair status (status):**

* TRADING \- after trade

**Trading pair type:**

* SPOT \- spot

**Order status (status):**

| Status | Description |
| :---- | :---- |
| NEW | Order accepted by the matching engine |
| PARTIALLY\_FILLED | Part of the order was filled |
| FILLED | The order was fully filled |
| CANCELED | The user canceled the order |
| REJECTED | The order was not accepted by the matching engine and was not processed |
| EXPIRED | Order canceled by the trading engine, for example: Limit FOK order not filled, Market order not fully filled, orders canceled during exchange maintenance |

**Order types (orderTypes, type):**

* LIMIT \- Limit Order  
* MARKET \- Market Order  
* STOP \- Limit Stop Order  
* TAKE\_PROFIT \- Limit Take-Profit Order  
* STOP\_MARKET \- Market Stop Order  
* TAKE\_PROFIT\_MARKET \- Market Take-Profit Order

**Order response type (newOrderRespType):**

* ACK  
* RESULT  
* FULL

**Order direction (direction side):**

* BUY \- Buy  
* SELL \- Sell

**Valid types (timeInForce):**

This defines how long an order can remain valid before expiring.

| Status | Description |
| :---- | :---- |
| GTC (Good ‘Til Canceled) | The order remains active until it is fully executed or manually canceled. |
| IOC (Immediate or Cancel) | The order will execute immediately for any amount available. Any unfilled portion is automatically canceled. |
| FOK (Fill or Kill) | The order must be fully executed immediately. If it cannot be filled in full, it is canceled right away. |
| GTX (Good till crossing, Post only) | The post-only limit order will only be placed if it can be added as a maker order and not as a taker order.  |

**K-line interval:**

m (minutes), h (hours), d (days), w (weeks), M (months)

* 1m  
* 3m  
* 5m  
* 15m  
* 30m  
* 1h  
* 2h  
* 4h  
* 6h  
* 8h  
* 12h  
* 1d  
* 3d  
* 1w  
* 1M

**Rate limit type (rateLimitType)**

REQUEST\_WEIGHT

```json
    {
      "rateLimitType": "REQUEST_WEIGHT",
      "interval": "MINUTE",
      "intervalNum": 1,
      "limit": 1200
    }
```

ORDERS

```json
    {
      "rateLimitType": "ORDERS",
      "interval": "MINUTE",
      "intervalNum": 1,
      "limit": 100
    }
```

* REQUEST\_WEIGHT \- The maximum sum of request weights allowed within a unit time  
    
* ORDERS \- Order placement frequency limit per time unit

**Interval restriction (interval)**

* MINUTE \- Minute

---

## Filters

Filters, i.e. Filter, define a set of trading rules. There are two types: filters for trading pairs `symbol filters`, and filters for the entire exchange `exchange filters` (not supported yet)

### Trading pair filters

#### PRICE\_FILTER Price filter

**Format in the /exchangeInfo response:**

```javascript
  {                     
    "minPrice": "556.72",
    "maxPrice": "4529764",
    "filterType": "PRICE_FILTER",
    "tickSize": "0.01"   
  }
```

The `Price Filter` checks the validity of the `price` parameter in an order. It consists of the following three parts:

* `minPrice` defines the minimum allowed value for `price`/`stopPrice`.  
* `maxPrice` defines the maximum allowed value for `price`/`stopPrice`.  
* `tickSize` defines the step interval for `price`/`stopPrice`, meaning the price must equal minPrice plus an integer multiple of tickSize.

Each of the above items can be 0; when 0 it means that item is not constrained.

The logical pseudocode is as follows:

* `price` \>= `minPrice`  
* `price` \<= `maxPrice`  
* (`price`\-`minPrice`) % `tickSize` \== 0

#### PERCENT\_PRICE price amplitude filter

**Format in the /exchangeInfo response:**

```javascript
  {                    
	"multiplierDown": "0.9500",
	"multiplierUp": "1.0500",
	"multiplierDecimal": "4",
	"filterType": "PERCENT_PRICE"
  }
```

The `PERCENT_PRICE` filter defines the valid range of prices based on the index price.

For the "price percentage" to apply, the "price" must meet the following conditions:

* `price` \<=`indexPrice` \*`multiplierUp`  
* `price`\> \=`indexPrice` \*`multiplierDown`

#### LOT\_SIZE order size

**Format in the /exchangeInfo response:**

```javascript
  {
    "stepSize": "0.00100000",
    "filterType": "LOT_SIZE",
    "maxQty": "100000.00000000",
    "minQty": "0.00100000"
  }
```

Lots is an auction term. The `LOT_SIZE` filter validates the `quantity` (i.e., the amount) parameter in orders. It consists of three parts:

* `minQty` indicates the minimum allowed value for `quantity`.  
* `maxQty` denotes the maximum allowed value for `quantity`.  
* `stepSize` denotes the allowed step increment for `quantity`.

The logical pseudocode is as follows:

* `quantity` \>= `minQty`  
* `quantity` \<= `maxQty`  
* (`quantity`\-`minQty`) % `stepSize` \== 0

#### MARKET\_LOT\_SIZE \- Market order size

\***/exchangeInfo response format:**

```javascript
  {
    "stepSize": "0.00100000",
    "filterType": "MARKET_LOT_SIZE"
	"maxQty": "100000.00000000",
	"minQty": "0.00100000"
  }
```

The `MARKET_LOT_SIZE` filter defines the `quantity` (i.e., the "lots" in an auction) rules for `MARKET` orders on a trading pair. There are three parts:

* `minQty` defines the minimum allowed `quantity`.  
* `maxQty` defines the maximum allowed quantity.  
* `stepSize` defines the increments by which the quantity can be increased or decreased.

In order to comply with the `market lot size`, the `quantity` must satisfy the following conditions:

* `quantity` \>= `minQty`  
* `quantity` \<= `maxQty`  
* (`quantity`\-`minQty`) % `stepSize` \== 0

# Market data API

## Test server connectivity

**Response**

```javascript
{}
```

`GET /api/v1/ping`

Test whether the REST API can be reached.

**Weight:** 1

**Parameters:** NONE

## Get server time

**Response**

```javascript
{
  "serverTime": 1499827319559
}
```

`GET /api/v1/time`

Test if the REST API can be reached and retrieve the server time.

**Weight:** 1

**Parameters:** NONE

## Trading specification information

**Response**

```javascript
{
	"timezone": "UTC",
	"serverTime": 1756197279679,
	"rateLimits": [{
			"rateLimitType": "REQUEST_WEIGHT",
			"interval": "MINUTE",
			"intervalNum": 1,
			"limit": 6000
		},
		{
			"rateLimitType": "ORDERS",
			"interval": "MINUTE",
			"intervalNum": 1,
			"limit": 6000
		},
		{
			"rateLimitType": "ORDERS",
			"interval": "SECOND",
			"intervalNum": 10,
			"limit": 300
		}
	],
	"exchangeFilters": [],
	"assets": [{
			"asset": "USD"
		}, {
			"asset": "USDT"
		},
		{
			"asset": "BNB"
		}
	],
	"symbols": [{
		"status": "TRADING",
		"baseAsset": "BNB",
		"quoteAsset": "USDT",
		"pricePrecision": 8,
		"quantityPrecision": 8,
		"baseAssetPrecision": 8,
		"quotePrecision": 8,
		"filters": [{
				"minPrice": "0.01000000",
				"maxPrice": "100000",
				"filterType": "PRICE_FILTER",
				"tickSize": "0.01000000"
			},
			{
				"stepSize": "0.00100000",
				"filterType": "LOT_SIZE",
				"maxQty": "1000",
				"minQty": "1"
			},
			{
				"stepSize": "0.00100000",
				"filterType": "MARKET_LOT_SIZE",
				"maxQty": "900000",
				"minQty": "0.00100000"
			},
			{
				"limit": 200,
				"filterType": "MAX_NUM_ORDERS"
			},
			{
				"minNotional": "5",
				"filterType": "MIN_NOTIONAL"
			},
			{
				"maxNotional": "100",
				"filterType": "MAX_NOTIONAL"
			},
			{
				"maxNotional": "100",
				"minNotional": "5",
				"avgPriceMins": 5,
				"applyMinToMarket": true,
				"filterType": "NOTIONAL",
				"applyMaxToMarket": true
			},
			{
				"multiplierDown": "0",
				"multiplierUp": "5",
				"multiplierDecimal": "0",
				"filterType": "PERCENT_PRICE"
			},
			{
				"bidMultiplierUp": "5",
				"askMultiplierUp": "5",
				"bidMultiplierDown": "0",
				"avgPriceMins": 5,
				"multiplierDecimal": "0",
				"filterType": "PERCENT_PRICE_BY_SIDE",
				"askMultiplierDown": "0"
			}
		],
		"orderTypes": [
			"LIMIT",
			"MARKET",
			"STOP",
			"STOP_MARKET",
			"TAKE_PROFIT",
			"TAKE_PROFIT_MARKET"
		],
		"timeInForce": [
			"GTC",
			"IOC",
			"FOK",
			"GTX"
		],
		"symbol": "BNBUSDT",
		"ocoAllowed": false
	}]
}
```

`GET /api/v1/exchangeInfo`

Retrieve trading rules and trading pair information.

**Weight:** 1

**Parameters:** None

## Depth information

**Response**

```javascript
{
  "lastUpdateId": 1027024,
  "E":1589436922972, //  Message output time
  "T":1589436922959, //  Transaction time
  "bids": [
    [
      "4.00000000", // PRICE
      "431.00000000" // QTY
    ]
  ],
  "asks": [
    [
      "4.00000200",
      "12.00000000"
    ]
  ]
}
```

`GET /api/v1/depth`

**Weight:**

Based on limit adjustments:

| Limitations | Weight |
| :---- | :---- |
| 5, 10, 20, 50 | 2 |
| 100 | 5 |
| 500 | 10 |
| 1000 | 20 |

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| limit | INT | NO | Default 100\. Optional values: \[5, 10, 20, 50, 100, 500, 1000\] |

## Recent trades list

**Response**

```javascript
[
 {
    "id": 657,
    "price": "1.01000000",
    "qty": "5.00000000",
    "baseQty": "4.95049505",
    "time": 1755156533943,
    "isBuyerMaker": false
  }
]
```

`GET /api/v1/trades`

Get recent trades

**Weight:** 1

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| limit | INT | NO | Default 500; maximum 1000 |

## Query historical trades (MARKET\_DATA)

**Response**

```javascript
[
 {
    "id": 1140,
    "price": "1.10000000",
    "qty": "7.27200000",
    "baseQty": "6.61090909",
    "time": 1756094288700,
    "isBuyerMaker": false
 }
]
```

`GET /api/v1/historicalTrades`

Retrieve historical trades

**Weight:** 20

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| limit | INT | NO | Default 500; maximum 1000\. |
| fromId | LONG | NO | Return starting from which trade id. Defaults to returning the most recent trade records. |

## Recent trades (aggregated)

**Response**

```javascript
[
  {
    "a": 26129, // Aggregate tradeId
    "p": "0.01633102", // Price
    "q": "4.70443515", // Quantity
    "f": 27781, // First tradeId
    "l": 27781, // Last tradeId
    "T": 1498793709153, // Timestamp
    "m": true, // Was the buyer the maker?
  }
]
```

`GET /api/v1/aggTrades`

The difference between aggregated trades and individual trades is that trades with the same price, same side, and same time are combined into a single entry.

**Weight:** 20

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| fromId | LONG | NO | Return results starting from the trade ID that includes fromId |
| startTime | LONG | NO | Return results starting from trades after that time |
| endTime | LONG | NO | Return the trade records up to that moment |
| limit | INT | NO | Default 500; maximum 1000\. |

* If you send startTime and endTime, the interval must be less than one hour.  
* If no filter parameters (fromId, startTime, endTime) are sent, the most recent trade records are returned by default

## K-line data

**Response**

```javascript
[
  [
    1499040000000, // Open time
    "0.01634790", // Open
    "0.80000000", // High
    "0.01575800", // Low
    "0.01577100", // Close
    "148976.11427815", // Volume
    1499644799999, // Close time
    "2434.19055334", // Quote asset volume
    308, // Number of trades
    "1756.87402397", // Taker buy base asset volume
    "28.46694368", // Taker buy quote asset volume
  ]
]
```

`GET /api/v1/klines`

Each K-line represents a trading pair. The open time of each K-line can be regarded as a unique ID.

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| interval | ENUM | YES | See the enumeration definition: K-line interval |
| startTime | LONG | NO |  |
| endTime | LONG | NO |  |
| limit | INT | NO | Default 500; maximum 1500\. |

* If startTime and endTime are not sent, the most recent trades are returned by default

## 24h price change

**Response**

```javascript
{
  "symbol": "BTCUSDT",              //symbol
  "priceChange": "-94.99999800",    //price change
  "priceChangePercent": "-95.960",  //price change percent
  "weightedAvgPrice": "0.29628482", //weighted avgPrice
  "prevClosePrice": "3.89000000",   //prev close price
  "lastPrice": "4.00000200",        //last price
  "lastQty": "200.00000000",        //last qty
  "bidPrice": "866.66000000",       //first bid price
  "bidQty": "72.05100000",          //first bid qty
  "askPrice": "866.73000000",       //first ask price
  "askQty": "1.21700000",           //first ask qty
  "openPrice": "99.00000000",       //open price
  "highPrice": "100.00000000",      //high price
  "lowPrice": "0.10000000",         //low price
  "volume": "8913.30000000",        //volume
  "quoteVolume": "15.30000000",     //quote volume
  "openTime": 1499783499040,        //open time
  "closeTime": 1499869899040,       //close time
  "firstId": 28385,   // first id
  "lastId": 28460,    // last id
  "count": 76,         // count
  "baseAsset": "BTC",   //base asset
  "quoteAsset": "USDT"  //quote asset
}
```

`GET /api/v1/ticker/24hr`

24-hour rolling window price change data. Please note that omitting the symbol parameter will return data for all trading pairs; in that case the returned data is an example array for the respective pairs, which is not only large in volume but also has a very high weight.

**Weight:** 1 \= single trading pair; **40** \= When the trading pair parameter is missing (returns all trading pairs)

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | NO |  |

* Please note that omitting the symbol parameter will return data for all trading pairs

## Latest price

**Response**

```javascript
{
   "symbol": "ADAUSDT",
   "price": "1.30000000",
   "time": 1649666690902
}  
```

OR

```javascript
[     
  {
     "symbol": "ADAUSDT",
     "price": "1.30000000",
     "time": 1649666690902
  }
]
```

`GET /api/v1/ticker/price`

Get the latest price for a trading pair

**Weight:** 1 \= Single trading pair; **2** \= No symbol parameter (returns all pairs)

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | NO |  |

* If no trading pair parameter is sent, information for all trading pairs will be returned

## Current best order

**Response**

```javascript
{
  "symbol": "LTCBTC",
  "bidPrice": "4.00000000",
  "bidQty": "431.00000000",
  "askPrice": "4.00000200",
  "askQty": "9.00000000"
  "time": 1589437530011   // Timestamp
}
```

OR

```javascript
[
  {
    "symbol": "LTCBTC",
    "bidPrice": "4.00000000",
    "bidQty": "431.00000000",
    "askPrice": "4.00000200",
    "askQty": "9.00000000",
    "time": 1589437530011   // Timestamp
  }
]
```

`GET /api/v1/ticker/bookTicker`

Return the current best orders (highest bid, lowest ask)

**Weight:** 1 \= Single trading pair; **2** \= No symbol parameter (returns all pairs)

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | NO |  |

* If no trading pair parameter is sent, information for all trading pairs will be returned

## Get symbol fees

**Response**

```javascript
{
   "symbol": "APXUSDT",
   "makerCommissionRate": "0.000200",    
   "takerCommissionRate": "0.000700"
}
```

`GET /api/v1/commissionRate`

Get symbol fees

**Weight:** 20

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| recvWindow | LONG | NO | The assigned value cannot be greater than 60000 |
| timestamp | LONG | YES |  |

# Spot account and trading API

## Place order (TRADE)

**Response ACK:**

```javascript
{
  "symbol": "BTCUSDT", 
  "orderId": 28, 
  "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP", 
  "updateTime": 1507725176595, 
  "price": "0.00000000", 
  "avgPrice": "0.0000000000000000", 
  "origQty": "10.00000000", 
  "cumQty": "0",          
  "executedQty": "10.00000000", 
  "cumQuote": "10.00000000",
  "status": "FILLED",
  "timeInForce": "GTC", 
  "stopPrice": "0",    
  "origType": "LIMIT",  
  "type": "LIMIT", 
  "side": "SELL", 
}
```

`POST /api/v1/order (HMAC SHA256)`

Send order

**Weight:** 1

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| side | ENUM | YES | See enum definition: Order direction |
| type | ENUM | YES | See enumeration definition: Order type |
| timeInForce | ENUM | NO | See enum definition: Time in force |
| quantity | DECIMAL | NO |  |
| quoteOrderQty | DECIMAL | NO |  |
| price | DECIMAL | NO |  |
| newClientOrderId | STRING | NO | Client-customized unique order ID. If not provided, one will be generated automatically. |
| stopPrice | DECIMAL | NO | Only STOP, STOP\_MARKET, TAKE\_PROFIT, TAKE\_PROFIT\_MARKET require this parameter |
| recvWindow | LONG | NO | The value cannot be greater than 60000 |
| timestamp | LONG | YES |  |

Depending on the order `type`, certain parameters are mandatory:

| Type | Mandatory parameters |
| :---- | :---- |
| LIMIT | timeInForce, quantity, price |
| MARKET | quantity or quoteOrderQty |
| STOP and TAKE\_PROFIT | quantity, price, stopPrice |
| STOP\_MARKET and TAKE\_PROFIT\_MARKET | quantity, stopPrice |

Other information:

* Place a `MARKET` `SELL` market order; the user controls the amount of base assets to sell with the market order via `QUANTITY`.  
  * For example, when placing a `MARKET` `SELL` market order on the `BTCUSDT` pair, use `QUANTITY` to let the user specify how much BTC they want to sell.  
* For a `MARKET` `BUY` market order, the user controls how much of the quote asset they want to spend with `quoteOrderQty`; `QUANTITY` will be calculated by the system based on market liquidity. For example, when placing a `MARKET` `BUY` market order on the `BTCUSDT` pair, use `quoteOrderQty` to let the user choose how much USDT to use to buy BTC.  
* A `MARKET` order using `quoteOrderQty` will not violate the `LOT_SIZE` limit rules; the order will be executed as closely as possible to the given `quoteOrderQty`.  
* Unless a previous order has already been filled, orders set with the same `newClientOrderId` will be rejected.

## Cancel order (TRADE)

**Response**

```javascript
{
  "symbol": "BTCUSDT", 
  "orderId": 28, 
  "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP", 
  "updateTime": 1507725176595, 
  "price": "0.00000000", 
  "avgPrice": "0.0000000000000000", 
  "origQty": "10.00000000", 
  "cumQty": "0",            
  "executedQty": "10.00000000", 
  "cumQuote": "10.00000000", 
  "status": "CANCELED", 
  "timeInForce": "GTC", 
  "stopPrice": "0",    
  "origType": "LIMIT",  
  "type": "LIMIT", 
  "side": "SELL",
}
```

`DELETE /api/v1/order (HMAC SHA256)`

Cancel active orders

**Weight:** 1

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| orderId | LONG | NO |  |
| origClientOrderId | STRING | NO |  |
| recvWindow | LONG | NO |  |
| timestamp | LONG | YES |  |

At least one of `orderId` or `origClientOrderId` must be sent.

## Query order (USER\_DATA)

**Response**

```javascript
{
    "orderId": 38,
    "symbol": "ADA25SLP25",
    "status": "FILLED",
    "clientOrderId": "afMd4GBQyHkHpGWdiy34Li",
    "price": "20",
    "avgPrice": "12.0000000000000000",
    "origQty": "10",
    "executedQty": "10",
    "cumQuote": "120",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "BUY",
    "stopPrice": "0",
    "origType": "LIMIT",
    "time": 1649913186270,
    "updateTime": 1649913186297
} 
```

`GET /api/v1/order (HMAC SHA256)`

Query order status

* Please note that orders meeting the following conditions will not be returned:  
  * The final status of the order is `CANCELED` or `EXPIRED`, **and**  
  * The order has no trade records, **and**  
  * Order creation time \+ 7 days \< current time

**Weight:** 1

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| orderId | LONG | NO |  |
| origClientOrderId | STRING | NO |  |
| recvWindow | LONG | NO |  |
| timestamp | LONG | YES |  |

Note:

* You must send at least one of `orderId` or `origClientOrderId`.

## Current open orders (USER\_DATA)

**Response**

```javascript
[
    {
        "orderId": 349661, 
        "symbol": "BNBUSDT", 
        "status": "NEW", 
        "clientOrderId": "LzypgiMwkf3TQ8wwvLo8RA", 
        "price": "1.10000000", 
        "avgPrice": "0.0000000000000000", 
        "origQty": "5",  
        "executedQty": "0", 
        "cumQuote": "0", 
        "timeInForce": "GTC",
        "type": "LIMIT", 
        "side": "BUY",   
        "stopPrice": "0", 
        "origType": "LIMIT", 
        "time": 1756252940207, 
        "updateTime": 1756252940207, 
    }
]
```

`GET /api/v1/openOrders (HMAC SHA256)`

Retrieve all current open orders for trading pairs. Use calls without a trading pair parameter with caution.

**Weight:**

* With symbol ***1***  
* Without ***40***  

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | NO |  |
| recvWindow | LONG | NO |  |
| timestamp | LONG | YES |  |

* If the symbol parameter is not provided, it will return the order books for all trading pairs.

## Cancel All Open Orders (TRADE)

> **Response**

```javascript
{
    "code": 200,
    "msg": "The operation of cancel all open order is done."
}
```

``
DEL /api/v1/allOpenOrders  (HMAC SHA256)
``

**Weight:**
- ***1***

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
orderIdList | STRING | NO |  orderid array string
origClientOrderIdList | STRING | NO | clientOrderId array string
recvWindow | LONG | NO |
timestamp | LONG | YES |


## Query all orders (USER\_DATA)

**Response**

```javascript
[
    {
        "orderId": 349661, 
        "symbol": "BNBUSDT", 
        "status": "NEW", 
        "clientOrderId": "LzypgiMwkf3TQ8wwvLo8RA", 
        "price": "1.10000000", 
        "avgPrice": "0.0000000000000000", 
        "origQty": "5",  
        "executedQty": "0", 
        "cumQuote": "0", 
        "timeInForce": "GTC", 
        "type": "LIMIT", 
        "side": "BUY",   
        "stopPrice": "0", 
        "origType": "LIMIT", 
        "time": 1756252940207, 
        "updateTime": 1756252940207, 
    }
]
```

`GET /api/v1/allOrders (HMAC SHA256)`

Retrieve all account orders; active, canceled, or completed.

* Please note that orders meeting the following conditions will not be returned:  
  * Order creation time \+ 7 days \< current time

**Weight:** 5

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | YES |  |
| orderId | LONG | NO |  |
| startTime | LONG | NO |  |
| endTime | LONG | NO |  |
| limit | INT | NO | Default 500; maximum 1000 |
| recvWindow | LONG | NO |  |
| timestamp | LONG | YES |  |

* The maximum query time range must not exceed 7 days.  
* By default, query data is from the last 7 days.



## Perp-spot transfer (TRADE)

**Response:**

```javascript
{
    "tranId": 21841, //Tran Id
    "status": "SUCCESS" //Status
}
```

`POST /api/v1/asset/wallet/transfer  (HMAC SHA256)`

**Weight:** 5

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| amount | DECIMAL | YES | Quantity |
| asset | STRING | YES | Asset |
| clientTranId | STRING | YES | Transaction ID |
| kindType | STRING | YES | Transaction type |
| timestamp | LONG | YES | Timestamp |

* kindType FUTURE_SPOT(future to spot)/SPOT_FUTURE(spot to future)

## Transfer asset to other address (TRADE)

> **Response:**

```javascript
{
    "tranId": 21841, 
    "status": "SUCCESS" 
}
```

``
POST /api/v1/asset/sendToAddress  (HMAC SHA256)
``

**Weight:**
5

**Parameters:**


Name | Type | Mandatory | Description
---------------- | ------- | -------- | ----
amount |	DECIMAL | 	YES |	
asset |	STRING | 	YES |	
toAddress |	STRING | 	YES |	
clientTranId |	STRING | 	NO |	 
recvWindow | LONG | NO | 
timestamp	| LONG | YES	|	

**Note:**
* The target address must be a valid existing account and must not be the same as the sender’s account.
* The toAddress must be an EVM address.
* If clientTranId is provided, its length must be at least 20 characters.


## Get withdraw fee (NONE)
> **Response:**
```javascript
{
  "tokenPrice": 1.00019000,
   "gasCost": 0.5000,
  "gasUsdValue": 0.5
}
```

``
GET /api/v1/aster/withdraw/estimateFee 
``

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
chainId | STRING | YES | 
asset | STRING | YES | 

**Notes:**
* chainId: 1(ETH),56(BSC),42161(Arbi)
* gasCost: The minimum fee required for a withdrawal

## Withdraw (USER_DATA)
> **Response:**
```javascript
{
  "withdrawId": "1014729574755487744",
  "hash":"0xa6d1e617a3f69211df276fdd8097ac8f12b6ad9c7a49ba75bbb24f002df0ebb"
}
```

``
POST /api/v1/aster/user-withdraw (HMAC SHA256)
``

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
chainId | STRING | YES | 1(ETH),56(BSC),42161(Arbi)
asset | STRING | YES |
amount | STRING | YES |
fee | STRING | YES |
receiver | STRING | YES |  The address of the current account
nonce | STRING | YES |  The current time in microseconds 
userSignature | STRING | YES | 
recvWindow | LONG | NO | 
timestamp | LONG | YES | 


**Note:** 
* chainId: 1(ETH),56(BSC),42161(Arbi)
* receiver: The address of the current account
* If the futures account balance is insufficient, funds will be transferred from the spot account to the perp account for withdrawal.
* userSignature demo

```shell
const domain = {
    name: 'Aster',
    version: '1',
    chainId: 56,
    verifyingContract: ethers.ZeroAddress,
  }

const currentTime = Date.now() * 1000
 
const types = {
    Action: [
        {name: "type", type: "string"},
        {name: "destination", type: "address"},
        {name: "destination Chain", type: "string"},
        {name: "token", type: "string"},
        {name: "amount", type: "string"},
        {name: "fee", type: "string"},
        {name: "nonce", type: "uint256"},
        {name: "aster chain", type: "string"},
    ],
  }
  const value = {
    'type': 'Withdraw',
    'destination': '0xD9cA6952F1b1349d27f91E4fa6FB8ef67b89F02d',
    'destination Chain': 'BSC',
    'token': 'USDT',
    'amount': '10.123400',
    'fee': '1.234567891',
    'nonce': currentTime,
    'aster chain': 'Mainnet',
  }


const signature = await signer.signTypedData(domain, types, value)
```

## Get User Create Apikey nonce (NONE)

> **Response:**
```javascript

111111

```

``
POST /api/v1/getNonce 
``

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | STRING | YES |
userOperationType | STRING | YES | CREATE_API_KEY
network | STRING | NO | 

**Notes:**
* userOperationType: CREATE_API_KEY
* network: For the Solana network, SOL must be provided; otherwise, this field can be ignored.

## Create Apikey (NONE)

> **Response:**
```javascript
{
    "apiKey": "bb3b24d0a3dec88cb06be58a257e4575cb0b1bb256ad6fd90ae8fd0ee1d102ae",
    "apiSecret": "9fe8f5642ae1961674ea0cb7f957fa99dc8e0421b607c985a963ad2ced90ae1c"
}
```

``
POST /api/v1/createApiKey
``

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
address | STRING | YES |
userOperationType | STRING | YES | CREATE_API_KEY
network | STRING | NO | 
userSignature | STRING | YES | 
apikeyIP | STRING | NO | 
desc | STRING | YES | 
recvWindow | LONG | NO | 
timestamp | LONG | YES | 

**Note:**
* userOperationType: CREATE_API_KEY
* network: For the Solana network, SOL must be provided; otherwise, this field can be ignored.
* desc: The same account cannot be duplicated, and the length must not exceed 20 characters.
* apikeyIP: An array of IP addresses, separated by commas.
* Rate limit: 60 requests per minute per IP.
* userSignature: EVM demo

```shell
const nonce = 111111
const message = 'You are signing into Astherus ${nonce}';
const signature = await signer.signMessage(message);
```

## Account information (USER\_DATA)

**Response**

```javascript
{     
   "feeTier": 0,
   "canTrade": true,
   "canDeposit": true,
   "canWithdraw": true,
   "canBurnAsset": true,
   "updateTime": 0,
   "balances": [
    {
      "asset": "BTC",
      "free": "4723846.89208129",
      "locked": "0.00000000"
    },
    {
      "asset": "LTC",
      "free": "4763368.68006011",
      "locked": "0.00000000"
    }
  ]
}
```

`GET /api/v1/account (HMAC SHA256)`

Retrieve current account information

**Weight:** 5

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| recvWindow | LONG | NO |  |
| timestamp | LONG | YES |  |

## Account trade history (USER\_DATA)

**Response**

```javascript
[ 
  {
    "symbol": "BNBUSDT",
    "id": 1002,
    "orderId": 266358,
    "side": "BUY",
    "price": "1",
    "qty": "2",
    "quoteQty": "2",
    "commission": "0.00105000",
    "commissionAsset": "BNB",
    "time": 1755656788798,
    "counterpartyId": 19,
    "createUpdateId": null,
    "maker": false,
    "buyer": true
  }
] 
```

`GET /api/v1/userTrades (HMAC SHA256)`

Retrieve the trade history for a specified trading pair of an account

**Weight:** 5

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| symbol | STRING | NO |  |
| orderId | LONG | NO | Must be used together with the parameter symbol |
| startTime | LONG | NO |  |
| endTime | LONG | NO |  |
| fromId | LONG | NO | Starting trade ID. Defaults to fetching the most recent trade. |
| limit | INT | NO | Default 500; maximum 1000 |
| recvWindow | LONG | NO |  |
| timestamp | LONG | YES |  |

* If both `startTime` and `endTime` are not sent, only data from the last 7 days will be returned.  
* The maximum interval between startTime and endTime is 7 days.  
* `fromId` cannot be sent together with `startTime` or `endTime`.      

---

# WebSocket market data feed

* The base URL for all wss endpoints listed in this document is: **wss://sstream.asterdex.com**  
* Streams have either a single raw stream or a combined stream  
* Single raw streams format is \*\*/ws/\*\*  
* The URL format for combined streams is \*\*/stream?streams=//\*\*  
* When subscribing to combined streams, the event payload is wrapped in this format: \*\*{"stream":"","data":}\*\*  
* All trading pairs in stream names are **lowercase**  
* Each link to **sstream.asterdex.com** is valid for no more than 24 hours; please handle reconnections appropriately  
* Every 3 minutes the server sends a ping frame; the client must reply with a pong frame within 10 minutes, otherwise the server will close the connection. The client is allowed to send unpaired pong frames (i.e., the client may send pong frames at a frequency higher than once every 10 minutes to keep the connection alive).

## Real-time subscribe/unsubscribe data streams

* The following messages can be sent via WebSocket to subscribe or unsubscribe to data streams. Examples are shown below.  
* The `id` in the response content is an unsigned integer that serves as the unique identifier for exchanges of information.  
* If the `result` in the response content is `null`, it indicates the request was sent successfully.

### Subscribe to a stream

**Response**

```javascript
{
  "result": null,
  "id": 1
}
```

* **Request** { "method": "SUBSCRIBE", "params": \[ "btcusdt@aggTrade", "btcusdt@depth" \], "id": 1 }

### Unsubscribe from a stream

**Response**

```javascript
{
  "result": null,
  "id": 312
}
```

* **Request** { "method": "UNSUBSCRIBE", "params": \[ "btcusdt@depth" \], "id": 312 }

### Subscribed to the feed

**Response**

```javascript
{
  "result": [
    "btcusdt@aggTrade"
  ],
  "id": 3
}
```

* **Request**  
    
  { "method": "LIST\_SUBSCRIPTIONS", "id": 3 }

### Set properties

Currently, the only configurable property is whether to enable the `combined` ("combined") stream. When connecting using `/ws/` ("raw stream"), the combined property is set to `false`, while connecting using `/stream/` sets the property to `true`.

**Response**

```javascript
{
"result": null,
"id": 5
}
```

* **Request** { "method": "SET\_PROPERTY" "params": \[ "combined", true \], "id": 5 }

### Retrieve properties

**Response**

```javascript
{
  "result": true, // Indicates that combined is set to true.
  "id": 2
}
```

* **Request**  
    
  { "method": "GET\_PROPERTY", "params": \[ "combined" \], "id": 2 }

\#\#\# Error message

| Error message | Description |
| :---- | :---- |
| {"code": 0, "msg": "Unknown property"} | Parameters applied in SET\_PROPERTY or GET\_PROPERTY are invalid |
| {"code": 1, "msg": "Invalid value type: expected Boolean", "id": '%s'} | Only true or false are accepted |
| {"code": 2, "msg": "Invalid request: property name must be a string"} | The provided attribute name is invalid |
| {"code": 2, "msg": "Invalid request: request ID must be an unsigned integer"} | Parameter ID not provided or ID has an invalid type |
| {"code": 2, "msg": "Invalid request: unknown variant %s, expected one of SUBSCRIBE, UNSUBSCRIBE, LIST\_SUBSCRIPTIONS, SET\_PROPERTY, GET\_PROPERTY at line 1 column 28"} | Typo warning, or the provided value is not of the expected type |
| {"code": 2, "msg": "Invalid request: too many parameters"} | Unnecessary parameters were provided in the data |
| {"code": 2, "msg": "Invalid request: property name must be a string"} | Property name not provided |
| {"code": 2, "msg": "Invalid request: missing field method at line 1 column 73"} | Data did not provide method |
| {"code":3,"msg":"Invalid JSON: expected value at line %s column %s"} | JSON syntax error |

## Collection transaction flow

**Payload:**

```javascript
{
  "e": "aggTrade",  // Event type
  "E": 123456789,   // Event time
  "s": "BNBBTC",    // Symbol
  "a": 12345,       // Aggregate trade ID
  "p": "0.001",     // Price
  "q": "100",       // Quantity
  "f": 100,         // First trade ID
  "l": 105,         // Last trade ID
  "T": 123456785,   // Trade time
  "m": true,        // Is the buyer the market maker?
  "M": true         // Ignore
}
```

The collection transaction stream pushes transaction information and is an aggregation of a single order.

**Stream name:** `<symbol>@aggTrade`

**Update speed:** real-time

## Tick-by-tick trades

**Payload:**

```javascript
{
  "e": "trade",     // Event type
  "E": 123456789,   // Event time
  "s": "BNBBTC",    // Symbol
  "t": 12345,       // Trade ID
  "p": "0.001",     // Price
  "q": "100",       // Quantity
  "T": 123456785,   // Trade time
  "m": true,        // Is the buyer the market maker?
}
```

**Stream name:** `<symbol>@trade`

Each trade stream pushes the details of every individual trade. A **trade**, also called a transaction, is defined as a match between exactly one taker and one maker.

## K-line streams

**Payload:**

```javascript
{
  "e": "kline",     // Event type
  "E": 123456789,   // Event time
  "s": "BNBBTC",    // Symbol
  "k": {
    "t": 123400000, // Kline start time
    "T": 123460000, // Kline close time
    "s": "BNBBTC",  // Symbol
    "i": "1m",      // Interval
    "f": 100,       // First trade ID
    "L": 200,       // Last trade ID
    "o": "0.0010",  // Open price
    "c": "0.0020",  // Close price
    "h": "0.0025",  // High price
    "l": "0.0015",  // Low price
    "v": "1000",    // Base asset volume
    "n": 100,       // Number of trades
    "x": false,     // Is this kline closed?
    "q": "1.0000",  // Quote asset volume
    "V": "500",     // Taker buy base asset volume
    "Q": "0.500",   // Taker buy quote asset volume
    "B": "123456"   // Ignore
  }
}
```

The K-line stream pushes per-second updates for the requested type of K-line (the latest candle).

**Stream name:** `<symbol>@kline_<interval>`

**Update speed:** 2000ms

**K-line interval parameter:**

m (minutes), h (hours), d (days), w (weeks), M (months)

* 1m  
* 3m  
* 5m  
* 15m  
* 30m  
* 1h  
* 2h  
* 4h  
* 6h  
* 8h  
* 12h  
* 1d  
* 3d  
* 1w  
* 1M

## Simplified ticker by symbol

**Payload:**

```javascript
  {
    "e": "24hrMiniTicker",  // Event type
    "E": 123456789,         // Event time
    "s": "BNBBTC",          // Symbol
    "c": "0.0025",          // Close price
    "o": "0.0010",          // Open price
    "h": "0.0025",          // High price
    "l": "0.0010",          // Low price
    "v": "10000",           // Total traded base asset volume
    "q": "18"               // Total traded quote asset volume
  }
```

Refreshed simplified 24-hour ticker information by symbol

**Stream name:** `<symbol>@miniTicker`

**Update speed:** 1000ms

## Compact tickers for all symbols in the entire market

**Payload:**

```javascript
[
  {
    // Same as <symbol>@miniTicker payload
  }
]
```

Same as above, but pushes all trading pairs. Note that only updated tickers will be pushed.

**Stream name:** \!miniTicker@arr

**Update speed:** 1000ms

## Full ticker per symbol

**Payload:**

```javascript
{
  "e": "24hrTicker",  // Event type
  "E": 123456789,     // Event time
  "s": "BNBBTC",      // Symbol
  "p": "0.0015",      // Price change
  "P": "250.00",      // Price change percent
  "w": "0.0018",      // Weighted average price
  "c": "0.0025",      // Last price
  "Q": "10",          // Last quantity
  "o": "0.0010",      // Open price
  "h": "0.0025",      // High price
  "l": "0.0010",      // Low price
  "v": "10000",       // Total traded base asset volume
  "q": "18",          // Total traded quote asset volume
  "O": 0,             // Statistics open time
  "C": 86400000,      // Statistics close time
  "F": 0,             // First trade ID
  "L": 18150,         // Last trade Id
  "n": 18151          // Total number of trades
}
```

Pushes per-second tag statistics for a single trading pair over a rolling 24-hour window.

**Stream name:** `<symbol>@ticker`

**Update speed:** 1000ms

## Complete ticker for all trading pairs on the entire market

**Payload:**

```javascript
[
  {
    // Same as <symbol>@ticker payload
  }
]
```

Pushes the full 24-hour refreshed ticker information for all trading pairs across the entire market. Note that tickers without updates will not be pushed.

**Stream name:** `!ticker@arr`

**Update speed:** 1000ms

## Best order book information by symbol

**Payload:**

```javascript
{
  "u":400900217,     // order book updateId
  "s":"BNBUSDT",     // symbol
  "b":"25.35190000", // best bid price
  "B":"31.21000000", // best bid qty
  "a":"25.36520000", // best ask price
  "A":"40.66000000"  // best ask qty
}
```

Real-time push of best order book information for the specified trading pair

**Stream name:** `<symbol>@bookTicker`

**Update speed:** Real-time

## Best order book information across the entire market

**Payload:**

```javascript
{
  // 同 <symbol>@bookTicker payload
}
```

Real-time push of the best order information for all trading pairs

**Stream name:** `!bookTicker`

**Update speed:** Real-time

## Limited depth information

**Payload:**

```javascript
{ 
  "e": "depthUpdate", // Event type
  "E": 123456789,     // Event time
  "T": 123456788,     // Transaction time 
  "s": "BTCUSDT",     // Symbol
  "U": 100,           // First update ID in event
  "u": 120,           // Final update ID in event
  "pu": 99,          // Final update Id in last stream(ie `u` in last stream) 
  "bids": [             // Bids to be updated
    [
      "0.0024",         // Price level to be updated
      "10"              // Quantity
    ]
  ],
  "asks": [             // Asks to be updated
    [
      "0.0026",         // Price level to be updated
      "100"             // Quantity
    ]
  ]
} 
```

Limited depth information pushed every second or every 100 milliseconds. Levels indicate how many levels of bid/ask information, optional 5/10/20 levels.

**Stream names:** `<symbol>@depth<levels>` or `<symbol>@depth<levels>@100ms`.

**Update speed:** 1000ms or 100ms

## Incremental depth information

**Payload:**

```javascript
{
  "e": "depthUpdate", // Event type
  "E": 123456789,     // Event time
  "T": 123456788,     // Transaction time 
  "s": "BTCUSDT",     // Symbol
  "U": 100,           // First update ID in event
  "u": 120,           // Final update ID in event
  "pu": 99,          // Final update Id in last stream(ie `u` in last stream)
  "b": [              // Bids to be updated
    [
      "5.4",       // Price level to be updated
      "10"            // Quantity
    ]
  ],
  "a": [              // Asks to be updated
    [
      "5.6",       // Price level to be updated
      "100"          // Quantity
    ]
  ]
}   
```

Pushes the changed parts of the orderbook (if any) every second or every 100 milliseconds

**Stream name:** `<symbol>@depth` or `<symbol>@depth@100ms`

**Update speed:** 1000ms or 100ms

## How to correctly maintain a local copy of an order book

1. Subscribe to **wss://sstream.asterdex.com/ws/bnbbtc@depth**  
2. Start caching the received updates. For the same price level, later updates overwrite earlier ones.  
3. Fetch the REST endpoint [**https://sapi.asterdex.com/api/v1/depth?symbol=BNBBTC\&limit=1000**](https://sapi.asterdex.com/api/v1/depth?symbol=BNBBTC&limit=1000) to obtain a 1000-level depth snapshot  
4. Discard from the currently cached messages those with `u` \<= the `lastUpdateId` obtained in step 3 (drop older, expired information)  
5. Apply the depth snapshot to your local order book copy, and resume updating the local copy from the first WebSocket event whose `U` \<= `lastUpdateId`\+1 **and** `u` \>= `lastUpdateId`\+1  
6. Each new event’s `U` should equal exactly the previous event’s `u`\+1; otherwise packets may have been lost \- restart initialization from step 3  
7. The order quantity in each event represents the current order quantity at that price as an **absolute value**, not a relative change  
8. If the order quantity at a given price is 0, it means the orders at that price have been canceled or filled, and that price level should be removed

# WebSocket account information push

* The base URL for the API endpoints listed in this document is: [**https://sapi.asterdex.com**](https://sapi.asterdex.com)  
* The `listenKey` used to subscribe to account data is valid for 60 minutes from the time of creation  
* You can extend the 60-minute validity of a `listenKey` by sending a `PUT` request  
* You can immediately close the current data stream and invalidate the `listenKey` by sending a `DELETE` for a `listenKey`  
* Sending a `POST` on an account with a valid `listenKey` will return the currently valid `listenKey` and extend its validity by 60 minutes  
* The WebSocket interface baseurl: **wss://sstream.asterdex.com**  
* The stream name for subscribing to the user account data stream is \*\*/ws/\*\*  
* Each connection is valid for no more than 24 hours; please handle disconnections and reconnections appropriately

## Listen Key (spot account)

### Generate Listen Key (USER\_STREAM)

**Response**

```javascript
{
  "listenKey": "pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1"
}
```

`POST /api/v1/listenKey`

Start a new data stream. The data stream will be closed after 60 minutes unless a keepalive is sent. If the account already has a valid `listenKey`, that `listenKey` will be returned and its validity extended by 60 minutes.

**Weight:** 1

**Parameters:** NONE

### Extend Listen Key validity period (USER\_STREAM)

**Response**

```javascript
{}
```

`PUT /api/v1/listenKey`

Validity extended to 60 minutes after this call. It is recommended to send a ping every 30 minutes.

**Weight:** 1

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| listenKey | STRING | YES |  |

### Close Listen Key (USER\_STREAM)

**Response**

```javascript
{}
```

`DELETE /api/v1/listenKey`

Close user data stream

**Weight:** 1

**Parameters:**

| Name | Type | Is it required? | Description |
| :---- | :---- | :---- | :---- |
| listenKey | STRING | YES |  |

## Payload: ACCOUNT\_UPDATE

An `outboundAccountPosition` event is sent whenever an account balance changes; it contains the assets that may have changed due to the event that generated the balance update.

**Payload**

```javascript
{
  "B":[  //Balance
    {
      "a":"SLP25",   //Asset
      "f":"10282.42029415",   //Free
      "l":"653.00000001"   //Locked
    },
    {
      "a":"ADA25",
      "f":"9916.96229880",
      "l":"34.00510000"
    }
  ],
  "e":"outboundAccountPosition",   //Event type
  "T":1649926447190,   //Time of last account update
  "E":1649926447205   //Event Time
  "m":"WITHDRAW" // Event reason type
}
```

## Payload: Order Update

Orders are updated via the `executionReport` event

**Payload**

```javascript
{
 "s":"ADA25SLP25",   // symbol
  "c":"Xzh0gnxT41PStbwqOtXnjD",  // client order id
  "S":"SELL",   // order direction
  "o":"LIMIT",   // order type
  "f":"GTC",   // Time in force
  "q":"10.001000",   // Order quantity
  "p":"19.1000000000",   // Order price
  "ap":"19.0999999955550656",  //average price
  "P":"0",  //stop price
  "x":"TRADE",   // Current execution type
  "X":"PARTIALLY_FILLED",   // Current order status
  "i":27,   // Order ID
  "l":"1",    // Last executed quantity   
  "z":"8.999000",   // Cumulative filled quantity
  "L":"19.1000000000",   // Last executed price
  "n":"0.00382000",   // Commission amount
  "N":"SLP25",   // Commission asset
  "T":1649926447190,   //Trasanction Time
  "t":18,   // transaction id
  "m":true,   // is this trade the maker side?
  "ot":"LIMIT", //original order type
  "O":0,   // Order creation time
  "Z":"171.88089996",   // Cumulative quote asset transacted quantity
  "Y":"19.1000000000000000",   // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  "Q":"0",   // Quote Order Qty
  "e":"executionReport",   // event
  "E":1649926447209  // event time
}  
```

**Execution type:**

* NEW \- New Order  
* CANCELED \- Order canceled  
* REJECTED \- New order was rejected  
* TRADE \- Order had a new fill  
* EXPIRED \- Order expired (based on the order's Time In Force parameter)

\#错误代码

error JSON payload:

```javascript
{
  "code":-1121,
  "msg":"Invalid symbol."
}
```

Errors consist of two parts: an error code and a message. The code is standardized, but the message may vary.

## 10xx \- General server or network issues

### \-1000 UNKNOWN

* An unknown error occurred while processing the request.

### \-1001 DISCONNECTED

* Internal error; unable to process your request. Please try again.

### \-1002 UNAUTHORIZED

* You are not authorized to execute this request.

### \-1003 TOO\_MANY\_REQUESTS

* Too many requests queued.  
* Too many requests; please use the WebSocket for live updates.  
* Too many requests; current limit is %s requests per minute. Please use the WebSocket for live updates to avoid polling the API.  
* Too many request weights; IP banned until %s. Please use the WebSocket for live updates to avoid bans.

### \-1004 DUPLICATE\_IP

* This IP is already on the white list.

### \-1005 NO\_SUCH\_IP

* No such IP has been whitelisted.

### \-1006 UNEXPECTED\_RESP

* An unexpected response was received from the message bus. Execution status unknown.

### \-1007 TIMEOUT

* Timeout waiting for response from backend server. Send status unknown; execution status unknown.

### \-1014 UNKNOWN\_ORDER\_COMPOSITION

* The current order parameter combination is not supported.

### \-1015 TOO\_MANY\_ORDERS

* Too many new orders.  
* Too many new orders; the current limit is %s orders per %s.

### \-1016 SERVICE\_SHUTTING\_DOWN

* This service is no longer available.

### \-1020 UNSUPPORTED\_OPERATION

* This operation is not supported.

### \-1021 INVALID\_TIMESTAMP

* Timestamp for this request is outside of the recvWindow.  
* The timestamp for this request was 1000ms ahead of the server's time.

### \-1022 INVALID\_SIGNATURE

* The signature for this request is invalid.

### \-1023 START\_TIME\_GREATER\_THAN\_END\_TIME

* The start time in the parameters is after the end time.

## 11xx \- Request issues

### \-1100 ILLEGAL\_CHARS

* Illegal characters found in a parameter.  
* Illegal characters found in parameter %s; legal range is %s.

### \-1101 TOO\_MANY\_PARAMETERS

* Too many parameters sent for this endpoint.  
* Too many parameters; expected %s and received %s.  
* Duplicate values for a parameter detected.

### \-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED

* A mandatory parameter was not sent, was empty/null, or malformed.  
* Mandatory parameter %s was not sent, was empty/null, or malformed.  
* Param %s or %s must be sent, but both were empty/null.

### \-1103 UNKNOWN\_PARAM

* An unknown parameter was sent.

### \-1104 UNREAD\_PARAMETERS

* Not all sent parameters were read.  
* Not all sent parameters were read; read %s parameter(s) but %s parameter(s) were sent.

### \-1105 PARAM\_EMPTY

* A parameter was empty.  
* Parameter %s was empty.

### \-1106 PARAM\_NOT\_REQUIRED

* A parameter was sent when not required. 

### \-1111 BAD\_PRECISION 

* The precision exceeds the maximum defined for this asset.

### \-1112 NO\_DEPTH

* No open orders for the trading pair.

### \-1114 TIF\_NOT\_REQUIRED

* TimeInForce parameter sent when not required.

### \-1115 INVALID\_TIF

* Invalid timeInForce.

### \-1116 INVALID\_ORDER\_TYPE

* Invalid orderType.

### \-1117 INVALID\_SIDE

* Invalid order side.

### \-1118 EMPTY\_NEW\_CL\_ORD\_ID

* New client order ID was empty.

### \-1119 EMPTY\_ORG\_CL\_ORD\_ID

* The client’s custom order ID is empty.

### \-1120 BAD\_INTERVAL

* Invalid time interval.

### \-1121 BAD\_SYMBOL

* Invalid trading pair.

### \-1125 INVALID\_LISTEN\_KEY

* This listenKey does not exist.

### \-1127 MORE\_THAN\_XX\_HOURS

* The query interval is too large.  
* More than %s hours between startTime and endTime.

### \-1128 OPTIONAL\_PARAMS\_BAD\_COMBO 

* Combination of optional parameters invalid. 

### \-1130 INVALID\_PARAMETER 

* The parameter sent contains invalid data.  
* Data sent for parameter %s is not valid. 

### \-1136 INVALID\_NEW\_ORDER\_RESP\_TYPE 

* Invalid newOrderRespType. 

## 20xx \- Processing Issues 

### \-2010 NEW\_ORDER\_REJECTED 

* New order rejected.

### \-2011 CANCEL\_REJECTED

* Order cancellation rejected.

### \-2013 NO\_SUCH\_ORDER

* Order does not exist.

### \-2014 BAD\_API\_KEY\_FMT

* API-key format invalid.

### \-2015 REJECTED\_MBX\_KEY

* Invalid API key, IP, or permissions for action.

### \-2016 NO\_TRADING\_WINDOW

* No trading window could be found for the symbol. Try ticker/24hrs instead.

### \-2018 BALANCE\_NOT\_SUFFICIENT

* Balance is insufficient.

### \-2020 UNABLE\_TO\_FILL

* Unable to fill.

### \-2021 ORDER\_WOULD\_IMMEDIATELY\_TRIGGER

* Order would immediately trigger.

### \-2022 REDUCE\_ONLY\_REJECT

* ReduceOnly Order is rejected.

### \-2024 POSITION\_NOT\_SUFFICIENT

* Position is not sufficient.

### \-2025 MAX\_OPEN\_ORDER\_EXCEEDED

* Reached max open order limit.

### \-2026 REDUCE\_ONLY\_ORDER\_TYPE\_NOT\_SUPPORTED

* This OrderType is not supported when reduceOnly.

## 40xx \- Filters and other Issues

### \-4000 INVALID\_ORDER\_STATUS

* Invalid order status.

### \-4001 PRICE\_LESS\_THAN\_ZERO

* Price less than 0\.

### \-4002 PRICE\_GREATER\_THAN\_MAX\_PRICE

* Price greater than max price.

### \-4003 QTY\_LESS\_THAN\_ZERO

* Quantity less than zero.

### \-4004 QTY\_LESS\_THAN\_MIN\_QTY

* Quantity less than minimum quantity.

### \-4005 QTY\_GREATER\_THAN\_MAX\_QTY

* Quantity greater than maximum quantity.

### \-4006 STOP\_PRICE\_LESS\_THAN\_ZERO

* Stop price less than zero.

### \-4007 STOP\_PRICE\_GREATER\_THAN\_MAX\_PRICE

* Stop price greater than max price.

### \-4008 TICK\_SIZE\_LESS\_THAN\_ZERO

* Tick size less than zero.

### \-4009 MAX\_PRICE\_LESS\_THAN\_MIN\_PRICE

* Max price less than min price.

### \-4010 MAX\_QTY\_LESS\_THAN\_MIN\_QTY

* Maximum quantity less than minimum quantity.

### \-4011 STEP\_SIZE\_LESS\_THAN\_ZERO

* Step size less than zero.

### \-4012 MAX\_NUM\_ORDERS\_LESS\_THAN\_ZERO

* Maximum order quantity less than 0\.

### \-4013 PRICE\_LESS\_THAN\_MIN\_PRICE

* Price less than minimum price.

### \-4014 PRICE\_NOT\_INCREASED\_BY\_TICK\_SIZE

* Price not increased by tick size.

### \-4015 INVALID\_CL\_ORD\_ID\_LEN

* Client order ID is not valid.  
* Client order ID length should not be more than 36 characters.

### \-4016 PRICE\_HIGHTER\_THAN\_MULTIPLIER\_UP

* Price is higher than mark price multiplier cap.

### \-4017 MULTIPLIER\_UP\_LESS\_THAN\_ZERO

* Multiplier up less than zero.

### \-4018 MULTIPLIER\_DOWN\_LESS\_THAN\_ZERO

* Multiplier down less than zero.

### \-4019 COMPOSITE\_SCALE\_OVERFLOW

* Composite scale too large.

### \-4020 TARGET\_STRATEGY\_INVALID

* Target strategy invalid for orderType %s, reduceOnly %b'

### \-4021 INVALID\_DEPTH\_LIMIT

* Invalid depth limit.  
* %s is not a valid depth limit.

### \-4022 WRONG\_MARKET\_STATUS

* Market status sent is not valid.

### \-4023 QTY\_NOT\_INCREASED\_BY\_STEP\_SIZE

* The increment of the quantity is not a multiple of the step size.

### \-4024 PRICE\_LOWER\_THAN\_MULTIPLIER\_DOWN

* Price is lower than mark price multiplier floor.

### \-4025 MULTIPLIER\_DECIMAL\_LESS\_THAN\_ZERO

* Multiplier decimal less than zero.

### \-4026 COMMISSION\_INVALID

* Commission invalid.  
* Incorrect profit value.  
* `%s` less than zero.  
* `%s` absolute value greater than `%s`.

### \-4027 INVALID\_ACCOUNT\_TYPE

* Invalid account type.

### \-4029 INVALID\_TICK\_SIZE\_PRECISION

* Tick size precision is invalid.  
* Price decimal precision is incorrect.

### \-4030 INVALID\_STEP\_SIZE\_PRECISION

* The number of decimal places for the step size is incorrect.

### \-4031 INVALID\_WORKING\_TYPE

* Invalid parameter working type: `%s`

### \-4032 EXCEED\_MAX\_CANCEL\_ORDER\_SIZE

* Exceeds the maximum order quantity that can be canceled.  
* Invalid parameter working type: `%s`

### \-4044 INVALID\_BALANCE\_TYPE

* The balance type is incorrect.

### \-4045 MAX\_STOP\_ORDER\_EXCEEDED

* Reached the stop-loss order limit.

### \-4055 AMOUNT\_MUST\_BE\_POSITIVE

* The quantity must be a positive integer.

### \-4056 INVALID\_API\_KEY\_TYPE

* The API key type is invalid.

### \-4057 INVALID\_RSA\_PUBLIC\_KEY

* The API key is invalid.

### \-4058 MAX\_PRICE\_TOO\_LARGE

* maxPrice and priceDecimal too large, please check.

### \-4060 INVALID\_POSITION\_SIDE

* Invalid position side.

### \-4061 POSITION\_SIDE\_NOT\_MATCH

* The order's position direction does not match the user’s settings.

### \-4062 REDUCE\_ONLY\_CONFLICT

* Invalid or improper reduceOnly value.

### \-4084 UPCOMING\_METHOD

* Method is not allowed currently. Coming soon.

### \-4086 INVALID\_PRICE\_SPREAD\_THRESHOLD

* Invalid price spread threshold.

### \-4087 REDUCE\_ONLY\_ORDER\_PERMISSION

* Users can only place reduce-only orders.

### \-4088 NO\_PLACE\_ORDER\_PERMISSION

* User cannot place orders currently.

### \-4114 INVALID\_CLIENT\_TRAN\_ID\_LEN

* clientTranId is not valid.  
* The customer's tranId length should be less than 64 characters.

### \-4115 DUPLICATED\_CLIENT\_TRAN\_ID

* clientTranId is duplicated.  
* The client's tranId should be unique within 7 days.

### \-4118 REDUCE\_ONLY\_MARGIN\_CHECK\_FAILED

* ReduceOnly Order failed. Please check your existing position and open orders

### \-4131 MARKET\_ORDER\_REJECT

* The counterparty's best price does not meet the PERCENT\_PRICE filter limit.

### \-4135 INVALID\_ACTIVATION\_PRICE

* Invalid activation price.

### \-4137 QUANTITY\_EXISTS\_WITH\_CLOSE\_POSITION

* Quantity must be zero when closePosition is true.

### \-4138 REDUCE\_ONLY\_MUST\_BE\_TRUE

* Reduce only must be true when closePosition is true.

### \-4139 ORDER\_TYPE\_CANNOT\_BE\_MKT

* Order type cannot be a market order if it cannot be canceled.

### \-4140 INVALID\_OPENING\_POSITION\_STATUS

* Invalid symbol status for opening position.

### \-4141 SYMBOL\_ALREADY\_CLOSED

* Trading pair has been delisted.

### \-4142 STRATEGY\_INVALID\_TRIGGER\_PRICE

* Rejected: Take Profit or Stop order would be triggered immediately.

### \-4164 MIN\_NOTIONAL

* Order notional must be at least 5.0 (unless you select Reduce Only)  
* Order notional must be no smaller than %s (unless you choose Reduce Only)

### \-4165 INVALID\_TIME\_INTERVAL

* Invalid time interval  
* Maximum time interval is %s days

### \-4183 PRICE\_HIGHTER\_THAN\_STOP\_MULTIPLIER\_UP

* Limit price cannot be higher than the cap of %s.  
* Take-Profit/Stop-Loss price cannot be higher than the cap of %s.

### \-4184 PRICE\_LOWER\_THAN\_STOP\_MULTIPLIER\_DOWN

* Price is below the stop price limit.  
* Take-Profit/Stop-Loss price must be above the trigger price × multiplier floor.  
* Order price (limit or TP/SL) can’t be below %s.
