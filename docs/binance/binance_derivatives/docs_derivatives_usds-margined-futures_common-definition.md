---
title: "Common Definition | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition"
fetched_at: "2026-01-27T05:28:26.296Z"
---
# Public Endpoints Info

## Terminology[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

-   `base asset` refers to the asset that is the `quantity` of a symbol.
-   `quote asset` refers to the asset that is the `price` of a symbol.

## ENUM definitions[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

**Symbol type:**

-   FUTURE

**Contract type (contractType):**

-   PERPETUAL
-   CURRENT\_MONTH
-   NEXT\_MONTH
-   CURRENT\_QUARTER
-   NEXT\_QUARTER
-   PERPETUAL\_DELIVERING

**Contract status (contractStatus, status):**

-   PENDING\_TRADING
-   TRADING
-   PRE\_DELIVERING
-   DELIVERING
-   DELIVERED
-   PRE\_SETTLE
-   SETTLING
-   CLOSE

**Order status (status):**

-   NEW
-   PARTIALLY\_FILLED
-   FILLED
-   CANCELED
-   REJECTED
-   EXPIRED
-   EXPIRED\_IN\_MATCH

**Order types (orderTypes, type):**

-   LIMIT
-   MARKET
-   STOP
-   STOP\_MARKET
-   TAKE\_PROFIT
-   TAKE\_PROFIT\_MARKET
-   TRAILING\_STOP\_MARKET

**Order side (side):**

-   BUY
-   SELL

**Position side (positionSide):**

-   BOTH
-   LONG
-   SHORT

**Time in force (timeInForce):**

-   GTC - Good Till Cancel(GTC order valitidy is 1 year from placement)
-   IOC - Immediate or Cancel
-   FOK - Fill or Kill
-   GTX - Good Till Crossing (Post Only)
-   GTD - Good Till Date
-   RPI - Retail Price Improvement(RPI order is post only and only be matched with the order from APP or Web)

**Working Type (workingType)**

-   MARK\_PRICE
-   CONTRACT\_PRICE

**Response Type (newOrderRespType)**

-   ACK
-   RESULT

**Kline/Candlestick chart intervals:**

m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

-   1m
-   3m
-   5m
-   15m
-   30m
-   1h
-   2h
-   4h
-   6h
-   8h
-   12h
-   1d
-   3d
-   1w
-   1M

**STP MODE (selfTradePreventionMode):**

-   EXPIRE\_TAKER
-   EXPIRE\_BOTH
-   EXPIRE\_MAKER

**Price Match (priceMatch)**

-   NONE (No price match)
-   OPPONENT (counterparty best price)
-   OPPONENT\_5 (the 5th best price from the counterparty)
-   OPPONENT\_10 (the 10th best price from the counterparty)
-   OPPONENT\_20 (the 20th best price from the counterparty)
-   QUEUE (the best price on the same side of the order book)
-   QUEUE\_5 (the 5th best price on the same side of the order book)
-   QUEUE\_10 (the 10th best price on the same side of the order book)
-   QUEUE\_20 (the 20th best price on the same side of the order book)

**Rate limiters (rateLimitType)**

> REQUEST\_WEIGHT

```
  {  	"rateLimitType": "REQUEST_WEIGHT",  	"interval": "MINUTE",  	"intervalNum": 1,  	"limit": 2400  }
```

> ORDERS

```
  {  	"rateLimitType": "ORDERS",  	"interval": "MINUTE",  	"intervalNum": 1,  	"limit": 1200   }
```

-   REQUEST\_WEIGHT
    
-   ORDERS
    

**Rate limit intervals (interval)**

-   MINUTE

# Filters

Filters define trading rules on a symbol or an exchange.

## Symbol filters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

### PRICE\_FILTER[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "PRICE_FILTER",    "minPrice": "0.00000100",    "maxPrice": "100000.00000000",    "tickSize": "0.00000100"  }
```

The `PRICE_FILTER` defines the `price` rules for a symbol. There are 3 parts:

-   `minPrice` defines the minimum `price`/`stopPrice` allowed; disabled on `minPrice` == 0.
-   `maxPrice` defines the maximum `price`/`stopPrice` allowed; disabled on `maxPrice` == 0.
-   `tickSize` defines the intervals that a `price`/`stopPrice` can be increased/decreased by; disabled on `tickSize` == 0.

Any of the above variables can be set to 0, which disables that rule in the `price filter`. In order to pass the `price filter`, the following must be true for `price`/`stopPrice` of the enabled rules:

-   `price` >= `minPrice`
-   `price` <= `maxPrice`
-   (`price`\-`minPrice`) % `tickSize` == 0

### LOT\_SIZE[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "LOT_SIZE",    "minQty": "0.00100000",    "maxQty": "100000.00000000",    "stepSize": "0.00100000"  }
```

The `LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms) rules for a symbol. There are 3 parts:

-   `minQty` defines the minimum `quantity` allowed.
-   `maxQty` defines the maximum `quantity` allowed.
-   `stepSize` defines the intervals that a `quantity` can be increased/decreased by.

In order to pass the `lot size`, the following must be true for `quantity`:

-   `quantity` >= `minQty`
-   `quantity` <= `maxQty`
-   (`quantity`\-`minQty`) % `stepSize` == 0

### MARKET\_LOT\_SIZE[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "MARKET_LOT_SIZE",    "minQty": "0.00100000",    "maxQty": "100000.00000000",    "stepSize": "0.00100000"  }
```

The `MARKET_LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms) rules for `MARKET` orders on a symbol. There are 3 parts:

-   `minQty` defines the minimum `quantity` allowed.
-   `maxQty` defines the maximum `quantity` allowed.
-   `stepSize` defines the intervals that a `quantity` can be increased/decreased by.

In order to pass the `market lot size`, the following must be true for `quantity`:

-   `quantity` >= `minQty`
-   `quantity` <= `maxQty`
-   (`quantity`\-`minQty`) % `stepSize` == 0

### MAX\_NUM\_ORDERS[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "MAX_NUM_ORDERS",    "limit": 200  }
```

The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on a symbol.

Note that both "algo" orders and normal orders are counted for this filter.

### MAX\_NUM\_ALGO\_ORDERS[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "MAX_NUM_ALGO_ORDERS",    "limit": 100  }
```

The `MAX_NUM_ALGO_ORDERS` filter defines the maximum number of all kinds of algo orders an account is allowed to have open on a symbol.

The algo orders include `STOP`, `STOP_MARKET`, `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`, and `TRAILING_STOP_MARKET` orders.

### PERCENT\_PRICE[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "PERCENT_PRICE",    "multiplierUp": "1.1500",    "multiplierDown": "0.8500",    "multiplierDecimal": 4  }
```

The `PERCENT_PRICE` filter defines valid range for a price based on the mark price.

In order to pass the `percent price`, the following must be true for `price`:

-   BUY: `price` <= `markPrice` \* `multiplierUp`
-   SELL: `price` >= `markPrice` \* `multiplierDown`

### MIN\_NOTIONAL[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "MIN_NOTIONAL",    "notional": "5.0"  }
```

The `MIN_NOTIONAL` filter defines the minimum notional value allowed for an order on a symbol. An order's notional value is the `price` \* `quantity`. Since `MARKET` orders have no price, the mark price is used.

-   [Terminology](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
-   [ENUM definitions](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
-   [Symbol filters](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [PRICE\_FILTER](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [LOT\_SIZE](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [MARKET\_LOT\_SIZE](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [MAX\_NUM\_ORDERS](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [MAX\_NUM\_ALGO\_ORDERS](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [PERCENT\_PRICE](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
    -   [MIN\_NOTIONAL](https://developers.binance.com/docs/derivatives/usds-margined-futures/common-definition)
