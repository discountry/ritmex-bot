---
title: "Trading requests | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests"
fetched_at: "2026-02-26T10:38:12.294Z"
---
### Place new order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "56374a46-3061-486b-a311-99ee972eb648",    "method": "order.place",    "params": {        "symbol": "BTCUSDT",        "side": "SELL",        "type": "LIMIT",        "timeInForce": "GTC",        "price": "23416.10000000",        "quantity": "0.00847000",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "15af09e41c36f3cc61378c2fbe2c33719a03dd5eba8d0f9206fbda44de717c88",        "timestamp": 1660801715431    }}
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

`symbol`

STRING

YES

`side`

ENUM

YES

`BUY` or `SELL`

`type`

ENUM

YES

`timeInForce`

ENUM

NO \*

`price`

DECIMAL

NO \*

`quantity`

DECIMAL

NO \*

`quoteOrderQty`

DECIMAL

NO \*

`newClientOrderId`

STRING

NO

Arbitrary unique ID among open orders. Automatically generated if not sent

`newOrderRespType`

ENUM

NO

Select response format: `ACK`, `RESULT`, `FULL`.

`MARKET` and `LIMIT` orders use `FULL` by default, other order types default to `ACK`.

`stopPrice`

DECIMAL

NO \*

`trailingDelta`

INT

NO \*

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

`icebergQty`

DECIMAL

NO

`strategyId`

LONG

NO

Arbitrary numeric value identifying the order within an order strategy.

`strategyType`

INT

NO

Arbitrary numeric value identifying the order strategy.

Values smaller than `1000000` are reserved and cannot be used.

`selfTradePreventionMode`

ENUM

NO

The allowed enums is dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pegPriceType`

ENUM

NO

`PRIMARY_PEG` or `MARKET_PEG`  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pegOffsetValue`

INT

NO

Price level to peg the price to (max: 100)  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pegOffsetType`

ENUM

NO

Only `PRICE_LEVEL` is supported  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

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

Certain parameters (\*) become mandatory based on the order `type`:

Order `type`

Mandatory parameters

`LIMIT`

-   `timeInForce`
-   `price`
-   `quantity`

`LIMIT_MAKER`

-   `price`
-   `quantity`

`MARKET`

-   `quantity` or `quoteOrderQty`

`STOP_LOSS`

-   `quantity`
-   `stopPrice` or `trailingDelta`

`STOP_LOSS_LIMIT`

-   `timeInForce`
-   `price`
-   `quantity`
-   `stopPrice` or `trailingDelta`

`TAKE_PROFIT`

-   `quantity`
-   `stopPrice` or `trailingDelta`

`TAKE_PROFIT_LIMIT`

-   `timeInForce`
-   `price`
-   `quantity`
-   `stopPrice` or `trailingDelta`

Supported order types:

Order `type`

Description

`LIMIT`

Buy or sell `quantity` at the specified `price` or better.

`LIMIT_MAKER`

`LIMIT` order that will be rejected if it immediately matches and trades as a taker.

This order type is also known as a POST-ONLY order.

`MARKET`

Buy or sell at the best available market price.

-   `MARKET` order with `quantity` parameter specifies the amount of the _base asset_ you want to buy or sell. Actually executed quantity of the quote asset will be determined by available market liquidity.
    
    E.g., a MARKET BUY order on BTCUSDT for `"quantity": "0.1000"` specifies that you want to buy 0.1 BTC at the best available price. If there is not enough BTC at the best price, keep buying at the next best price, until either your order is filled, or you run out of USDT, or market runs out of BTC.
    
-   `MARKET` order with `quoteOrderQty` parameter specifies the amount of the _quote asset_ you want to spend (when buying) or receive (when selling). Actually executed quantity of the base asset will be determined by available market liquidity.
    
    E.g., a MARKET BUY on BTCUSDT for `"quoteOrderQty": "100.00"` specifies that you want to buy as much BTC as you can for 100 USDT at the best available price. Similarly, a SELL order will sell as much available BTC as needed for you to receive 100 USDT (before commission).
    

`STOP_LOSS`

Execute a `MARKET` order for given `quantity` when specified conditions are met.

I.e., when `stopPrice` is reached, or when `trailingDelta` is activated.

`STOP_LOSS_LIMIT`

Place a `LIMIT` order with given parameters when specified conditions are met.

`TAKE_PROFIT`

Like `STOP_LOSS` but activates when market price moves in the favorable direction.

`TAKE_PROFIT_LIMIT`

Like `STOP_LOSS_LIMIT` but activates when market price moves in the favorable direction.

Notes on using parameters for Pegged Orders:

-   These parameters are allowed for `LIMIT`, `LIMIT_MAKER`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT_LIMIT` orders.
-   If `pegPriceType` is specified, `price` becomes optional. Otherwise, it is still mandatory.
-   `pegPriceType=PRIMARY_PEG` means the primary peg, that is the best price on the same side of the order book as your order.
-   `pegPriceType=MARKET_PEG` means the market peg, that is the best price on the opposite side of the order book from your order.
-   Use `pegOffsetType` and `pegOffsetValue` to request a price level other than the best one. These parameters must be specified together.

Available `timeInForce` options, setting how long the order should be active before expiration:

TIF

Description

`GTC`

**Good 'til Canceled** – the order will remain on the book until you cancel it, or the order is completely filled.

`IOC`

**Immediate or Cancel** – the order will be filled for as much as possible, the unfilled quantity immediately expires.

`FOK`

**Fill or Kill** – the order will expire unless it cannot be immediately filled for the entire quantity.

Notes:

-   `newClientOrderId` specifies `clientOrderId` value for the order.
    
    A new order with the same `clientOrderId` is accepted only when the previous one is filled or expired.
    
-   Any `LIMIT` or `LIMIT_MAKER` order can be made into an iceberg order by specifying the `icebergQty`.
    
    An order with an `icebergQty` must have `timeInForce` set to `GTC`.
    
-   Trigger order price rules for `STOP_LOSS`/`TAKE_PROFIT` orders:
    
    -   `stopPrice` must be above market price: `STOP_LOSS BUY`, `TAKE_PROFIT SELL`
    -   `stopPrice` must be below market price: `STOP_LOSS SELL`, `TAKE_PROFIT BUY`
-   `MARKET` orders using `quoteOrderQty` follow [`LOT_SIZE`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/filters) filter rules.
    
    The order will execute a quantity that has notional value as close as possible to requested `quoteOrderQty`.
    

**Data Source:** Matching Engine

**Response:**

Response format is selected by using the `newOrderRespType` parameter.

`ACK` response type:

```
{    "id": "56374a46-3061-486b-a311-99ee972eb648",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "orderId": 12569099453,        "orderListId": -1, // always -1 for singular orders        "clientOrderId": "4d96324ff9d44481926157ec08158a40",        "transactTime": 1660801715639    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

`RESULT` response type:

```
{    "id": "56374a46-3061-486b-a311-99ee972eb648",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "orderId": 12569099453,        "orderListId": -1, // always -1 for singular orders        "clientOrderId": "4d96324ff9d44481926157ec08158a40",        "transactTime": 1660801715639,        "price": "23416.10000000",        "origQty": "0.00847000",        "executedQty": "0.00000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.00000000",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "SELL",        "workingTime": 1660801715639,        "selfTradePreventionMode": "NONE"    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

`FULL` response type:

```
{    "id": "56374a46-3061-486b-a311-99ee972eb648",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "orderId": 12569099453,        "orderListId": -1,        "clientOrderId": "4d96324ff9d44481926157ec08158a40",        "transactTime": 1660801715793,        "price": "23416.10000000",        "origQty": "0.00847000",        "executedQty": "0.00847000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "198.33521500",        "status": "FILLED",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "SELL",        "workingTime": 1660801715793,        // FULL response is identical to RESULT response, with the same optional fields        // based on the order type and parameters. FULL response additionally includes        // the list of trades which immediately filled the order.        "fills": [            {                "price": "23416.10000000",                "qty": "0.00635000",                "commission": "0.000000",                "commissionAsset": "BNB",                "tradeId": 1650422481            },            {                "price": "23416.50000000",                "qty": "0.00212000",                "commission": "0.000000",                "commissionAsset": "BNB",                "tradeId": 1650422482            }        ]    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

**Conditional fields in Order Responses**

There are fields in the order responses (e.g. order placement, order query, order cancellation) that appear only if certain conditions are met.

These fields can apply to Order lists.

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

### Test new order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "6ffebe91-01d9-43ac-be99-57cf062e0e30",    "method": "order.test",    "params": {        "symbol": "BTCUSDT",        "side": "SELL",        "type": "LIMIT",        "timeInForce": "GTC",        "price": "23416.10000000",        "quantity": "0.00847000",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "15af09e41c36f3cc61378c2fbe2c33719a03dd5eba8d0f9206fbda44de717c88",        "timestamp": 1660801715431    }}
```

Test order placement.

Validates new order parameters and verifies your signature but does not send the order into the matching engine.

**Weight:**

Condition

Request Weight

Without `computeCommissionRates`

1

With `computeCommissionRates`

20

**Parameters:**

In addition to all parameters accepted by [`order.place`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests), the following optional parameters are also accepted:

Name

Type

Mandatory

Description

`computeCommissionRates`

BOOLEAN

NO

Default: `false`  
See [Commissions FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/commission_faq) to learn more.

**Data Source:** Memory

**Response:**

Without `computeCommissionRates`:

```
{    "id": "6ffebe91-01d9-43ac-be99-57cf062e0e30",    "status": 200,    "result": {},    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

With `computeCommissionRates`:

```
{    "id": "6ffebe91-01d9-43ac-be99-57cf062e0e30",    "status": 200,    "result": {        "standardCommissionForOrder": {  // Standard commission rates on trades from the order.            "maker": "0.00000112",            "taker": "0.00000114"        },        "specialCommissionForOrder": {   // Special commission rates on trades from the order.            "maker": "0.05000000",            "taker": "0.06000000"        },        "taxCommissionForOrder": {       // Tax commission rates for trades from the order            "maker": "0.00000112",            "taker": "0.00000114"        },        "discount": {                    // Discount on standard commissions when paying in BNB.            "enabledForAccount": true,            "enabledForSymbol": true,            "discountAsset": "BNB",            "discount": "0.25000000"     // Standard commission is reduced by this rate when paying in BNB.        }    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

### Cancel order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "5633b6a2-90a9-4192-83e7-925c90b6a2fd",    "method": "order.cancel",    "params": {        "symbol": "BTCUSDT",        "origClientOrderId": "4d96324ff9d44481926157",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "33d5b721f278ae17a52f004a82a6f68a70c68e7dd6776ed0be77a455ab855282",        "timestamp": 1660801715830    }}
```

Cancel an active order.

**Weight:** 1

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

Cancel order by `orderId`

`origClientOrderId`

STRING

Cancel order by `clientOrderId`

`newClientOrderId`

STRING

NO

New ID for the canceled order. Automatically generated if not sent

`cancelRestrictions`

ENUM

NO

Supported values:  
`ONLY_NEW` - Cancel will succeed if the order status is `NEW`.  
`ONLY_PARTIALLY_FILLED` - Cancel will succeed if order status is `PARTIALLY_FILLED`.

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

-   If both `orderId` and `origClientOrderId` parameters are provided, the `orderId` is searched first, then the `origClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.
    
-   `newClientOrderId` will replace `clientOrderId` of the canceled order, freeing it up for new orders.
    
-   If you cancel an order that is a part of an order list, the entire order list is canceled.
    
-   The performance for canceling an order (single cancel or as part of a cancel-replace) is always better when only `orderId` is sent. Sending `origClientOrderId` or both `orderId` + `origClientOrderId` will be slower.
    

**Data Source:** Matching Engine

**Response:**

When an individual order is canceled:

```
{    "id": "5633b6a2-90a9-4192-83e7-925c90b6a2fd",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "origClientOrderId": "4d96324ff9d44481926157",     // clientOrderId that was canceled        "orderId": 12569099453,        "orderListId": -1,                                 // set only for legs of an order list        "clientOrderId": "91fe37ce9e69c90d6358c0",         // newClientOrderId from request        "transactTime": 1684804350068,        "price": "23416.10000000",        "origQty": "0.00847000",        "executedQty": "0.00001000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.23416100",        "status": "CANCELED",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "SELL",        "stopPrice": "0.00000000",                         // present only if stopPrice set for the order        "trailingDelta": 0,                                // present only if trailingDelta set for the order        "icebergQty": "0.00000000",                        // present only if icebergQty set for the order        "strategyId": 37463720,                            // present only if strategyId set for the order        "strategyType": 1000000,                           // present only if strategyType set for the order        "selfTradePreventionMode": "NONE"    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

When an order list is canceled:

```
{    "id": "16eaf097-bbec-44b9-96ff-e97e6e875870",    "status": 200,    "result": {        "orderListId": 19431,        "contingencyType": "OCO",        "listStatusType": "ALL_DONE",        "listOrderStatus": "ALL_DONE",        "listClientOrderId": "iuVNVJYYrByz6C4yGOPPK0",        "transactionTime": 1660803702431,        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 12569099453,                "clientOrderId": "bX5wROblo6YeDwa9iTLeyY"            },            {                "symbol": "BTCUSDT",                "orderId": 12569099454,                "clientOrderId": "Tnu2IP0J5Y4mxw3IATBfmW"            }        ],        // order list order's status format is the same as for individual orders.        "orderReports": [            {                "symbol": "BTCUSDT",                "origClientOrderId": "bX5wROblo6YeDwa9iTLeyY",                "orderId": 12569099453,                "orderListId": 19431,                "clientOrderId": "OFFXQtxVFZ6Nbcg4PgE2DA",                "transactTime": 1684804350068,                "price": "23450.50000000",                "origQty": "0.00850000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "STOP_LOSS_LIMIT",                "side": "BUY",                "stopPrice": "23430.00000000",                "selfTradePreventionMode": "NONE"            },            {                "symbol": "BTCUSDT",                "origClientOrderId": "Tnu2IP0J5Y4mxw3IATBfmW",                "orderId": 12569099454,                "orderListId": 19431,                "clientOrderId": "OFFXQtxVFZ6Nbcg4PgE2DA",                "transactTime": 1684804350068,                "price": "23400.00000000",                "origQty": "0.00850000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "LIMIT_MAKER",                "side": "BUY",                "selfTradePreventionMode": "NONE"            }        ]    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

**Regarding `cancelRestrictions`**

-   If the `cancelRestrictions` value is not any of the supported values, the error will be:

```
{    "code": -1145,    "msg": "Invalid cancelRestrictions"}
```

-   If the order did not pass the conditions for `cancelRestrictions`, the error will be:

```
{    "code": -2011,    "msg": "Order was not canceled due to cancel restrictions."}
```

### Cancel and replace order (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "99de1036-b5e2-4e0f-9b5c-13d751c93a1a",    "method": "order.cancelReplace",    "params": {        "symbol": "BTCUSDT",        "cancelReplaceMode": "ALLOW_FAILURE",        "cancelOrigClientOrderId": "4d96324ff9d44481926157",        "side": "SELL",        "type": "LIMIT",        "timeInForce": "GTC",        "price": "23416.10000000",        "quantity": "0.00847000",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "7028fdc187868754d25e42c37ccfa5ba2bab1d180ad55d4c3a7e2de643943dc5",        "timestamp": 1660813156900    }}
```

Cancel an existing order and immediately place a new order instead of the canceled one.

A new order that was not attempted (i.e. when `newOrderResult: NOT_ATTEMPTED`), will still increase the unfilled order count by 1.

**Weight:** 1

**Unfilled Order Count:** 1

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`cancelReplaceMode`

ENUM

YES

`cancelOrderId`

LONG

YES

Cancel order by `orderId`

`cancelOrigClientOrderId`

STRING

Cancel order by `clientOrderId`

`cancelNewClientOrderId`

STRING

NO

New ID for the canceled order. Automatically generated if not sent

`side`

ENUM

YES

`BUY` or `SELL`

`type`

ENUM

YES

`timeInForce`

ENUM

NO \*

`price`

DECIMAL

NO \*

`quantity`

DECIMAL

NO \*

`quoteOrderQty`

DECIMAL

NO \*

`newClientOrderId`

STRING

NO

Arbitrary unique ID among open orders. Automatically generated if not sent

`newOrderRespType`

ENUM

NO

Select response format: `ACK`, `RESULT`, `FULL`.

`MARKET` and `LIMIT` orders produce `FULL` response by default, other order types default to `ACK`.

`stopPrice`

DECIMAL

NO \*

`trailingDelta`

DECIMAL

NO \*

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

`icebergQty`

DECIMAL

NO

`strategyId`

LONG

NO

Arbitrary numeric value identifying the order within an order strategy.

`strategyType`

INT

NO

Arbitrary numeric value identifying the order strategy.

Values smaller than 1000000 are reserved and cannot be used.

`selfTradePreventionMode`

ENUM

NO

The allowed enums is dependent on what is configured on the symbol.

Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums.md).

`cancelRestrictions`

ENUM

NO

Supported values:  
`ONLY_NEW` - Cancel will succeed if the order status is `NEW`.  
`ONLY_PARTIALLY_FILLED` - Cancel will succeed if order status is `PARTIALLY_FILLED`. For more information please refer to [Regarding `cancelRestrictions`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

`apiKey`

STRING

YES

`orderRateLimitExceededMode`

ENUM

NO

Supported values:  
`DO_NOTHING` (default)- will only attempt to cancel the order if account has not exceeded the unfilled order rate limit  
`CANCEL_ONLY` - will always cancel the order.

`pegPriceType`

ENUM

NO

`PRIMARY_PEG` or `MARKET_PEG`.  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)"

`pegOffsetValue`

INT

NO

Price level to peg the price to (max: 100)  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pegOffsetType`

ENUM

NO

Only `PRICE_LEVEL` is supported  
See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

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

Similar to the [`order.place`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests) request, additional mandatory parameters (\*) are determined by the new order [`type`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

Available `cancelReplaceMode` options:

-   `STOP_ON_FAILURE` – if cancellation request fails, new order placement will not be attempted.
-   `ALLOW_FAILURE` – new order placement will be attempted even if the cancel request fails.

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

`200`

❌ `FAILURE`

❌ `FAILURE`

`400`

❌ `FAILURE`

✅ `SUCCESS`

N/A

✅ `SUCCESS`

❌ `FAILURE`

`409`

Notes:

-   If both `cancelOrderId` and `cancelOrigClientOrderId` parameters are provided, the `cancelOrderId` is searched first, then the `cancelOrigClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.
    
-   `cancelNewClientOrderId` will replace `clientOrderId` of the canceled order, freeing it up for new orders.
    
-   `newClientOrderId` specifies `clientOrderId` value for the placed order.
    
    A new order with the same `clientOrderId` is accepted only when the previous one is filled or expired.
    
    The new order can reuse old `clientOrderId` of the canceled order.
    
-   This cancel-replace operation is **not transactional**.
    
    If one operation succeeds but the other one fails, the successful operation is still executed.
    
    For example, in `STOP_ON_FAILURE` mode, if the new order placement fails, the old order is still canceled.
    
-   Filters and order count limits are evaluated before cancellation and order placement occurs.
    
-   If new order placement is not attempted, your order count is still incremented.
    
-   Like [`order.cancel`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests), if you cancel an individual order from an order list, the entire order list is canceled.
    
-   The performance for canceling an order (single cancel or as part of a cancel-replace) is always better when only `orderId` is sent. Sending `origClientOrderId` or both `orderId` + `origClientOrderId` will be slower.
    

**Data Source:** Matching Engine

**Response:**

If both cancel and placement succeed, you get the following response with `"status": 200`:

```
{    "id": "99de1036-b5e2-4e0f-9b5c-13d751c93a1a",    "status": 200,    "result": {        "cancelResult": "SUCCESS",        "newOrderResult": "SUCCESS",        // Format is identical to "order.cancel" format.        // Some fields are optional and are included only for orders that set them.        "cancelResponse": {            "symbol": "BTCUSDT",            "origClientOrderId": "4d96324ff9d44481926157",     // cancelOrigClientOrderId from request            "orderId": 125690984230,            "orderListId": -1,            "clientOrderId": "91fe37ce9e69c90d6358c0",         // cancelNewClientOrderId from request            "transactTime": 1684804350068,            "price": "23450.00000000",            "origQty": "0.00847000",            "executedQty": "0.00001000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.23450000",            "status": "CANCELED",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "selfTradePreventionMode": "NONE"        },        // Format is identical to "order.place" format, affected by "newOrderRespType".        // Some fields are optional and are included only for orders that set them.        "newOrderResponse": {            "symbol": "BTCUSDT",            "orderId": 12569099453,            "orderListId": -1,            "clientOrderId": "bX5wROblo6YeDwa9iTLeyY",         // newClientOrderId from request            "transactTime": 1660813156959,            "price": "23416.10000000",            "origQty": "0.00847000",            "executedQty": "0.00000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "selfTradePreventionMode": "NONE"        }    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

In `STOP_ON_FAILURE` mode, failed order cancellation prevents new order from being placed and returns the following response with `"status": 400`:

```
{    "id": "27e1bf9f-0539-4fb0-85c6-06183d36f66c",    "status": 400,    "error": {        "code": -2022,        "msg": "Order cancel-replace failed.",        "data": {            "cancelResult": "FAILURE",            "newOrderResult": "NOT_ATTEMPTED",            "cancelResponse": {                "code": -2011,                "msg": "Unknown order sent."            },            "newOrderResponse": null        }    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

If cancel-replace mode allows failure and one of the operations fails, you get a response with `"status": 409`, and the `"data"` field detailing which operation succeeded, which failed, and why:

```
{    "id": "b220edfe-f3c4-4a3a-9d13-b35473783a25",    "status": 409,    "error": {        "code": -2021,        "msg": "Order cancel-replace partially failed.",        "data": {            "cancelResult": "SUCCESS",            "newOrderResult": "FAILURE",            "cancelResponse": {                "symbol": "BTCUSDT",                "origClientOrderId": "4d96324ff9d44481926157",                "orderId": 125690984230,                "orderListId": -1,                "clientOrderId": "91fe37ce9e69c90d6358c0",                "transactTime": 1684804350068,                "price": "23450.00000000",                "origQty": "0.00847000",                "executedQty": "0.00001000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.23450000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "SELL",                "selfTradePreventionMode": "NONE"            },            "newOrderResponse": {                "code": -2010,                "msg": "Order would immediately match and take."            }        }    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

```
{    "id": "ce641763-ff74-41ac-b9f7-db7cbe5e93b1",    "status": 409,    "error": {        "code": -2021,        "msg": "Order cancel-replace partially failed.",        "data": {            "cancelResult": "FAILURE",            "newOrderResult": "SUCCESS",            "cancelResponse": {                "code": -2011,                "msg": "Unknown order sent."            },            "newOrderResponse": {                "symbol": "BTCUSDT",                "orderId": 12569099453,                "orderListId": -1,                "clientOrderId": "bX5wROblo6YeDwa9iTLeyY",                "transactTime": 1660813156959,                "price": "23416.10000000",                "origQty": "0.00847000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "SELL",                "workingTime": 1669693344508,                "fills": [],                "selfTradePreventionMode": "NONE"            }        }    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

If both operations fail, response will have `"status": 400`:

```
{    "id": "3b3ac45c-1002-4c7d-88e8-630c408ecd87",    "status": 400,    "error": {        "code": -2022,        "msg": "Order cancel-replace failed.",        "data": {            "cancelResult": "FAILURE",            "newOrderResult": "FAILURE",            "cancelResponse": {                "code": -2011,                "msg": "Unknown order sent."            },            "newOrderResponse": {                "code": -2010,                "msg": "Order would immediately match and take."            }        }    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

If `orderRateLimitExceededMode` is `DO_NOTHING` regardless of `cancelReplaceMode`, and you have exceeded your unfilled order count, you will get status `429` with the following error:

```
{    "id": "3b3ac45c-1002-4c7d-88e8-630c408ecd87",    "status": 429,    "error": {        "code": -1015,        "msg": "Too many new orders; current limit is 50 orders per 10 SECOND."    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 50        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 50        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

If `orderRateLimitExceededMode` is `CANCEL_ONLY` regardless of `cancelReplaceMode`, and you have exceeded your unfilled order count, you will get status `409` with the following error:

```
{    "id": "3b3ac45c-1002-4c7d-88e8-630c408ecd87",    "status": 409,    "error": {        "code": -2021,        "msg": "Order cancel-replace partially failed.",        "data": {            "cancelResult": "SUCCESS",            "newOrderResult": "FAILURE",            "cancelResponse": {                "symbol": "LTCBNB",                "origClientOrderId": "GKt5zzfOxRDSQLveDYCTkc",                "orderId": 64,                "orderListId": -1,                "clientOrderId": "loehOJF3FjoreUBDmv739R",                "transactTime": 1715779007228,                "price": "1.00",                "origQty": "10.00000000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "SELL",                "selfTradePreventionMode": "NONE"            },            "newOrderResponse": {                "code": -1015,                "msg": "Too many new orders; current limit is 50 orders per 10 SECOND."            }        }    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 50        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 50        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

### Order Amend Keep Priority (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "56374a46-3061-486b-a311-89ee972eb648",    "method": "order.amend.keepPriority",    "params": {        "newQty": "5",        "origClientOrderId": "my_test_order1",        "recvWindow": 5000,        "symbol": "BTCUSDT",        "timestamp": 1741922620419,        "apiKey": "Rl1KOMDCpSg6xviMYOkNk9ENUB5QOTnufXukVe0Ijd40yduAlpHn78at3rJyJN4F",        "signature": "fa49c0c4ebc331c6ebd3fcb20deb387f60081ea858eebe6e35aa6fcdf2a82e08"    }}
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

**Response:**

Response for a single order:

```
{    "id": "56374a46-3061-486b-a311-89ee972eb648",    "status": 200,    "result": {        "transactTime": 1741923284382,        "executionId": 16,        "amendedOrder": {            "symbol": "BTCUSDT",            "orderId": 12,            "orderListId": -1,            "origClientOrderId": "my_test_order1",            "clientOrderId": "4zR9HFcEq8gM1tWUqPEUHc",            "price": "5.00000000",            "qty": "5.00000000",            "executedQty": "0.00000000",            "preventedQty": "0.00000000",            "quoteOrderQty": "0.00000000",            "cumulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "BUY",            "workingTime": 1741923284364,            "selfTradePreventionMode": "NONE"        }    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

Response for an order which is part of an Order list:

```
{    "id": "56374b46-3061-486b-a311-89ee972eb648",    "status": 200,    "result": {        "transactTime": 1741924229819,        "executionId": 60,        "amendedOrder": {            "symbol": "BTUCSDT",            "orderId": 23,            "orderListId": 4,            "origClientOrderId": "my_pending_order",            "clientOrderId": "xbxXh5SSwaHS7oUEOCI88B",            "price": "1.00000000",            "qty": "5.00000000",            "executedQty": "0.00000000",            "preventedQty": "0.00000000",            "quoteOrderQty": "0.00000000",            "cumulativeQuoteQty": "0.00000000",            "status": "NEW",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "BUY",            "workingTime": 1741924204920,            "selfTradePreventionMode": "NONE"        },        "listStatus": {            "orderListId": 4,            "contingencyType": "OTO",            "listOrderStatus": "EXECUTING",            "listClientOrderId": "8nOGLLawudj1QoOiwbroRH",            "symbol": "BTCUSDT",            "orders": [                {                    "symbol": "BTCUSDT",                    "orderId": 22,                    "clientOrderId": "g04EWsjaackzedjC9wRkWD"                },                {                    "symbol": "BTCUSDT",                    "orderId": 23,                    "clientOrderId": "xbxXh5SSwaHS7oUEOCI88B"                }            ]        }    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

**Note:** The payloads above do not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

### Cancel open orders (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "778f938f-9041-4b88-9914-efbf64eeacc8",    "method": "openOrders.cancelAll",    "params": {        "symbol": "BTCUSDT",        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "773f01b6e3c2c9e0c1d217bc043ce383c1ddd6f0e25f8d6070f2b66a6ceaf3a5",        "timestamp": 1660805557200    }}
```

Cancel all open orders on a symbol. This includes orders that are part of an order list.

**Weight:** 1

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

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

**Data Source:** Matching Engine

**Response:**

Cancellation reports for orders and order lists have the same format as in [`order.cancel`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

```
{    "id": "778f938f-9041-4b88-9914-efbf64eeacc8",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "origClientOrderId": "4d96324ff9d44481926157",            "orderId": 12569099453,            "orderListId": -1,            "clientOrderId": "91fe37ce9e69c90d6358c0",            "transactTime": 1684804350068,            "price": "23416.10000000",            "origQty": "0.00847000",            "executedQty": "0.00001000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "0.23416100",            "status": "CANCELED",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "SELL",            "stopPrice": "0.00000000",            "trailingDelta": 0,            "trailingTime": -1,            "icebergQty": "0.00000000",            "strategyId": 37463720,            "strategyType": 1000000,            "selfTradePreventionMode": "NONE"        },        {            "orderListId": 19431,            "contingencyType": "OCO",            "listStatusType": "ALL_DONE",            "listOrderStatus": "ALL_DONE",            "listClientOrderId": "iuVNVJYYrByz6C4yGOPPK0",            "transactionTime": 1660803702431,            "symbol": "BTCUSDT",            "orders": [                {                    "symbol": "BTCUSDT",                    "orderId": 12569099453,                    "clientOrderId": "bX5wROblo6YeDwa9iTLeyY"                },                {                    "symbol": "BTCUSDT",                    "orderId": 12569099454,                    "clientOrderId": "Tnu2IP0J5Y4mxw3IATBfmW"                }            ],            "orderReports": [                {                    "symbol": "BTCUSDT",                    "origClientOrderId": "bX5wROblo6YeDwa9iTLeyY",                    "orderId": 12569099453,                    "orderListId": 19431,                    "clientOrderId": "OFFXQtxVFZ6Nbcg4PgE2DA",                    "transactTime": 1684804350068,                    "price": "23450.50000000",                    "origQty": "0.00850000",                    "executedQty": "0.00000000",                    "origQuoteOrderQty": "0.000000",                    "cummulativeQuoteQty": "0.00000000",                    "status": "CANCELED",                    "timeInForce": "GTC",                    "type": "STOP_LOSS_LIMIT",                    "side": "BUY",                    "stopPrice": "23430.00000000",                    "selfTradePreventionMode": "NONE"                },                {                    "symbol": "BTCUSDT",                    "origClientOrderId": "Tnu2IP0J5Y4mxw3IATBfmW",                    "orderId": 12569099454,                    "orderListId": 19431,                    "clientOrderId": "OFFXQtxVFZ6Nbcg4PgE2DA",                    "transactTime": 1684804350068,                    "price": "23400.00000000",                    "origQty": "0.00850000",                    "executedQty": "0.00000000",                    "origQuoteOrderQty": "0.000000",                    "cummulativeQuoteQty": "0.00000000",                    "status": "CANCELED",                    "timeInForce": "GTC",                    "type": "LIMIT_MAKER",                    "side": "BUY",                    "selfTradePreventionMode": "NONE"                }            ]        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

### Order lists[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

#### Place new Order list - OCO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "56374a46-3261-486b-a211-99ed972eb648",    "method": "orderList.place.oco",    "params": {        "symbol": "LTCBNB",        "side": "BUY",        "quantity": 1,        "timestamp": 1711062760647,        "aboveType": "STOP_LOSS_LIMIT",        "abovePrice": "1.5",        "aboveStopPrice": "1.50000001",        "aboveTimeInForce": "GTC",        "belowType": "LIMIT_MAKER",        "belowPrice": "1.49999999",        "apiKey": "duwNf97YPLqhFIk7kZF0dDdGYVAXStA7BeEz0fIT9RAhUbixJtyS6kJ3hhzJsRXC",        "signature": "64614cfd8dd38260d4fd86d3c455dbf4b9d1c8a8170ea54f700592a986c30ddb"    }}
```

Send in an one-cancels-the-other (OCO) pair, where activation of one order immediately cancels the other.

-   An OCO has 2 orders called the **above order** and **below order**.
-   One of the orders must be a `LIMIT_MAKER/TAKE_PROFIT/TAKE_PROFIT_LIMIT` order and the other must be `STOP_LOSS` or `STOP_LOSS_LIMIT` order.
-   Price restrictions:
    -   If the OCO is on the `SELL` side:
        -   `LIMIT_MAKER/TAKE_PROFIT_LIMIT` `price` > Last Traded Price > `STOP_LOSS/STOP_LOSS_LIMIT` `stopPrice`
        -   `TAKE_PROFIT stopPrice` > Last Traded Price > `STOP_LOSS/STOP_LOSS_LIMIT stopPrice`
    -   If the OCO is on the `BUY` side:
        -   `LIMIT_MAKER` `price` < Last Traded Price < `STOP_LOSS/STOP_LOSS_LIMIT` `stopPrice`
        -   `TAKE_PROFIT stopPrice >` Last Traded Price `> STOP_LOSS/STOP_LOSS_LIMIT stopPrice`
-   OCOs add **2 orders** to the `EXCHANGE_MAX_ORDERS` filter and `MAX_NUM_ORDERS` filter.

**Weight:** 1

**Unfilled Order Count:** 2

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`listClientOrderId`

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent.  
A new order list with the same `listClientOrderId` is accepted only when the previous one is filled or completely expired.  
`listClientOrderId` is distinct from the `aboveClientOrderId` and the `belowCLientOrderId`.

`side`

ENUM

YES

`BUY` or `SELL`

`quantity`

DECIMAL

YES

Quantity for both orders of the order list.

`aboveType`

ENUM

YES

Supported values: `STOP_LOSS_LIMIT`, `STOP_LOSS`, `LIMIT_MAKER`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

`aboveClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the above order. Automatically generated if not sent

`aboveIcebergQty`

LONG

NO

Note that this can only be used if `aboveTimeInForce` is `GTC`.

`abovePrice`

DECIMAL

NO

Can be used if `aboveType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

`aboveStopPrice`

DECIMAL

NO

Can be used if `aboveType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`.  
Either `aboveStopPrice` or `aboveTrailingDelta` or both, must be specified.

`aboveTrailingDelta`

LONG

NO

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/..faqs/trailing-stop-faq.md).

`aboveTimeInForce`

ENUM

NO

Required if `aboveType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT`.

`aboveStrategyId`

LONG

NO

Arbitrary numeric value identifying the above order within an order strategy.

`aboveStrategyType`

INT

NO

Arbitrary numeric value identifying the above order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`abovePegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`abovePegOffsetType`

ENUM

NO

`abovePegOffsetValue`

INT

NO

`belowType`

ENUM

YES

Supported values: `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`,`TAKE_PROFIT_LIMIT`

`belowClientOrderId`

STRING

NO

`belowIcebergQty`

LONG

NO

Note that this can only be used if `belowTimeInForce` is `GTC`.

`belowPrice`

DECIMAL

NO

Can be used if `belowType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

`belowStopPrice`

DECIMAL

NO

Can be used if `belowType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT` or `TAKE_PROFIT_LIMIT`.  
Either `belowStopPrice` or `belowTrailingDelta` or both, must be specified.

`belowTrailingDelta`

LONG

NO

See [Trailing Stop order FAQ](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/..faqs/trailing-stop-faq.md).

`belowTimeInForce`

ENUM

NO

Required if `belowType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT`

`belowStrategyId`

LONG

NO

Arbitrary numeric value identifying the below order within an order strategy.

`belowStrategyType`

INT

NO

Arbitrary numeric value identifying the below order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`belowPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`belowPegOffsetType`

ENUM

NO

`belowPegOffsetValue`

INT

NO

`newOrderRespType`

ENUM

NO

Select response format: `ACK`, `RESULT`, `FULL`

`selfTradePreventionMode`

ENUM

NO

The allowed enums is dependent on what is configured on the symbol. The possible supported values are: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums).

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`timestamp`

LONG

YES

`signature`

STRING

YES

**Data Source:** Matching Engine

**Response:**

Response format for `orderReports` is selected using the `newOrderRespType` parameter. The following example is for `RESULT` response type. See [`order.place`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests) for more examples.

```
{    "id": "56374a46-3261-486b-a211-99ed972eb648",    "status": 200,    "result": {        "orderListId": 2,        "contingencyType": "OCO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "cKPMnDCbcLQILtDYM4f4fX",        "transactionTime": 1711062760648,        "symbol": "LTCBNB",        "orders": [            {                "symbol": "LTCBNB",                "orderId": 2,                "clientOrderId": "0m6I4wfxvTUrOBSMUl0OPU"            },            {                "symbol": "LTCBNB",                "orderId": 3,                "clientOrderId": "Z2IMlR79XNY5LU0tOxrWyW"            }        ],        "orderReports": [            {                "symbol": "LTCBNB",                "orderId": 2,                "orderListId": 2,                "clientOrderId": "0m6I4wfxvTUrOBSMUl0OPU",                "transactTime": 1711062760648,                "price": "1.50000000",                "origQty": "1.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "STOP_LOSS_LIMIT",                "side": "BUY",                "stopPrice": "1.50000001",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "LTCBNB",                "orderId": 3,                "orderListId": 2,                "clientOrderId": "Z2IMlR79XNY5LU0tOxrWyW",                "transactTime": 1711062760648,                "price": "1.49999999",                "origQty": "1.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "LIMIT_MAKER",                "side": "BUY",                "workingTime": 1711062760648,                "selfTradePreventionMode": "NONE"            }        ]    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 2        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 2        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

#### Place new Order list - OTO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "1712544395950",    "method": "orderList.place.oto",    "params": {        "signature": "3e1e5ac8690b0caf9a2afd5c5de881ceba69939cc9d817daead5386bf65d0cbb",        "apiKey": "Rf07JlnL9PHVxjs27O5CvKNyOsV4qJ5gXdrRfpvlOdvMZbGZbPO5Ce2nIwfRP0iA",        "pendingQuantity": 1,        "pendingSide": "BUY",        "pendingType": "MARKET",        "symbol": "LTCBNB",        "recvWindow": "5000",        "timestamp": "1712544395951",        "workingPrice": 1,        "workingQuantity": 1,        "workingSide": "SELL",        "workingTimeInForce": "GTC",        "workingType": "LIMIT"    }}
```

Places an OTO.

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

`symbol`

STRING

YES

`listClientOrderId`

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent.  
A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired.  
`listClientOrderId` is distinct from the `workingClientOrderId` and the `pendingClientOrderId`.

`newOrderRespType`

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`selfTradePreventionMode`

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingType`

ENUM

YES

Supported values: `LIMIT`,`LIMIT_MAKER`

`workingSide`

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the working order.  
Automatically generated if not sent.

`workingPrice`

DECIMAL

YES

`workingQuantity`

DECIMAL

YES

Sets the quantity for the working order.

`workingIcebergQty`

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC`, or if `workingType` is `LIMIT_MAKER`.

`workingTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingStrategyId`

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

`workingStrategyType`

INT

NO

Arbitrary numeric value identifying the working order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`workingPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`workingPegOffsetType`

ENUM

NO

`workingPegOffsetValue`

INT

NO

`pendingType`

ENUM

YES

Supported values: [Order types](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).  
Note that `MARKET` orders using `quoteOrderQty` are not supported.

`pendingSide`

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the pending order.  
Automatically generated if not sent.

`pendingPrice`

DECIMAL

NO

`pendingStopPrice`

DECIMAL

NO

`pendingTrailingDelta`

DECIMAL

NO

`pendingQuantity`

DECIMAL

YES

Sets the quantity for the pending order.

`pendingIcebergQty`

DECIMAL

NO

This can only be used if `pendingTimeInForce` is `GTC`, or if `pendingType` is `LIMIT_MAKER`.

`pendingTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingStrategyId`

LONG

NO

Arbitrary numeric value identifying the pending order within an order strategy.

`pendingStrategyType`

INT

NO

Arbitrary numeric value identifying the pending order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`pendingPegOffsetType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pendingPegPriceType`

ENUM

NO

`pendingPegOffsetValue`

INT

NO

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`timestamp`

LONG

YES

`signature`

STRING

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

`pendingType` =`STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT`

`pendingPrice`, `pendingStopPrice` and/or `pendingTrailingDelta`, `pendingTimeInForce`

**Data Source:**

Matching Engine

**Response:**

```
{    "id": "1712544395950",    "status": 200,    "result": {        "orderListId": 626,        "contingencyType": "OTO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "KA4EBjGnzvSwSCQsDdTrlf",        "transactionTime": 1712544395981,        "symbol": "1712544378871",        "orders": [            {                "symbol": "LTCBNB",                "orderId": 13,                "clientOrderId": "YiAUtM9yJjl1a2jXHSp9Ny"            },            {                "symbol": "LTCBNB",                "orderId": 14,                "clientOrderId": "9MxJSE1TYkmyx5lbGLve7R"            }        ],        "orderReports": [            {                "symbol": "LTCBNB",                "orderId": 13,                "orderListId": 626,                "clientOrderId": "YiAUtM9yJjl1a2jXHSp9Ny",                "transactTime": 1712544395981,                "price": "1.000000",                "origQty": "1.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "SELL",                "workingTime": 1712544395981,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "LTCBNB",                "orderId": 14,                "orderListId": 626,                "clientOrderId": "9MxJSE1TYkmyx5lbGLve7R",                "transactTime": 1712544395981,                "price": "0.000000",                "origQty": "1.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "PENDING_NEW",                "timeInForce": "GTC",                "type": "MARKET",                "side": "BUY",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            }        ]    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 10000000,            "count": 10        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 1000,            "count": 38        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

#### Place new Order list - OTOCO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "1712544408508",    "method": "orderList.place.otoco",    "params": {        "signature": "c094473304374e1b9c5f7e2558358066cfa99df69f50f63d09cfee755136cb07",        "apiKey": "Rf07JlnL9PHVxjs27O5CvKNyOsV4qJ5gXdrRfpvlOdvMZbGZbPO5Ce2nIwfRP0iA",        "pendingQuantity": 5,        "pendingSide": "SELL",        "pendingBelowPrice": 5,        "pendingBelowType": "LIMIT_MAKER",        "pendingAboveStopPrice": 0.5,        "pendingAboveType": "STOP_LOSS",        "symbol": "LTCBNB",        "recvWindow": "5000",        "timestamp": "1712544408509",        "workingPrice": 1.5,        "workingQuantity": 1,        "workingSide": "BUY",        "workingTimeInForce": "GTC",        "workingType": "LIMIT"    }}
```

Place an OTOCO.

-   An OTOCO (One-Triggers-One-Cancels-the-Other) is an order list comprised of 3 orders.
-   The first order is called the **working order** and must be `LIMIT` or `LIMIT_MAKER`. Initially, only the working order goes on the order book.
    -   The behavior of the working order is the same as the [OTO](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).
-   OTOCO has 2 pending orders (pending above and pending below), forming an OCO pair. The pending orders are only placed on the order book when the working order gets **fully filled**.
    -   The rules of the pending above and pending below follow the same rules as the [Order list OCO](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).
-   OTOCOs add **3 orders** to the `EXCHANGE_MAX_NUM_ORDERS` filter and `MAX_NUM_ORDERS` filter.

**Weight:** 1

**Unfilled Order Count:** 3

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`listClientOrderId`

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent.  
A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired.  
`listClientOrderId` is distinct from the `workingClientOrderId`, `pendingAboveClientOrderId`, and the `pendingBelowClientOrderId`.

`newOrderRespType`

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`selfTradePreventionMode`

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingType`

ENUM

YES

Supported values: `LIMIT`, `LIMIT_MAKER`

`workingSide`

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the working order.  
Automatically generated if not sent.

`workingPrice`

DECIMAL

YES

`workingQuantity`

DECIMAL

YES

`workingIcebergQty`

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC` or if `workingType` is `LIMIT_MAKER`.

`workingTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingStrategyId`

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

`workingStrategyType`

INT

NO

Arbitrary numeric value identifying the working order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`workingPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`workingPegOffsetType`

ENUM

NO

`workingPegOffsetValue`

INT

NO

`pendingSide`

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingQuantity`

DECIMAL

YES

`pendingAboveType`

ENUM

YES

Supported values: `STOP_LOSS_LIMIT`, `STOP_LOSS`, `LIMIT_MAKER`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

`pendingAboveClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the pending above order.  
Automatically generated if not sent.

`pendingAbovePrice`

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

`pendingAboveStopPrice`

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

`pendingAboveTrailingDelta`

DECIMAL

NO

See [Trailing Stop FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

`pendingAboveIcebergQty`

DECIMAL

NO

This can only be used if `pendingAboveTimeInForce` is `GTC` or if `pendingAboveType` is `LIMIT_MAKER`.

`pendingAboveTimeInForce`

ENUM

NO

`pendingAboveStrategyId`

LONG

NO

Arbitrary numeric value identifying the pending above order within an order strategy.

`pendingAboveStrategyType`

INT

NO

Arbitrary numeric value identifying the pending above order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`pendingAbovePegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pendingAbovePegOffsetType`

ENUM

NO

`pendingAbovePegOffsetValue`

INT

NO

`pendingBelowType`

ENUM

NO

Supported values: `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`,`TAKE_PROFIT_LIMIT`

`pendingBelowClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the pending below order.  
Automatically generated if not sent.

`pendingBelowPrice`

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT` to specify the limit price.

`pendingBelowStopPrice`

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS`, `STOP_LOSS_LIMIT, TAKE_PROFIT or TAKE_PROFIT_LIMIT`.  
Either `pendingBelowStopPrice` or `pendingBelowTrailingDelta` or both, must be specified.

`pendingBelowTrailingDelta`

DECIMAL

NO

`pendingBelowIcebergQty`

DECIMAL

NO

This can only be used if `pendingBelowTimeInForce` is `GTC`, or if `pendingBelowType` is `LIMIT_MAKER`.

`pendingBelowTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingBelowStrategyId`

LONG

NO

Arbitrary numeric value identifying the pending below order within an order strategy.

`pendingBelowStrategyType`

INT

NO

Arbitrary numeric value identifying the pending below order strategy.  
Values smaller than 1000000 are reserved and cannot be used.

`pendingBelowPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pendingBelowPegOffsetType`

ENUM

NO

`pendingBelowPegOffsetValue`

INT

NO

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`timestamp`

LONG

YES

`signature`

STRING

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

**Data Source:** Matching Engine

**Response:**

```
{    "id": "1712544408508",    "status": 200,    "result": {        "orderListId": 629,        "contingencyType": "OTO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "GaeJHjZPasPItFj4x7Mqm6",        "transactionTime": 1712544408537,        "symbol": "1712544378871",        "orders": [            {                "symbol": "LTCBNB",                "orderId": 23,                "clientOrderId": "OVQOpKwfmPCfaBTD0n7e7H"            },            {                "symbol": "LTCBNB",                "orderId": 24,                "clientOrderId": "YcCPKCDMQIjNvLtNswt82X"            },            {                "symbol": "LTCBNB",                "orderId": 25,                "clientOrderId": "ilpIoShcFZ1ZGgSASKxMPt"            }        ],        "orderReports": [            {                "symbol": "LTCBNB",                "orderId": 23,                "orderListId": 629,                "clientOrderId": "OVQOpKwfmPCfaBTD0n7e7H",                "transactTime": 1712544408537,                "price": "1.500000",                "origQty": "1.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "BUY",                "workingTime": 1712544408537,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "LTCBNB",                "orderId": 24,                "orderListId": 629,                "clientOrderId": "YcCPKCDMQIjNvLtNswt82X",                "transactTime": 1712544408537,                "price": "0.000000",                "origQty": "5.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "PENDING_NEW",                "timeInForce": "GTC",                "type": "STOP_LOSS",                "side": "SELL",                "stopPrice": "0.500000",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "LTCBNB",                "orderId": 25,                "orderListId": 629,                "clientOrderId": "ilpIoShcFZ1ZGgSASKxMPt",                "transactTime": 1712544408537,                "price": "5.000000",                "origQty": "5.000000",                "executedQty": "0.000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.000000",                "status": "PENDING_NEW",                "timeInForce": "GTC",                "type": "LIMIT_MAKER",                "side": "SELL",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            }        ]    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 10000000,            "count": 18        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 1000,            "count": 65        }    ]}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

#### OPO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "1762941318128",    "method": "orderList.place.opo",    "params": {        "workingPrice": "101496",        "workingQuantity": "0.0007",        "workingType": "LIMIT",        "workingTimeInForce": "GTC",        "pendingType": "MARKET",        "pendingSide": "SELL",        "recvWindow": 5000,        "workingSide": "BUY",        "symbol": "BTCUSDT",        "timestamp": 1762941318129,        "apiKey": "aHb4Ur1cK1biW3sgibqUFs39SE58f9d5Xwf4uEW0tFh7ibun5g035QKSktxoOBfE",        "signature": "b50ce8977333a78a3bbad21df178d7e104a8c985d19007b55df688cdf868639a"    }}
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

`symbol`

STRING

YES

`listClientOrderId`

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent. A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired. `listClientOrderId` is distinct from the `workingClientOrderId` and the `pendingClientOrderId`.

`newOrderRespType`

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`selfTradePreventionMode`

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingType`

ENUM

YES

Supported values: `LIMIT`,`LIMIT_MAKER`

`workingSide`

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the working order. Automatically generated if not sent.

`workingPrice`

DECIMAL

YES

`workingQuantity`

DECIMAL

YES

Sets the quantity for the working order.

`workingIcebergQty`

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC`, or if `workingType` is `LIMIT_MAKER`.

`workingTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingStrategyId`

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

`workingStrategyType`

INT

NO

Arbitrary numeric value identifying the working order strategy. Values smaller than 1000000 are reserved and cannot be used.

`workingPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`workingPegOffsetType`

ENUM

NO

`workingPegOffsetValue`

INT

NO

`pendingType`

ENUM

YES

Supported values: [Order Types](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests) Note that `MARKET` orders using `quoteOrderQty` are not supported.

`pendingSide`

ENUM

YES

Supported values: [Order Side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the pending order. Automatically generated if not sent.

`pendingPrice`

DECIMAL

NO

`pendingStopPrice`

DECIMAL

NO

`pendingTrailingDelta`

DECIMAL

NO

`pendingIcebergQty`

DECIMAL

NO

This can only be used if `pendingTimeInForce` is `GTC` or if `pendingType` is `LIMIT_MAKER`.

`pendingTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingStrategyId`

LONG

NO

Arbitrary numeric value identifying the pending order within an order strategy.

`pendingStrategyType`

INT

NO

Arbitrary numeric value identifying the pending order strategy. Values smaller than 1000000 are reserved and cannot be used.

`pendingPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pendingPegOffsetType`

ENUM

NO

`pendingPegOffsetValue`

INT

NO

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`. Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`timestamp`

LONG

YES

**Data Source**: Matching Engine

**Response:**

```
{    "id": "1762941318128",    "status": 200,    "result": {        "orderListId": 2,        "contingencyType": "OTO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "OiOgqvRagBefpzdM5gjYX3",        "transactionTime": 1762941318142,        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 2,                "clientOrderId": "pUzhKBbc0ZVdMScIRAqitH"            },            {                "symbol": "BTCUSDT",                "orderId": 3,                "clientOrderId": "x7ISSjywZxFXOdzwsThNnd"            }        ],        "orderReports": [            {                "symbol": "BTCUSDT",                "orderId": 2,                "orderListId": 2,                "clientOrderId": "pUzhKBbc0ZVdMScIRAqitH",                "transactTime": 1762941318142,                "price": "101496.00000000",                "origQty": "0.00070000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.00000000",                "cummulativeQuoteQty": "0.00000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "BUY",                "workingTime": 1762941318142,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "BTCUSDT",                "orderId": 3,                "orderListId": 2,                "clientOrderId": "x7ISSjywZxFXOdzwsThNnd",                "transactTime": 1762941318142,                "price": "0.00000000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.00000000",                "cummulativeQuoteQty": "0.00000000",                "status": "PENDING_NEW",                "timeInForce": "GTC",                "type": "MARKET",                "side": "SELL",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            }        ]    }}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

#### OPOCO (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "1763000139090",    "method": "orderList.place.opoco",    "params": {        "workingPrice": "102496",        "workingQuantity": "0.0017",        "workingType": "LIMIT",        "workingTimeInForce": "GTC",        "pendingAboveType": "LIMIT_MAKER",        "pendingAbovePrice": "104261",        "pendingBelowStopPrice": "10100",        "pendingBelowPrice": "101613",        "pendingBelowType": "STOP_LOSS_LIMIT",        "pendingBelowTimeInForce": "IOC",        "pendingSide": "SELL",        "recvWindow": 5000,        "workingSide": "BUY",        "symbol": "BTCUSDT",        "timestamp": 1763000139091,        "apiKey": "2wiKgTLyllTCu0QWXaEtKWX9tUQ5iQMiDQqTQPdUe2bZ1IVT9aXoS6o19wkYIKl2",        "signature": "adfa185c50f793392a54ad5a6e2c39fd34ef6d35944adf2ddd6f30e1866e58d3"    }}
```

Place an [OPOCO](https://developers.binance.com/docs/binance-spot-api-docs/faqs/opo).

**Weight**: 1

**Unfilled Order Count:** 3

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`listClientOrderId`

STRING

NO

Arbitrary unique ID among open order lists. Automatically generated if not sent. A new order list with the same listClientOrderId is accepted only when the previous one is filled or completely expired. `listClientOrderId` is distinct from the `workingClientOrderId`, `pendingAboveClientOrderId`, and the `pendingBelowClientOrderId`.

`newOrderRespType`

ENUM

NO

Format of the JSON response. Supported values: [Order Response Type](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`selfTradePreventionMode`

ENUM

NO

The allowed values are dependent on what is configured on the symbol. Supported values: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingType`

ENUM

YES

Supported values: `LIMIT`, `LIMIT_MAKER`

`workingSide`

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the working order. Automatically generated if not sent.

`workingPrice`

DECIMAL

YES

`workingQuantity`

DECIMAL

YES

`workingIcebergQty`

DECIMAL

NO

This can only be used if `workingTimeInForce` is `GTC`, or if `workingType` is `LIMIT_MAKER`.

`workingTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`workingStrategyId`

LONG

NO

Arbitrary numeric value identifying the working order within an order strategy.

`workingStrategyType`

INT

NO

Arbitrary numeric value identifying the working order strategy. Values smaller than 1000000 are reserved and cannot be used.

`workingPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`workingPegOffsetType`

ENUM

NO

`workingPegOffsetValue`

INT

NO

`pendingSide`

ENUM

YES

Supported values: [Order side](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingAboveType`

ENUM

YES

Supported values: `STOP_LOSS_LIMIT`, `STOP_LOSS`, `LIMIT_MAKER`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

`pendingAboveClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the pending above order. Automatically generated if not sent.

`pendingAbovePrice`

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS_LIMIT` , `LIMIT_MAKER`, or `TAKE_PROFIT_LIMIT` to specify the limit price.

`pendingAboveStopPrice`

DECIMAL

NO

Can be used if `pendingAboveType` is `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT`

`pendingAboveTrailingDelta`

DECIMAL

NO

See [Trailing Stop FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/trailing-stop-faq)

`pendingAboveIcebergQty`

DECIMAL

NO

This can only be used if `pendingAboveTimeInForce` is `GTC` or if `pendingAboveType` is `LIMIT_MAKER`.

`pendingAboveTimeInForce`

ENUM

NO

`pendingAboveStrategyId`

LONG

NO

Arbitrary numeric value identifying the pending above order within an order strategy.

`pendingAboveStrategyType`

INT

NO

Arbitrary numeric value identifying the pending above order strategy. Values smaller than 1000000 are reserved and cannot be used.

`pendingAbovePegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pendingAbovePegOffsetType`

ENUM

NO

`pendingAbovePegOffsetValue`

INT

NO

`pendingBelowType`

ENUM

NO

Supported values: `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`,`TAKE_PROFIT_LIMIT`

`pendingBelowClientOrderId`

STRING

NO

Arbitrary unique ID among open orders for the pending below order. Automatically generated if not sent.

`pendingBelowPrice`

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS_LIMIT` or `TAKE_PROFIT_LIMIT` to specify limit price

`pendingBelowStopPrice`

DECIMAL

NO

Can be used if `pendingBelowType` is `STOP_LOSS`, `STOP_LOSS_LIMIT, TAKE_PROFIT or TAKE_PROFIT_LIMIT`. Either `pendingBelowStopPrice` or `pendingBelowTrailingDelta` or both, must be specified.

`pendingBelowTrailingDelta`

DECIMAL

NO

`pendingBelowIcebergQty`

DECIMAL

NO

This can only be used if `pendingBelowTimeInForce` is `GTC`, or if `pendingBelowType` is `LIMIT_MAKER`.

`pendingBelowTimeInForce`

ENUM

NO

Supported values: [Time In Force](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

`pendingBelowStrategyId`

LONG

NO

Arbitrary numeric value identifying the pending below order within an order strategy.

`pendingBelowStrategyType`

INT

NO

Arbitrary numeric value identifying the pending below order strategy. Values smaller than 1000000 are reserved and cannot be used.

`pendingBelowPegPriceType`

ENUM

NO

See [Pegged Orders](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

`pendingBelowPegOffsetType`

ENUM

NO

`pendingBelowPegOffsetValue`

INT

NO

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`. Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`timestamp`

LONG

YES

**Data Source:** Matching Engine

**Response:**

```
{    "id": "1763000139090",    "status": 200,    "result": {        "orderListId": 1,        "contingencyType": "OTO",        "listStatusType": "EXEC_STARTED",        "listOrderStatus": "EXECUTING",        "listClientOrderId": "TVbG6ymkYMXTj7tczbOsBf",        "transactionTime": 1763000139104,        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 6,                "clientOrderId": "3czuJSeyjPwV9Xo28j1Dv3"            },            {                "symbol": "BTCUSDT",                "orderId": 7,                "clientOrderId": "kyIKnMLKQclE5FmyYgaMSo"            },            {                "symbol": "BTCUSDT",                "orderId": 8,                "clientOrderId": "i76cGJWN9J1FpADS56TtQZ"            }        ],        "orderReports": [            {                "symbol": "BTCUSDT",                "orderId": 6,                "orderListId": 1,                "clientOrderId": "3czuJSeyjPwV9Xo28j1Dv3",                "transactTime": 1763000139104,                "price": "102496.00000000",                "origQty": "0.00170000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.00000000",                "cummulativeQuoteQty": "0.00000000",                "status": "NEW",                "timeInForce": "GTC",                "type": "LIMIT",                "side": "BUY",                "workingTime": 1763000139104,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "BTCUSDT",                "orderId": 7,                "orderListId": 1,                "clientOrderId": "kyIKnMLKQclE5FmyYgaMSo",                "transactTime": 1763000139104,                "price": "101613.00000000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.00000000",                "cummulativeQuoteQty": "0.00000000",                "status": "PENDING_NEW",                "timeInForce": "IOC",                "type": "STOP_LOSS_LIMIT",                "side": "SELL",                "stopPrice": "10100.00000000",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            },            {                "symbol": "BTCUSDT",                "orderId": 8,                "orderListId": 1,                "clientOrderId": "i76cGJWN9J1FpADS56TtQZ",                "transactTime": 1763000139104,                "price": "104261.00000000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.00000000",                "cummulativeQuoteQty": "0.00000000",                "status": "PENDING_NEW",                "timeInForce": "GTC",                "type": "LIMIT_MAKER",                "side": "SELL",                "workingTime": -1,                "selfTradePreventionMode": "NONE"            }        ]    }}
```

**Note:** The payload above does not show all fields that can appear. Please refer to [Conditional fields in Order Responses](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests).

#### Cancel Order list (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "c5899911-d3f4-47ae-8835-97da553d27d0",    "method": "orderList.cancel",    "params": {        "symbol": "BTCUSDT",        "orderListId": 1274512,        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "4973f4b2fee30bf6d45e4a973e941cc60fdd53c8dd5a25edeac96f5733c0ccee",        "timestamp": 1660801720210    }}
```

Cancel an active order list.

**Weight**: 1

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`orderListId`

INT

YES

Cancel order list by `orderListId`

`listClientOrderId`

STRING

Cancel order list by `listClientId`

`newClientOrderId`

STRING

NO

New ID for the canceled order list. Automatically generated if not sent

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

-   If both `orderListId` and `listClientOrderId` parameters are provided, the `orderListId` is searched first, then the `listClientOrderId` from that result is checked against that order. If both conditions are not met the request will be rejected.
    
-   Canceling an individual order with [`order.cancel`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests) will cancel the entire order list as well.
    

**Data Source:** Matching Engine

**Response:**

```
{    "id": "c5899911-d3f4-47ae-8835-97da553d27d0",    "status": 200,    "result": {        "orderListId": 1274512,        "contingencyType": "OCO",        "listStatusType": "ALL_DONE",        "listOrderStatus": "ALL_DONE",        "listClientOrderId": "6023531d7edaad348f5aff",        "transactionTime": 1660801720215,        "symbol": "BTCUSDT",        "orders": [            {                "symbol": "BTCUSDT",                "orderId": 12569138901,                "clientOrderId": "BqtFCj5odMoWtSqGk2X9tU"            },            {                "symbol": "BTCUSDT",                "orderId": 12569138902,                "clientOrderId": "jLnZpj5enfMXTuhKB1d0us"            }        ],        "orderReports": [            {                "symbol": "BTCUSDT",                "orderId": 12569138901,                "orderListId": 1274512,                "clientOrderId": "BqtFCj5odMoWtSqGk2X9tU",                "transactTime": 1660801720215,                "price": "23410.00000000",                "origQty": "0.00650000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "STOP_LOSS_LIMIT",                "side": "SELL",                "stopPrice": "23405.00000000",                "selfTradePreventionMode": "NONE"            },            {                "symbol": "BTCUSDT",                "orderId": 12569138902,                "orderListId": 1274512,                "clientOrderId": "jLnZpj5enfMXTuhKB1d0us",                "transactTime": 1660801720215,                "price": "23420.00000000",                "origQty": "0.00650000",                "executedQty": "0.00000000",                "origQuoteOrderQty": "0.000000",                "cummulativeQuoteQty": "0.00000000",                "status": "CANCELED",                "timeInForce": "GTC",                "type": "LIMIT_MAKER",                "side": "SELL",                "selfTradePreventionMode": "NONE"            }        ]    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

### SOR[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

#### Place new order using SOR (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "method": "sor.order.place",    "params": {        "symbol": "BTCUSDT",        "side": "BUY",        "type": "LIMIT",        "quantity": 0.5,        "timeInForce": "GTC",        "price": 31000,        "timestamp": 1687485436575,        "apiKey": "u5lgqJb97QWXWfgeV4cROuHbReSJM9rgQL0IvYcYc7BVeA5lpAqqc3a5p2OARIFk",        "signature": "fd301899567bc9472ce023392160cdc265ad8fcbbb67e0ea1b2af70a4b0cd9c7"    }}
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

`symbol`

STRING

YES

`side`

ENUM

YES

`BUY` or `SELL`

`type`

ENUM

YES

`timeInForce`

ENUM

NO

Applicable only to `LIMIT` order type

`price`

DECIMAL

NO

Applicable only to `LIMIT` order type

`quantity`

DECIMAL

YES

`newClientOrderId`

STRING

NO

Arbitrary unique ID among open orders. Automatically generated if not sent

`newOrderRespType`

ENUM

NO

Select response format: `ACK`, `RESULT`, `FULL`.

`MARKET` and `LIMIT` orders use `FULL` by default.

`icebergQty`

DECIMAL

NO

`strategyId`

LONG

NO

Arbitrary numeric value identifying the order within an order strategy.

`strategyType`

INT

NO

Arbitrary numeric value identifying the order strategy.

Values smaller than `1000000` are reserved and cannot be used.

`selfTradePreventionMode`

ENUM

NO

The allowed enums is dependent on what is configured on the symbol. The possible supported values are: [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums).

`apiKey`

STRING

YES

`timestamp`

LONG

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

**Note:** `sor.order.place` only supports `LIMIT` and `MARKET` orders. `quoteOrderQty` is not supported.

**Data Source:** Matching Engine

**Response:**

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "orderId": 2,            "orderListId": -1,            "clientOrderId": "sBI1KM6nNtOfj5tccZSKly",            "transactTime": 1689149087774,            "price": "31000.00000000",            "origQty": "0.50000000",            "executedQty": "0.50000000",            "origQuoteOrderQty": "0.000000",            "cummulativeQuoteQty": "14000.00000000",            "status": "FILLED",            "timeInForce": "GTC",            "type": "LIMIT",            "side": "BUY",            "workingTime": 1689149087774,            "fills": [                {                    "matchType": "ONE_PARTY_TRADE_REPORT",                    "price": "28000.00000000",                    "qty": "0.50000000",                    "commission": "0.00000000",                    "commissionAsset": "BTC",                    "tradeId": -1,                    "allocId": 0                }            ],            "workingFloor": "SOR",            "selfTradePreventionMode": "NONE",            "usedSor": true        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

#### Test new order using SOR (TRADE)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "method": "sor.order.test",    "params": {        "symbol": "BTCUSDT",        "side": "BUY",        "type": "LIMIT",        "quantity": 0.1,        "timeInForce": "GTC",        "price": 0.1,        "timestamp": 1687485436575,        "apiKey": "u5lgqJb97QWXWfgeV4cROuHbReSJM9rgQL0IvYcYc7BVeA5lpAqqc3a5p2OARIFk",        "signature": "fd301899567bc9472ce023392160cdc265ad8fcbbb67e0ea1b2af70a4b0cd9c7"    }}
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

In addition to all parameters accepted by [`sor.order.place`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests), the following optional parameters are also accepted:

Name

Type

Mandatory

Description

`computeCommissionRates`

BOOLEAN

NO

Default: `false`

**Data Source:** Memory

**Response:**

Without `computeCommissionRates`:

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "status": 200,    "result": {},    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 1        }    ]}
```

With `computeCommissionRates`:

```
{    "id": "3a4437e2-41a3-4c19-897c-9cadc5dce8b6",    "status": 200,    "result": {        "standardCommissionForOrder": { // Commission rates for the order depending on its role (e.g. maker or taker)            "maker": "0.00000112",            "taker": "0.00000114"        },        "taxCommissionForOrder": {      // Tax deduction rates for the order depending on its role (e.g. maker or taker)            "maker": "0.00000112",            "taker": "0.00000114"        },        "discount": {                   // Discount on standard commissions when paying in BNB.            "enabledForAccount": true,            "enabledForSymbol": true,            "discountAsset": "BNB",            "discount": "0.25"          // Standard commission is reduced by this rate when paying in BNB.        }    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 20        }    ]}
```

-   [Place new order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [Test new order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [Cancel order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [Cancel and replace order (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [Order Amend Keep Priority (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [Cancel open orders (TRADE)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [Order lists](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
-   [SOR](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/trading-requests)
