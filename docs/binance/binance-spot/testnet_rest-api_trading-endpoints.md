---
title: "Trading endpoints | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints"
fetched_at: "2026-02-26T10:38:10.979Z"
---
### New order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/order
```

Send in a new order.

This adds 1 order to the `EXCHANGE_MAX_ORDERS` filter and the `MAX_NUM_ORDERS` filter.

**Weight:** 1

**Unfilled Order Count:** 1

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

side

ENUM

YES

Please see [Enums](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums) for supported values.

type

ENUM

YES

Please see [Enums](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums) for supported values.

timeInForce

ENUM

NO

Please see [Enums](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums) for supported values.

quantity

DECIMAL

NO

quoteOrderQty

DECIMAL

NO

price

DECIMAL

NO

newClientOrderId

STRING

NO

A unique id among open orders. Automatically generated if not sent.  
Orders with the same `newClientOrderID` can be accepted only when the previous one is filled, otherwise the order will be rejected.

strategyId

LONG

NO

strategyType

INT

NO

The value cannot be less than `1000000`.

stopPrice

DECIMAL

NO

Used with `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.

trailingDelta

LONG

NO

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq).

icebergQty

DECIMAL

NO

Used with `LIMIT`, `STOP_LOSS_LIMIT`, and `TAKE_PROFIT_LIMIT` to create an iceberg order.

newOrderRespType

ENUM

NO

Set the response JSON. `ACK`, `RESULT`, or `FULL`; `MARKET` and `LIMIT` order types default to `FULL`, all other orders default to `ACK`.

selfTradePreventionMode

ENUM

NO

The allowed enums is dependent on what is configured on the symbol. The possible supported values are: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums).

pegPriceType

ENUM

NO

`PRIMARY_PEG` or `MARKET_PEG`.  
See [Pegged Orders Info](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pegOffsetValue

INT

NO

Price level to peg the price to (max: 100).  
See [Pegged Orders Info](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pegOffsetType

ENUM

NO

Only `PRICE_LEVEL` is supported.  
See [Pegged Orders Info](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

Some additional mandatory parameters based on order `type`:

Type

Additional mandatory parameters

Additional Information

`LIMIT`

`timeInForce`, `quantity`, `price`

`MARKET`

`quantity` or `quoteOrderQty`

`MARKET` orders using the `quantity` field specifies the amount of the `base asset` the user wants to buy or sell at the market price.  
E.g. MARKET order on BTCUSDT will specify how much BTC the user is buying or selling.  
  
`MARKET` orders using `quoteOrderQty` specifies the amount the user wants to spend (when buying) or receive (when selling) the `quote` asset; the correct `quantity` will be determined based on the market liquidity and `quoteOrderQty`.  
E.g. Using the symbol BTCUSDT:  
`BUY` side, the order will buy as many BTC as `quoteOrderQty` USDT can.  
`SELL` side, the order will sell as much BTC needed to receive `quoteOrderQty` USDT.

`STOP_LOSS`

`quantity`, `stopPrice` or `trailingDelta`

This will execute a `MARKET` order when the conditions are met. (e.g. `stopPrice` is met or `trailingDelta` is activated)

`STOP_LOSS_LIMIT`

`timeInForce`, `quantity`, `price`, `stopPrice` or `trailingDelta`

`TAKE_PROFIT`

`quantity`, `stopPrice` or `trailingDelta`

This will execute a `MARKET` order when the conditions are met. (e.g. `stopPrice` is met or `trailingDelta` is activated)

`TAKE_PROFIT_LIMIT`

`timeInForce`, `quantity`, `price`, `stopPrice` or `trailingDelta`

`LIMIT_MAKER`

`quantity`, `price`

This is a `LIMIT` order that will be rejected if the order immediately matches and trades as a taker.  
This is also known as a POST-ONLY order.

Notes on using parameters for Pegged Orders:

-   These parameters are allowed for `LIMIT`, `LIMIT_MAKER`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT_LIMIT` orders.
-   If `pegPriceType` is specified, `price` becomes optional. Otherwise, it is still mandatory.
-   `pegPriceType=PRIMARY_PEG` means the primary peg, that is the best price on the same side of the order book as your order.
-   `pegPriceType=MARKET_PEG` means the market peg, that is the best price on the opposite side of the order book from your order.
-   Use `pegOffsetType` and `pegOffsetValue` to request a price level other than the best one. These parameters must be specified together.

Other info:

-   Any `LIMIT` or `LIMIT_MAKER` type order can be made an iceberg order by sending an `icebergQty`.
    
-   Any order with an `icebergQty` MUST have `timeInForce` set to `GTC`.
    
-   For `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT_LIMIT` and `TAKE_PROFIT` orders, `trailingDelta` can be combined with `stopPrice`.
    
-   `MARKET` orders using `quoteOrderQty` will not break `LOT_SIZE` filter rules; the order will execute a `quantity` that will have the notional value as close as possible to `quoteOrderQty`. Trigger order price rules against market price for both MARKET and LIMIT versions:
    
-   Price above market price: `STOP_LOSS` `BUY`, `TAKE_PROFIT` `SELL`
    
-   Price below market price: `STOP_LOSS` `SELL`, `TAKE_PROFIT` `BUY`
    

**Data Source:** Matching Engine

**Response - ACK:**

```
{    "symbol": "BTCUSDT",    "orderId": 28,    "orderListId": -1, // Unless it's part of an order list, value will be -1    "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",    "transactTime": 1507725176595}
```

**Response - RESULT:**

```
{    "symbol": "BTCUSDT",    "orderId": 28,    "orderListId": -1, // Unless it's part of an order list, value will be -1    "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",    "transactTime": 1507725176595,    "price": "0.00000000",    "origQty": "10.00000000",    "executedQty": "10.00000000",    "origQuoteOrderQty": "0.000000",    "cummulativeQuoteQty": "10.00000000",    "status": "FILLED",    "timeInForce": "GTC",    "type": "MARKET",    "side": "SELL",    "workingTime": 1507725176595,    "selfTradePreventionMode": "NONE"}
```

**Response - FULL:**

```
{    "symbol": "BTCUSDT",    "orderId": 28,    "orderListId": -1, // Unless it's part of an order list, value will be -1    "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",    "transactTime": 1507725176595,    "price": "0.00000000",    "origQty": "10.00000000",    "executedQty": "10.00000000",    "origQuoteOrderQty": "0.000000",    "cummulativeQuoteQty": "10.00000000",    "status": "FILLED",    "timeInForce": "GTC",    "type": "MARKET",    "side": "SELL",    "workingTime": 1507725176595,    "selfTradePreventionMode": "NONE",    "fills": [        {            "price": "4000.00000000",            "qty": "1.00000000",            "commission": "4.00000000",            "commissionAsset": "USDT",            "tradeId": 56        },        {            "price": "3999.00000000",            "qty": "5.00000000",            "commission": "19.99500000",            "commissionAsset": "USDT",            "tradeId": 57        },        {            "price": "3998.00000000",            "qty": "2.00000000",            "commission": "7.99600000",            "commissionAsset": "USDT",            "tradeId": 58        },        {            "price": "3997.00000000",            "qty": "1.00000000",            "commission": "3.99700000",            "commissionAsset": "USDT",            "tradeId": 59        },        {            "price": "3995.00000000",            "qty": "1.00000000",            "commission": "3.99500000",            "commissionAsset": "USDT",            "tradeId": 60        }    ]}
```

**Conditional fields in Order Responses**

There are fields in the order responses (e.g. order placement, order query, order cancellation) that appear only if certain conditions are met.

These fields can apply to order lists.

The fields are listed below:

Field

Description

Visibility conditions

Examples

`icebergQty`

Quantity for the iceberg order

Appears only if the parameter `icebergQty` was sent in the request.

`"icebergQty": "0.00000000"`

`preventedMatchId`

When used in combination with `symbol`, can be used to query a prevented match.

Appears only if the order expired due to STP.

`"preventedMatchId": 0`

`preventedQuantity`

Order quantity that expired due to STP

Appears only if the order expired due to STP.

`"preventedQuantity": "1.200000"`

`stopPrice`

Price when the algorithmic order will be triggered

Appears for `STOP_LOSS`. `TAKE_PROFIT`, `STOP_LOSS_LIMIT` and `TAKE_PROFIT_LIMIT` orders.

`"stopPrice": "23500.00000000"`

`strategyId`

Can be used to label an order that's part of an order strategy.

Appears if the parameter was populated in the request.

`"strategyId": 37463720`

`strategyType`

Can be used to label an order that is using an order strategy.

Appears if the parameter was populated in the request.

`"strategyType": 1000000`

`trailingDelta`

Delta price change required before order activation

Appears for Trailing Stop Orders.

`"trailingDelta": 10`

`trailingTime`

Time when the trailing order is now active and tracking price changes

Appears only for Trailing Stop Orders.

`"trailingTime": -1`

`usedSor`

Field that determines whether order used SOR

Appears when placing orders using SOR

`"usedSor": true`

`workingFloor`

Field that determines whether the order is being filled by the SOR or by the order book the order was submitted to.

Appears when placing orders using SOR

`"workingFloor": "SOR"`

`pegPriceType`

Price peg type

Only for pegged orders

`"pegPriceType": "PRIMARY_PEG"`

`pegOffsetType`

Price peg offset type

Only for pegged orders, if requested

`"pegOffsetType": "PRICE_LEVEL"`

`pegOffsetValue`

Price peg offset value

Only for pegged orders, if requested

`"pegOffsetValue": 5`

`peggedPrice`

Current price order is pegged at

Only for pegged orders, once determined

`"peggedPrice": "87523.83710000"`

### Test new order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/order/test
```

Test new order creation and signature/recvWindow long. Creates and validates a new order but does not send it into the matching engine.

**Weight:**

Condition

Request Weight

Without `computeCommissionRates`

1

With `computeCommissionRates`

20

**Parameters:**

In addition to all parameters accepted by [`POST /api/v3/order`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints), the following optional parameters are also accepted:

Name

Type

Mandatory

Description

computeCommissionRates

BOOLEAN

NO

Default: `false`  
See [Commissions FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/commission_faq) to learn more.

**Data Source:** Memory

**Response:**

Without `computeCommissionRates`

```
{}
```

With `computeCommissionRates`

```
{    "standardCommissionForOrder": {  // Standard commission rates on trades from the order.        "maker": "0.00000112",        "taker": "0.00000114"    },    "specialCommissionForOrder": {   // Special commission rates on trades from the order.        "maker": "0.05000000",        "taker": "0.06000000"    },    "taxCommissionForOrder": {       // Tax commission rates for trades from the order.        "maker": "0.00000112",        "taker": "0.00000114"    },    "discount": {                    // Discount on standard commissions when paying in BNB.        "enabledForAccount": true,        "enabledForSymbol": true,        "discountAsset": "BNB",        "discount": "0.25000000"     // Standard commission is reduced by this rate when paying commission in BNB.    }}
```

### Query order (USER\_DATA)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
GET /api/v3/order
```

Check an order's status.

**Weight:** 4

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

origClientOrderId

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

**Notes:**

-   Either `orderId` or `origClientOrderId` must be sent.
-   If both `orderId` and `origClientOrderId` are provided, the `orderId` is searched first, then the `origClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.
-   For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time.

**Data Source:** Memory => Database

**Response:**

```
{    "symbol": "LTCBTC",    "orderId": 1,    "orderListId": -1, // This field will always have a value of -1 if not an order list.    "clientOrderId": "myOrder1",    "price": "0.1",    "origQty": "1.0",    "executedQty": "0.0",    "cummulativeQuoteQty": "0.0",    "status": "NEW",    "timeInForce": "GTC",    "type": "LIMIT",    "side": "BUY",    "stopPrice": "0.0",    "icebergQty": "0.0",    "time": 1499827319559,    "updateTime": 1499827319559,    "isWorking": true,    "workingTime": 1499827319559,    "origQuoteOrderQty": "0.000000",    "selfTradePreventionMode": "NONE"}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

### Cancel order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
DELETE /api/v3/order
```

Cancel an active order.

**Weight:** 1

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

origClientOrderId

STRING

NO

newClientOrderId

STRING

NO

Used to uniquely identify this cancel. Automatically generated by default.

cancelRestrictions

ENUM

NO

Supported values:  
`ONLY_NEW` - Cancel will succeed if the order status is `NEW`.  
`ONLY_PARTIALLY_FILLED` \- Cancel will succeed if order status is `PARTIALLY_FILLED`.

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

Notes:

-   Either `orderId` or `origClientOrderId` must be sent.
-   If both `orderId` and `origClientOrderId` are provided, the `orderId` is searched first, then the `origClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.

**Data Source:** Matching Engine

**Response:**

```
{    "symbol": "LTCBTC",    "origClientOrderId": "myOrder1",    "orderId": 4,    "orderListId": -1, // Unless it's part of an order list, value will be -1    "clientOrderId": "cancelMyOrder1",    "transactTime": 1684804350068,    "price": "2.00000000",    "origQty": "1.00000000",    "executedQty": "0.00000000",    "origQuoteOrderQty": "0.000000",    "cummulativeQuoteQty": "0.00000000",    "status": "CANCELED",    "timeInForce": "GTC",    "type": "LIMIT",    "side": "BUY",    "selfTradePreventionMode": "NONE"}
```

**Notes:**

-   The payload above does not show all fields that can appear in the order response. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).
-   The performance for canceling an order (single cancel or as part of a cancel-replace) is always better when only `orderId` is sent. Sending `origClientOrderId` or both `orderId` + `origClientOrderId` will be slower.

**Regarding `cancelRestrictions`**

-   If the `cancelRestrictions` value is not any of the supported values, the error will be:

```
{    "code": -1145,    "msg": "Invalid cancelRestrictions"}
```

-   If the order did not pass the conditions for `cancelRestrictions`, the error will be:

```
{    "code": -2011,    "msg": "Order was not canceled due to cancel restrictions."}
```

### Cancel All Open Orders on a Symbol (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
DELETE /api/v3/openOrders
```

Cancels all active orders on a symbol. This includes orders that are part of an order list.

**Weight:** 1

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

**Data Source:** Matching Engine

**Response:**

```
[    {        "symbol": "BTCUSDT",        "origClientOrderId": "E6APeyTJvkMvLMYMqu1KQ4",        "orderId": 11,        "orderListId": -1,        "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",        "transactTime": 1684804350068,        "price": "0.089853",        "origQty": "0.178622",        "executedQty": "0.000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.000000",        "status": "CANCELED",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "selfTradePreventionMode": "NONE"    },    {        "symbol": "BTCUSDT",        "origClientOrderId": "A3EF2HCwxgZPFMrfwbgrhv",        "orderId": 13,        "orderListId": -1,        "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",        "transactTime": 1684804350069,        "price": "0.090430",        "origQty": "0.178622",        "executedQty": "0.000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.000000",        "status": "CANCELED",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "selfTradePreventionMode": "NONE"    },    {        "orderListId": 1929,        "contingencyType": "OCO",        "listStatusType": "ALL_DONE",        "listOrderStatus": "ALL_DONE",        "listClientOrderId": "2inzWQdDvZLHbbAmAozX2N",        "transactionTime": 1585230948299,        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 20,                "clientOrderId": "CwOOIPHSmYywx6jZX77TdL"            },            {                "symbol": "BTCUSDT",                "orderId": 21,                "clientOrderId": "461cPg51vQjV3zIMOXNz39"            }        ],        "orderReports": [            {                "symbol": "BTCUSDT",                "origClientOrderId": "CwOOIPHSmYywx6jZX77TdL",                "orderId": 20,                "orderListId": 1929,                "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",                "transactTime": 1688005070874,                "price": "0.668611",                "origQty": "0.690354",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "STOP_LOSS_LIMIT",                "side": "BUY",                "stopPrice": "0.378131",                "icebergQty": "0.017083",                "selfTradePreventionMode": "NONE"            },            {                "symbol": "BTCUSDT",                "origClientOrderId": "461cPg51vQjV3zIMOXNz39",                "orderId": 21,                "orderListId": 1929,                "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",                "transactTime": 1688005070874,                "price": "0.008791",                "origQty": "0.690354",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "LIMIT_MAKER",                "side": "BUY",                "icebergQty": "0.639962",                "selfTradePreventionMode": "NONE"            }        ]    }]
```

### Cancel an Existing Order and Send a New Order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/order/cancelReplace
```

Cancels an existing order and places a new order on the same symbol.

Filters and Order Count are evaluated before the processing of the cancellation and order placement occurs.

A new order that was not attempted (i.e. when `newOrderResult: NOT_ATTEMPTED`), will still increase the unfilled order count by 1.

**Weight:** 1

**Unfilled Order Count:** 1

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

side

ENUM

YES

type

ENUM

YES

cancelReplaceMode

ENUM

YES

The allowed values are:  
`STOP_ON_FAILURE` - If the cancel request fails, the new order placement will not be attempted.  
`ALLOW_FAILURE` - new order placement will be attempted even if cancel request fails.

timeInForce

ENUM

NO

quantity

DECIMAL

NO

quoteOrderQty

DECIMAL

NO

price

DECIMAL

NO

cancelNewClientOrderId

STRING

NO

Used to uniquely identify this cancel. Automatically generated by default.

cancelOrigClientOrderId

STRING

NO

Either `cancelOrderId` or `cancelOrigClientOrderId` must be sent.  
  
If both `cancelOrderId` and `cancelOrigClientOrderId` parameters are provided, the `cancelOrderId` is searched first, then the `cancelOrigClientOrderId` from that result is checked against that order.  
  
If both conditions are not met the request will be rejected.

cancelOrderId

LONG

NO

Either `cancelOrderId` or `cancelOrigClientOrderId` must be sent.  
  
If both `cancelOrderId` and `cancelOrigClientOrderId` parameters are provided, the `cancelOrderId` is searched first, then the `cancelOrigClientOrderId` from that result is checked against that order.  
  
If both conditions are not met the request will be rejected.

newClientOrderId

STRING

NO

Used to identify the new order.

strategyId

LONG

NO

strategyType

INT

NO

The value cannot be less than `1000000`.

stopPrice

DECIMAL

NO

trailingDelta

LONG

NO

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

icebergQty

DECIMAL

NO

newOrderRespType

ENUM

NO

Allowed values:  
`ACK`, `RESULT`, `FULL`  
`MARKET` and `LIMIT` orders types default to `FULL`; all other orders default to `ACK`

selfTradePreventionMode

ENUM

NO

The allowed enums is dependent on what is configured on the symbol. The possible supported values are: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums).

cancelRestrictions

ENUM

NO

Supported values:  
`ONLY_NEW` - Cancel will succeed if the order status is `NEW`.  
`ONLY_PARTIALLY_FILLED` \- Cancel will succeed if order status is `PARTIALLY_FILLED`. For more information please refer to [Regarding `cancelRestrictions`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

orderRateLimitExceededMode

ENUM

No

Supported values:  
`DO_NOTHING` (default)- will only attempt to cancel the order if account has not exceeded the unfilled order rate limit  
`CANCEL_ONLY` - will always cancel the order

pegPriceType

ENUM

NO

`PRIMARY_PEG` or `MARKET_PEG`  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pegOffsetValue

INT

NO

Price level to peg the price to (max: 100)  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pegOffsetType

ENUM

NO

Only `PRICE_LEVEL` is supported  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

Similar to `POST /api/v3/order`, additional mandatory parameters are determined by `type`.

Response format varies depending on whether the processing of the message succeeded, partially succeeded, or failed.

**Data Source:** Matching Engine

Request

Response

`cancelReplaceMode`

`orderRateLimitExceededMode`

Unfilled Order Count

`cancelResult`

`newOrderResult`

`status`

`STOP_ON_FAILURE`

`DO_NOTHING`

Within Limits

✅ `SUCCESS`

✅ `SUCCESS`

`200`

❌ `FAILURE`

➖ `NOT_ATTEMPTED`

`400`

✅ `SUCCESS`

❌ `FAILURE`

`409`

Exceeds Limits

✅ `SUCCESS`

✅ `SUCCESS`

N/A

❌ `FAILURE`

➖ `NOT_ATTEMPTED`

N/A

✅ `SUCCESS`

❌ `FAILURE`

N/A

`CANCEL_ONLY`

Within Limits

✅ `SUCCESS`

✅ `SUCCESS`

`200`

❌ `FAILURE`

➖ `NOT_ATTEMPTED`

`400`

✅ `SUCCESS`

❌ `FAILURE`

`409`

Exceeds Limits

❌ `FAILURE`

➖ `NOT_ATTEMPTED`

`429`

✅ `SUCCESS`

❌ `FAILURE`

`429`

`ALLOW_FAILURE`

`DO_NOTHING`

Within Limits

✅ `SUCCESS`

✅ `SUCCESS`

`200`

❌ `FAILURE`

❌ `FAILURE`

`400`

❌ `FAILURE`

✅ `SUCCESS`

`409`

✅ `SUCCESS`

❌ `FAILURE`

`409`

Exceeds Limits

✅ `SUCCESS`

✅ `SUCCESS`

N/A

❌ `FAILURE`

❌ `FAILURE`

N/A

❌ `FAILURE`

✅ `SUCCESS`

N/A

✅ `SUCCESS`

❌ `FAILURE`

N/A

`CANCEL_ONLY`

Within Limits

✅ `SUCCESS`

✅ `SUCCESS`

`200`

❌ `FAILURE`

❌ `FAILURE`

`400`

❌ `FAILURE`

✅ `SUCCESS`

`409`

✅ `SUCCESS`

❌ `FAILURE`

`409`

Exceeds Limits

✅ `SUCCESS`

✅ `SUCCESS`

`N/A`

❌ `FAILURE`

❌ `FAILURE`

`400`

❌ `FAILURE`

✅ `SUCCESS`

N/A

✅ `SUCCESS`

❌ `FAILURE`

`409`

**Response SUCCESS and account has not exceeded the unfilled order count:**

```
// Both the cancel order placement and new order placement succeeded.{    "cancelResult": "SUCCESS",    "newOrderResult": "SUCCESS",    "cancelResponse": {        "symbol": "BTCUSDT",        "origClientOrderId": "DnLo3vTAQcjha43lAZhZ0y",        "orderId": 9,        "orderListId": -1,        "clientOrderId": "osxN3JXAtJvKvCqGeMWMVR",        "transactTime": 1684804350068,        "price": "0.01000000",        "origQty": "0.000100",        "executedQty": "0.00000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.00000000",        "status": "CANCELED",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "SELL",        "selfTradePreventionMode": "NONE"    },    "newOrderResponse": {        "symbol": "BTCUSDT",        "orderId": 10,        "orderListId": -1,        "clientOrderId": "wOceeeOzNORyLiQfw7jd8S",        "transactTime": 1652928801803,        "price": "0.02000000",        "origQty": "0.040000",        "executedQty": "0.00000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.00000000",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "workingTime": 1669277163808,        "fills": [],        "selfTradePreventionMode": "NONE"    }}
```

**Response when Cancel Order Fails with STOP\_ON FAILURE and account has not exceeded their unfilled order count:**

```
{    "code": -2022,    "msg": "Order cancel-replace failed.",    "data": {        "cancelResult": "FAILURE",        "newOrderResult": "NOT_ATTEMPTED",        "cancelResponse": {            "code": -2011,            "msg": "Unknown order sent."        },        "newOrderResponse": null    }}
```

**Response when Cancel Order Succeeds but New Order Placement Fails and account has not exceeded their unfilled order count:**

```
{    "code": -2021,    "msg": "Order cancel-replace partially failed.",    "data": {        "cancelResult": "SUCCESS",        "newOrderResult": "FAILURE",        "cancelResponse": {            "symbol": "BTCUSDT",            "origClientOrderId": "86M8erehfExV8z2RC8Zo8k",            "orderId": 3,            "orderListId": -1,            "clientOrderId": "G1kLo6aDv2KGNTFcjfTSFq",            "transactTime": 1684804350068,            "price": "0.006123",            "origQty": "10000.000000",            "executedQty": "0.000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.000000",            "status": "CANCELED",            "timeInForce": "GTC",            "type": "LIMIT_MAKER",            "side": "SELL",            "selfTradePreventionMode": "NONE"        },        "newOrderResponse": {            "code": -2010,            "msg": "Order would immediately match and take."        }    }}
```

**Response when Cancel Order fails with ALLOW\_FAILURE and account has not exceeded their unfilled order count:**

```
{    "code": -2021,    "msg": "Order cancel-replace partially failed.",    "data": {        "cancelResult": "FAILURE",        "newOrderResult": "SUCCESS",        "cancelResponse": {            "code": -2011,            "msg": "Unknown order sent."        },        "newOrderResponse": {            "symbol": "BTCUSDT",            "orderId": 11,            "orderListId": -1,            "clientOrderId": "pfojJMg6IMNDKuJqDxvoxN",            "transactTime": 1648540168818        }    }}
```

**Response when both Cancel Order and New Order Placement fail using `cancelReplaceMode=ALLOW_FAILURE` and account has not exceeded their unfilled order count:**

```
{    "code": -2022,    "msg": "Order cancel-replace failed.",    "data": {        "cancelResult": "FAILURE",        "newOrderResult": "FAILURE",        "cancelResponse": {            "code": -2011,            "msg": "Unknown order sent."        },        "newOrderResponse": {            "code": -2010,            "msg": "Order would immediately match and take."        }    }}
```

**Response when using `orderRateLimitExceededMode=DO_NOTHING` and account's unfilled order count has been exceeded:**

```
{    "code": -1015,    "msg": "Too many new orders; current limit is 1 orders per 10 SECOND."}
```

**Response when using `orderRateLimitExceededMode=CANCEL_ONLY` and account's unfilled order count has been exceeded:**

```
{    "code": -2021,    "msg": "Order cancel-replace partially failed.",    "data": {        "cancelResult": "SUCCESS",        "newOrderResult": "FAILURE",        "cancelResponse": {            "symbol": "LTCBNB",            "origClientOrderId": "GKt5zzfOxRDSQLveDYCTkc",            "orderId": 64,            "orderListId": -1,            "clientOrderId": "loehOJF3FjoreUBDmv739R",            "transactTime": 1715779007228,            "price": "1.00",            "origQty": "10.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00",            "status": "CANCELED",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "selfTradePreventionMode": "NONE"        },        "newOrderResponse": {            "code": -1015,            "msg": "Too many new orders; current limit is 1 orders per 10 SECOND."        }    }}
```

**Notes:**

-   The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).
-   The performance for canceling an order (single cancel or as part of a cancel-replace) is always better when only `orderId` is sent. Sending `origClientOrderId` or both `orderId` + `origClientOrderId` will be slower.

### Order Amend Keep Priority (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
PUT /api/v3/order/amend/keepPriority
```

Reduce the quantity of an existing open order.

This adds 0 orders to the `EXCHANGE_MAX_ORDERS` filter and the `MAX_NUM_ORDERS` filter.

Read [Order Amend Keep Priority FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/order_amend_keep_priority) to learn more.

**Weight**: 4

**Unfilled Order Count:** 0

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

NO\*

`orderId` or `origClientOrderId` must be sent

origClientOrderId

STRING

NO\*

`orderId` or `origClientOrderId` must be sent

newClientOrderId

STRING

NO\*

The new client order ID for the order after being amended.  
If not sent, one will be randomly generated.  
It is possible to reuse the current clientOrderId by sending it as the `newClientOrderId`.

newQty

DECIMAL

YES

`newQty` must be greater than 0 and less than the order's quantity.

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Data Source**: Matching Engine

**Response:** Response for a single order:

```
{    "transactTime": 1741926410255,    "executionId": 75,    "amendedOrder": {        "symbol": "BTCUSDT",        "orderId": 33,        "orderListId": -1,        "origClientOrderId": "5xrgbMyg6z36NzBn2pbT8H",        "clientOrderId": "PFaq6hIHxqFENGfdtn4J6Q",        "price": "6.00000000",        "qty": "5.00000000",        "executedQty": "0.00000000",        "preventedQty": "0.00000000",        "quoteOrderQty": "0.00000000",        "cumulativeQuoteQty": "0.00000000",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "SELL",        "workingTime": 1741926410242,        "selfTradePreventionMode": "NONE"    }}
```

Response for an order that is part of an Order list:

```
{    "transactTime": 1741669661670,    "executionId": 22,    "amendedOrder": {        "symbol": "BTCUSDT",        "orderId": 9,        "orderListId": 1,        "origClientOrderId": "W0fJ9fiLKHOJutovPK3oJp",        "clientOrderId": "UQ1Np3bmQ71jJzsSDW9Vpi",        "price": "0.00000000",        "qty": "4.00000000",        "executedQty": "0.00000000",        "preventedQty": "0.00000000",        "quoteOrderQty": "0.00000000",        "cumulativeQuoteQty": "0.00000000",        "status": "PENDING_NEW",        "timeInForce": "GTC",        "type": "MARKET",        "side": "BUY",        "selfTradePreventionMode": "NONE"    },    "listStatus": {        "orderListId": 1,        "contingencyType": "OTO",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "AT7FTxZXylVSwRoZs52mt3",        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 8,                "clientOrderId": "GkwwHZUUbFtZOoH1YsZk9Q"            },            {                "symbol": "BTCUSDT",                "orderId": 9,                "clientOrderId": "UQ1Np3bmQ71jJzsSDW9Vpi"            }        ]    }}
```

**Note:** The payloads above do not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

### Order lists[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

#### New Order list - OCO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/orderList/oco
```

Send in an one-cancels-the-other (OCO) pair, where activation of one order immediately cancels the other.

-   An OCO has 2 orders called the **above order** and **below order**.
-   One of the orders must be a `LIMIT_MAKER/TAKE_PROFIT/TAKE_PROFIT_LIMIT` order and the other must be `STOP_LOSS` or `STOP_LOSS_LIMIT` order.
-   Price restrictions
    -   If the OCO is on the `SELL` side:
        -   `LIMIT_MAKER/TAKE_PROFIT_LIMIT` `price` > Last Traded Price > `STOP_LOSS/STOP_LOSS_LIMIT` `stopPrice`
        -   `TAKE_PROFIT stopPrice` \> Last Traded Price > `STOP_LOSS/STOP_LOSS_LIMIT stopPrice`
    -   If the OCO is on the `BUY` side:
        -   `LIMIT_MAKER/TAKE_PROFIT_LIMIT price` < Last Traded Price < `stopPrice`
        -   `TAKE_PROFIT stopPrice` < Last Traded Price < `STOP_LOSS/STOP_LOSS_LIMIT stopPrice`
-   OCOs add **2 orders** to the `EXCHANGE_MAX_ORDERS` filter and the `MAX_NUM_ORDERS` filter.

**Weight:** 1

**Unfilled Order Count:** 2

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

Yes

listClientOrderId

STRING

No

Arbitrary unique ID among open order lists. Automatically generated if not sent.  
A new order list with the same `listClientOrderId` is accepted only when the previous one is filled or completely expired.  
`listClientOrderId` is distinct from the `aboveClientOrderId` and the `belowCLientOrderId`.

side

ENUM

Yes

`BUY` or `SELL`

quantity

DECIMAL

Yes

Quantity for both orders of the order list.

aboveType

ENUM

Yes

Supported values: `STOP_LOSS_LIMIT`, `STOP_LOSS`, `LIMIT_MAKER`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

aboveClientOrderId

STRING

No

Arbitrary unique ID among open orders for the above order. Automatically generated if not sent

aboveIcebergQty

LONG

No

Note that this can only be used if `aboveTimeInForce` is `GTC`.

abovePrice

DECIMAL

No

Can be used if `aboveType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

aboveStopPrice

DECIMAL

No

Can be used if `aboveType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`.  
Either `aboveStopPrice` or `aboveTrailingDelta` or both, must be specified.

aboveTrailingDelta

LONG

No

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq).

aboveTimeInForce

ENUM

No

Required if `aboveType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT`.

aboveStrategyId

LONG

No

Arbitrary numeric value identifying the above order within an order strategy.

aboveStrategyType

INT

No

Arbitrary numeric value identifying the above order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

abovePegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

abovePegOffsetType

ENUM

NO

abovePegOffsetValue

INT

NO

belowType

ENUM

Yes

Supported values: `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`,`TAKE_PROFIT_LIMIT`

belowClientOrderId

STRING

No

Arbitrary unique ID among open orders for the below order. Automatically generated if not sent

belowIcebergQty

LONG

No

Note that this can only be used if `belowTimeInForce` is `GTC`.

belowPrice

DECIMAL

No

Can be used if `belowType` is `STOP_LOSS_LIMIT`, `TAKE_PROFIT_LIMIT`, or `LIMIT_MAKER` to specify the limit price.

belowStopPrice

DECIMAL

No

Can be used if `belowType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT` or `TAKE_PROFIT_LIMIT`. Either `belowStopPrice` or `belowTrailingDelta` or both, must be specified.  
Either `belowStopPrice` or `belowTrailingDelta` or both, must be specified.

belowTrailingDelta

LONG

No

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq).

belowTimeInForce

ENUM

No

Required if `belowType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT`.

belowStrategyId

LONG

No

Arbitrary numeric value identifying the below order within an order strategy.

belowStrategyType

INT

No

Arbitrary numeric value identifying the below order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

belowPegPriceType

ENUM

NO

belowPegOffsetType

ENUM

NO

belowPegOffsetValue

INT

NO

newOrderRespType

ENUM

No

Select response format: `ACK`, `RESULT`, `FULL`

selfTradePreventionMode

ENUM

No

The allowed enums is dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

recvWindow

DECIMAL

No

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

Yes

**Data Source:** Matching Engine

**Response:**

Response format for `orderReports` is selected using the `newOrderRespType` parameter. The following example is for the `RESULT` response type. See [`POST /api/v3/order`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints) for more examples.

```
{    "orderListId": 1,    "contingencyType": "OCO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "lH1YDkuQKWiXVXHPSKYEIp",    "transactionTime": 1710485608839,    "symbol": "LTCBTC",    "orders": [        {            "symbol": "LTCBTC",            "orderId": 10,            "clientOrderId": "44nZvqpemY7sVYgPYbvPih"        },        {            "symbol": "LTCBTC",            "orderId": 11,            "clientOrderId": "NuMp0nVYnciDiFmVqfpBqK"        }    ],    "orderReports": [        {            "symbol": "LTCBTC",            "orderId": 10,            "orderListId": 1,            "clientOrderId": "44nZvqpemY7sVYgPYbvPih",            "transactTime": 1710485608839,            "price": "1.00000000",            "origQty": "5.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "STOP_LOSS_LIMIT",            "side": "SELL",            "stopPrice": "1.00000000",            "workingTime": -1,            "icebergQty": "1.00000000",            "selfTradePreventionMode": "NONE"        },        {            "symbol": "LTCBTC",            "orderId": 11,            "orderListId": 1,            "clientOrderId": "NuMp0nVYnciDiFmVqfpBqK",            "transactTime": 1710485608839,            "price": "3.00000000",            "origQty": "5.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT_MAKER",            "side": "SELL",            "workingTime": 1710485608839,            "selfTradePreventionMode": "NONE"        }    ]}
```

#### New Order list - OTO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/orderList/oto
```

Place an OTO.

-   An OTO (One-Triggers-the-Other) is an order list comprised of 2 orders.
-   The first order is called the **working order** and must be `LIMIT` or `LIMIT_MAKER`. Initially, only the working order goes on the order book.
-   The second order is called the **pending order**. It can be any order type except for `MARKET` orders using parameter `quoteOrderQty`. The pending order is only placed on the order book when the working order gets **fully filled**.
-   If either the working order or the pending order is cancelled individually, the other order in the order list will also be canceled or expired.
-   When the order list is placed, if the working order gets **immediately fully filled**, the placement response will show the working order as `FILLED` but the pending order will still appear as `PENDING_NEW`. You need to query the status of the pending order again to see its updated status.
-   OTOs add **2 orders** to the `EXCHANGE_MAX_NUM_ORDERS` filter and `MAX_NUM_ORDERS` filter.

**Weight:** 1

**Unfilled Order Count:** 2

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

listClientOrderId

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent.  
A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired.  
`listClientOrderId` is distinct from the `workingClientOrderId` and the `pendingClientOrderId`.

newOrderRespType

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

selfTradePreventionMode

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingType

ENUM

YES

Supported values: `LIMIT`,`LIMIT_MAKER`

workingSide

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the working order.  
Automatically generated if not sent.

workingPrice

DECIMAL

YES

workingQuantity

DECIMAL

YES

Sets the quantity for the working order.

workingIcebergQty

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC`, or if `workingType` is `LIMIT_MAKER`.

workingTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingStrategyId

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

workingStrategyType

INT

NO

Arbitrary numeric value identifying the working order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

workingPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

workingPegOffsetType

ENUM

NO

workingPegOffsetValue

INT

NO

pendingType

ENUM

YES

Supported values: [Order Types](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)  
Note that `MARKET` orders using `quoteOrderQty` are not supported.

pendingSide

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the pending order.  
Automatically generated if not sent.

pendingPrice

DECIMAL

NO

pendingStopPrice

DECIMAL

NO

pendingTrailingDelta

DECIMAL

NO

pendingQuantity

DECIMAL

YES

Sets the quantity for the pending order.

pendingIcebergQty

DECIMAL

NO

This can only be used if `pendingTimeInForce` is `GTC` or if `pendingType` is `LIMIT_MAKER`.

pendingTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingStrategyId

LONG

NO

Arbitrary numeric value identifying the pending order within an order strategy.

pendingStrategyType

INT

NO

Arbitrary numeric value identifying the pending order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

pendingPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pendingPegOffsetType

ENUM

NO

pendingPegOffsetValue

INT

NO

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Mandatory parameters based on `pendingType` or `workingType`**

Depending on the `pendingType` or `workingType`, some optional parameters will become mandatory.

Type

Additional mandatory parameters

Additional information

`workingType` = `LIMIT`

`workingTimeInForce`

`pendingType` = `LIMIT`

`pendingPrice`, `pendingTimeInForce`

`pendingType` = `STOP_LOSS` or `TAKE_PROFIT`

`pendingStopPrice` and/or `pendingTrailingDelta`

`pendingType` = `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT`

`pendingPrice`, `pendingStopPrice` and/or `pendingTrailingDelta`, `pendingTimeInForce`

**Data Source:**

Matching Engine

**Response:**

```
{    "orderListId": 0,    "contingencyType": "OTO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "yl2ERtcar1o25zcWtqVBTC",    "transactionTime": 1712289389158,    "symbol": "LTCBTC",    "orders": [        {            "symbol": "LTCBTC",            "orderId": 4,            "clientOrderId": "Bq17mn9fP6vyCn75Jw1xya"        },        {            "symbol": "LTCBTC",            "orderId": 5,            "clientOrderId": "arLFo0zGJVDE69cvGBaU0d"        }    ],    "orderReports": [        {            "symbol": "LTCBTC",            "orderId": 4,            "orderListId": 0,            "clientOrderId": "Bq17mn9fP6vyCn75Jw1xya",            "transactTime": 1712289389158,            "price": "1.00000000",            "origQty": "1.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "workingTime": 1712289389158,            "selfTradePreventionMode": "NONE"        },        {            "symbol": "LTCBTC",            "orderId": 5,            "orderListId": 0,            "clientOrderId": "arLFo0zGJVDE69cvGBaU0d",            "transactTime": 1712289389158,            "price": "0.00000000",            "origQty": "5.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "PENDING_NEW",            "timeInForce": "GTC",            "type": "MARKET",            "side": "BUY",            "workingTime": -1,            "selfTradePreventionMode": "NONE"        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

#### New Order list - OTOCO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/orderList/otoco
```

Place an OTOCO.

-   An OTOCO (One-Triggers-One-Cancels-the-Other) is an order list comprised of 3 orders.
-   The first order is called the **working order** and must be `LIMIT` or `LIMIT_MAKER`. Initially, only the working order goes on the order book.
    -   The behavior of the working order is the same as the [OTO](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).
-   OTOCO has 2 pending orders (pending above and pending below), forming an OCO pair. The pending orders are only placed on the order book when the working order gets **fully filled**.
    -   The rules of the pending above and pending below follow the same rules as the [Order list OCO](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).
-   OTOCOs add **3 orders** to the `EXCHANGE_MAX_NUM_ORDERS` filter and `MAX_NUM_ORDERS` filter.

**Weight:** 1

**Unfilled Order Count:** 3

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

listClientOrderId

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent.  
A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired.  
`listClientOrderId` is distinct from the `workingClientOrderId`, `pendingAboveClientOrderId`, and the `pendingBelowClientOrderId`.

newOrderRespType

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

selfTradePreventionMode

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingType

ENUM

YES

Supported values: `LIMIT`, `LIMIT_MAKER`

workingSide

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the working order.  
Automatically generated if not sent.

workingPrice

DECIMAL

YES

workingQuantity

DECIMAL

YES

workingIcebergQty

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC` or if `workingType` is `LIMIT_MAKER`.

workingTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingStrategyId

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

workingStrategyType

INT

NO

Arbitrary numeric value identifying the working order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

workingPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

workingPegOffsetType

ENUM

NO

workingPegOffsetValue

INT

NO

pendingSide

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingQuantity

DECIMAL

YES

pendingAboveType

ENUM

YES

Supported values: `STOP_LOSS_LIMIT`, `STOP_LOSS`, `LIMIT_MAKER`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

pendingAboveClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the pending above order.  
Automatically generated if not sent.

pendingAbovePrice

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

pendingAboveStopPrice

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, or `TAKE_PROFIT_LIMIT`

pendingAboveTrailingDelta

DECIMAL

NO

See [Trailing Stop FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

pendingAboveIcebergQty

DECIMAL

NO

This can only be used if `pendingAboveTimeInForce` is `GTC` or if `pendingAboveType` is `LIMIT_MAKER`.

pendingAboveTimeInForce

ENUM

NO

pendingAboveStrategyId

LONG

NO

Arbitrary numeric value identifying the pending above order within an order strategy.

pendingAboveStrategyType

INT

NO

Arbitrary numeric value identifying the pending above order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

pendingAbovePegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pendingAbovePegOffsetType

ENUM

NO

pendingAbovePegOffsetValue

INT

NO

pendingBelowType

ENUM

NO

Supported values: `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`,`TAKE_PROFIT_LIMIT`

pendingBelowClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the pending below order.  
Automatically generated if not sent.

pendingBelowPrice

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT` to specify limit price.

pendingBelowStopPrice

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, or `TAKE_PROFIT_LIMIT`.  
Either `pendingBelowStopPrice` or `pendingBelowTrailingDelta` or both, must be specified.

pendingBelowTrailingDelta

DECIMAL

NO

pendingBelowIcebergQty

DECIMAL

NO

This can only be used if `pendingBelowTimeInForce` is `GTC` or if `pendingBelowType` is `LIMIT_MAKER`.

pendingBelowTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingBelowStrategyId

LONG

NO

Arbitrary numeric value identifying the pending below order within an order strategy.

pendingBelowStrategyType

INT

NO

Arbitrary numeric value identifying the pending below order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

pendingBelowPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pendingBelowPegOffsetType

ENUM

NO

pendingBelowPegOffsetValue

INT

NO

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Mandatory parameters based on `pendingAboveType`, `pendingBelowType` or `workingType`**

Depending on the `pendingAboveType`/`pendingBelowType` or `workingType`, some optional parameters will become mandatory.

Type

Additional mandatory parameters

Additional information

`workingType` = `LIMIT`

`workingTimeInForce`

`pendingAboveType`\= `LIMIT_MAKER`

`pendingAbovePrice`

`pendingAboveType` = `STOP_LOSS/TAKE_PROFIT`

`pendingAboveStopPrice` and/or `pendingAboveTrailingDelta`

`pendingAboveType=STOP_LOSS_LIMIT/TAKE_PROFIT_LIMIT`

`pendingAbovePrice`, `pendingAboveStopPrice` and/or `pendingAboveTrailingDelta`, `pendingAboveTimeInForce`

`pendingBelowType`\= `LIMIT_MAKER`

`pendingBelowPrice`

`pendingBelowType= STOP_LOSS/TAKE_PROFIT`

`pendingBelowStopPrice` and/or `pendingBelowTrailingDelta`

`pendingBelowType=STOP_LOSS_LIMIT/TAKE_PROFIT_LIMIT`

`pendingBelowPrice`, `pendingBelowStopPrice` and/or `pendingBelowTrailingDelta`, `pendingBelowTimeInForce`

**Data Source:**

Matching Engine

**Response:**

```
{    "orderListId": 1,    "contingencyType": "OTO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "RumwQpBaDctlUu5jyG5rs0",    "transactionTime": 1712291372842,    "symbol": "LTCBTC",    "orders": [        {            "symbol": "LTCBTC",            "orderId": 6,            "clientOrderId": "fM9Y4m23IFJVCQmIrlUmMK"        },        {            "symbol": "LTCBTC",            "orderId": 7,            "clientOrderId": "6pcQbFIzTXGZQ1e2MkGDq4"        },        {            "symbol": "LTCBTC",            "orderId": 8,            "clientOrderId": "r4JMv9cwAYYUwwBZfbussx"        }    ],    "orderReports": [        {            "symbol": "LTCBTC",            "orderId": 6,            "orderListId": 1,            "clientOrderId": "fM9Y4m23IFJVCQmIrlUmMK",            "transactTime": 1712291372842,            "price": "1.00000000",            "origQty": "1.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "workingTime": 1712291372842,            "selfTradePreventionMode": "NONE"        },        {            "symbol": "LTCBTC",            "orderId": 7,            "orderListId": 1,            "clientOrderId": "6pcQbFIzTXGZQ1e2MkGDq4",            "transactTime": 1712291372842,            "price": "1.00000000",            "origQty": "5.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "PENDING_NEW",            "timeInForce": "IOC",            "type": "STOP_LOSS_LIMIT",            "side": "BUY",            "stopPrice": "6.00000000",            "workingTime": -1,            "selfTradePreventionMode": "NONE"        },        {            "symbol": "LTCBTC",            "orderId": 8,            "orderListId": 1,            "clientOrderId": "r4JMv9cwAYYUwwBZfbussx",            "transactTime": 1712291372842,            "price": "3.00000000",            "origQty": "5.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "PENDING_NEW",            "timeInForce": "GTC",            "type": "LIMIT_MAKER",            "side": "BUY",            "workingTime": -1,            "selfTradePreventionMode": "NONE"        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

#### New Order List - OPO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/orderList/opo
```

Place an [OPO](https://developers.binance.com/docs/binance-spot-api-docs/faqs/opo).

-   OPOs add 2 orders to the EXCHANGE\_MAX\_NUM\_ORDERS filter and MAX\_NUM\_ORDERS filter.

**Weight:** 1

**Unfilled Order Count:** 2

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

listClientOrderId

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent. A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired. `listClientOrderId` is distinct from the `workingClientOrderId` and the `pendingClientOrderId`.

newOrderRespType

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

selfTradePreventionMode

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingType

ENUM

YES

Supported values: `LIMIT`,`LIMIT_MAKER`

workingSide

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the working order. Automatically generated if not sent.

workingPrice

DECIMAL

YES

workingQuantity

DECIMAL

YES

Sets the quantity for the working order.

workingIcebergQty

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC`, or if `workingType` is `LIMIT_MAKER`.

workingTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingStrategyId

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

workingStrategyType

INT

NO

Arbitrary numeric value identifying the working order strategy. Values smaller than 1000000 are reserved and cannot be used.

workingPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

workingPegOffsetType

ENUM

NO

workingPegOffsetValue

INT

NO

pendingType

ENUM

YES

Supported values: [Order Types](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints) Note that `MARKET` orders using `quoteOrderQty` are not supported.

pendingSide

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the pending order. Automatically generated if not sent.

pendingPrice

DECIMAL

NO

pendingStopPrice

DECIMAL

NO

pendingTrailingDelta

DECIMAL

NO

pendingIcebergQty

DECIMAL

NO

This can only be used if `pendingTimeInForce` is `GTC` or if `pendingType` is `LIMIT_MAKER`.

pendingTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingStrategyId

LONG

NO

Arbitrary numeric value identifying the pending order within an order strategy.

pendingStrategyType

INT

NO

Arbitrary numeric value identifying the pending order strategy. Values smaller than 1000000 are reserved and cannot be used.

pendingPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pendingPegOffsetType

ENUM

NO

pendingPegOffsetValue

INT

NO

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`. Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Data Source**: Matching Engine

**Response:**

```
{    "orderListId": 0,    "contingencyType": "OTO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "H94qCqO27P74OEiO4X8HOG",    "transactionTime": 1762998011671,    "symbol": "BTCUSDT",    "orders": [        {            "symbol": "BTCUSDT",            "orderId": 2,            "clientOrderId": "JX6xfdjo0wysiGumfHNmPu"        },        {            "symbol": "BTCUSDT",            "orderId": 3,            "clientOrderId": "2ZJCY0IjOhuYIMLGN8kU8S"        }    ],    "orderReports": [        {            "symbol": "BTCUSDT",            "orderId": 2,            "orderListId": 0,            "clientOrderId": "JX6xfdjo0wysiGumfHNmPu",            "transactTime": 1762998011671,            "price": "102264.00000000",            "origQty": "0.00060000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.00000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "BUY",            "workingTime": 1762998011671,            "selfTradePreventionMode": "NONE"        },        {            "symbol": "BTCUSDT",            "orderId": 3,            "orderListId": 0,            "clientOrderId": "2ZJCY0IjOhuYIMLGN8kU8S",            "transactTime": 1762998011671,            "price": "0.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.00000000",            "cummulativeQuoteQty": "0.00000000",            "status": "PENDING_NEW",            "timeInForce": "GTC",            "type": "MARKET",            "side": "SELL",            "workingTime": -1,            "selfTradePreventionMode": "NONE"        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

#### New Order List - OPOCO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/orderList/opoco
```

Place an [OPOCO](https://developers.binance.com/docs/binance-spot-api-docs/faqs/opo).

**Weight**: 1

**Unfilled Order Count:** 3

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

listClientOrderId

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent. A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired. `listClientOrderId` is distinct from the `workingClientOrderId`, `pendingAboveClientOrderId`, and the `pendingBelowClientOrderId`.

newOrderRespType

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

selfTradePreventionMode

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingType

ENUM

YES

Supported values: `LIMIT`, `LIMIT_MAKER`

workingSide

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the working order. Automatically generated if not sent.

workingPrice

DECIMAL

YES

workingQuantity

DECIMAL

YES

workingIcebergQty

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC` or if `workingType` is `LIMIT_MAKER`.

workingTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

workingStrategyId

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

workingStrategyType

INT

NO

Arbitrary numeric value identifying the working order strategy. Values smaller than 1000000 are reserved and cannot be used.

workingPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

workingPegOffsetType

ENUM

NO

workingPegOffsetValue

INT

NO

pendingSide

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingAboveType

ENUM

YES

Supported values: `STOP_LOSS_LIMIT`, `STOP_LOSS`, `LIMIT_MAKER`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

pendingAboveClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the pending above order. Automatically generated if not sent.

pendingAbovePrice

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

pendingAboveStopPrice

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

pendingAboveTrailingDelta

DECIMAL

NO

See [Trailing Stop FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

pendingAboveIcebergQty

DECIMAL

NO

This can only be used if `pendingAboveTimeInForce` is `GTC` or if `pendingAboveType` is `LIMIT_MAKER`.

pendingAboveTimeInForce

ENUM

NO

pendingAboveStrategyId

LONG

NO

Arbitrary numeric value identifying the pending above order within an order strategy.

pendingAboveStrategyType

INT

NO

Arbitrary numeric value identifying the pending above order strategy. Values smaller than 1000000 are reserved and cannot be used.

pendingAbovePegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pendingAbovePegOffsetType

ENUM

NO

pendingAbovePegOffsetValue

INT

NO

pendingBelowType

ENUM

NO

Supported values: `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`,`TAKE_PROFIT_LIMIT`

pendingBelowClientOrderId

STRING

NO

Arbitrary unique ID among open orders for the pending below order. Automatically generated if not sent.

pendingBelowPrice

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT` to specify limit price

pendingBelowStopPrice

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS`, `STOP_LOSS_LIMIT, TAKE_PROFIT or TAKE_PROFIT_LIMIT`. Either `pendingBelowStopPrice` or `pendingBelowTrailingDelta` or both, must be specified.

pendingBelowTrailingDelta

DECIMAL

NO

pendingBelowIcebergQty

DECIMAL

NO

This can only be used if `pendingBelowTimeInForce` is `GTC`, or if `pendingBelowType` is `LIMIT_MAKER`.

pendingBelowTimeInForce

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

pendingBelowStrategyId

LONG

NO

Arbitrary numeric value identifying the pending below order within an order strategy.

pendingBelowStrategyType

INT

NO

Arbitrary numeric value identifying the pending below order strategy. Values smaller than 1000000 are reserved and cannot be used.

pendingBelowPegPriceType

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

pendingBelowPegOffsetType

ENUM

NO

pendingBelowPegOffsetValue

INT

NO

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`. Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Response**

```
{    "orderListId": 2,    "contingencyType": "OTO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "bcedxMpQG6nFrZUPQyshoL",    "transactionTime": 1763000506354,    "symbol": "BTCUSDT",    "orders": [        {            "symbol": "BTCUSDT",            "orderId": 9,            "clientOrderId": "OLSBhMWaIlLSzZ9Zm7fnKB"        },        {            "symbol": "BTCUSDT",            "orderId": 10,            "clientOrderId": "mfif39yPTHsB3C0FIXznR2"        },        {            "symbol": "BTCUSDT",            "orderId": 11,            "clientOrderId": "yINkaXSJeoi3bU5vWMY8Z8"        }    ],    "orderReports": [        {            "symbol": "BTCUSDT",            "orderId": 9,            "orderListId": 2,            "clientOrderId": "OLSBhMWaIlLSzZ9Zm7fnKB",            "transactTime": 1763000506354,            "price": "102496.00000000",            "origQty": "0.00170000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.00000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "BUY",            "workingTime": 1763000506354,            "selfTradePreventionMode": "NONE"        },        {            "symbol": "BTCUSDT",            "orderId": 10,            "orderListId": 2,            "clientOrderId": "mfif39yPTHsB3C0FIXznR2",            "transactTime": 1763000506354,            "price": "101613.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.00000000",            "cummulativeQuoteQty": "0.00000000",            "status": "PENDING_NEW",            "timeInForce": "GTC",            "type": "STOP_LOSS_LIMIT",            "side": "SELL",            "stopPrice": "10100.00000000",            "workingTime": -1,            "selfTradePreventionMode": "NONE"        },        {            "symbol": "BTCUSDT",            "orderId": 11,            "orderListId": 2,            "clientOrderId": "yINkaXSJeoi3bU5vWMY8Z8",            "transactTime": 1763000506354,            "price": "104261.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.00000000",            "cummulativeQuoteQty": "0.00000000",            "status": "PENDING_NEW",            "timeInForce": "GTC",            "type": "LIMIT_MAKER",            "side": "SELL",            "workingTime": -1,            "selfTradePreventionMode": "NONE"        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints).

#### Cancel Order list (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
DELETE /api/v3/orderList
```

Cancel an entire Order list

**Weight:** 1

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

orderListId

LONG

NO

Either `orderListId` or `listClientOrderId` must be provided

listClientOrderId

STRING

NO

Either `orderListId` or `listClientOrderId` must be provided

newClientOrderId

STRING

NO

Used to uniquely identify this cancel. Automatically generated by default

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Notes:**

-   Canceling an individual order from an order list will cancel the entire order list.
-   If both `orderListId` and `listClientOrderId` parameters are provided, the `orderListId` is searched first, then the `listClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.

**Data Source:** Matching Engine

**Response:**

```
{    "orderListId": 0,    "contingencyType": "OCO",    "listStatusType": "ALL_DONE",    "listOrderStatus": "ALL_DONE",    "listClientOrderId": "C3wyj4WVEktd7u9aVBRXcN",    "transactionTime": 1574040868128,    "symbol": "LTCBTC",    "orders": [        {            "symbol": "LTCBTC",            "orderId": 2,            "clientOrderId": "pO9ufTiFGg3nw2fOdgeOXa"        },        {            "symbol": "LTCBTC",            "orderId": 3,            "clientOrderId": "TXOvglzXuaubXAaENpaRCB"        }    ],    "orderReports": [        {            "symbol": "LTCBTC",            "origClientOrderId": "pO9ufTiFGg3nw2fOdgeOXa",            "orderId": 2,            "orderListId": 0,            "clientOrderId": "unfWT8ig8i0uj6lPuYLez6",            "transactTime": 1688005070874,            "price": "1.00000000",            "origQty": "10.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "CANCELED",            "timeInForce": "GTC",            "type": "STOP_LOSS_LIMIT",            "side": "SELL",            "stopPrice": "1.00000000",            "selfTradePreventionMode": "NONE"        },        {            "symbol": "LTCBTC",            "origClientOrderId": "TXOvglzXuaubXAaENpaRCB",            "orderId": 3,            "orderListId": 0,            "clientOrderId": "unfWT8ig8i0uj6lPuYLez6",            "transactTime": 1688005070874,            "price": "3.00000000",            "origQty": "10.00000000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "CANCELED",            "timeInForce": "GTC",            "type": "LIMIT_MAKER",            "side": "SELL",            "selfTradePreventionMode": "NONE"        }    ]}
```

### SOR[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

#### New order using SOR (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/sor/order
```

Places an order using smart order routing (SOR).

This adds 1 order to the `EXCHANGE_MAX_ORDERS` filter and the `MAX_NUM_ORDERS` filter.

Read [SOR FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sor_faq) to learn more.

**Weight:** 1

**Unfilled Order Count:** 1

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

side

ENUM

YES

type

ENUM

YES

timeInForce

ENUM

NO

quantity

DECIMAL

YES

price

DECIMAL

NO

newClientOrderId

STRING

NO

A unique id among open orders. Automatically generated if not sent.  
Orders with the same `newClientOrderID` can be accepted only when the previous one is filled, otherwise the order will be rejected.

strategyId

LONG

NO

strategyType

INT

NO

The value cannot be less than `1000000`.

icebergQty

DECIMAL

NO

Used with `LIMIT` to create an iceberg order.

newOrderRespType

ENUM

NO

Set the response JSON. `ACK`, `RESULT`, or `FULL`. Default to `FULL`

selfTradePreventionMode

ENUM

NO

The allowed enums is dependent on what is configured on the symbol. The possible supported values are: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums).

recvWindow

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

timestamp

LONG

YES

**Note:** `POST /api/v3/sor/order` only supports `LIMIT` and `MARKET` orders. `quoteOrderQty` is not supported.

**Data Source:** Matching Engine

**Response:**

```
{    "symbol": "BTCUSDT",    "orderId": 2,    "orderListId": -1,    "clientOrderId": "sBI1KM6nNtOfj5tccZSKly",    "transactTime": 1689149087774,    "price": "31000.00000000",    "origQty": "0.50000000",    "executedQty": "0.50000000",    "origQuoteOrderQty": "0.000000",    "cummulativeQuoteQty": "14000.00000000",    "status": "FILLED",    "timeInForce": "GTC",    "type": "LIMIT",    "side": "BUY",    "workingTime": 1689149087774,    "fills": [        {            "matchType": "ONE_PARTY_TRADE_REPORT",            "price": "28000.00000000",            "qty": "0.50000000",            "commission": "0.00000000",            "commissionAsset": "BTC",            "tradeId": -1,            "allocId": 0        }    ],    "workingFloor": "SOR",    "selfTradePreventionMode": "NONE",    "usedSor": true}
```

#### Test new order using SOR (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)

```
POST /api/v3/sor/order/test
```

Test new order creation and signature/recvWindow using smart order routing (SOR). Creates and validates a new order but does not send it into the matching engine.

**Weight:**

Condition

Request Weight

Without `computeCommissionRates`

1

With `computeCommissionRates`

20

**Parameters:**

In addition to all parameters accepted by [`POST /api/v3/sor/order`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints), the following optional parameters are also accepted:

Name

Type

Mandatory

Description

computeCommissionRates

BOOLEAN

NO

Default: `false`

**Data Source:** Memory

**Response:**

Without `computeCommissionRates`

```
{}
```

With `computeCommissionRates`

```
{    "standardCommissionForOrder": {  // Standard commission rates on trades from the order.        "maker": "0.00000112",        "taker": "0.00000114"    },    "taxCommissionForOrder": {       // Tax commission rates for trades from the order        "maker": "0.00000112",        "taker": "0.00000114"    },    "discount": {                    // Discount on standard commissions when paying in BNB.        "enabledForAccount": true,        "enabledForSymbol": true,        "discountAsset": "BNB",        "discount": "0.25000000"     // Standard commission is reduced by this rate when paying commission in BNB.    }}
```

-   [New order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Test new order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Query order (USER\_DATA)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Cancel order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Cancel All Open Orders on a Symbol (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Cancel an Existing Order and Send a New Order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Order Amend Keep Priority (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [Order lists](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
-   [SOR](https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/trading-endpoints)
