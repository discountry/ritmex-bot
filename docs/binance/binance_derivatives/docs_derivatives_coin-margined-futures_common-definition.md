---
title: "Common Definition | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition"
fetched_at: "2026-01-27T05:28:02.113Z"
---
# Public Endpoints Info

## Terminology[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

-   `symbol` refers to the symbol name of a contract symbol
-   `pair` refers to the underlying symbol of a contracrt symbol
-   `base asset` refers to the asset that is the `quantity` of a symbol.
-   `quote asset` refers to the asset that is the `price` of a symbol.
-   `margin asset` refers to the asset that is the `margin` of a symbol

## ENUM definitions[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

**Symbol type:**

-   DELIVERY\_CONTRACT
-   PERPETUAL\_CONTRACT

**Contract type (contractType):**

-   PERPETUAL
-   CURRENT\_QUARTER
-   NEXT\_QUARTER
-   CURRENT\_QUARTER\_DELIVERING // Invalid type, only used for DELIVERING status
-   NEXT\_QUARTER\_DELIVERING // Invalid type, only used for DELIVERING status
-   PERPETUAL\_DELIVERING

**Contract status (contractStatus, status):**

-   PENDING\_TRADING
-   TRADING
-   PRE\_DELIVERING
-   DELIVERING
-   DELIVERED

**Order status (status):**

-   NEW
-   PARTIALLY\_FILLED
-   FILLED
-   CANCELED
-   EXPIRED

**Order types (type):**

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

-   GTC - Good Till Cancel
-   IOC - Immediate or Cancel
-   FOK - Fill or Kill
-   GTX - Good Till Crossing (Post Only)

**Working Type (workingType)**

-   MARK\_PRICE
-   CONTRACT\_PRICE

**New Order Response Type (newOrderRespType)**

-   ACK
-   RESULT

**Price Match (priceMatch)**

-   NONE: no price match
-   OPPONENT: counterparty best price
-   OPPONENT\_5: counterparty 5th best price
-   OPPONENT\_10: counterparty 10th best price
-   OPPONENT\_20: counterparty 20th best price
-   QUEUE: the best price on the same side of the order book
-   QUEUE\_5: the 5th best price on the same side of the order book
-   QUEUE\_10: the 10th best price on the same side of the order book
-   QUEUE\_20: the 20th best price on the same side of the order book

**Self-Trade Prevention mode (selfTradePreventionMode)**

-   NONE: No Self-Trade Prevention
-   EXPIRE\_TAKER: expire taker order when STP trigger
-   EXPIRE\_BOTH: expire taker and maker order when STP trigger
-   EXPIRE\_MAKER: expire maker order when STP trigger

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

**Rate limiters (rateLimitType)**

> REQUEST\_WEIGHT

```
  {  	"rateLimitType": "REQUEST_WEIGHT",  	"interval": "MINUTE",  	"intervalNum": 1,  	"limit": 6000  }
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

## Symbol filters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

### PRICE\_FILTER[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

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

### LOT\_SIZE[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

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

### MARKET\_LOT\_SIZE[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

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

### MAX\_NUM\_ORDERS[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "MAX_NUM_ORDERS",    "limit": 200  }
```

The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on a symbol.

Note that both "algo" orders and normal orders are counted for this filter.

### PERCENT\_PRICE[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)

> **/exchangeInfo format:**

```
  {    "filterType": "PERCENT_PRICE",    "multiplierUp": "1.0500",    "multiplierDown": "0.9500",    "multiplierDecimal": 4  }
```

The `PERCENT_PRICE` filter defines valid range for a price based on the mark price.

In order to pass the `percent price`, the following must be true for `price`:

-   BUY: `price` <= `markPrice` \* `multiplierUp`
-   SELL: `price` >= `markPrice` \* `multiplierDown`

-   [Terminology](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
-   [ENUM definitions](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
-   [Symbol filters](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
    -   [PRICE\_FILTER](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
    -   [LOT\_SIZE](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
    -   [MARKET\_LOT\_SIZE](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
    -   [MAX\_NUM\_ORDERS](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
    -   [PERCENT\_PRICE](https://developers.binance.com/docs/derivatives/coin-margined-futures/common-definition)
