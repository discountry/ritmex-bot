---
title: "General endpoints | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints"
fetched_at: "2026-02-26T10:38:08.963Z"
---
### Test connectivity[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)

```
GET /api/v3/ping
```

Test connectivity to the Rest API.

**Weight:** 1

**Parameters:** NONE

**Data Source:** Memory

**Response:**

```
{}
```

### Check server time[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)

```
GET /api/v3/time
```

Test connectivity to the Rest API and get the current server time.

**Weight:** 1

**Parameters:** NONE

**Data Source:** Memory

**Response:**

```
{    "serverTime": 1499827319559}
```

### Exchange information[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)

```
GET /api/v3/exchangeInfo
```

Current exchange trading rules and symbol information

**Weight:** 20

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

No

Example: curl -X GET "[https://api.binance.com/api/v3/exchangeInfo?symbol=BNBBTC](https://api.binance.com/api/v3/exchangeInfo?symbol=BNBBTC)"

symbols

ARRAY OF STRING

No

Examples: curl -X GET "[https://api.binance.com/api/v3/exchangeInfo?symbols=%5B%22BNBBTC%22,%22BTCUSDT%22%5D](https://api.binance.com/api/v3/exchangeInfo?symbols=%5B%22BNBBTC%22,%22BTCUSDT%22%5D)"  
or  
curl -g -X GET '[https://api.binance.com/api/v3/exchangeInfo?symbols=\["BTCUSDT","BNBBTC](https://api.binance.com/api/v3/exchangeInfo?symbols=%5B%22BTCUSDT%22,%22BNBBTC)"\]'

permissions

ENUM

No

Examples: curl -X GET "[https://api.binance.com/api/v3/exchangeInfo?permissions=SPOT](https://api.binance.com/api/v3/exchangeInfo?permissions=SPOT)"  
or  
curl -X GET "[https://api.binance.com/api/v3/exchangeInfo?permissions=%5B%22MARGIN%22%2C%22LEVERAGED%22%5D](https://api.binance.com/api/v3/exchangeInfo?permissions=%5B%22MARGIN%22%2C%22LEVERAGED%22%5D)"  
or  
curl -g -X GET '[https://api.binance.com/api/v3/exchangeInfo?permissions=\["MARGIN","LEVERAGED](https://api.binance.com/api/v3/exchangeInfo?permissions=%5B%22MARGIN%22,%22LEVERAGED)"\]'

showPermissionSets

BOOLEAN

No

Controls whether the content of the `permissionSets` field is populated or not. Defaults to `true`

symbolStatus

ENUM

No

Filters for symbols that have this `tradingStatus`. Valid values: `TRADING`, `HALT`, `BREAK`  
Cannot be used in combination with `symbols` or `symbol`.

**Notes:**

-   If the value provided to `symbol` or `symbols` do not exist, the endpoint will throw an error saying the symbol is invalid.
-   All parameters are optional.
-   `permissions` can support single or multiple values (e.g. `SPOT`, `["MARGIN","LEVERAGED"]`). This cannot be used in combination with `symbol` or `symbols`.
-   If `permissions` parameter not provided, all symbols that have either `SPOT`, `MARGIN`, or `LEVERAGED` permission will be exposed.
    -   To display symbols with any permission you need to specify them explicitly in `permissions`: (e.g. `["SPOT","MARGIN",...]`.). See [Account and Symbol Permissions](https://developers.binance.com/docs/binance-spot-api-docs/enums) for the full list.

**Examples of Symbol Permissions Interpretation from the Response:**

-   `[["A","B"]]` means you may place an order if your account has either permission "A" **or** permission "B".
-   `[["A"],["B"]]` means you can place an order if your account has permission "A" **and** permission "B".
-   `[["A"],["B","C"]]` means you can place an order if your account has permission "A" **and** permission "B" or permission "C". (Inclusive or is applied here, not exclusive or, so your account may have both permission "B" and permission "C".)

**Data Source:** Memory

**Response:**

```
{    "timezone": "UTC",    "serverTime": 1565246363776,    "rateLimits": [        {            // These are defined in the `ENUM definitions` section under `Rate Limiters (rateLimitType)`.            // All limits are optional        }    ],    "exchangeFilters": [        // These are the defined filters in the `Filters` section.        // All filters are optional.    ],    "symbols": [        {            "symbol": "ETHBTC",            "status": "TRADING",            "baseAsset": "ETH",            "baseAssetPrecision": 8,            "quoteAsset": "BTC",            "quotePrecision": 8,     // will be removed in future api versions (v4+)            "quoteAssetPrecision": 8,            "baseCommissionPrecision": 8,            "quoteCommissionPrecision": 8,            "orderTypes": [                "LIMIT",                "LIMIT_MAKER",                "MARKET",                "STOP_LOSS",                "STOP_LOSS_LIMIT",                "TAKE_PROFIT",                "TAKE_PROFIT_LIMIT"            ],            "icebergAllowed": true,            "ocoAllowed": true,            "otoAllowed": true,            "opoAllowed": true,            "quoteOrderQtyMarketAllowed": true,            "allowTrailingStop": false,            "cancelReplaceAllowed": false,            "amendAllowed": false,            "pegInstructionsAllowed": true,            "isSpotTradingAllowed": true,            "isMarginTradingAllowed": true,            "filters": [                // These are defined in the Filters section.                // All filters are optional            ],            "permissions": [],            "permissionSets": [["SPOT", "MARGIN"]],            "defaultSelfTradePreventionMode": "NONE",            "allowedSelfTradePreventionModes": ["NONE"]        }    ],    // Optional field. Present only when SOR is available.    // https://github.com/binance/binance-spot-api-docs/blob/master/faqs/sor_faq.md    "sors": [        {            "baseAsset": "BTC",            "symbols": ["BTCUSDT", "BTCUSDC"]        }    ]}
```

-   [Test connectivity](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)
-   [Check server time](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)
-   [Exchange information](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)
