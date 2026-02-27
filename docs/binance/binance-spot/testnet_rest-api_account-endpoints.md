---
title: "Account Endpoints | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints"
fetched_at: "2026-02-26T10:38:10.082Z"
---
### Account information (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/account
```

Get current account information.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

omitZeroBalances

BOOLEAN

NO

When set to `true`, emits only the non-zero balances of an account.  
Default value: `false`

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Data Source:** Memory => Database

**Response:**

```
{    "makerCommission": 15,    "takerCommission": 15,    "buyerCommission": 0,    "sellerCommission": 0,    "commissionRates": {        "maker": "0.00150000",        "taker": "0.00150000",        "buyer": "0.00000000",        "seller": "0.00000000"    },    "canTrade": true,    "canWithdraw": true,    "canDeposit": true,    "brokered": false,    "requireSelfTradePrevention": false,    "preventSor": false,    "updateTime": 123456789,    "accountType": "SPOT",    "balances": [        {            "asset": "BTC",            "free": "4723846.89208129",            "locked": "0.00000000"        },        {            "asset": "LTC",            "free": "4763368.68006011",            "locked": "0.00000000"        }    ],    "permissions": ["SPOT"],    "uid": 354937868}
```

### Current open orders (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/openOrders
```

Get all open orders on a symbol. **Careful** when accessing this with no symbol.

**Weight:** 6 for a single symbol; **80** when the symbol parameter is omitted

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

-   If the symbol is not sent, orders for all symbols will be returned in an array.

**Data Source:** Memory => Database

**Response:**

```
[    {        "symbol": "LTCBTC",        "orderId": 1,        "orderListId": -1, // Unless it's part of an order list, value will be -1        "clientOrderId": "myOrder1",        "price": "0.1",        "origQty": "1.0",        "executedQty": "0.0",        "cummulativeQuoteQty": "0.0",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "stopPrice": "0.0",        "icebergQty": "0.0",        "time": 1499827319559,        "updateTime": 1499827319559,        "isWorking": true,        "origQuoteOrderQty": "0.000000",        "workingTime": 1499827319559,        "selfTradePreventionMode": "NONE"    }]
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

### All orders (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/allOrders
```

Get all account orders; active, canceled, or filled.

**Weight:** 20

**Data Source:** Database

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

NO

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default 500; Maximum: 1000.

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Notes:**

-   If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned.
-   For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time.
-   If `startTime` and/or `endTime` provided, `orderId` is not required.
-   The time between `startTime` and `endTime` can't be longer than 24 hours.

**Response:**

```
[    {        "symbol": "LTCBTC",        "orderId": 1,        "orderListId": -1, // Unless it's part of an order list, value will be -1        "clientOrderId": "myOrder1",        "price": "0.1",        "origQty": "1.0",        "executedQty": "0.0",        "cummulativeQuoteQty": "0.0",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "stopPrice": "0.0",        "icebergQty": "0.0",        "time": 1499827319559,        "updateTime": 1499827319559,        "isWorking": true,        "origQuoteOrderQty": "0.000000",        "workingTime": 1499827319559,        "selfTradePreventionMode": "NONE"    }]
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

### Query Order list (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/orderList
```

Retrieves a specific order list based on provided optional parameters.

**Weight:**

4

**Parameters**:

Name

Type

Mandatory

Description

orderListId

LONG

NO\*

Query order list by `orderListId`.  
`orderListId` or `origClientOrderId` must be provided.

origClientOrderId

STRING

NO\*

Query order list by `listClientOrderId`.  
`orderListId` or `origClientOrderId` must be provided.

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
{    "orderListId": 27,    "contingencyType": "OCO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "h2USkA5YQpaXHPIrkd96xE",    "transactionTime": 1565245656253,    "symbol": "LTCBTC",    "orders": [        {            "symbol": "LTCBTC",            "orderId": 4,            "clientOrderId": "qD1gy3kc3Gx0rihm9Y3xwS"        },        {            "symbol": "LTCBTC",            "orderId": 5,            "clientOrderId": "ARzZ9I00CPM8i3NhmU9Ega"        }    ]}
```

### Query all Order lists (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/allOrderList
```

Retrieves all order lists based on provided optional parameters

Note that the time between `startTime` and `endTime` can't be longer than 24 hours.

**Weight:**

20

**Parameters:**

Name

Type

Mandatory

Description

fromId

LONG

NO

If supplied, neither `startTime` or `endTime` can be provided

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default: 500; Maximum: 1000

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
[    {        "orderListId": 29,        "contingencyType": "OCO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "amEEAXryFzFwYF1FeRpUoZ",        "transactionTime": 1565245913483,        "symbol": "LTCBTC",        "orders": [            {                "symbol": "LTCBTC",                "orderId": 4,                "clientOrderId": "oD7aesZqjEGlZrbtRpy5zB"            },            {                "symbol": "LTCBTC",                "orderId": 5,                "clientOrderId": "Jr1h6xirOxgeJOUuYQS7V3"            }        ]    },    {        "orderListId": 28,        "contingencyType": "OCO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "hG7hFNxJV6cZy3Ze4AUT4d",        "transactionTime": 1565245913407,        "symbol": "LTCBTC",        "orders": [            {                "symbol": "LTCBTC",                "orderId": 2,                "clientOrderId": "j6lFOfbmFMRjTYA7rRJ0LP"            },            {                "symbol": "LTCBTC",                "orderId": 3,                "clientOrderId": "z0KCjOdditiLS5ekAFtK81"            }        ]    }]
```

### Query Open Order lists (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/openOrderList
```

**Weight**: 6

**Parameters:**

Name

Type

Mandatory

Description

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
[    {        "orderListId": 31,        "contingencyType": "OCO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "wuB13fmulKj3YjdqWEcsnp",        "transactionTime": 1565246080644,        "symbol": "LTCBTC",        "orders": [            {                "symbol": "LTCBTC",                "orderId": 4,                "clientOrderId": "r3EH2N76dHfLoSZWIUw1bT"            },            {                "symbol": "LTCBTC",                "orderId": 5,                "clientOrderId": "Cv1SnyPD3qhqpbjpYEHbd2"            }        ]    }]
```

### Account trade list (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/myTrades
```

Get trades for a specific account and symbol.

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

symbol

STRING

YES

orderId

LONG

NO

This can only be used in combination with `symbol`.

startTime

LONG

NO

endTime

LONG

NO

fromId

LONG

NO

TradeId to fetch from. Default gets most recent trades.

limit

INT

NO

Default: 500; Maximum: 1000.

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Notes:**

-   If `fromId` is set, it will get trades >= that `fromId`. Otherwise most recent trades are returned.
-   The time between `startTime` and `endTime` can't be longer than 24 hours.
-   These are the supported combinations of all parameters:
    -   `symbol`
    -   `symbol` + `orderId`
    -   `symbol` + `startTime`
    -   `symbol` + `endTime`
    -   `symbol` + `fromId`
    -   `symbol` + `startTime` + `endTime`
    -   `symbol`\+ `orderId` + `fromId`

**Data Source:** Memory => Database

**Response:**

```
[    {        "symbol": "BNBBTC",        "id": 28457,        "orderId": 100234,        "orderListId": -1,        "price": "4.00000100",        "qty": "12.00000000",        "quoteQty": "48.000012",        "commission": "10.10000000",        "commissionAsset": "BNB",        "time": 1499865549590,        "isBuyer": true,        "isMaker": false,        "isBestMatch": true    }]
```

### Query Unfilled Order Count (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/rateLimit/order
```

Displays the user's unfilled order count for all intervals.

**Weight:** 40

**Parameters:**

Name

Type

Mandatory

Description

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
[    {        "rateLimitType": "ORDERS",        "interval": "SECOND",        "intervalNum": 10,        "limit": 50,        "count": 0    },    {        "rateLimitType": "ORDERS",        "interval": "DAY",        "intervalNum": 1,        "limit": 160000,        "count": 0    }]
```

### Query Prevented Matches (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/myPreventedMatches
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

**Weight:**

Case

Weight

If `symbol` is invalid

2

Querying by `preventedMatchId`

2

Querying by `orderId`

20

**Data Source:**

Database

**Response:**

```
[    {        "symbol": "BTCUSDT",        "preventedMatchId": 1,        "takerOrderId": 5,        "makerSymbol": "BTCUSDT",        "makerOrderId": 3,        "tradeGroupId": 1,        "selfTradePreventionMode": "EXPIRE_MAKER",        "price": "1.100000",        "makerPreventedQuantity": "1.300000",        "transactTime": 1669101687094    }]
```

### Query Allocations (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/myAllocations
```

Retrieves allocations resulting from SOR order placement.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

Yes

startTime

LONG

No

endTime

LONG

No

fromAllocationId

INT

No

limit

INT

No

Default: 500; Maximum: 1000

orderId

LONG

No

recvWindow

DECIMAL

No

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

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
[    {        "symbol": "BTCUSDT",        "allocationId": 0,        "allocationType": "SOR",        "orderId": 1,        "orderListId": -1,        "price": "1.00000000",        "qty": "5.00000000",        "quoteQty": "5.00000000",        "commission": "0.00000000",        "commissionAsset": "BTC",        "time": 1687506878118,        "isBuyer": true,        "isMaker": false,        "isAllocator": false    }]
```

### Query Commission Rates (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/account/commission
```

Get current account commission rates.

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

**Data Source:** Database

**Response:**

```
{    "symbol": "BTCUSDT",    "standardCommission": {           // Commission rates on trades from the order.        "maker": "0.00000010",        "taker": "0.00000020",        "buyer": "0.00000030",        "seller": "0.00000040"    },    "specialCommission": {            // Special commission rates from the order.        "maker": "0.01000000",        "taker": "0.02000000",        "buyer": "0.03000000",        "seller": "0.04000000"    },    "taxCommission": {                // Tax commission rates for trades from the order.        "maker": "0.00000112",        "taker": "0.00000114",        "buyer": "0.00000118",        "seller": "0.00000116"    },    "discount": {                     // Discount commission when paying in BNB        "enabledForAccount": true,        "enabledForSymbol": true,        "discountAsset": "BNB",        "discount": "0.75000000"      // Standard commission is reduced by this rate when paying commission in BNB.    }}
```

### Query Order Amendments (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/order/amendments
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

**Data Source:**

Database

**Response:**

```
[    {        "symbol": "BTCUSDT",        "orderId": 9,        "executionId": 22,        "origClientOrderId": "W0fJ9fiLKHOJutovPK3oJp",        "newClientOrderId": "UQ1Np3bmQ71jJzsSDW9Vpi",        "origQty": "5.00000000",        "newQty": "4.00000000",        "time": 1741669661670    },    {        "symbol": "BTCUDST",        "orderId": 9,        "executionId": 25,        "origClientOrderId": "UQ1Np3bmQ71jJzsSDW9Vpi",        "newClientOrderId": "5uS0r35ohuQyDlCzZuYXq2",        "origQty": "4.00000000",        "newQty": "3.00000000",        "time": 1741672924895    }]
```

### Query relevant filters (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)

```
GET /api/v3/myFilters
```

Retrieves the list of [filters](https://developers.binance.com/docs/binance-spot-api-docs/testnet/filters) relevant to an account on a given symbol. This is the only endpoint that shows if an account has [`MAX_ASSET`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/filters) filters applied to it.

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
{    "exchangeFilters": [        {            "filterType": "EXCHANGE_MAX_NUM_ORDERS",            "maxNumOrders": 1000        }    ],    "symbolFilters": [        {            "filterType": "MAX_NUM_ORDER_LISTS",            "maxNumOrderLists": 20        }    ],    "assetFilters": [        {            "filterType": "MAX_ASSET",            "asset": "JPY",            "limit": "1000000.00000000"        }    ]}
```

-   [Account information (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Current open orders (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [All orders (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Order list (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query all Order lists (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Open Order lists (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Account trade list (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Unfilled Order Count (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Prevented Matches (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Allocations (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Commission Rates (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query Order Amendments (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
-   [Query relevant filters (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints)
