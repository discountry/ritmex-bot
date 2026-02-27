---
title: "Enums | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums"
fetched_at: "2026-02-26T10:38:09.538Z"
---
# ENUM Definitions

This will apply for both REST API and WebSocket API.

## Symbol status (status):[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `TRADING`
-   `END_OF_DAY`
-   `HALT`
-   `BREAK`

## Account and Symbol Permissions (permissions)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `SPOT`

## Order status (status)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

Status

Description

`NEW`

The order has been accepted by the engine.

`PENDING_NEW`

The order is in a pending phase until the working order of an order list has been fully filled.

`PARTIALLY_FILLED`

A part of the order has been filled.

`FILLED`

The order has been completed.

`CANCELED`

The order has been canceled by the user.

`PENDING_CANCEL`

Currently unused

`REJECTED`

The order was not accepted by the engine and not processed.

`EXPIRED`

The order was canceled according to the order type's rules (e.g. LIMIT FOK orders with no fill, LIMIT IOC or MARKET orders that partially fill)  
or by the exchange, (e.g. orders canceled during liquidation, orders canceled during maintenance)

`EXPIRED_IN_MATCH`

The order was expired by the exchange due to STP. (e.g. an order with `EXPIRE_TAKER` will match with existing orders on the book with the same account or same `tradeGroupId`)

## Order List Status (listStatusType)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

Status

Description

`RESPONSE`

This is used when the ListStatus is responding to a failed action. (E.g. order list placement or cancellation)

`EXEC_STARTED`

The order list has been placed or there is an update to the order list status.

`UPDATED`

The clientOrderId of an order in the order list has been changed.

`ALL_DONE`

The order list has finished executing and thus is no longer active.

## Order List Order Status (listOrderStatus)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

Status

Description

`EXECUTING`

Either an order list has been placed or there is an update to the status of the list.

`ALL_DONE`

An order list has completed execution and thus no longer active.

`REJECT`

The List Status is responding to a failed action either during order placement or order canceled.

## ContingencyType[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `OCO`
-   `OTO`

## AllocationType[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `SOR`

## Order types (orderTypes, type)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `LIMIT`
-   `MARKET`
-   `STOP_LOSS`
-   `STOP_LOSS_LIMIT`
-   `TAKE_PROFIT`
-   `TAKE_PROFIT_LIMIT`
-   `LIMIT_MAKER`

## Order Response Type (newOrderRespType)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `ACK`
-   `RESULT`
-   `FULL`

## Working Floor[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `EXCHANGE`
-   `SOR`

## Order side (side)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   `BUY`
-   `SELL`

## Time in force (timeInForce)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

This sets how long an order will be active before expiration.

Status

Description

`GTC`

Good Til Canceled  
An order will be on the book unless the order is canceled.

`IOC`

Immediate Or Cancel  
An order will try to fill the order as much as it can before the order expires.

`FOK`

Fill or Kill  
An order will expire if the full order cannot be filled upon execution.

## Rate limiters (rateLimitType)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   REQUEST\_WEIGHT

```
{    "rateLimitType": "REQUEST_WEIGHT",    "interval": "MINUTE",    "intervalNum": 1,    "limit": 6000}
```

-   ORDERS

```
{    "rateLimitType": "ORDERS",    "interval": "SECOND",    "intervalNum": 1,    "limit": 10}
```

-   RAW\_REQUESTS

```
{    "rateLimitType": "RAW_REQUESTS",    "interval": "MINUTE",    "intervalNum": 5,    "limit": 61000}
```

## Rate limit intervals (interval)[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

-   SECOND
-   MINUTE
-   DAY

## STP Modes[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)

Read [Self Trade Prevention (STP) FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/stp_faq) to learn more.

-   `NONE`
-   `EXPIRE_MAKER`
-   `EXPIRE_TAKER`
-   `EXPIRE_BOTH`
-   `DECREMENT`
-   `TRANSFER`

-   [Symbol status (status):](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Account and Symbol Permissions (permissions)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Order status (status)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Order List Status (listStatusType)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Order List Order Status (listOrderStatus)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [ContingencyType](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [AllocationType](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Order types (orderTypes, type)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Order Response Type (newOrderRespType)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Working Floor](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Order side (side)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Time in force (timeInForce)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Rate limiters (rateLimitType)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [Rate limit intervals (interval)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
-   [STP Modes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/enums)
