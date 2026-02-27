---
title: "Account requests | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests"
fetched_at: "2026-02-26T10:38:12.594Z"
---
### Account information (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",    "method": "account.status",    "params": {        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "83303b4a136ac1371795f465808367242685a9e3a42b22edb4d977d0696eb45c",        "timestamp": 1660801839480    }}
```

Query information about your account.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

`apiKey`

STRING

YES

`omitZeroBalances`

BOOLEAN

NO

When set to `true`, emits only the non-zero balances of an account.  
Default value: false

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

**Data Source:** Memory => Database

**Response:**

```
{    "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",    "status": 200,    "result": {        "makerCommission": 15,        "takerCommission": 15,        "buyerCommission": 0,        "sellerCommission": 0,        "canTrade": true,        "canWithdraw": true,        "canDeposit": true,        "commissionRates": {            "maker": "0.00150000",            "taker": "0.00150000",            "buyer": "0.00000000",            "seller": "0.00000000"        },        "brokered": false,        "requireSelfTradePrevention": false,        "preventSor": false,        "updateTime": 1660801833000,        "accountType": "SPOT",        "balances": [            {                "asset": "BNB",                "free": "0.00000000",                "locked": "0.00000000"            },            {                "asset": "BTC",                "free": "1.3447112",                "locked": "0.08600000"            },            {                "asset": "USDT",                "free": "1021.21000000",                "locked": "0.00000000"            }        ],        "permissions": ["SPOT"],        "uid": 354937868    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Query order (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "aa62318a-5a97-4f3b-bdc7-640bbe33b291",    "method": "order.status",    "params": {        "symbol": "BTCUSDT",        "orderId": 12569099453,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "2c3aab5a078ee4ea465ecd95523b77289f61476c2f238ec10c55ea6cb11a6f35",        "timestamp": 1660801720951    }}
```

Check execution status of an order.

**Weight:** 4

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`orderId`

LONG

YES

Lookup order by `orderId`

`origClientOrderId`

STRING

Lookup order by `clientOrderId`

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than 60000.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

Notes:

-   If both `orderId` and `origClientOrderId` are provided, the `orderId` is searched first, then the `origClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.
    
-   For some historical orders the `cummulativeQuoteQty` response field may be negative, meaning the data is not available at this time.
    

**Data Source:** Memory => Database

**Response:**

```
{    "id": "aa62318a-5a97-4f3b-bdc7-640bbe33b291",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "orderId": 12569099453,        "orderListId": -1,                     // set only for orders of an order list        "clientOrderId": "4d96324ff9d44481926157",        "price": "23416.10000000",        "origQty": "0.00847000",        "executedQty": "0.00847000",        "cummulativeQuoteQty": "198.33521500",        "status": "FILLED",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "SELL",        "stopPrice": "0.00000000",             // always present, zero if order type does not use stopPrice        "trailingDelta": 10,                   // present only if trailingDelta set for the order        "trailingTime": -1,                    // present only if trailingDelta set for the order        "icebergQty": "0.00000000",            // always present, zero for non-iceberg orders        "time": 1660801715639,                 // time when the order was placed        "updateTime": 1660801717945,           // time of the last update to the order        "isWorking": true,        "workingTime": 1660801715639,        "origQuoteOrderQty": "0.00000000",     // always present, zero if order type does not use quoteOrderQty        "strategyId": 37463720,                // present only if strategyId set for the order        "strategyType": 1000000,               // present only if strategyType set for the order        "selfTradePreventionMode": "NONE",        "preventedMatchId": 0,                 // present only if the order expired due to STP        "preventedQuantity": "1.200000"        // present only if the order expired due to STP    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/trading-requests).

### Current open orders (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "55f07876-4f6f-4c47-87dc-43e5fff3f2e7",    "method": "openOrders.status",    "params": {        "symbol": "BTCUSDT",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "d632b3fdb8a81dd44f82c7c901833309dd714fe508772a89b0a35b0ee0c48b89",        "timestamp": 1660813156812    }}
```

Query execution status of all open orders.

If you need to continuously monitor order status updates, please consider using WebSocket Streams:

-   [`userDataStream.start`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests) request
-   [`executionReport`](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream) user data stream event

**Weight:** Adjusted based on the number of requested symbols:

Parameter

Weight

`symbol`

6

none

80

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

NO

If omitted, open orders for all symbols are returned

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

**Data Source:** Memory => Database

**Response:**

Status reports for open orders are identical to [`order.status`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests).

Note that some fields are optional and included only for orders that set them.

Open orders are always returned as a flat list. If all symbols are requested, use the `symbol` field to tell which symbol the orders belong to.

```
{    "id": "55f07876-4f6f-4c47-87dc-43e5fff3f2e7",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "orderId": 12569099453,            "orderListId": -1,            "clientOrderId": "4d96324ff9d44481926157",            "price": "23416.10000000",            "origQty": "0.00847000",            "executedQty": "0.00720000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "172.43931000",            "status": "PARTIALLY_FILLED",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "stopPrice": "0.00000000",            "icebergQty": "0.00000000",            "time": 1660801715639,            "updateTime": 1660801717945,            "isWorking": true,            "workingTime": 1660801715639,            "origQuoteOrderQty": "0.00000000",            "selfTradePreventionMode": "NONE"        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 6        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/trading-requests).

### Account order history (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "734235c2-13d2-4574-be68-723e818c08f3",    "method": "allOrders",    "params": {        "symbol": "BTCUSDT",        "startTime": 1660780800000,        "endTime": 1660867200000,        "limit": 5,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "f50a972ba7fad92842187643f6b930802d4e20bce1ba1e788e856e811577bd42",        "timestamp": 1661955123341    }}
```

Query information about all your orders – active, canceled, filled – filtered by time range.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`orderId`

LONG

NO

Order ID to begin at

`startTime`

LONG

NO

`endTime`

LONG

NO

`limit`

INT

NO

Default: 500; Maximum: 1000

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

Notes:

-   If `startTime` and/or `endTime` are specified, `orderId` is ignored.
    
    Orders are filtered by `time` of the last execution status update.
    
-   If `orderId` is specified, return orders with order ID >= `orderId`.
    
-   If no condition is specified, the most recent orders are returned.
    
-   For some historical orders the `cummulativeQuoteQty` response field may be negative, meaning the data is not available at this time.
    
-   The time between `startTime` and `endTime` can't be longer than 24 hours.
    

**Data Source:** Database

**Response:**

Status reports for orders are identical to [`order.status`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests).

Note that some fields are optional and included only for orders that set them.

```
{    "id": "734235c2-13d2-4574-be68-723e818c08f3",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "orderId": 12569099453,            "orderListId": -1,            "clientOrderId": "4d96324ff9d44481926157",            "price": "23416.10000000",            "origQty": "0.00847000",            "executedQty": "0.00847000",            "cummulativeQuoteQty": "198.33521500",            "status": "FILLED",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "stopPrice": "0.00000000",            "icebergQty": "0.00000000",            "time": 1660801715639,            "updateTime": 1660801717945,            "isWorking": true,            "workingTime": 1660801715639,            "origQuoteOrderQty": "0.00000000",            "selfTradePreventionMode": "NONE",            "preventedMatchId": 0,              // This field only appears if the order expired due to STP.            "preventedQuantity": "1.200000"     // This field only appears if the order expired due to STP.        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Query Order list (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "b53fd5ff-82c7-4a04-bd64-5f9dc42c2100",    "method": "orderList.status",    "params": {        "origClientOrderId": "08985fedd9ea2cf6b28996",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "d12f4e8892d46c0ddfbd43d556ff6d818581b3be22a02810c2c20cb719aed6a4",        "timestamp": 1660801713965    }}
```

Check execution status of an Order list.

For execution status of individual orders, use [`order.status`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests).

**Weight:** 4

**Parameters**:

Name

Type

Mandatory

Description

`origClientOrderId`

STRING

NO\*

Query order list by `listClientOrderId`.  
`orderListId` or `origClientOrderId` must be provided.

`orderListId`

INT

Query order list by `orderListId`.  
`orderListId` or `origClientOrderId` must be provided.

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than 60000.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

Notes:

-   `origClientOrderId` refers to `listClientOrderId` of the order list itself.
    
-   If both `origClientOrderId` and `orderListId` parameters are specified, only `origClientOrderId` is used and `orderListId` is ignored.
    

**Data Source:** Database

**Response:**

```
{    "id": "b53fd5ff-82c7-4a04-bd64-5f9dc42c2100",    "status": 200,    "result": {        "orderListId": 1274512,        "contingencyType": "OCO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "08985fedd9ea2cf6b28996",        "transactionTime": 1660801713793,        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 12569138901,                "clientOrderId": "BqtFCj5odMoWtSqGk2X9tU"            },            {                "symbol": "BTCUSDT",                "orderId": 12569138902,                "clientOrderId": "jLnZpj5enfMXTuhKB1d0us"            }        ]    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

### Current open Order lists (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "method": "openOrderLists.status",    "params": {        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "1bea8b157dd78c3da30359bddcd999e4049749fe50b828e620e12f64e8b433c9",        "timestamp": 1660801713831    }}
```

Query execution status of all open order lists.

If you need to continuously monitor order status updates, please consider using WebSocket Streams:

-   [`userDataStream.start`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests) request
-   [`executionReport`](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream) user data stream event

**Weight**: 6

**Parameters:**

Name

Type

Mandatory

Description

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

**Data Source:** Database

**Response:**

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "status": 200,    "result": [        {            "orderListId": 0,            "contingencyType": "OCO",            "listStatusType": "EXEC_STARTED",            "listOrderStatus": "EXECUTING",            "listClientOrderId": "08985fedd9ea2cf6b28996",            "transactionTime": 1660801713793,            "symbol": "BTCUSDT",            "orders": [                {                    "symbol": "BTCUSDT",                    "orderId": 4,                    "clientOrderId": "CUhLgTXnX5n2c0gWiLpV4d"                },                {                    "symbol": "BTCUSDT",                    "orderId": 5,                    "clientOrderId": "1ZqG7bBuYwaF4SU8CwnwHm"                }            ]        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 6        }    ]}
```

### Account order list history (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "8617b7b3-1b3d-4dec-94cd-eefd929b8ceb",    "method": "allOrderLists",    "params": {        "startTime": 1660780800000,        "endTime": 1660867200000,        "limit": 5,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "c8e1484db4a4a02d0e84dfa627eb9b8298f07ebf12fcc4eaf86e4a565b2712c2",        "timestamp": 1661955123341    }}
```

Query information about all your order lists, filtered by time range.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

`fromId`

INT

NO

Order list ID to begin at

`startTime`

LONG

NO

`endTime`

LONG

NO

`limit`

INT

NO

Default: 500; Maximum: 1000

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

Notes:

-   If `startTime` and/or `endTime` are specified, `fromId` is ignored.
    
    Order lists are filtered by `transactionTime` of the last order list execution status update.
    
-   If `fromId` is specified, return order lists with order list ID >= `fromId`.
    
-   If no condition is specified, the most recent order lists are returned.
    
-   The time between `startTime` and `endTime` can't be longer than 24 hours.
    

**Data Source:** Database

**Response:**

Status reports for order lists are identical to [`orderList.status`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests).

```
{    "id": "8617b7b3-1b3d-4dec-94cd-eefd929b8ceb",    "status": 200,    "result": [        {            "orderListId": 1274512,            "contingencyType": "OCO",            "listStatusType": "EXEC_STARTED",            "listOrderStatus": "EXECUTING",            "listClientOrderId": "08985fedd9ea2cf6b28996",            "transactionTime": 1660801713793,            "symbol": "BTCUSDT",            "orders": [                {                    "symbol": "BTCUSDT",                    "orderId": 12569138901,                    "clientOrderId": "BqtFCj5odMoWtSqGk2X9tU"                },                {                    "symbol": "BTCUSDT",                    "orderId": 12569138902,                    "clientOrderId": "jLnZpj5enfMXTuhKB1d0us"                }            ]        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Account trade history (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "f4ce6a53-a29d-4f70-823b-4ab59391d6e8",    "method": "myTrades",    "params": {        "symbol": "BTCUSDT",        "startTime": 1660780800000,        "endTime": 1660867200000,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "c5a5ffb79fd4f2e10a92f895d488943a57954edf5933bde3338dfb6ea6d6eefc",        "timestamp": 1661955125250    }}
```

Query information about all your trades, filtered by time range.

**Weight:**

Condition

Weight

Without orderId

20

With orderId

5

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`orderId`

LONG

NO

`startTime`

LONG

NO

`endTime`

LONG

NO

`fromId`

INT

NO

First trade ID to query

`limit`

INT

NO

Default: 500; Maximum: 1000

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

Notes:

-   If `fromId` is specified, return trades with trade ID >= `fromId`.
    
-   If `startTime` and/or `endTime` are specified, trades are filtered by execution time (`time`).
    
    `fromId` cannot be used together with `startTime` and `endTime`.
    
-   If `orderId` is specified, only trades related to that order are returned.
    
    `startTime` and `endTime` cannot be used together with `orderId`.
    
-   If no condition is specified, the most recent trades are returned.
    
-   The time between `startTime` and `endTime` can't be longer than 24 hours.
    

**Data Source:** Memory => Database

**Response:**

```
{    "id": "f4ce6a53-a29d-4f70-823b-4ab59391d6e8",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "id": 1650422481,            "orderId": 12569099453,            "orderListId": -1,            "price": "23416.10000000",            "qty": "0.00635000",            "quoteQty": "148.69223500",            "commission": "0.00000000",            "commissionAsset": "BNB",            "time": 1660801715793,            "isBuyer": false,            "isMaker": true,            "isBestMatch": true        },        {            "symbol": "BTCUSDT",            "id": 1650422482,            "orderId": 12569099453,            "orderListId": -1,            "price": "23416.50000000",            "qty": "0.00212000",            "quoteQty": "49.64298000",            "commission": "0.00000000",            "commissionAsset": "BNB",            "time": 1660801715793,            "isBuyer": false,            "isMaker": true,            "isBestMatch": true        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Unfilled Order Count (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "d3783d8d-f8d1-4d2c-b8a0-b7596af5a664",    "method": "account.rateLimits.orders",    "params": {        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "76289424d6e288f4dc47d167ac824e859dabf78736f4348abbbac848d719eb94",        "timestamp": 1660801839500    }}
```

Query your current unfilled order count for all intervals.

**Weight:** 40

**Parameters:**

Name

Type

Mandatory

Description

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

**Data Source:** Memory

**Response:**

```
{    "id": "d3783d8d-f8d1-4d2c-b8a0-b7596af5a664",    "status": 200,    "result": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 0        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 0        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 40        }    ]}
```

### Account prevented matches (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "g4ce6a53-a39d-4f71-823b-4ab5r391d6y8",    "method": "myPreventedMatches",    "params": {        "symbol": "BTCUSDT",        "orderId": 35,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "c5a5ffb79fd4f2e10a92f895d488943a57954edf5933bde3338dfb6ea6d6eefc",        "timestamp": 1673923281052    }}
```

Displays the list of orders that were expired due to STP.

These are the combinations supported:

-   `symbol` + `preventedMatchId`
-   `symbol` + `orderId`
-   `symbol` + `orderId` + `fromPreventedMatchId` (`limit` will default to 500)
-   `symbol` + `orderId` + `fromPreventedMatchId` + `limit`

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

preventedMatchId

LONG

NO

orderId

LONG

NO

fromPreventedMatchId

LONG

NO

limit

INT

NO

Default: `500`; Maximum: `1000`

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Weight**

Case

Weight

If `symbol` is invalid

2

Querying by `preventedMatchId`

2

Querying by `orderId`

20

**Data Source:** Database

**Response:**

```
{    "id": "g4ce6a53-a39d-4f71-823b-4ab5r391d6y8",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "preventedMatchId": 1,            "takerOrderId": 5,            "makerSymbol": "BTCUSDT",            "makerOrderId": 3,            "tradeGroupId": 1,            "selfTradePreventionMode": "EXPIRE_MAKER",            "price": "1.100000",            "makerPreventedQuantity": "1.300000",            "transactTime": 1669101687094        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Account allocations (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "g4ce6a53-a39d-4f71-823b-4ab5r391d6y8",    "method": "myAllocations",    "params": {        "symbol": "BTCUSDT",        "orderId": 500,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "c5a5ffb79fd4f2e10a92f895d488943a57954edf5933bde3338dfb6ea6d6eefc",        "timestamp": 1673923281052    }}
```

Retrieves allocations resulting from SOR order placement.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

Yes

`startTime`

LONG

No

`endTime`

LONG

No

`fromAllocationId`

INT

No

`limit`

INT

No

Default: 500; Maximum: 1000

`orderId`

LONG

No

`recvWindow`

DECIMAL

No

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`timestamp`

LONG

No

Supported parameter combinations:

Parameters

Response

`symbol`

allocations from oldest to newest

`symbol` + `startTime`

oldest allocations since `startTime`

`symbol` + `endTime`

newest allocations until `endTime`

`symbol` + `startTime` + `endTime`

allocations within the time range

`symbol` + `fromAllocationId`

allocations by allocation ID

`symbol` + `orderId`

allocations related to an order starting with oldest

`symbol` + `orderId` + `fromAllocationId`

allocations related to an order by allocation ID

**Note:** The time between `startTime` and `endTime` can't be longer than 24 hours.

**Data Source:** Database

**Response:**

```
{    "id": "g4ce6a53-a39d-4f71-823b-4ab5r391d6y8",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "allocationId": 0,            "allocationType": "SOR",            "orderId": 500,            "orderListId": -1,            "price": "1.00000000",            "qty": "0.10000000",            "quoteQty": "0.10000000",            "commission": "0.00000000",            "commissionAsset": "BTC",            "time": 1687319487614,            "isBuyer": false,            "isMaker": false,            "isAllocator": false        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Account Commission Rates (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "d3df8a61-98ea-4fe0-8f4e-0fcea5d418b0",    "method": "account.commission",    "params": {        "symbol": "BTCUSDT",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "c5a5ffb79fd4f2e10a92f895d488943a57954edf5933bde3338dfb6ea6d6eefc",        "timestamp": 1673923281052    }}
```

Get current account commission rates.

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

**Weight:** 20

**Data Source:** Database

**Response:**

```
{    "id": "d3df8a61-98ea-4fe0-8f4e-0fcea5d418b0",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "standardCommission": {          // Standard commission rates on trades from the order.            "maker": "0.00000010",            "taker": "0.00000020",            "buyer": "0.00000030",            "seller": "0.00000040"        },        "specialCommission": {           // Special commission rates from the order.            "maker": "0.01000000",            "taker": "0.02000000",            "buyer": "0.03000000",            "seller": "0.04000000"        },        "taxCommission": {               // Tax commission rates on trades from the order.            "maker": "0.00000112",            "taker": "0.00000114",            "buyer": "0.00000118",            "seller": "0.00000116"        },        "discount": {                    // Discount on standard commissions when paying in BNB.            "enabledForAccount": true,            "enabledForSymbol": true,            "discountAsset": "BNB",            "discount": "0.75000000"     // Standard commission is reduced by this rate when paying commission in BNB.        }    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Query Order Amendments (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "6f5ebe91-01d9-43ac-be99-57cf062e0e30",    "method": "order.amendments",    "params": {        "orderId": "23",        "recvWindow": 5000,        "symbol": "BTCUSDT",        "timestamp": 1741925524887,        "apiKey": "N3Swv7WaBF7S2rzA12UkPunM3udJiDddbgv1W7CzFGnsQXH9H62zzSCST0CndjeE",        "signature": "0eed2e9d95b6868ea5ec21da0d14538192ef344c30ecf9fe83d58631699334dc"    }}
```

Queries all amendments of a single order.

**Weight**: 4

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

orderId

LONG

YES

fromExecutionId

LONG

NO

limit

LONG

NO

Default:500; Maximum: 1000

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Data Source:** Database

**Response:**

```
{    "id": "6f5ebe91-01d9-43ac-be99-57cf062e0e30",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "orderId": 23,            "executionId": 60,            "origClientOrderId": "my_pending_order",            "newClientOrderId": "xbxXh5SSwaHS7oUEOCI88B",            "origQty": "7.00000000",            "newQty": "5.00000000",            "time": 1741924229819        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

### Query Relevant Filters (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)

```
{    "id": "74R4febb-d142-46a2-977d-90533eb4d97g",    "method": "myFilters",    "params": {        "recvWindow": 5000,        "symbol": "BTCUSDT",        "timestamp": 1758008841149,        "apiKey": "nQ6kG5gDExDd5MZSO0MfOOWEVZmdkRllpNMfm1FjMjkMnmw1NUd3zPDfvcnDJlil",        "signature": "7edc54dd0493dd5bc47adbab9b17bfc9b378d55c20511ae5a168456d3d37aa3a"    }}
```

Retrieves the list of [filters](https://developers.binance.com/docs/binance-spot-api-docs/filters) relevant to an account on a given symbol. This is the only method that shows if an account has [`MAX_ASSET`](https://developers.binance.com/docs/binance-spot-api-docs/filters) filters applied to it.

**Weight:** 40

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Data Source:** Memory

**Response:**

```
{    "id": "1758009606869",    "status": 200,    "result": {        "exchangeFilters": [            {                "filterType": "EXCHANGE_MAX_NUM_ORDERS",                "maxNumOrders": 1000            }        ],        "symbolFilters": [            {                "filterType": "MAX_NUM_ORDER_LISTS",                "maxNumOrderLists": 20            }        ],        "assetFilters": [            {                "filterType": "MAX_ASSET",                "asset": "JPY",                "limit": "1000000.00000000"            }        ]    }}
```

-   [Account information (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Query order (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Current open orders (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Account order history (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Query Order list (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Current open Order lists (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Account order list history (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Account trade history (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Unfilled Order Count (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Account prevented matches (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Account allocations (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Account Commission Rates (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Query Order Amendments (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
-   [Query Relevant Filters (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/account-requests)
