---
title: "Modify CM Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order"
fetched_at: "2026-01-27T05:28:20.820Z"
---
# Modify CM Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)

Order modify function, currently only LIMIT order modification is supported, modified orders will be reordered in the match queue

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)

PUT `/papi/v1/cm/order`

## Request Weight(Order)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)

Name

Type

Mandatory

Description

orderId

LONG

NO

origClientOrderId

STRING

NO

symbol

STRING

YES

side

ENUM

YES

SELL, BUY

quantity

DECIMAL

YES

Order quantity

price

DECIMAL

YES

priceMatch

ENUM

NO

only avaliable for `LIMIT`/`STOP`/`TAKE_PROFIT` order; can be set to `OPPONENT`/ `OPPONENT_5`/ `OPPONENT_10`/ `OPPONENT_20`: /`QUEUE`/ `QUEUE_5`/ `QUEUE_10`/ `QUEUE_20`; Can't be passed together with `price`

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Either `orderId` or `origClientOrderId` must be sent, and the `orderId` will prevail if both are sent.
> -   Both `quantity` and `price` must be sent
> -   When the new `quantity` or `price` doesn't satisfy PRICE\_FILTER / PERCENT\_FILTER / LOT\_SIZE, amendment will be rejected and the order will stay as it is.
> -   However the order will be cancelled by the amendment in the following situations:
>     -   when the order is in partially filled status and the new `quantity` <= `executedQty`
>     -   When the order is `GTX` and the new price will cause it to be executed immediately

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)

```
{    "orderId": 20072994037,    "symbol": "BTCUSD_PERP",    "pair": "BTCUSD",    "status": "NEW",    "clientOrderId": "LJ9R4QZDihCaS8UAOOLpgW",    "price": "30005",    "avgPrice": "0.0",    "origQty": "1",    "executedQty": "0",    "cumQty": "0",    "cumBase": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "side": "BUY",    "positionSide": "LONG",    "origType": "LIMIT",    "updateTime": 1629182711600}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)
-   [Request Weight(Order)](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Modify-CM-Order)
