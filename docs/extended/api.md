# API Documentation
Extended API Documentation
--------------------------

By using the Extended API, you agree to the [Extended Terms](https://docs.extended.exchange/extended-resources/legal/terms-of-use) & [Privacy Policy](https://docs.extended.exchange/extended-resources/legal/privacy-policy). If you do not agree to the foregoing terms, do not use the Extended API.

Introduction
------------

Welcome to the Extended API Documentation! This guide is designed to assist traders and developers in integrating with our hybrid perpetuals exchange.

Extended operates as a hybrid Central Limit Order Book (CLOB) exchange. While order processing, matching, position risk assessment, and transaction sequencing are handled off-chain, trade settlement occurs on-chain via Starknet.

Extended is designed to operate in a completely trustless manner, enabled by two core principles:

1.  Users retain self-custody of their funds, with all assets held in smart contracts on Starknet. This means Extended has no custodial access to user assets under any circumstances.
    
2.  On-chain validation of the trading logic ensures that fraudulent or incorrect transactions, including liquidations that are contrary to the on-chain rules, are never permitted.
    

All transactions that happen on Extended are settled on Starknet. While Starknet does not rely on Ethereum Layer 1 for every individual transaction, it inherits Ethereum’s security by publishing zero-knowledge proofs every few hours. These proofs validate state transitions on Starknet, ensuring the integrity and correctness of the entire system.

Extended's on-chain logic and smart contracts have undergone extensive audits by external security firms. The audit reports are available below:

1.  [ChainSecurity](https://www.chainsecurity.com/security-audit/starkware-starknet-perpetual).
    
2.  [Public audit competition](https://code4rena.com/reports/2025-03-starknet-perpetual).
    

For a deeper breakdown of the core principles that make Extended trustless, see the blog [Why Safe](https://extended.exchange/blog/why-safe). For more on Extended Exchange's roadmap and architecture, check out [Extended Vision](https://extended.exchange/blog/extended-vision) and [Architecture](https://extended.exchange/blog/extended-architecture), respectively.

To optimize high-frequency trading performance, the Extended API operates asynchronously. When you place an order, it immediately returns an order ID, even before the order is officially recorded in the book. To track your order status in real time subscribe to the Order WebSocket stream, which delivers instant updates on confirmations, cancellations, and rejections.

StarkEx to Starknet migration
-----------------------------

On August 12, 2025, Extended began the migration from StarkEx to Starknet. This transition marks the first step toward our long-term vision of the Extended ecosystem and the introduction of unified margin. You can read more about the broader migration rationale and vision in our [documentation](https://docs.extended.exchange/starknet-migration/rationale-and-vision).

Existing Extended users will need to migrate from the current StarkEx instance to the new Starknet instance. The migration process has been designed to be as seamless as possible and is explained [here](https://docs.extended.exchange/starknet-migration/migration-guide#migration-process-user-flow). New users will be onboarded directly to the Starknet instance.

For the Starknet instance of the platform, the following changes vs StarkEx apply:

1.  Wallet support: In addition to EVM-compatible wallets, we will also support Starknet-compatible wallets.
    
2.  Signing logic: New signing logic in line with the SNIP12 standard (EIP712 for Starknet) and examples are available via the [SDK](https://api.docs.extended.exchange/#python-sdk).
    
3.  Deposits and withdrawals: For EVM wallets, we support deposits and withdrawals on six major EVM chains, currently only via the user interface. For Starknet wallets, deposits and withdrawals via Starknet are now supported.
    
4.  URL: The URL for the Starknet instance is api.starknet.extended.exchange, vs. api.extended.exchange for the StarkEx instance.
    

The migration will be rolled out in three stages:

Stage 1 – Dual Operation Mode,

Stage 2 – StarkEx Wind-Down Mode,

Stage 3 – StarkEx Freeze.

While the StarkEx instance will remain fully operational during Stage 1 of the migration, certain restrictions will apply starting August 12. Please review them carefully [here](https://docs.extended.exchange/starknet-migration/migration-guide#migration-stages).

Until the migration is complete, all StarkEx-specific details can be found in the dedicated section of the [API documentation](https://api.docs.extended.exchange/#legacy-starkex-sdk).

Python SDK
----------

> SDK configuration

```
from dataclasses import dataclass


@dataclass
class EndpointConfig:
    chain_rpc_url: str
    api_base_url: str
    stream_url: str
    onboarding_url: str
    signing_domain: str
    collateral_asset_contract: str
    asset_operations_contract: str
    collateral_asset_on_chain_id: str
    collateral_decimals: int


STARKNET_TESTNET_CONFIG = EndpointConfig(
    chain_rpc_url="https://rpc.sepolia.org",
    api_base_url="https://api.starknet.sepolia.extended.exchange/api/v1",
    stream_url="wss://starknet.sepolia.extended.exchange/stream.extended.exchange/v1",
    onboarding_url="https://api.starknet.sepolia.extended.exchange",
    signing_domain="starknet.sepolia.extended.exchange",
    collateral_asset_contract="",
    asset_operations_contract="",
    collateral_asset_on_chain_id="",
    collateral_decimals=6,
    starknet_domain=StarknetDomain(name="Perpetuals", version="v0", chain_id="SN_SEPOLIA", revision="1"),
    collateral_asset_id="0x1",
)

STARKNET_MAINNET_CONFIG = EndpointConfig(
    chain_rpc_url="",
    api_base_url="https://api.starknet.extended.exchange/api/v1",
    stream_url="wss://api.starknet.extended.exchange/stream.extended.exchange/v1",
    onboarding_url="https://api.starknet.extended.exchange",
    signing_domain="extended.exchange",
    collateral_asset_contract="",
    asset_operations_contract="",
    collateral_asset_on_chain_id="0x1",
    collateral_decimals=6,
    starknet_domain=StarknetDomain(name="Perpetuals", version="v0", chain_id="SN_MAIN", revision="1"),
    collateral_asset_id="0x1",
)

```


Getting Started:

*   For installation instructions, please refer to the [description](https://github.com/x10xchange/python_sdk/blob/starknet/README.md) provided.
    
*   For reference implementations, explore the [examples folder](https://github.com/x10xchange/python_sdk/tree/starknet/examples).
    
*   For SDK configuration, please refer to the [config description](https://github.com/x10xchange/python_sdk/blob/starknet/x10/perpetual/configuration.py).
    

Supported Features:

*   Account creation and authorisation.
    
*   Order Management.
    
*   Account Management.
    
*   Transfers.
    
*   Withdrawals (for Starknet wallets only).
    
*   Market Information.
    

We are committed to enhancing the SDK with more functionalities based on user feedback and evolving market needs.

Mainnet
-------

Our Mainnet is running on `Starknet`.

Base URL for the Mainnet API endpoints: https://api.starknet.extended.exchange/.

UI URL: `https://app.extended.exchange/perp`.

Testnet
-------

Our Testnet is running on `Sepolia`.

Base URL for the Testnet API endpoints: https://api.starknet.sepolia.extended.exchange/.

UI URL: `https://starknet.sepolia.extended.exchange/perp`

On the testnet, users can claim $1,000 worth of test USDC per hour for each wallet. This can be done by clicking the 'Claim' button in the 'Account' section, located at the bottom right of the Extended Testnet Trade screen.

Allowed HTTP Verbs
------------------

`GET`: Retrieves a resource or list of resources.

`POST`: Creates a resource.

`PATCH`: Updates a resource.

`DELETE`: Deletes a resource.

Authentication
--------------

Due to the trustless, self-custody nature of the Extended exchange, transactions involving user funds require both an API key and a valid Stark signature.

For order management, both an API key and Stark signature are necessary. For other endpoints, only the API key signature is required. Stark signatures are generated using a private Stark key.

### Account Creation, API and Stark Key Management

Currently, accounts can be created through the SDK or the User Interface:

1.  SDK - refer to the [onboarding example](https://github.com/x10xchange/python_sdk/blob/starknet/examples/onboarding_example.py).
    
2.  User Interface - connect your wallet on [extended.exchange](https://app.extended.exchange/) to create your Extended account.
    

You can create up to ten Extended sub-accounts per one wallet address. You can add and manage all sub-accounts associated with your connected wallet in the 'Account' section, located at the bottom right of the [Extended Trade screen](https://app.extended.exchange/).

On the [API management](https://app.extended.exchange/api-management) page, you can obtain API keys, Stark keys, and Vault numbers for each of your sub-accounts. Note that each sub-account is a separate Starknet position and therefore has unique API and Stark keys.

### Authenticate Using API Key

Extended uses a simplified authentication scheme for API access. Include your API key in the HTTP header as follows: `X-Api-Key: <API_KEY_FROM_API_MANAGEMENT_PAGE_OF_UI>`.

### Mandatory headers

For both REST and WebSocket API requests, the `User-Agent` header is required.

Rate Limits
-----------

REST API endpoints are subject to rate limits. For real-time data, consider using the WebSockets API instead.

All REST API endpoints are throttled by IP address. Currently, the rate limit is set at 1,000 requests per minute, shared across all endpoints. We plan to increase these limits as our system expands. If you require an increase in the rate limit now, please reach out to our team on [Discord](https://discord.gg/extendedapp).

Higher rate limit of 60,000 requests per 5 minutes apply for the market makers.

When a REST API rate limit is exceeded, a 429 status code will be returned.

> Paginated response schema:

```
type PaginatedResponse = {
  "status": "ok" | "error"
  "data": object | object[] | string | number,
  "error": {
    "code": number,
    "message": string
  },
  "pagination": {
    "cursor": number // Current cursor
    "count": number  // Count of the items in the response
  }
}

```


> General not paginated response schema:

```
type GeneralResponse = {
  "status": "ok" | "error",
  "data": object | object[] | string | number,
  "error": {
    "code": number,
    "message": string
  }
}

```


The Extended API uses a cursor-based pagination model across all endpoints that may return large volumes of items.

Items are automatically sorted in descending order by ID unless otherwise specified in the endpoint description. As IDs increase over time, the most recent items are always returned first.

Pagination parameters are passed via the query string. These parameters include:



* Parameter: cursor
  * Required: no
  * Type: number
  * Description: Determines the offset of the returned result. It represents the ID of the item after which you want to retrieve the next result. To get the next result page, use the cursor from the pagination section of the previous response.
* Parameter: limit
  * Required: no
  * Type: number
  * Description: The maximum number of items that should be returned.


Public REST-API
---------------

The following Public REST API endpoints enable users to access comprehensive information about available markets, their configurations, and trading statistics.

Get markets
-----------

### HTTP Request

`GET /api/v1/info/markets?market={market}`

Get a list of available markets, their configurations, and trading statistics.

To request data for several markets, use the following format: `GET /api/v1/info/markets?market=market1&market2`.

Please note that the margin schedule by market is not covered by this endpoint. For more details on the margin schedule, please refer to the [documentation](https://docs.extended.exchange/extended-resources/trading/margin-schedule).

### Market statuses


|Status     |Description                                                            |
|-----------|-----------------------------------------------------------------------|
|ACTIVE     |Market is active, and all types of orders are permitted.               |
|REDUCE_ONLY|Market is in reduce only mode, and only reduce only orders are allowed.|
|DELISTED   |Market is delisted, and trading is no longer permitted.                |
|PRELISTED  |Market is in prelisting stage, and trading not yet available.          |
|DISABLED   |Market is completly disabled, and trading is not allowed.              |


### Query Parameters


|Parameter|Required|Type    |Description                            |
|---------|--------|--------|---------------------------------------|
|market   |no      |string[]|List of names of the requested markets.|


> Response example:

```
{
  "status": "ok",
  "data": [
    {
      "name": "BTC-USD",
      "assetName": "BTC",
      "assetPrecision": 6,
      "collateralAssetName": "USD",
      "collateralAssetPrecision": 6,
      "active": true,
      "status": "ACTIVE",
      "marketStats": {
        "dailyVolume": "39659164065",
        "dailyVolumeBase": "39659164065",
        "dailyPriceChangePercentage": "5.57",
        "dailyLow": "39512",
        "dailyHigh": "42122",
        "lastPrice": "42000",
        "askPrice": "42005",
        "bidPrice": "39998",
        "markPrice": "39950",
        "indexPrice": "39940",
        "fundingRate": "0.001",
        "nextFundingRate": 1701563440,
        "openInterest": "1245.2",
        "openInterestBase": "1245.2"
      },
      "tradingConfig": {
        "minOrderSize": "0.001",
        "minOrderSizeChange": "0.001",
        "minPriceChange": "0.001",
        "maxMarketOrderValue": "1000000",
        "maxLimitOrderValue": "5000000",
        "maxPositionValue": "10000000",
        "maxLeverage": "50",
        "maxNumOrders": "200",
        "limitPriceCap": "0.05",
        "limitPriceFloor": "0.05"
      },
      "l2Config": {
        "type": "STARKX",
        "collateralId": "0x35596841893e0d17079c27b2d72db1694f26a1932a7429144b439ba0807d29c",
        "collateralResolution": 1000000,
        "syntheticId": "0x4254432d3130000000000000000000",
        "syntheticResolution": 10000000000
      }
    }
  ]
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].name
  * Required: yes
  * Type: string
  * Description: Name of the market.
* Parameter: data[].assetName
  * Required: yes
  * Type: string
  * Description: Name of the base asset.
* Parameter: data[].assetPrecision
  * Required: yes
  * Type: number
  * Description: Number of decimals for the base asset.
* Parameter: data[].collateralAssetName
  * Required: yes
  * Type: string
  * Description: Name of the collateral asset.
* Parameter: data[].collateralAssetPrecision
  * Required: yes
  * Type: number
  * Description: Number of decimals for the collateral asset.
* Parameter: data[].active
  * Required: yes
  * Type: boolean
  * Description: Indicates if the market is currently active. Can be true or false.
* Parameter: data[].status
  * Required: yes
  * Type: string
  * Description: Market status.
* Parameter: data[].marketStats.dailyVolume
  * Required: yes
  * Type: string
  * Description: Trading volume of the market in the previous 24 hours in the collateral asset.
* Parameter: data[].marketStats.dailyVolumeBase
  * Required: yes
  * Type: string
  * Description: Trading volume of the market in the previous 24 hours in the base asset.
* Parameter: data[].marketStats.dailyPriceChange
  * Required: yes
  * Type: string
  * Description: Absolute price change of the last trade price over the past 24 hours.
* Parameter: data[].marketStats.dailyPriceChangePercentage
  * Required: yes
  * Type: string
  * Description: Percent price change of the last trade price over the past 24 hours.
* Parameter: data[].marketStats.dailyLow
  * Required: yes
  * Type: string
  * Description: Lowest trade price over the past 24 hours.
* Parameter: data[].marketStats.dailyHigh
  * Required: yes
  * Type: string
  * Description: Highest trade price over the past 24 hours.
* Parameter: data[].marketStats.lastPrice
  * Required: yes
  * Type: string
  * Description: Last price of the market.
* Parameter: data[].marketStats.askPrice
  * Required: yes
  * Type: string
  * Description: Current best ask price of the market.
* Parameter: data[].marketStats.bidPrice
  * Required: yes
  * Type: string
  * Description: Current best bid price of the market.
* Parameter: data[].marketStats.markPrice
  * Required: yes
  * Type: string
  * Description: Current mark price of the market.
* Parameter: data[].marketStats.indexPrice
  * Required: yes
  * Type: string
  * Description: Current index price of the market.
* Parameter: data[].marketStats.fundingRate
  * Required: yes
  * Type: string
  * Description: Current funding rate, calculated every minute.
* Parameter: data[].marketStats.nextFundingRate
  * Required: yes
  * Type: number
  * Description: Timestamp of the next funding update.
* Parameter: data[].marketStats.openInterest
  * Required: yes
  * Type: string
  * Description: Open interest in collateral asset.
* Parameter: data[].marketStats.openInterestBase
  * Required: yes
  * Type: string
  * Description: Open interest in base asset.
* Parameter: data[].tradingConfig.minOrderSize
  * Required: yes
  * Type: string
  * Description: Minimum order size for the market.
* Parameter: data[].tradingConfig.minOrderSizeChange
  * Required: yes
  * Type: string
  * Description: Minimum order size change for the market.
* Parameter: data[].tradingConfig.minPriceChange
  * Required: yes
  * Type: string
  * Description: Minimum price change for the market.
* Parameter: data[].tradingConfig.maxMarketOrderValue
  * Required: yes
  * Type: string
  * Description: Maximum market order value for the market.
* Parameter: data[].tradingConfig.maxLimitOrderValue
  * Required: yes
  * Type: string
  * Description: Maximum limit order value for the market.
* Parameter: data[].tradingConfig.maxPositionValue
  * Required: yes
  * Type: string
  * Description: Maximum position value for the market.
* Parameter: data[].tradingConfig.maxLeverage
  * Required: yes
  * Type: string
  * Description: Maximum leverage available for the market.
* Parameter: data[].tradingConfig.maxNumOrders
  * Required: yes
  * Type: string
  * Description: Maximum number of open orders for the market.
* Parameter: data[].tradingConfig.limitPriceCap
  * Required: yes
  * Type: string
  * Description: Limit order price cap.
* Parameter: data[].tradingConfig.limitPriceFloor
  * Required: yes
  * Type: string
  * Description: Limit order floor ratio.
* Parameter: data[].l2Config.type
  * Required: yes
  * Type: string
  * Description: Type of Layer 2 solution. Currently, only 'STARKX' is supported.
* Parameter: data[].l2Config.collateralId
  * Required: yes
  * Type: string
  * Description: Starknet collateral asset ID.
* Parameter: data[].l2Config.collateralResolution
  * Required: yes
  * Type: number
  * Description: Collateral asset resolution, the number of quantums (Starknet units) that fit within one "human-readable" unit of the collateral asset.
* Parameter: data[].l2Config.syntheticId
  * Required: yes
  * Type: string
  * Description: Starknet synthetic asset ID.
* Parameter: data[].l2Config.syntheticResolution
  * Required: yes
  * Type: number
  * Description: Synthetic asset resolution, the number of quantums (Starknet units) that fit within one "human-readable" unit of the synthetic asset.


Get market statistics
---------------------

### HTTP Request

`GET /api/v1/info/markets/{market}/stats`

Get the latest trading statistics for an individual market.

Please note that the returned funding rate represents the most recent funding rate, which is calculated every minute.

### URL Parameters


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|market   |yes     |string|Name of the requested market.|


> Successful response example:

```
{
  "status": "OK",
  "data": {
    "dailyVolume": "10283410.122959",
    "dailyVolumeBase": "3343.1217",
    "dailyPriceChange": "-26.00",
    "dailyPriceChangePercentage": "-0.0084",
    "dailyLow": "3057.98",
    "dailyHigh": "3133.53",
    "lastPrice": "3085.70",
    "askPrice": "3089.05",
    "bidPrice": "3087.50",
    "markPrice": "3088.439710293828",
    "indexPrice": "3089.556987078441",
    "fundingRate": "-0.000059",
    "nextFundingRate": 1716192000000,
    "openInterest": "35827242.257619",
    "openInterestBase": "11600.4344",
    "deleverageLevels": {
      "shortPositions": [
        {
          "level": 1,
          "rankingLowerBound": "-1354535.1454"
        },
        {
          "level": 2,
          "rankingLowerBound": "-6.3450"
        },
        {
          "level": 3,
          "rankingLowerBound": "-0.3419"
        },
        {
          "level": 4,
          "rankingLowerBound": "0.0000"
        }
      ],
      "longPositions": [
        {
          "level": 1,
          "rankingLowerBound": "-2978.4427"
        },
        {
          "level": 2,
          "rankingLowerBound": "0.0000"
        },
        {
          "level": 3,
          "rankingLowerBound": "0.0000"
        },
        {
          "level": 4,
          "rankingLowerBound": "0.0001"
        }
      ]
    }
  }
}

```


> Error response example:

```
{
  "status": "ERROR",
  "error": {
    "code": "NOT_FOUND",
    "message": "Market not found"
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data.dailyVolume
  * Required: yes
  * Type: string
  * Description: Trading volume of the market in the previous 24 hours in the collateral asset.
* Parameter: data.dailyVolumeBase
  * Required: yes
  * Type: string
  * Description: Trading volume of the market in the previous 24 hours in the base asset.
* Parameter: data.dailyPriceChange
  * Required: yes
  * Type: string
  * Description: Absolute price change of the last trade price over the past 24 hours.
* Parameter: data.dailyPriceChangePercentage
  * Required: yes
  * Type: string
  * Description: Percent price change of the last trade price over the past 24 hours.
* Parameter: data.dailyLow
  * Required: yes
  * Type: string
  * Description: Lowest trade price over the past 24 hours.
* Parameter: data.dailyHigh
  * Required: yes
  * Type: string
  * Description: Highest trade price over the past 24 hours.
* Parameter: data.lastPrice
  * Required: yes
  * Type: string
  * Description: Last price of the market.
* Parameter: data.askPrice
  * Required: yes
  * Type: string
  * Description: Current best ask price of the market.
* Parameter: data.bidPrice
  * Required: yes
  * Type: string
  * Description: Current best bid price of the market.
* Parameter: data.markPrice
  * Required: yes
  * Type: string
  * Description: Current mark price of the market.
* Parameter: data.indexPrice
  * Required: yes
  * Type: string
  * Description: Current index price of the market.
* Parameter: data.fundingRate
  * Required: yes
  * Type: string
  * Description: Current funding rate, calculated every minute.
* Parameter: data.nextFundingRate
  * Required: yes
  * Type: number
  * Description: Timestamp of the next funding update.
* Parameter: data.openInterest
  * Required: yes
  * Type: string
  * Description: Open interest in collateral asset.
* Parameter: data.openInterestBase
  * Required: yes
  * Type: string
  * Description: Open interest in base asset.
* Parameter: data.deleverageLevels
  * Required: yes
  * Type: enum
  * Description: Auto Deleveraging (ADL) levels for long and short positions, ranging from level 1 (lowest risk) to level 4 (highest risk) of ADL. For details, please refer to the documentation.


Get market order book
---------------------

### HTTP Request

`GET /api/v1/info/markets/{market}/orderbook`

Get the latest orderbook for an individual market.

### URL Parameters


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|market   |yes     |string|Name of the requested market.|


> Successful response example:

```
{
  "status": "OK",
  "data": {
    "market": "BTC-USD",
    "bid": [
      {
        "qty": "0.04852",
        "price": "61827.7"
      },
      {
        "qty": "0.50274",
        "price": "61820.5"
      }
    ],
    "ask": [
      {
        "qty": "0.04852",
        "price": "61840.3"
      },
      {
        "qty": "0.4998",
        "price": "61864.1"
      }
    ]
  }
}

```


> Error response example:

```
{
  "status": "ERROR",
  "error": {
    "code": "NOT_FOUND",
    "message": "Market not found"
  }
}

```


### Response


|Parameter       |Required|Type    |Description             |
|----------------|--------|--------|------------------------|
|status          |yes     |string  |Can be OK or ERROR.     |
|data.market     |yes     |string  |Market name.            |
|data.bid        |yes     |object[]|List of bid orders.     |
|data.bid[].qty  |yes     |string  |Qty for the price level.|
|data.bid[].price|yes     |string  |Bid price.              |
|data.ask        |yes     |object[]|List of ask orders.     |
|data.ask[].qty  |yes     |string  |Qty for the price level.|
|data.ask[].price|yes     |string  |Ask price.              |


Get market last trades
----------------------

### HTTP Request

`GET /api/v1/info/markets/{market}/trades`

Get the latest trade for an individual market.

### URL Parameters


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|market   |yes     |string|Name of the requested market.|


> Successful response example:

```
{
  "status": "OK",
  "data": [
    {
      "i": 1844000421446684673,
      "m": "BTC-USD",
      "S": "SELL",
      "tT": "TRADE",
      "T": 1728478935001,
      "p": "61998.5",
      "q": "0.04839"
    },
    {
      "i": 1844000955650019328,
      "m": "BTC-USD",
      "S": "SELL",
      "tT": "TRADE",
      "T": 1728479062365,
      "p": "61951.4",
      "q": "0.00029"
    }
  ]
}

```


> Error response example:

```
{
  "status": "ERROR",
  "error": {
    "code": "NOT_FOUND",
    "message": "Market not found"
  }
}

```


### Response


|Parameter|Type  |Description                                               |
|---------|------|----------------------------------------------------------|
|data[].i |number|Trade ID.                                                 |
|data[].m |string|Market name.                                              |
|data[].S |string|Side of taker trades. Can be BUY or SELL.                 |
|data[].tT|string|Trade type. Can be TRADE, LIQUIDATION or DELEVERAGE.      |
|data[].T |number|Timestamp (in epoch milliseconds) when the trade happened.|
|data[].p |string|Trade price.                                              |
|data[].q |string|Trade quantity in base asset.                             |


Get candles history
-------------------

### HTTP Request

`GET /api/v1/info/candles/{market}/{candleType}`

Get the candles history for an individual market for the timeframe specified in the request. Candles are sorted by timestamp in descending order.

Available price types include:

1.  Trades (last) price: `GET /api/v1/info/candles/{market}/trades`.
    
2.  Mark price: `GET /api/v1/info/candles/{market}/mark-prices`.
    
3.  Index price: `GET /api/v1/info/candles/{market}/index-prices`.
    

The endpoint returns a maximum of 10,000 records.

### URL Parameters


|Parameter |Required|Type  |Description                                             |
|----------|--------|------|--------------------------------------------------------|
|market    |yes     |string|Name of the requested market.                           |
|candleType|yes     |string|Price type. Can be trades, mark-prices, or index-prices.|


### Query Parameters


|Parameter|Required|Type  |Description                                                    |
|---------|--------|------|---------------------------------------------------------------|
|interval |yes     |string|The time interval between data points.                         |
|limit    |yes     |number|The maximum number of items that should be returned.           |
|endTime  |no      |number|End timestamp (in epoch milliseconds) for the requested period.|


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "o": "65206.2",
      "l": "65206.2",
      "h": "65206.2",
      "c": "65206.2",
      "v": "0.0",
      "T": 1715797320000
    }
  ]
}

```


### Response


|Parameter|Required|Type  |Description                                               |
|---------|--------|------|----------------------------------------------------------|
|status   |yes     |string|Can be OK or ERROR                                        |
|data[].o |yes     |string|Open price.                                               |
|data[].c |yes     |string|Close price.                                              |
|data[].h |yes     |string|Highest price.                                            |
|data[].l |yes     |string|Lowest price.                                             |
|data[].v |yes     |string|Trading volume (Only for trades candles).                 |
|data[].T |yes     |number|Starting timestamp (in epoch milliseconds) for the candle.|


Get funding rates history
-------------------------

### HTTP Request

`GET /api/v1/info/{market}/funding?startTime={startTime}&endTime={endTime}`

Get the funding rates history for an individual market for the timeframe specified in the request. The funding rates are sorted by timestamp in descending order.

The endpoint returns a maximum of 10,000 records; pagination should be used to access records beyond this limit.

While the funding rate is calculated every minute, it is only applied once per hour. The records represent the 1-hour rates that were applied for the payment of funding fees.

For details on how the funding rate is calculated on Extended, please refer to the [documentation](https://docs.extended.exchange/extended-resources/trading/funding-payments).

### URL Parameters


|Parameter|Required|Type  |Description                   |
|---------|--------|------|------------------------------|
|market   |yes     |string|Names of the requested market.|


### Query Parameters



* Parameter: startTime
  * Required: yes
  * Type: number
  * Description: Starting timestamp (in epoch milliseconds) for the requested period.
* Parameter: endTime
  * Required: yes
  * Type: number
  * Description: Ending timestamp (in epoch milliseconds) for the requested period.
* Parameter: cursor
  * Required: no
  * Type: number
  * Description: Determines the offset of the returned result. To get the next result page, you can use the cursor from the pagination section of the previous response.
* Parameter: limit
  * Required: no
  * Type: number
  * Description: Maximum number of items that should be returned.


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "m": "BTC-USD",
      "T": 1701563440,
      "f": "0.001"
    }
  ],
  "pagination": {
    "cursor": 1784963886257016832,
    "count": 1
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].m
  * Required: yes
  * Type: string
  * Description: Name of the requested market.
* Parameter: data[].T
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the funding rate was calculated and applied.
* Parameter: data[].f
  * Required: yes
  * Type: string
  * Description: Funding rates used for funding fee payments.


Get open interest history
-------------------------

### HTTP Request

`GET /api/v1/info/{market}/open-interests?interval={interval}&startTime={startTime}&endTime={endTime}`

Get the open interest history for an individual market for the timeframe specified in the request. The open interests are sorted by timestamp in descending order.

The endpoint returns a maximum of 300 records; proper combination of start and end time should be used to access records beyond this limit.

### URL Parameters


|Parameter|Required|Type  |Description                   |
|---------|--------|------|------------------------------|
|market   |yes     |string|Names of the requested market.|


### Query Parameters


|Parameter|Required|Type  |Description                                                         |
|---------|--------|------|--------------------------------------------------------------------|
|startTime|yes     |number|Starting timestamp (in epoch milliseconds) for the requested period.|
|endTime  |yes     |number|Ending timestamp (in epoch milliseconds) for the requested period.  |
|interval |yes     |enum  |P1H for hour and P1D for day                                        |
|limit    |no      |number|Maximum number of items that should be returned.                    |


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "i": "151193.8952300000000000",
      "I": "430530.0000000000000000",
      "t": 1749513600000
    },
    {
      "i": "392590.9522500000000000",
      "I": "1147356.0000000000000000",
      "t": 1749600000000
    },
    {
      "i": "397721.7285100000000000",
      "I": "1224362.0000000000000000",
      "t": 1749686400000
    }
  ]
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].i
  * Required: yes
  * Type: string
  * Description: Open interest in USD.
* Parameter: data[].I
  * Required: yes
  * Type: string
  * Description: Open interest in synthetic asset.
* Parameter: data[].t
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the funding rate was calculated and applied.


Private REST-API
----------------

Account
-------

You can create up to ten Extended sub-accounts for each wallet address. For more details, please refer to the [Authentication section](https://api.docs.extended.exchange/#authentication) of the API Documentation.

The Private API endpoints listed below grant access to details specific to each sub-account, such as balances, transactions, positions, orders, trades, and the fee rates applied. Additionally, there are endpoints for retrieving the current leverage and adjusting it.

Please note that all endpoints in this section will only return records for the authenticated sub-account.

Get account details
-------------------

### HTTP Request

`GET /api/v1/user/account/info`

> Response example:

```
 {
  "status": "OK",
  "data": {
    "status": "ACTIVE",
    "l2Key": "0x123",
    "l2Vault": 321,
    "accountId": 123,
    "description": "abc",
    "bridgeStarknetAddress": "0x21be84f913dbddbfc0a3993e1f949933139f427f88eb6bfd247ab3ef7174487"
  }
}

```


Get current account details.

### Response


|Parameter                 |Required|Type  |Description                               |
|--------------------------|--------|------|------------------------------------------|
|status                    |yes     |string|Can be OK or ERROR.                       |
|data.status               |yes     |string|Account status.                           |
|data.l2Key                |yes     |string|Account public key in perp contract.      |
|data.l2Vault              |yes     |string|Position ID in perp contract.             |
|data.accountId            |yes     |string|Account ID.                               |
|data.description          |no      |string|Account description (name).               |
|data.bridgeStarknetAddress|yes     |string|Starknet account address for EVM bridging.|


Get balance
-----------

### HTTP Request

`GET /api/v1/user/balance`

Get key balance details for the authenticated sub-account. Returns a 404 error if the user’s balance is 0.

1.  Account Balance = Deposits - Withdrawals + Realised PnL.
    
2.  Equity = Account Balance + Unrealised PnL.
    
3.  Available Balance for Trading = Equity - Initial Margin Requirement.
    
4.  Available Balance for Withdrawals = max(0, Wallet Balance + min(0,Unrealised PnL) - Initial Margin Requirement).
    
5.  Unrealised PnL (mark-price-based) = The sum of unrealised PnL across open positions, calculated as Position Size \* (Mark Price - Entry Price).
    
6.  Unrealised PnL (mid-price-based) = The sum of unrealised PnL across open positions, calculated as Position Size \* (Mid Price - Entry Price).
    
7.  Initial Margin Requirement for a given market = Max(Abs(Position Value + Value of Buy Orders), Abs(Position Value + Value of Sell Orders))\*1/Leverage.
    
8.  Account Margin Ratio = Maintenance Margin requirement of all open positions / Equity. Liquidation is triggered when Account Margin Ratio > 100%.
    
9.  Account Exposure = Sum(All positions value)
    
10.  Account Leverage = Exposure / Equity.
     

> Response example:

```
{
  "status": "OK",
  "data": {
    "collateralName": "USDC",
    "balance": "13500",
    "equity": "12000",
    "availableForTrade": "1200",
    "availableForWithdrawal": "100",
    "unrealisedPnl": "-10.1",
    "initialMargin": "160",
    "marginRatio": "1.5",
    "exposure": "12751.859629",
    "leverage": "1275.1860",
    "updatedTime": 1701563440
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data.collateralName
  * Required: yes
  * Type: string
  * Description: Name of the collateral asset used for the account.
* Parameter: data.balance
  * Required: yes
  * Type: string
  * Description: Account balance expressed in the collateral asset, also known as Wallet balance.
* Parameter: data.equity
  * Required: yes
  * Type: string
  * Description: Equity of the account.
* Parameter: data.availableForTrade
  * Required: yes
  * Type: string
  * Description: Available Balance for Trading.
* Parameter: data.availableForWithdrawal
  * Required: yes
  * Type: string
  * Description: Available Balance for Withdrawals.
* Parameter: data.unrealisedPnl
  * Required: yes
  * Type: string
  * Description: Current unrealised PnL of the account.
* Parameter: data.initialMargin
  * Required: yes
  * Type: string
  * Description: Collateral used to open the positions and orders.
* Parameter: data.marginRatio
  * Required: yes
  * Type: string
  * Description: Margin ratio of the account.
* Parameter: data.exposure
  * Required: yes
  * Type: string
  * Description: Exposure of the account.
* Parameter: data.leverage
  * Required: yes
  * Type: string
  * Description: Leverage of the account.
* Parameter: data.updatedTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the server generated the balance message.


Get deposits, withdrawals, transfers history
--------------------------------------------

### HTTP Request

`GET /api/v1/user/assetOperations?&type={type}&status={status}`

Get the history of deposits, withdrawals, and transfers between sub-accounts for the authenticated sub-account. Optionally, the request can be filtered by a specific transaction type or status.

The endpoint returns 50 records per page; pagination should be used to access records beyond this limit. Transactions are sorted by timestamp in descending order.

### Transactions types


|Transaction|Description                                             |
|-----------|--------------------------------------------------------|
|DEPOSIT    |Deposit.                                                |
|CLAIM      |Testing funds claim. Available only on Extended Testnet.|
|TRANSFER   |Transfer between sub-accounts within one wallet.        |
|WITHDRAWAL |Withdrawal.                                             |


### Transactions statuses


|Status     |Description                                                             |
|-----------|------------------------------------------------------------------------|
|CREATED    |Transaction created on Extended.                                        |
|IN_PROGRESS|Transaction is being processed by Extended, Starknet or bridge provider.|
|COMPLETED  |Transaction completed.                                                  |
|REJECTED   |Transaction rejected.                                                   |


> Response example:

```
{
    "status": "OK",
    "data": [
        {
            "id": "1951255127004282880",
            "type": "TRANSFER",
            "status": "COMPLETED",
            "amount": "-3.0000000000000000",
            "fee": "0",
            "asset": 1,
            "time": 1754050449502,
            "accountId": 100009,
            "counterpartyAccountId": 100023
        },
        {
            "id": "0x6795eac4ebbdd9fb88f85e3ce4ce4e61895049591c89ad5db8046a4546d2cdd",
            "type": "DEPOSIT",
            "status": "COMPLETED",
            "amount": "4.9899990000000000",
            "fee": "0.0000000000000000",
            "asset": 1,
            "time": 1753872990528,
            "accountId": 100009,
            "transactionHash": "0x93829e61480b528bb18c1b94f0afbc672fb2b340fbfd2f329dffc4180e24b894",
            "chain": "ETH"
        },
        {
            "id": "1950490023665475584",
            "type": "WITHDRAWAL",
            "status": "COMPLETED",
            "amount": "-4.0000000000000000",
            "fee": "0.0001000000000000",
            "asset": 1,
            "time": 1753868034651,
            "accountId": 100009,
            "transactionHash": "0x6d89968d72fc766691d4772048edaf667c88894aedf71f0490c2592c1d268691",
            "chain": "ETH"
        },
    ],
    "pagination": {
        "cursor": 23,
        "count": 23
    }
}

```


### Query Parameters



* Parameter: type
  * Required: no
  * Type: string
  * Description: Transaction type. Refer to the list of transaction types in the endpoint description above.
* Parameter: status
  * Required: no
  * Type: string
  * Description: Transaction status. Refer to the list of statuses in the endpoint description above.
* Parameter: cursor
  * Required: no
  * Type: 
  * Description: Determines the offset of the returned result. It represents the ID of the item after which you want to retrieve the next result. To get the next result page, you can use the cursor from the pagination section of the previous response.
* Parameter: limit
  * Required: no
  * Type: number
  * Description: Maximum number of items that should be returned.


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Response status. Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number or string
  * Description: Transaction ID. A number assigned by Extended for transfers and withdrawals. An onchain id string for deposits.
* Parameter: data[].type
  * Required: yes
  * Type: string
  * Description: Transaction type. Refer to the list of transaction types in the endpoint description above.
* Parameter: data[].status
  * Required: yes
  * Type: string
  * Description: Transaction status. Refer to the list of statuses in the endpoint description above.
* Parameter: data[].amount
  * Required: yes
  * Type: string
  * Description: Transaction amount, absolute value in collateral asset.
* Parameter: data[].fee
  * Required: yes
  * Type: string
  * Description: Fee paid.
* Parameter: data[].asset
  * Required: yes
  * Type: string
  * Description: Collateral asset name.
* Parameter: data[].time
  * Required: yes
  * Type: number
  * Description: Timestamp (epoch milliseconds) when the transaction was updated.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID; source account for transfers and withdrawals; destination account for deposits.
* Parameter: data[].counterpartyAccountId
  * Required: no
  * Type: number
  * Description: Account ID; destination account for transfers.
* Parameter: data[].transactionHash
  * Required: no
  * Type: string
  * Description: Onchain transaction hash. Not available for transfers.
* Parameter: 
  * Required: 
  * Type: 
  * Description: 
* Parameter: data[].chain
  * Required: no
  * Type: string
  * Description: Source chain name for deposits; target chain name for withdrawals.


Get positions
-------------

### HTTP Request

`GET /api/v1/user/positions?market={market}&side={side}`

Get all open positions for the authenticated sub-account. Optionally, the request can be filtered by a specific market or position side (`long` or `short`).

To request data for multiple markets, use the following format: `GET /api/v1/user/positions?market=market1&market2`.

### Query Parameters


|Parameter|Required|Type  |Description                            |
|---------|--------|------|---------------------------------------|
|market   |no      |string|List of names of the requested markets.|
|side     |no      |string|Position side. Can be LONG or SHORT.   |


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 1,
      "accountId": 1,
      "market": "BTC-USD",
      "side": "LONG",
      "leverage": "10",
      "size": "0.1",
      "value": "4000",
      "openPrice": "39000",
      "markPrice": "40000",
      "liquidationPrice": "38200",
      "margin": "20",
      "unrealisedPnl": "1000",
      "realisedPnl": "1.2",
      "tpTriggerPrice": "41000",
      "tpLimitPrice": "41500",
      "slTriggerPrice": "39500",
      "slLimitPrice": "39000",
      "adl": "2.5",
      "maxPositionSize": "0.2",
      "createdTime": 1701563440000,
      "updatedTime": 1701563440
    }
  ]
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Position ID assigned by Extended.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Position side. Can be LONG or SHORT.
* Parameter: data[].leverage
  * Required: yes
  * Type: string
  * Description: Position leverage.
* Parameter: data[].size
  * Required: yes
  * Type: string
  * Description: Position size, absolute value in base asset.
* Parameter: data[].value
  * Required: yes
  * Type: string
  * Description: Position value, absolute value in collateral asset.
* Parameter: data[].openPrice
  * Required: yes
  * Type: string
  * Description: Position's open (entry) price.
* Parameter: data[].markPrice
  * Required: yes
  * Type: string
  * Description: Current mark price of the market.
* Parameter: data[].liquidationPrice
  * Required: yes
  * Type: string
  * Description: Position's liquidation price.
* Parameter: data[].margin
  * Required: yes
  * Type: string
  * Description: Position's margin in collateral asset.
* Parameter: data[].unrealisedPnl
  * Required: yes
  * Type: string
  * Description: Position's Unrealised PnL.
* Parameter: data[].realisedPnl
  * Required: yes
  * Type: string
  * Description: Position's Realised PnL.
* Parameter: data[].tpTriggerPrice
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price.
* Parameter: data[].tpLimitPrice
  * Required: no
  * Type: string
  * Description: Take Profit Limit price.
* Parameter: data[].slTriggerPrice
  * Required: no
  * Type: string
  * Description: Stop Loss Trigger price.
* Parameter: data[].slLimitPrice
  * Required: no
  * Type: string
  * Description: Stop Loss Limit price.
* Parameter: data[].maxPositionSize
  * Required: yes
  * Type: string
  * Description: Maximum allowed position size, absolute value in base asset.
* Parameter: data[].adl
  * Required: yes
  * Type: string
  * Description: Position's Auto-Deleveraging (ADL) ranking in the queue, expressed as a percentile. A value closer to 100 indicates a higher likelihood of being ADLed.
* Parameter: data[].createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (epoch milliseconds) when the position was created.
* Parameter: data[].updatedTime
  * Required: yes
  * Type: number
  * Description: Timestamp (epoch milliseconds) when the position was updated.


Get positions history
---------------------

### HTTP Request

`GET /api/v1/user/positions/history?market={market}&side={side}`

Get all open and closed positions for the authenticated sub-account. Optionally, the request can be filtered by a specific market or position side (`long` or `short`).

To request data for several markets, use the following format: GET /api/v1/user/positions/history?market=market1&market2.

The endpoint returns a maximum of 10,000 records; pagination should be used to access records beyond this limit.

### Query Parameters



* Parameter: market
  * Required: no
  * Type: string
  * Description: List of names of the requested markets.
* Parameter: side
  * Required: no
  * Type: string
  * Description: Position side. Can be long or short.
* Parameter: cursor
  * Required: no
  * Type: number
  * Description: Determines the offset of the returned result. It represents the ID of the item after which you want to retrieve the next result. To get the next result page, you can use the cursor from the pagination section of the previous response.
* Parameter: limit
  * Required: no
  * Type: number
  * Description: Maximum number of items that should be returned.


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 1784963886257016832,
      "accountId": 1,
      "market": "BTC-USD",
      "side": "LONG",
      "exitType": "TRADE",
      "leverage": "10",
      "size": "0.1",
      "maxPositionSize": "0.2",
      "openPrice": "39000",
      "exitPrice": "40000",
      "realisedPnl": "1.2",
      "createdTime": 1701563440000,
      "closedTime": 1701563440
    }
  ],
  "pagination": {
    "cursor": 1784963886257016832,
    "count": 1
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Position ID assigned by Extended.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Position side. Can be LONG or SHORT.
* Parameter: data[].exitType
  * Required: no
  * Type: string
  * Description: The exit type of the last trade that reduced the position. Can be TRADE, LIQUIDATION, or DELEVERAGE.
* Parameter: data[].leverage
  * Required: yes
  * Type: string
  * Description: Position leverage.
* Parameter: data[].size
  * Required: yes
  * Type: string
  * Description: Position size, absolute value in base asset.
* Parameter: data[].maxPositionSize
  * Required: yes
  * Type: string
  * Description: Maximum position size during the position's lifetime, absolute value in base asset.
* Parameter: data[].openPrice
  * Required: yes
  * Type: string
  * Description: The weighted average price of trades that contributed to increasing the position.
* Parameter: data[].exitPrice
  * Required: no
  * Type: string
  * Description: The weighted average price of trades that contributed to decreasing the position.
* Parameter: data[].realisedPnl
  * Required: yes
  * Type: string
  * Description: Position Realised PnL.
* Parameter: data[].createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the position was created.
* Parameter: data[].closedTime
  * Required: no
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the position was closed, applicable only for closed positions.


Get open orders
---------------

### HTTP Request

`GET /api/v1/user/orders?market={market}&type={type}&side={side}`

Get all open orders for the authenticated sub-account. Optionally, the request can be filtered by a specific market or order type (`limit`, `conditional`, `tpsl` or `twap`).

Open orders correspond to the following order statuses from the list below: `new`, `partially filled`, `untriggered`.

To request data for several markets, use the following format: `GET /api/v1/user/orders?market=market1&market2`.

### Order statuses


|Status          |Description                                          |
|----------------|-----------------------------------------------------|
|NEW             |Order in the order book, unfilled.                   |
|PARTIALLY_FILLED|Order in the order book, partially filled.           |
|FILLED          |Order fully filled.                                  |
|UNTRIGGERED     |Conditional order waiting for the trigger price.     |
|CANCELLED       |Order cancelled.                                     |
|REJECTED        |Order rejected.                                      |
|EXPIRED         |Order expired.                                       |
|TRIGGERED       |Technical status, transition from UNTRIGGERED to NEW.|


### Order status reasons (when cancelled or rejected)


|Reason                |Description                                                          |
|----------------------|---------------------------------------------------------------------|
|NONE                  |Order was accepted.                                                  |
|UNKNOWN               |Technical status reason.                                             |
|UNKNOWN_MARKET        |Market does not exist.                                               |
|DISABLED_MARKET       |Market is not active.                                                |
|NOT_ENOUGH_FUNDS      |Insufficient balance to create order.                                |
|NO_LIQUIDITY          |Not enough liquidity in the market to execute the order.             |
|INVALID_FEE           |Fee specified in the create order request is invalid.                |
|INVALID_QTY           |Quantity specified is invalid.                                       |
|INVALID_PRICE         |Price specified is invalid.                                          |
|INVALID_VALUE         |Order exceeds the maximum value.                                     |
|UNKNOWN_ACCOUNT       |Account does not exist.                                              |
|SELF_TRADE_PROTECTION |Order cancelled to prevent self-trading.                             |
|POST_ONLY_FAILED      |Order could not be posted as a post-only order.                      |
|REDUCE_ONLY_FAILED    |Reduce-only order failed due to position size conflict.              |
|INVALID_EXPIRE_TIME   |Expiration time specified is invalid.                                |
|POSITION_TPSL_CONFLICT|TPSL order for the entire position already exists.                   |
|INVALID_LEVERAGE      |Leverage specified is invalid.                                       |
|PREV_ORDER_NOT_FOUND  |The order to be replaced does not exist.                             |
|PREV_ORDER_TRIGGERED  |The order to be replaced has been triggered and cannot be replaced.  |
|TPSL_OTHER_SIDE_FILLED|The opposite side of a TP/SL order has been filled.                  |
|PREV_ORDER_CONFLICT   |Conflict with an existing order during replacement.                  |
|ORDER_REPLACED        |Order has been replaced by another order.                            |
|POST_ONLY_MODE        |Exchange is in post-only mode, only post-only orders are allowed.    |
|REDUCE_ONLY_MODE      |Exchange is in reduce-only mode, only reduce-only orders are allowed.|
|TRADING_OFF_MODE      |Trading is currently disabled.                                       |
|NEGATIVE_EQUITY       |Account has negative equity.                                         |
|ACCOUNT_LIQUIDATION   |Account is under liquidation.                                        |


### Query Parameters


|Parameter|Required|Type  |Description                                         |
|---------|--------|------|----------------------------------------------------|
|market   |no      |string|List of names of the requested markets.             |
|type     |no      |string|Order type. Can be LIMIT, CONDITIONAL, TPSL or TWAP.|
|side     |no      |string|Order side. Can be BUY or SELL.                     |


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 1775511783722512384,
      "accountId": 3017,
      "externalId": "2554612759479898620327573136214120486511160383028978112799136270841501275076",
      "market": "ETH-USD",
      "type": "LIMIT",
      "side": "BUY",
      "status": "PARTIALLY_FILLED",
      "price": "3300",
      "averagePrice": "3297.00",
      "qty": "0.2",
      "filledQty": "0.1",
      "payedFee": "0.0120000000000000",
      "trigger": {
        "triggerPrice": "3300",
        "triggerPriceType": "LAST",
        "triggerPriceDirection": "UP",
        "executionPriceType": "MARKET"
      },
      "takeProfit": {
        "triggerPrice": "3500",
        "triggerPriceType": "LAST",
        "price": "3340",
        "priceType": "MARKET"
      },
      "stopLoss": {
        "triggerPrice": "2800",
        "triggerPriceType": "LAST",
        "price": "2660",
        "priceType": "MARKET"
      },
      "reduceOnly": false,
      "postOnly": false,
      "createdTime": 1701563440000,
      "updatedTime": 1701563440000,
      "timeInForce": "IOC",
      "expireTime": 1712754771819
    }
  ]
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Order ID assigned by Extended.
* Parameter: data[].externalId
  * Required: yes
  * Type: string
  * Description: Order ID assigned by user.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].status
  * Required: yes
  * Type: string
  * Description: Order status.
* Parameter: data[].statusReason
  * Required: no
  * Type: string
  * Description: Reason for REJECTED or CANCELLED status.
* Parameter: data[].type
  * Required: yes
  * Type: string
  * Description: Order type. Can be LIMIT, CONDITIONAL, TPSL or TWAP.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Order side. Can be BUY or SELL.
* Parameter: data[].price
  * Required: no
  * Type: string
  * Description: Worst accepted price in the collateral asset.
* Parameter: data[].averagePrice
  * Required: no
  * Type: string
  * Description: Actual filled price, empty if not filled.
* Parameter: data[].qty
  * Required: yes
  * Type: string
  * Description: Order size in base asset.
* Parameter: data[].filledQty
  * Required: no
  * Type: string
  * Description: Actual filled quantity in base asset.
* Parameter: data[].payedFee
  * Required: no
  * Type: string
  * Description: Paid fee.
* Parameter: data[].reduceOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Reduce-only.
* Parameter: data[].postOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Post-only.
* Parameter: data[].trigger.triggerPrice
  * Required: no
  * Type: string
  * Description: Trigger price for conditional orders.
* Parameter: data[].trigger.triggerPriceType
  * Required: no
  * Type: string
  * Description: Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].trigger.triggerPriceDirection
  * Required: no
  * Type: string
  * Description: Indicates whether the order should be triggered when the price is above or below the set trigger price. It can be UP (the order will be triggered when the price reaches or surpasses the set trigger price) or DOWN (the order will be triggered when the price reaches or drops below the set trigger price).
* Parameter: data[].trigger.executionPriceType
  * Required: no
  * Type: string
  * Description: Execution price type. Can be LIMIT or MARKET.
* Parameter: data[].tpSlType
  * Required: no
  * Type: string
  * Description: TPSL type determining TPSL order size. Can be ORDER or POSITION.
* Parameter: data[].takeProfit.triggerPrice
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price.
* Parameter: data[].takeProfit.triggerPriceType
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].takeProfit.price
  * Required: no
  * Type: string
  * Description: Take Profit order price.
* Parameter: data[].takeProfit.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Take profit order should be executed as MARKET or LIMIT order.
* Parameter: data[].stopLoss.triggerPrice
  * Required: no
  * Type: string
  * Description: Stop loss Trigger price.
* Parameter: data[].stopLoss.triggerPriceType
  * Required: no
  * Type: string
  * Description: Stop Loss Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].stopLoss.price
  * Required: no
  * Type: string
  * Description: Stop loss order price.
* Parameter: data[].stopLoss.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Stop loss order should be executed as MARKET or LIMIT order.
* Parameter: data[].createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order creation.
* Parameter: data[].updatedTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order update.
* Parameter: data[].timeInForce
  * Required: yes
  * Type: string
  * Description: Time-in-force. Can be GTT (Good till time) or IOC (Immediate or cancel).
* Parameter: data[].expireTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the order expires.


Get orders history
------------------

### HTTP Request

`GET /api/v1/user/orders/history?market={market}&type={type}&side={side}&id={id}&externalId={externalId}`

Get orders history for the authenticated sub-account. Optionally, the request can be filtered by a specific market or order type (`limit`, `market`, `conditional`, `tpsl` or `twap`). Note: Scaled orders are represented as multiple individual `limit` orders in the system.

Orders history corresponds to the following order statuses from the list below: `filled`, `cancelled`, `rejected`, `expired`.

To request data for several markets, use the following format: `GET /api/v1/user/orders/history?market=market1&market2`.

The endpoint returns a maximum of 10,000 records; pagination should be used to access records beyond this limit. The records for closed non-filled orders are available only for the past 7 days.

### Order statuses


|Status          |Description                                          |
|----------------|-----------------------------------------------------|
|NEW             |Order in the order book, unfilled.                   |
|PARTIALLY_FILLED|Order in the order book, partially filled.           |
|FILLED          |Order fully filled.                                  |
|UNTRIGGERED     |Conditional order waiting for the trigger price.     |
|CANCELLED       |Order cancelled.                                     |
|REJECTED        |Order rejected.                                      |
|EXPIRED         |Order expired.                                       |
|TRIGGERED       |Technical status, transition from UNTRIGGERED to NEW.|


### Query Parameters



* Parameter: id
  * Required: no
  * Type: number
  * Description: List of internal Ids of the requested orders.
* Parameter: externalId
  * Required: no
  * Type: string[]
  * Description: List of external Ids of the requested orders.
* Parameter: market
  * Required: no
  * Type: string[]
  * Description: List of names of the requested markets.
* Parameter: type
  * Required: no
  * Type: string
  * Description: Order type. Can be limit, market, conditional, tpsl or twap.
* Parameter: side
  * Required: no
  * Type: string
  * Description: Order side. Can be buy or sell.
* Parameter: cursor
  * Required: no
  * Type: number
  * Description: Determines the offset of the returned result. It represents the ID of the item after which you want to retrieve the next result. To get the next result page, you can use the cursor from the pagination section of the previous response.
* Parameter: limit
  * Required: no
  * Type: number
  * Description: Maximum number of items that should be returned.


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 1784963886257016832,
      "externalId": "ExtId-1",
      "accountId": 1,
      "market": "BTC-USD",
      "status": "FILLED",
      "type": "LIMIT",
      "side": "BUY",
      "price": "39000",
      "averagePrice": "39000",
      "qty": "0.2",
      "filledQty": "0.1",
      "payedFee": "0.0120000000000000",
      "reduceOnly": false,
      "postOnly": false,
      "trigger": {
        "triggerPrice": "34000",
        "triggerPriceType": "LAST",
        "triggerPriceDirection": "UP",
        "executionPriceType": "MARKET"
      },
      "tpslType": "ORDER",
      "takeProfit": {
        "triggerPrice": "34000",
        "triggerPriceType": "LAST",
        "price": "35000",
        "priceType": "MARKET",
        "starkExSignature": ""
      },
      "stopLoss": {
        "triggerPrice": "34000",
        "triggerPriceType": "LAST",
        "price": "35000",
        "priceType": "MARKET",
        "starkExSignature": ""
      },
      "createdTime": 1701563440000,
      "updatedTime": 1701563440000,
      "timeInForce": "IOC",
      "expireTime": 1706563440
    }
  ],
  "pagination": {
    "cursor": 1784963886257016832,
    "count": 1
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Order ID assigned by Extended.
* Parameter: data[].externalId
  * Required: yes
  * Type: string
  * Description: Order ID assigned by user.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].status
  * Required: yes
  * Type: string
  * Description: Order status.
* Parameter: data[].statusReason
  * Required: no
  * Type: string
  * Description: Reason for REJECTED or CANCELLED status.
* Parameter: data[].type
  * Required: yes
  * Type: string
  * Description: Order type. Can be LIMIT, MARKET, CONDITIONAL, TPSL or TWAP.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Order side. Can be BUY or SELL.
* Parameter: data[].price
  * Required: no
  * Type: string
  * Description: Worst accepted price in the collateral asset.
* Parameter: data[].averagePrice
  * Required: no
  * Type: string
  * Description: Actual filled price, empty if not filled.
* Parameter: data[].qty
  * Required: yes
  * Type: string
  * Description: Order size in base asset.
* Parameter: data[].filledQty
  * Required: no
  * Type: string
  * Description: Actual filled quantity in base asset.
* Parameter: data[].payedFee
  * Required: no
  * Type: string
  * Description: Paid fee.
* Parameter: data[].reduceOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Reduce-only.
* Parameter: data[].postOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Post-only.
* Parameter: data[].trigger.triggerPrice
  * Required: no
  * Type: string
  * Description: Trigger price for conditional orders.
* Parameter: data[].trigger.triggerPriceType
  * Required: no
  * Type: string
  * Description: Trigger price type . Can be LAST, MARK or INDEX.
* Parameter: data[].trigger.triggerPriceDirection
  * Required: no
  * Type: string
  * Description: Indicates whether the order should be triggered when the price is above or below the set trigger price. It can be UP (the order will be triggered when the price reaches or surpasses the set trigger price) or DOWN (the order will be triggered when the price reaches or drops below the set trigger price).
* Parameter: data[].trigger.executionPriceType
  * Required: no
  * Type: string
  * Description: Execution price type. Can be LIMIT or MARKET.
* Parameter: data[].tpSlType
  * Required: no
  * Type: string
  * Description: TPSL type determining TPSL order size. Can be ORDER or POSITION.
* Parameter: data[].takeProfit.triggerPrice
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price.
* Parameter: data[].takeProfit.triggerPriceType
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].takeProfit.price
  * Required: no
  * Type: string
  * Description: Take Profit order price.
* Parameter: data[].takeProfit.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Take profit order should be executed as MARKET or LIMIT order.
* Parameter: data[].stopLoss.triggerPrice
  * Required: no
  * Type: string
  * Description: Stop loss Trigger price.
* Parameter: data[].stopLoss.triggerPriceType
  * Required: no
  * Type: string
  * Description: Stop Loss Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].stopLoss.price
  * Required: no
  * Type: string
  * Description: Stop loss order price.
* Parameter: data[].stopLoss.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Stop loss order should be executed as MARKET or LIMIT order.
* Parameter: data[].createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order creation.
* Parameter: data[].updatedTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order update.
* Parameter: data[].timeInForce
  * Required: yes
  * Type: string
  * Description: Time-in-force. Can be GTT (Good till time) or IOC (Immediate or cancel).
* Parameter: data[].expireTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the order expires.


Get order by id
---------------

### HTTP Request

`GET /api/v1/user/orders/{id}`

Get order by id for the authenticated sub-account.

### Order statuses


|Status          |Description                                          |
|----------------|-----------------------------------------------------|
|NEW             |Order in the order book, unfilled.                   |
|PARTIALLY_FILLED|Order in the order book, partially filled.           |
|FILLED          |Order fully filled.                                  |
|UNTRIGGERED     |Conditional order waiting for the trigger price.     |
|CANCELLED       |Order cancelled.                                     |
|REJECTED        |Order rejected.                                      |
|EXPIRED         |Order expired.                                       |
|TRIGGERED       |Technical status, transition from UNTRIGGERED to NEW.|


### URL Parameters


|Parameter|Required|Type  |Description                                    |
|---------|--------|------|-----------------------------------------------|
|id       |yes     |number|Order to be retrieved, ID assigned by Extended.|


> Response example:

```
{
  "status": "OK",
  "data": {
    "id": 1784963886257016832,
    "externalId": "ExtId-1",
    "accountId": 1,
    "market": "BTC-USD",
    "status": "FILLED",
    "type": "LIMIT",
    "side": "BUY",
    "price": "39000",
    "averagePrice": "39000",
    "qty": "0.2",
    "filledQty": "0.1",
    "payedFee": "0.0120000000000000",
    "reduceOnly": false,
    "postOnly": false,
    "trigger": {
      "triggerPrice": "34000",
      "triggerPriceType": "LAST",
      "triggerPriceDirection": "UP",
      "executionPriceType": "MARKET"
    },
    "tpslType": "ORDER",
    "takeProfit": {
      "triggerPrice": "34000",
      "triggerPriceType": "LAST",
      "price": "35000",
      "priceType": "MARKET",
      "starkExSignature": ""
    },
    "stopLoss": {
      "triggerPrice": "34000",
      "triggerPriceType": "LAST",
      "price": "35000",
      "priceType": "MARKET",
      "starkExSignature": ""
    },
    "createdTime": 1701563440000,
    "updatedTime": 1701563440000,
    "timeInForce": "IOC",
    "expireTime": 1706563440
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data.id
  * Required: yes
  * Type: number
  * Description: Order ID assigned by Extended.
* Parameter: data.externalId
  * Required: yes
  * Type: string
  * Description: Order ID assigned by user.
* Parameter: data.accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data.market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data.status
  * Required: yes
  * Type: string
  * Description: Order status.
* Parameter: data.statusReason
  * Required: no
  * Type: string
  * Description: Reason for REJECTED or CANCELLED status.
* Parameter: data.type
  * Required: yes
  * Type: string
  * Description: Order type. Can be LIMIT, MARKET, CONDITIONAL, TPSL or TWAP.
* Parameter: data.side
  * Required: yes
  * Type: string
  * Description: Order side. Can be BUY or SELL.
* Parameter: data.price
  * Required: no
  * Type: string
  * Description: Worst accepted price in the collateral asset.
* Parameter: data.averagePrice
  * Required: no
  * Type: string
  * Description: Actual filled price, empty if not filled.
* Parameter: data.qty
  * Required: yes
  * Type: string
  * Description: Order size in base asset.
* Parameter: data.filledQty
  * Required: no
  * Type: string
  * Description: Actual filled quantity in base asset.
* Parameter: data.payedFee
  * Required: no
  * Type: string
  * Description: Paid fee.
* Parameter: data.reduceOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Reduce-only.
* Parameter: data.postOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Post-only.
* Parameter: data.trigger.triggerPrice
  * Required: no
  * Type: string
  * Description: Trigger price for conditional orders.
* Parameter: data.trigger.triggerPriceType
  * Required: no
  * Type: string
  * Description: Trigger price type . Can be LAST, MARK or INDEX.
* Parameter: data.trigger.triggerPriceDirection
  * Required: no
  * Type: string
  * Description: Indicates whether the order should be triggered when the price is above or below the set trigger price. It can be UP (the order will be triggered when the price reaches or surpasses the set trigger price) or DOWN (the order will be triggered when the price reaches or drops below the set trigger price).
* Parameter: data.trigger.executionPriceType
  * Required: no
  * Type: string
  * Description: Execution price type. Can be LIMIT or MARKET.
* Parameter: data.tpSlType
  * Required: no
  * Type: string
  * Description: TPSL type determining TPSL order size. Can be ORDER or POSITION.
* Parameter: data.takeProfit.triggerPrice
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price.
* Parameter: data.takeProfit.triggerPriceType
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data.takeProfit.price
  * Required: no
  * Type: string
  * Description: Take Profit order price.
* Parameter: data.takeProfit.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Take profit order should be executed as MARKET or LIMIT order.
* Parameter: data.stopLoss.triggerPrice
  * Required: no
  * Type: string
  * Description: Stop loss Trigger price.
* Parameter: data.stopLoss.triggerPriceType
  * Required: no
  * Type: string
  * Description: Stop Loss Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data.stopLoss.price
  * Required: no
  * Type: string
  * Description: Stop loss order price.
* Parameter: data.stopLoss.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Stop loss order should be executed as MARKET or LIMIT order.
* Parameter: data.createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order creation.
* Parameter: data.updatedTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order update.
* Parameter: data.timeInForce
  * Required: yes
  * Type: string
  * Description: Time-in-force. Can be GTT (Good till time) or IOC (Immediate or cancel).
* Parameter: data.expireTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the order expires.


Get orders by external id
-------------------------

### HTTP Request

`GET /api/v1/user/orders/external/{externalId}`

Get orders by external id for the authenticated sub-account.

### Order statuses


|Status          |Description                                          |
|----------------|-----------------------------------------------------|
|NEW             |Order in the order book, unfilled.                   |
|PARTIALLY_FILLED|Order in the order book, partially filled.           |
|FILLED          |Order fully filled.                                  |
|UNTRIGGERED     |Conditional order waiting for the trigger price.     |
|CANCELLED       |Order cancelled.                                     |
|REJECTED        |Order rejected.                                      |
|EXPIRED         |Order expired.                                       |
|TRIGGERED       |Technical status, transition from UNTRIGGERED to NEW.|


### URL Parameters


|Parameter |Required|Type  |Description                                |
|----------|--------|------|-------------------------------------------|
|externalId|yes     |number|Order to be retrieved, ID assigned by user.|


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 1784963886257016832,
      "externalId": "ExtId-1",
      "accountId": 1,
      "market": "BTC-USD",
      "status": "FILLED",
      "type": "LIMIT",
      "side": "BUY",
      "price": "39000",
      "averagePrice": "39000",
      "qty": "0.2",
      "filledQty": "0.1",
      "payedFee": "0.0120000000000000",
      "reduceOnly": false,
      "postOnly": false,
      "trigger": {
        "triggerPrice": "34000",
        "triggerPriceType": "LAST",
        "triggerPriceDirection": "UP",
        "executionPriceType": "MARKET"
      },
      "tpslType": "ORDER",
      "takeProfit": {
        "triggerPrice": "34000",
        "triggerPriceType": "LAST",
        "price": "35000",
        "priceType": "MARKET",
        "starkExSignature": ""
      },
      "stopLoss": {
        "triggerPrice": "34000",
        "triggerPriceType": "LAST",
        "price": "35000",
        "priceType": "MARKET",
        "starkExSignature": ""
      },
      "createdTime": 1701563440000,
      "updatedTime": 1701563440000,
      "timeInForce": "IOC",
      "expireTime": 1706563440
    }
  ]
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Order ID assigned by Extended.
* Parameter: data[].externalId
  * Required: yes
  * Type: string
  * Description: Order ID assigned by user.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].status
  * Required: yes
  * Type: string
  * Description: Order status.
* Parameter: data[].statusReason
  * Required: no
  * Type: string
  * Description: Reason for REJECTED or CANCELLED status.
* Parameter: data[].type
  * Required: yes
  * Type: string
  * Description: Order type. Can be LIMIT, MARKET, CONDITIONAL, TPSL or TWAP.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Order side. Can be BUY or SELL.
* Parameter: data[].price
  * Required: no
  * Type: string
  * Description: Worst accepted price in the collateral asset.
* Parameter: data[].averagePrice
  * Required: no
  * Type: string
  * Description: Actual filled price, empty if not filled.
* Parameter: data[].qty
  * Required: yes
  * Type: string
  * Description: Order size in base asset.
* Parameter: data[].filledQty
  * Required: no
  * Type: string
  * Description: Actual filled quantity in base asset.
* Parameter: data[].payedFee
  * Required: no
  * Type: string
  * Description: Paid fee.
* Parameter: data[].reduceOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Reduce-only.
* Parameter: data[].postOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order is Post-only.
* Parameter: data[].trigger.triggerPrice
  * Required: no
  * Type: string
  * Description: Trigger price for conditional orders.
* Parameter: data[].trigger.triggerPriceType
  * Required: no
  * Type: string
  * Description: Trigger price type . Can be LAST, MARK or INDEX.
* Parameter: data[].trigger.triggerPriceDirection
  * Required: no
  * Type: string
  * Description: Indicates whether the order should be triggered when the price is above or below the set trigger price. It can be UP (the order will be triggered when the price reaches or surpasses the set trigger price) or DOWN (the order will be triggered when the price reaches or drops below the set trigger price).
* Parameter: data[].trigger.executionPriceType
  * Required: no
  * Type: string
  * Description: Execution price type. Can be LIMIT or MARKET.
* Parameter: data[].tpSlType
  * Required: no
  * Type: string
  * Description: TPSL type determining TPSL order size. Can be ORDER or POSITION.
* Parameter: data[].takeProfit.triggerPrice
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price.
* Parameter: data[].takeProfit.triggerPriceType
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].takeProfit.price
  * Required: no
  * Type: string
  * Description: Take Profit order price.
* Parameter: data[].takeProfit.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Take profit order should be executed as MARKET or LIMIT order.
* Parameter: data[].stopLoss.triggerPrice
  * Required: no
  * Type: string
  * Description: Stop loss Trigger price.
* Parameter: data[].stopLoss.triggerPriceType
  * Required: no
  * Type: string
  * Description: Stop Loss Trigger price type. Can be LAST, MARK or INDEX.
* Parameter: data[].stopLoss.price
  * Required: no
  * Type: string
  * Description: Stop loss order price.
* Parameter: data[].stopLoss.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Stop loss order should be executed as MARKET or LIMIT order.
* Parameter: data[].createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order creation.
* Parameter: data[].updatedTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) of order update.
* Parameter: data[].timeInForce
  * Required: yes
  * Type: string
  * Description: Time-in-force. Can be GTT (Good till time) or IOC (Immediate or cancel).
* Parameter: data[].expireTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the order expires.


Get trades
----------

### HTTP Request

`GET /api/v1/user/trades?market={market}&type={type}&side={side}`

Get trades history for the authenticated sub-account. Optionally, the request can be filtered by a specific market, by trade type (`trade`, `liquidation` or `deleverage`) and side (`buy` or `sell`).

To request data for several markets, use the following format: `GET /api/v1/user/trades?market=market1&market2`.

The endpoint returns a maximum of 10,000 records; pagination should be used to access records beyond this limit.

### Query Parameters


|Parameter|Required|Type  |Description                                         |
|---------|--------|------|----------------------------------------------------|
|market   |no      |string|List of names of the requested markets.             |
|type     |no      |string|Trade type. Can be trade, liquidation or deleverage.|
|side     |no      |string|Order side. Can be buy or sell.                     |


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 1784963886257016832,
      "accountId": 3017,
      "market": "BTC-USD",
      "orderId": 9223372036854775808,
      "externalId": "ext-1",
      "side": "BUY",
      "price": "58853.4000000000000000",
      "qty": "0.0900000000000000",
      "value": "5296.8060000000000000",
      "fee": "0.0000000000000000",
      "tradeType": "DELEVERAGE",
      "createdTime": 1701563440000,
      "isTaker": true
    }
  ],
  "pagination": {
    "cursor": 1784963886257016832,
    "count": 1
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Trade ID assigned by Extended.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].orderId
  * Required: yes
  * Type: string
  * Description: Order ID assigned by Extended.
* Parameter: data[].externalOrderId
  * Required: yes
  * Type: string
  * Description: Order ID assigned by user. Populated only on websocket stream.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Order side. Can be BUY or SELL.
* Parameter: data[].averagePrice
  * Required: yes
  * Type: string
  * Description: Actual filled price.
* Parameter: data[].filledQty
  * Required: yes
  * Type: string
  * Description: Actual filled quantity in base asset.
* Parameter: data[].value
  * Required: yes
  * Type: string
  * Description: Actual filled absolute nominal value in collateral asset.
* Parameter: data[].fee
  * Required: yes
  * Type: string
  * Description: Paid fee.
* Parameter: data[].isTaker
  * Required: yes
  * Type: boolean
  * Description: Whether the trade was executed as a taker.
* Parameter: data[].tradeType
  * Required: yes
  * Type: string
  * Description: Trade type. Can be TRADE (for regular trades), LIQUIDATION (for liquidaton trades) or DELEVERAGE (for ADL trades).
* Parameter: data[].createdTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the trade happened.


Get funding payments
--------------------

### HTTP Request

`GET /api/v1/user/funding/history?market={market}&side={side}&fromTime={fromTime}`

Get funding payments history for the authenticated sub-account. Optionally, the request can be filtered by a specific market, by side (`long` or `short`) and from time as a start point.

To request data for several markets, use the following format: `GET /api/v1/user/funding/history?market=market1&market2`.

The endpoint returns a maximum of 10,000 records; pagination should be used to access records beyond this limit.

### Query Parameters


|Parameter|Required|Type  |Description                                |
|---------|--------|------|-------------------------------------------|
|market   |no      |string|List of names of the requested markets.    |
|side     |no      |string|Position side. Can be long or short.       |
|fromTime |yes     |number|Starting timestamp (in epoch milliseconds).|


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "id": 8341,
      "accountId": 3137,
      "market": "BNB-USD",
      "positionId": 1821237954501148672,
      "side": "LONG",
      "size": "1.116",
      "value": "560.77401888",
      "markPrice": "502.48568",
      "fundingFee": "0",
      "fundingRate": "0",
      "paidTime": 1723147241346
    }
  ],
  "pagination": {
    "cursor": 8341,
    "count": 1
  }
}

```


### Response



* Parameter: status
  * Required: yes
  * Type: string
  * Description: Can be OK or ERROR.
* Parameter: data[].id
  * Required: yes
  * Type: number
  * Description: Funding payment ID assigned by Extended.
* Parameter: data[].accountId
  * Required: yes
  * Type: number
  * Description: Account ID.
* Parameter: data[].market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: data[].positionId
  * Required: yes
  * Type: number
  * Description: Position ID assigned by Extended.
* Parameter: data[].side
  * Required: yes
  * Type: string
  * Description: Position side. Can be LONG or SHORT.
* Parameter: data[].value
  * Required: yes
  * Type: string
  * Description: Position value at funding payment time.
* Parameter: data[].markPrice
  * Required: yes
  * Type: string
  * Description: Mark price at funding payment time
* Parameter: data[].fundingFee
  * Required: yes
  * Type: string
  * Description: Funding payment size.
* Parameter: data[].fundingRate
  * Required: yes
  * Type: string
  * Description: Funding rate.
* Parameter: data[].paidTime
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the funding payment happened.


Get rebates
-----------

### HTTP Request

`GET /api/v1/user/rebates/stats`

Get rebates related data for the authenticated sub-account.

> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "totalPaid": "0",
      "rebatesRate": "0",
      "marketShare": "0.002",
      "nextTierMakerShare": "0.01",
      "nextTierRebateRate": "0.00005"
    }
  ]
}

```


### Response


|Parameter              |Required|Type  |Description                                     |
|-----------------------|--------|------|------------------------------------------------|
|status                 |yes     |string|Can be OK or ERROR.                             |
|data.totalPaid         |yes     |string|Total rebates paid.                             |
|data.rebatesRate       |yes     |string|Current rebates rate.                           |
|data.marketShare       |yes     |string|Maker volume share.                             |
|data.nextTierMakerShare|yes     |string|Maker volume share required to increase rebates.|
|data.nextTierRebateRate|yes     |string|Rebates rate for next maker share threshold.    |


Get current leverage
--------------------

### HTTP Request

`GET /api/v1/user/leverage?market={market}`

Get current leverage for the authenticated sub-account. You can get current leverage for all markets, a single market, or multiple specific markets.

To request data for several markets, use the format `GET/api/v1/user/leverage?market=market1&market=market2`.

### Query Parameters


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|market   |no      |string|Name of the requested market.|


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "market": "SOL-USD",
      "leverage": "10"
    }
  ]
}

```


### Response


|Parameter    |Required|Type  |Description        |
|-------------|--------|------|-------------------|
|status       |yes     |string|Can be OK or ERROR.|
|data.market  |yes     |string|Market name.       |
|data.leverage|yes     |string|Current leverage.  |


Update leverage
---------------

### HTTP Request

`PATCH /api/v1/user/leverage`

Update leverage for an individual market.

Modifying your leverage will impact your `Available balance` and `Initial Margin requirements` of your open position and orders in the market.

To adjust your leverage, you must meet two requirements:

1.  The total value of your open position and triggered orders must remain below the maximum position value allowed for the selected leverage.
    
2.  Your Available balance must be sufficient to cover the additional Margin requirements (if any) associated with the new leverage.
    

Failure to meet either of these criteria will result in an error.

For details on Margin requirements, please refer to the [documentation](https://docs.extended.exchange/extended-resources/trading/margin-schedule).

> Request example:

```
{
  "market": "BTC-USD",
  "leverage": "10"
}

```


### Body Parameters


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|market   |yes     |string|Name of the requested market.|
|leverage |yes     |string|Target leverage.             |


> Response example:

```
{
  "status": "OK",
  "data": {
    "market": "BTC-USD",
    "leverage": "10"
  }
}

```


### Response


|Parameter    |Required|Type  |Description        |
|-------------|--------|------|-------------------|
|status       |yes     |string|Can be OK or ERROR.|
|data.market  |yes     |string|Market name.       |
|data.leverage|yes     |string|Updated leverage.  |


Get fees
--------

### HTTP Request

`GET /api/v1/user/fees?market={market}`

Get current fees for the sub-account. Currently, Extended features a flat fee structure:

*   Taker: 0.025%
    
*   Maker: 0.000%
    

The team reserves the right to update the fee schedule going forward.

For updates on the Fee Schedule, please refer to the [documentation](https://docs.extended.exchange/extended-resources/trading/trading-fees-and-rebates).

### Query Parameters


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|market   |no      |string|Name of the requested market.|
|builderId|no      |string|builder client id            |


> Response example:

```
{
  "status": "OK",
  "data": [
    {
      "market": "BTC-USD",
      "makerFeeRate": "0.00000",
      "takerFeeRate": "0.00025",
      "builderFeeRate": "0.0001"
    }
  ]
}

```


### Response


|Parameter          |Required|Type  |Description        |
|-------------------|--------|------|-------------------|
|status             |yes     |string|Can be OK or ERROR.|
|data.market        |yes     |string|Market name.       |
|data.makerFeeRate  |yes     |string|Maker fee rate.    |
|data.takerFeeRate  |yes     |string|Taker fee rate.    |
|data.builderFeeRate|yes     |string|Builder fee rate.  |


Order management
----------------

The Private API endpoints listed below allow you to create, cancel, and manage orders from the authenticated sub-account.

### Starknet-Specific Logic

Extended settles all transactions on-chain on Starknet. As a result, order creation might differ from centralized exchanges in a few ways:

1.  Stark Key Signature: Required for all order management endpoints. For details, please refer to the reference implementation in the [Python SDK](https://github.com/x10xchange/python_sdk/blob/starknet/README.md).
    
2.  Price Parameter: All orders, including market orders, require a price as a mandatory parameter.
    
3.  Fee Parameter: All orders require a fee as a mandatory parameter. The `Fee` parameter represents the maximum fee a user is willing to pay for an order. Use the maker fee for Post-only orders and the taker fee for all other orders. Enter the fee in decimal format (e.g., 0.1 for 10%). To view current fees, use the `Get fees` endpoint, which displays applicable fee rates.
    
4.  Expiration Timestamp: All orders, including `Fill or Kill` and `Immediate or Cancel` orders, require an expiration timestamp as a mandatory parameter. When submitting orders via the API, enter the expiration time as an epoch timestamp in milliseconds. On the Mainnet, the maximum allowable expiration time is 90 days from the order creation date. On the Testnet, 28 days from the order creation date.
    
5.  Market Orders: Extended does not natively support market orders. On the UI, market orders are created as limit `Immediate-or-Cancel` orders with a price parameter set to ensure immediate execution. For example, Market Buy Orders are set at the best ask price multiplied by 1.0075, and Market Sell Orders at the best bid price multiplied by 0.9925 (subtracting 0.75%).
    
6.  TPSL Orders: Orders with Take Profit and/or Stop Loss require multiple signatures.
    

Create or edit order
--------------------

### HTTP Request

`POST /api/v1/user/order`

Create a new order or edit (replace) an open order. When you create an order via our REST API, the initial response will confirm whether the order has been successfully accepted. Please be aware that, although rare, orders can be canceled or rejected by the Matching Engine even after acceptance at the REST API level. To receive real-time updates on your order status, subscribe to the Account updates WebSocket stream. This stream provides immediate notifications of any changes to your orders, including confirmations, cancellations, and rejections.

Currently, we support `limit`, `market`, `conditional` and `tpsl` order types via API, along with `reduce-only` and `post-only` settings. For API trading, we offer the following Time-in-force settings: `GTT` (Good till time - default) and `IOC` (Immediate or cancel). On the Mainnet, the maximum allowable expiration time for `GTT` orders is 90 days from the order creation date. On the Testnet, 28 days from the order creation date. For details on supported order types and settings, please refer to the [documentation](https://docs.extended.exchange/extended-resources/trading/order-types).

To successfully place an order, it must meet the following requirements:

1.  Trading Rules. For detailed information, please refer to the [trading rules documentation](https://docs.extended.exchange/extended-resources/trading/trading-rules).
    
2.  Order Cost Requirements. For detailed information, please refer to the [order cost documentation](https://docs.extended.exchange/extended-resources/trading/order-cost).
    
3.  Margin Schedule Requirements. For detailed information, please refer to the [margin schedule documentation](https://docs.extended.exchange/extended-resources/trading/margin-schedule).
    
4.  Price requirements, which are described below.
    

### Price requirements

1.  Limit Orders
    *   Long Limit Orders: Order Price ≤ Mark Price \* (1+Limit Order Price Cap)
    *   Short Limit Orders: Order Price ≥ Mark Price \* (1-Limit Order Floor Ratio)
2.  Market Orders
    *   Long Market Order: Order Price ≤ Mark Price \* (1 + 5%)
    *   Short Market Order: Order Price ≥ Mark Price \* (1 - 5%)
3.  Conditional Orders
    *   Short Conditional Orders: Order Price ≥ Trigger price \* (1-Limit Order Floor Ratio)
    *   Long Conditional Orders: Order Price ≤ Trigger Price \* (1+Limit Order Price Cap)
4.  TPSL Orders

Entry order: Buy; TPSL order: Sell.



* Validation: Trigger price validation
  * Stop loss: Trigger price < Entry order price
  * Take profit: Trigger price > Entry order price.
* Validation: Limit price validation
  * Stop loss: Order Price ≥ Trigger price * (1-Limit Order Floor Ratio)
  * Take profit: Order Price ≥ Trigger price * (1-Limit Order Floor Ratio)


Entry order: Sell; TPSL order: Buy.



* Validation: Trigger price validation
  * Stop loss: Trigger price > Entry order price.
  * Take profit: Trigger price < Entry order price.
* Validation: Limit price validation
  * Stop loss: Order Price ≤ Trigger Price * (1+Limit Order Price Cap)
  * Take profit: Order Price ≤ Trigger Price * (1+Limit Order Price Cap)


### Orders Edit

To edit (replace) an open order, add its ID as the cancelId parameter. You can edit multiple parameters at once. Editing is available for all orders except for triggered TPSL orders.

Order editing and validations:

*   If any updated parameter fails the validations described above, all updates will be rejected.
*   If validations fail at the REST API level, the initial open order remains unchanged.
*   In the rare event that validations pass at the REST API level but fail at the Matching Engine, both the updated order and the initial open order will be cancelled.

Editable Order Parameters:

*   For All Order Types (except triggered TPSL orders): Order price and Execution Order Price Type (market or limit)
*   For All Order Types (except untriggered entire position TPSL orders and triggered TPSL orders): Order size
*   For Conditional and Untriggered TPSL Orders: Trigger price
*   For Conditional Orders: Trigger price direction (up or down)
*   For Non-TPSL Orders: All TPSL parameters

### Self trade protection

Self-trade protection is a mechanism that prevents orders from the same client or sub-account from executing against each other. When two such orders are about to match, the system applies the self-trade protection mode specified on the taker order to determine how to handle the potential self-match.


|Value   |Description                                                                          |
|--------|-------------------------------------------------------------------------------------|
|DISABLED|Self trade protection is disabled                                                    |
|ACCOUNT |Trades within same sub-account are disabled, trades between sub-accounts are enabled.|
|CLIENT  |Trades within same sub-account and between sub-accounts are disabled.                |


### Request

> Request example:

```
{
  "id": "e581a9ca-c3a2-4318-9706-3f36a2b858d3",
  "market": "BTC-USDT",
  "type": "CONDITIONAL",
  "side": "BUY",
  "qty": "1",
  "price": "1000",
  "timeInForce": "GTT",
  "expiryEpochMillis": 1715884049245,
  "fee": "0.0002",
  "nonce": "876542",
  "settlement": {
    "signature": {
      "r": "0x17a89cb97c64f546d2dc9189e1ef73547487b228945dcda406cd0e4b8301bd3",
      "s": "0x385b65811a0fc92f109d5ebc30731efd158ee4e502945cd2fcb35a4947b045e"
    },
    "starkKey": "0x23830b00378d17755775b5a73a5967019222997eb2660c2dbfbc74877c2730f",
    "collateralPosition": "4272448241247734333"
  },
  "reduceOnly": true,
  "postOnly": false,
  "selfTradeProtectionLevel": "ACCOUNT",
  "trigger": {
    "triggerPrice": "12000",
    "triggerPriceType": "LAST",
    "direction": "UP",
    "executionPriceType": "LIMIT"
  },
  "tpSlType": "ORDER",
  "takeProfit": {
    "triggerPrice": "1050",
    "triggerPriceType": "LAST",
    "price": "1300",
    "priceType": "LIMIT",
    "settlement": {
      "signature": {
        "r": "0x5b45f0fb2b8e075f6a5f9b4c039ccf1c01c56aa212c63f943337b920103c3a1",
        "s": "0x46133ab89d90a3ae2a3a7680d2a27e30fa015c0c4979931164c51b52b27758a"
      },
      "starkKey": "0x23830b00378d17755775b5a73a5967019222997eb2660c2dbfbc74877c2730f",
      "collateralPosition": "4272448241247734333"
    }
  },
  "stopLoss": {
    "triggerPrice": "950",
    "triggerPriceType": "LAST",
    "price": "900",
    "priceType": "LIMIT",
    "settlement": {
      "signature": {
        "r": "0x5033ad23fe851d16ceec5dd99f2f0c9585c5abec3f09ec89a32a961536ba55",
        "s": "0x1234ee151a8b5c68efb4adaa2eaf1dcc4a5107d4446274a69389ef8abd2dcf"
      },
      "starkKey": "0x23830b00378d17755775b5a73a5967019222997eb2660c2dbfbc74877c2730f",
      "collateralPosition": "4272448241247734333"
    }
  },
  "builderFee": "0.0001",
  "builderId": 2017
}

```


### Body Parameters



* Parameter: id
  * Required: yes
  * Type: string
  * Description: Order ID assigned by user.
* Parameter: market
  * Required: yes
  * Type: string
  * Description: Market name.
* Parameter: type
  * Required: yes
  * Type: string
  * Description: Order type. Can be limit, market, conditional or tpsl.
* Parameter: side
  * Required: yes
  * Type: string
  * Description: Order side. Can be buy or sell.
* Parameter: qty
  * Required: yes
  * Type: string
  * Description: Order size in base asset.
* Parameter: price
  * Required: yes
  * Type: string
  * Description: Worst accepted price in collateral asset. Note that price is optional for a tpsl type position.
* Parameter: reduceOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order should be Reduce-only.
* Parameter: postOnly
  * Required: no
  * Type: boolean
  * Description: Whether the order should be Post-only.
* Parameter: timeInForce
  * Required: yes
  * Type: string
  * Description: Time-in-force setting. Can be GTT (Good till time) or IOC (Immediate or cancel). This parameter will default to GTT.
* Parameter: expiryEpochMillis
  * Required: yes
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the order expires if not filled. Cannot exceed 3 months from the order creation time.
* Parameter: fee
  * Required: yes
  * Type: string
  * Description: Highest accepted fee for the trade, expressed in decimal format (e.g., 0.1 for 10%). Use the maker fee for Post-only orders and the taker fee for all other orders.
* Parameter: cancelId
  * Required: no
  * Type: string
  * Description: External ID of the order that this order is replacing.
* Parameter: settlement
  * Required: yes
  * Type: object
  * Description: StarkKey signature, including nonce and signed order parameters. For details, please refer to the Python SDK reference implementation.
* Parameter: nonce
  * Required: yes
  * Type: string
  * Description: Nonce is part of the settlement and must be a number ≥1 and ≤2^31. Please make sure to check the Python SDK reference implementation.
* Parameter: selfTradeProtectionLevel
  * Required: yes
  * Type: string
  * Description: Level of self trade protection. Can be DISABLED, ACCOUNT(default) and CLIENT.
* Parameter: trigger.triggerPrice
  * Required: no
  * Type: string
  * Description: Price threshold for triggering a conditional order.
* Parameter: trigger.triggerPriceType
  * Required: no
  * Type: string
  * Description: Type of price used for the order triggering. Can be last, mark or index.
* Parameter: trigger.triggerPriceDirection
  * Required: no
  * Type: string
  * Description: Indicates whether the order should be triggered when the price is above or below the set trigger price. It can be up (the order will be triggered when the price reaches or surpasses the set trigger price) or down (the order will be triggered when the price reaches or drops below the set trigger price).
* Parameter: trigger.executionPriceType
  * Required: no
  * Type: string
  * Description: Type of price used for the order execution. Can be limit or market.
* Parameter: tpSlType
  * Required: no
  * Type: string
  * Description: TPSL type determining TPSL order size. Can be order or position.
* Parameter: takeProfit.triggerPrice
  * Required: no
  * Type: string
  * Description: Take Profit Trigger price.
* Parameter: takeProfit.triggerPriceType
  * Required: no
  * Type: string
  * Description: Type of price used for the Take Profit order triggering. Can be last, mid (to be added soon), mark or index.
* Parameter: takeProfit.price
  * Required: no
  * Type: string
  * Description: Take Profit order price.
* Parameter: takeProfit.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Take profit order should be executed as market or limit order.
* Parameter: takeProfit.settlement
  * Required: no
  * Type: object
  * Description: StarkKey signature, including nonce and signed order parameters. For details, please refer to the Python SDK reference implementation.
* Parameter: triggerPrice
  * Required: no
  * Type: string
  * Description: Stop loss Trigger price.
* Parameter: stopLoss.triggerPriceType
  * Required: no
  * Type: string
  * Description: Type of price used for the Stop Loss order triggering. Can be last, mid (to be added soon), mark or index.
* Parameter: stopLoss.price
  * Required: no
  * Type: string
  * Description: Stop loss order price.
* Parameter: stopLoss.priceType
  * Required: no
  * Type: string
  * Description: Indicates whether the Stop loss order should be executed as market or limit order.
* Parameter: stopLoss.settlement
  * Required: no
  * Type: object
  * Description: StarkKey signature, including nonce and signed order parameters. For details, please refer to the Python SDK reference implementation.
* Parameter: builderFee
  * Required: no
  * Type: number
  * Description: Amount that user will pay builder (an alternative ui maker) for the trade. Expressed in decimal format (e.g., 0.1 for 10%)
* Parameter: builderId
  * Required: no
  * Type: number
  * Description: Builder client id that will receive the builderFee


> Response example:

```
{
  "status": "OK",
  "data": {
    "id": 1791389621914243072,
    "externalId": "31097979600959341921260192820644698907062844065707793749567497227004358262"
  }
}

```


### Response


|Parameter      |Required|Type  |Description                   |
|---------------|--------|------|------------------------------|
|status         |yes     |string|Can be OK or ERROR.           |
|data.id        |yes     |number|Order ID assigned by Extended.|
|data.externalId|yes     |string|Order ID assigned by user.    |


Cancel order by ID
------------------

### HTTP Request

`DELETE /api/v1/user/order/{id}`

Cancel an individual order by Extended ID.

The cancellation process is asynchronous; the endpoint returns only the status of the cancellation.

### URL Parameters


|Parameter|Required|Type  |Description                                   |
|---------|--------|------|----------------------------------------------|
|id       |yes     |number|Order to be canceled, ID assigned by Extended.|


Cancel order by external id
---------------------------

### HTTP Request

`DELETE /api/v1/user/order?externalId={externalId}`

Cancel an individual order by user ID.

The cancellation process is asynchronous; the endpoint returns only the status of the cancellation.

### URL Parameters


|Parameter |Required|Type  |Description                                     |
|----------|--------|------|------------------------------------------------|
|externalId|yes     |string|Order to be canceled, Order ID assigned by user.|


### Response


|Parameter|Required|Type  |Description        |
|---------|--------|------|-------------------|
|status   |yes     |string|Can be OK or ERROR.|


Mass Cancel
-----------

### HTTP Request

`POST /api/v1/user/order/massCancel`

Mass Cancel enables the cancellation of multiple orders by ID, by specific market, or for all orders within an account.

The cancellation process is asynchronous; the endpoint returns only the status of the cancellation request.

Although all parameters are optional, at least one must be specified.

> Request example:

```
{
  "orderIds": [
    1,
    2
  ],
  "externalOrderIds": [
    "ExtId-1",
    "ExtId-2"
  ],
  "markets": [
    "BTC-USD",
    "ETH-USD"
  ],
  "cancelAll": true
}

```


### Body Parameters



* Parameter: markets
  * Required: no
  * Type: string[]
  * Description: Market names where all orders should be cancelled.
* Parameter: cancelAll
  * Required: no
  * Type: boolean
  * Description: Indicates whether all open orders for the account should be cancelled.
* Parameter: orderIds
  * Required: no
  * Type: number[]
  * Description: Cancel by Extended IDs.
* Parameter: externalOrderIds
  * Required: no
  * Type: string[]
  * Description: Cancel by external IDs.


### Response


|Parameter|Required|Type  |Description        |
|---------|--------|------|-------------------|
|status   |yes     |string|Can be OK or ERROR.|


Mass auto-cancel (dead man's switch)
------------------------------------

### HTTP Request

`POST /api/v1/user/deadmanswitch?countdownTime={countdownTime}`

The dead man's switch automatically cancels all open orders for the account at the end of the specified countdown if no Mass Auto-Cancel request is received within this timeframe. Setting the time to zero will remove any outstanding scheduled cancellations.

Positions and account status are not affected by the dead man's switch.

### Request Parameters



* Parameter: countdownTime
  * Required: yes
  * Type: number
  * Description: Time till Scheduled Mass Cancel (in seconds), should be non-negative. Setting the time to zero will remove any outstanding scheduled cancellations.


### Response


|Parameter|Required|Type  |Description        |
|---------|--------|------|-------------------|
|status   |yes     |string|Can be OK or ERROR.|


Bridge Config
-------------

### HTTP Request

`GET /api/v1/user/bridge/config`

> Response example:

```
{
  "chains": [
    {
      "chain":"ARB",
      "contractAddress":"0x10417734001162Ea139e8b044DFe28DbB8B28ad0"
    }
  ]
}

```


Returns EVM chains supported for deposits and withdrawals for EVM-wallets.

### Response


|Parameter|Required|Type    |Description           |
|---------|--------|--------|----------------------|
|chains   |yes     |object[]|List of Chain objects.|


### Chain object


|Parameter      |Required|Type  |Description                           |
|---------------|--------|------|--------------------------------------|
|chain          |yes     |string|Chain name.                           |
|contractAddress|yes     |string|Bridge contract address for the chain.|


Get bridge quote
----------------

### HTTP Request

`GET /api/v1/user/bridge/quote?chainIn=ARB&chainOut=STRK&amount=100`

> Response example:

```
{
  "id": "68aaa",
  "fee": "0.1"
}

```


Gets a [quote](https://docs.rhino.fi/get-started/architecture) for an EVM deposit/withdrawal.

### Request Parameters



* Parameter: chainIn
  * Required: yes
  * Type: string
  * Description: Chain where bridge will accept funds. For deposit set EVM chain, for withdrawal STRK.
* Parameter: chainOut
  * Required: yes
  * Type: string
  * Description: Chain where bridge will send funds. For deposit set STRK chain, for withdrawal EVM.
* Parameter: amount
  * Required: yes
  * Type: number
  * Description: Amount in USD that user should pay to bridge contract on chainIn.


### Response


|Parameter|Required|Type   |Description|
|---------|--------|-------|-----------|
|id       |yes     |string |Quote ID.  |
|fee      |yes     |decimal|Bridge fee.|


Commit quote
------------

### HTTP Request

`POST /api/v1/user/bridge/quote?id=68aaa`

Commits a [quote](https://docs.rhino.fi/get-started/architecture) for EVM deposit/withdrawal.

If a quote is deemed acceptable it needs to be committed before the bridge can be executed. This tells our bridge provider Rhino.fi to start watching for a transaction on the origin chain that deposits the required funds into the bridge contract. Rhino.fi will then issue a commitment ID to be used when sending the funds to be bridged.

Deposits
--------

For EVM wallets, we support deposits and withdrawals on six major chains via the Rhino.fi bridge—Arbitrum, Ethereum, Base, Binance Smart Chain, Avalanche, and Polygon—currently. Please refer to the [documentation](https://docs.extended.exchange/extended-resources/account-operations/deposits-and-withdrawals) for transaction limits and estimated processing times.

For Starknet wallets, we support USDC deposits via on-chain interaction and through the User Interface. To deposit on-chain, invoke the Starknet contract at `0x062da0780fae50d68cecaa5a051606dc21217ba290969b302db4dd99d2e9b470`.

Extended doesn't charge fees on deposits or withdrawals, but for EVM chains, bridge fees may apply. All deposits and withdrawals are subject to gas fees.

EVM deposit requires bridging, please read [Bridge section](https://api.docs.extended.exchange/#bridge-config) before proceeding.

EVM deposit consists of four steps:

1) User retrieves supported chains and bridge contracts via GET /bridge/config.

2) User requests a quote via GET /bridge/quote.

3) If the user accepts the bridge fee, they confirm the quote using POST /bridge/quote.

4) Finally, the user calls the depositWithId function on the source chain. See the [rhino.fi docs](https://docs.rhino.fi/get-started/architecture) for more details.

Withdrawals
-----------

For EVM wallets, we support deposits and withdrawals on six major chains—Arbitrum, Ethereum, Base, Binance Smart Chain, Avalanche, and Polygon. Please refer to the [documentation](https://docs.extended.exchange/extended-resources/account-operations/deposits-and-withdrawals) for transaction limits and estimated processing times.

For Starknet wallets, we support withdrawals via the User Interface and API, as described below.

Note that Available Balance for Withdrawals = max(0, Wallet Balance + min(0,Unrealised PnL) - Initial Margin Requirements).

Extended doesn't charge fees on deposits or withdrawals, but for EVM chains, bridge fees may apply. All deposits and withdrawals are subject to gas fees. Withdrawals are only permitted to wallets that are linked to the authorised account.

### EVM withdrawals

EVM withdrawals involve bridging, please read the [Bridge](#Bridge) section first before proceeding. The withdrawal process consists of four steps:

1) User retrieves supported chains and bridge contracts via GET /bridge/config. 2) User requests a quote with GET /bridge/quote. 3) If the user accepts the bridge fee, they confirm the quote using POST /bridge/quote. 4) Finally, the user submits a Starknet withdrawal with the quoteId to the bridgeStarknetAddress associated with their account. See [Account](#account) for details.

### Starknet withdrawals

To initiate a Starknet withdrawal, send a "Create Withdrawal" request as described below or use the corresponding SDK method, signed with a private L2 key. Starknet withdrawals are only available for accounts created with a Starknet wallet.

### HTTP Request

`POST /api/v1/user/withdrawal`

### Request

> Request example:

```
{
  "accountId":"100006",
  "amount":"2",
  "chainId":"STRK",
  "asset":"USD",
  "settlement":{
    "recipient":"0x00f7016a6f1281925ef584bdc1fd2276b2fef02d0741acce215bc512857030dc",
    "positionId":300006,
    "collateralId":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount":"2000000",
    "expiration":{
      "seconds":1755690249
    },
    "salt":93763903,
    "signature":{
      "r":"1110b06f591a5495b07c1e6ccc9478cbf2301af3a207c082be4c63fde19dd0b",
      "s":"cc93ea79708889869c94c95efdb005f0f15c16dec94a93e7efda33eaf7bcbd"
    }
  }
}

```


### Body Parameters



* Parameter: chainId
  * Required: yes
  * Type: string
  * Description: For starknet withdrawals, the type should be STRK.
* Parameter: accountId
  * Required: yes
  * Type: number
  * Description: Source account ID.
* Parameter: amount
  * Required: yes
  * Type: string
  * Description: Withdrawal amount, absolute value in collateral asset.
* Parameter: asset
  * Required: yes
  * Type: string
  * Description: Collateral asset name.
* Parameter: settlement
  * Required: yes
  * Type: object
  * Description: Withdrawal object StarkKey signature. For details, please refer to the Python SDK.
* Parameter: quoteId
  * Required: yes
  * Type: object
  * Description: Bridge quote id for bridged withdrawal.


> Response example:

```
{
  "status": "OK",
  "data": 1820796462590083072
}

```


### Response


|Parameter|Required|Type  |Description                         |
|---------|--------|------|------------------------------------|
|status   |yes     |string|Can be OK or ERROR.                 |
|data     |yes     |number|Withdrawal ID, assigned by Extended.|


Create transfer
---------------

### HTTP Request

`POST /api/v1/user/transfer`

Create a transfer between sub-accounts associated with the same wallet.

### Request

> Request example:

```
{
  "fromAccount": 3004,
  "toAccount": 7349,
  "amount": "1000",
  "transferredAsset": "USD",
  "settlement": {
    "amount": 1000000000,
    "assetId": "0x31857064564ed0ff978e687456963cba09c2c6985d8f9300a1de4962fafa054",
    "expirationTimestamp": 478932,
    "nonce": 758978120,
    "receiverPositionId": 104350,
    "receiverPublicKey": "0x3895139a98a6168dc8b0db251bcd0e6dcf97fd1e96f7a87d9bd3f341753a844",
    "senderPositionId": 100005,
    "senderPublicKey": "0x3895139a98a6168dc8b0db251bcd0e6dcf97fd1e96f7a87d9bd3f341753a844",
    "signature": {
      "r": "6be1839e2ca76484a1a0fcaca9cbbe3792a23656d42ecee306c31e65aadb877",
      "s": "7b8f81258e16f0f90cd12f02e81427e54b4ebf7646e9b14b57f74c2cb44bff6"
    }
  }
}

```


### Body Parameters



* Parameter: fromAccount
  * Required: yes
  * Type: number
  * Description: Source account ID.
* Parameter: toAccount
  * Required: yes
  * Type: number
  * Description: Destination account ID.
* Parameter: amount
  * Required: yes
  * Type: string
  * Description: Transfer amount, absolute value in collateral asset.
* Parameter: transferredAsset
  * Required: yes
  * Type: string
  * Description: Collateral asset name.
* Parameter: settlement
  * Required: yes
  * Type: object
  * Description: Transfer object StarkKey signature (including nonce and transfer parameters). For details, please refer to the Python SDK.


> Response example:

```
{
  "status": "OK",
  "data": {
    "validSignature": true,
    "id": 1820778187672010752
  }
}

```


### Response


|Parameter          |Required|Type   |Description                              |
|-------------------|--------|-------|-----------------------------------------|
|status             |yes     |string |Can be OK or ERROR.                      |
|data.validSignature|yes     |boolean|Indicates whether the signature is valid.|
|data.id            |yes     |number |Transfer ID assigned by Extended.        |


Referrals
---------

Extended offers a referral program. The following API endpoints allow you to issue referral codes and retrieve your referral statistics.

### Glossary

*   **Referral** – A client who was invited by another client.
*   **Referee** – A client who invited another client.
*   **Affiliate** – A client who successfully applied to the [Affiliate Program](https://docs.extended.exchange/extended-resources/referrals).
*   **Subaffiliate** – A referred user who is also an affiliate, and was referred by an affiliate.
*   **Referred volume** – The trading volume of all clients referred by the user (non-transitive).
*   **Rebate** – The reward paid to the referee of affiliate, derived from the trading fees of his referrals.
*   **Rebate rate** – The percentage of fees paid by the referral that the referee or affiliate receive.  
    `Rebate = rebate_rate * (trading_fees - rewards_to_other_programs)`
*   **Referral schedule** – A set of rules (`tiers`) that determine the rebate rate based on the L30D referred volume.

### Shared objects

### Tier object

> Example:

```
{
  "totalVolume": "0",
  "rebateRate": "0.1",
  "volumeLimitPerReferral": "0"
}

```


`Tier` is the lowest-level object that defines the rules of the referral program.



* Parameter: totalVolume
  * Required: yes
  * Type: number
  * Description: Minimum Last 30D referred volume for the rebate rate tier.
* Parameter: rebateRate
  * Required: yes
  * Type: number
  * Description: The rebate rate.
* Parameter: volumeLimitPerReferral
  * Required: yes
  * Type: number
  * Description: Maximum trading volume eligible for a fee discount per referral.


### Refferal schedule object

> Example:

```
{
  "tiers": [
    {
      "totalVolume": "0",
      "rebateRate": "0.1",
      "volumeLimitPerReferral": "0"
    }
  ]
}

```


Contains a list of `Tiers` objects.


|Parameter|Required|Type    |Description           |
|---------|--------|--------|----------------------|
|tiers    |yes     |object[]|List of Tiers objects.|


### Refferal group object

> Example:

```
{
  "id": 1,
  "schedule": {
    "tiers": [
      {
        "totalVolume": "0",
        "rebateRate": "0.1",
        "volumeLimitPerReferral": "0"
      }
    ]
  },
  "subaffiliateRate": "0.1"
}

```


Contains the `Referral schedule` object and the sub-affiliate rebate rate. Each affiliate can have two types of Referral groups — the Main group and the Protection-period group.



* Parameter: id
  * Required: yes
  * Type: number
  * Description: Group ID.
* Parameter: schedule
  * Required: yes
  * Type: object
  * Description: Refferal schedule object.
* Parameter: subaffiliateRate
  * Required: yes
  * Type: number
  * Description: Rebate rate that referee gains from their subaffiliate referral rebates.


### Affiliate object

> Example:

```
{
  "clientId": 42,
  "name": "ABC",
  "onboarded": 1746784655000,
  "mainGroup": {
    "id": 1,
    "schedule": {
      "tiers": [
        {
          "totalVolume": "0",
          "rebateRate": "0.1",
          "volumeLimitPerReferral": "0"
        }
      ]
    },
    "subaffiliateRate": "0"
  },
  "d30ReferredVolume": "2000"
}

```



|Parameter            |Required|Type  |Description                                         |
|---------------------|--------|------|----------------------------------------------------|
|clientId             |yes     |number|Affiliate's client ID on Extended.                  |
|name                 |yes     |string|Affiliate's name on Extended.                       |
|onboarded            |yes     |number|Affiliate's onboarding timestamp (Unix).            |
|mainGroup            |yes     |number|Affiliate's Main Refferal group object.             |
|d30ReferredVolume    |yes     |number|Last 30D volume of users referred by the Affiliate. |
|protectionPeriodGroup|no      |number|Affiliate's Refferal group during protection period.|
|protectionPeriodUntil|no      |number|End of protection period (Unix timestamp).          |


### Period

Enum that specifies the time period for fetching data. Can be `DAY`, `WEEK`, `MONTH`, `YEAR`, `ALL`.

### Granularity

Enum that specifies the time period for fetching data. Can be `DAY`, `WEEK`, `MONTH`.

Get affiliate data
------------------

`GET /api/v1/user/affiliate`

> Response example:

```
{
  "clientId": 42,
  "name": "ABC",
  "onboarded": 1746784655000,
  "mainGroup": {
    "id": 1,
    "schedule": {
      "tiers": [
        {
          "totalVolume": "0",
          "rebateRate": "0.1",
          "volumeLimitPerReferral": "0"
        }
      ]
    },
    "subaffiliateRate": "0"
  },
  "d30ReferredVolume": "2000"
}

```


If the user is an affiliate, returns their affiliate data; otherwise, returns a 404.

### Response

See `Affiliate` object in the Shared objects section of [Referrals documentation](https://api.docs.extended.exchange/#referrals).

Get referral status
-------------------

`GET /api/v1/user/referrals/status`

> Response example:

```
{
  "active": true, 
  "limit": 10000,
  "tradedVolume": 100
}

```


Returns the user’s referral program status.

### Response



* Parameter: active
  * Required: yes
  * Type: boolean
  * Description: Program is active for the user - user can issue referral codes. Can be true or false.
* Parameter: limit
  * Required: yes
  * Type: number
  * Description: Trading volume required to activate the referral program.
* Parameter: tradedVolume
  * Required: yes
  * Type: number
  * Description: User's current traded volume.


Get referral links
------------------

`GET /api/v1/user/referrals/links`

> Response example:

```
[
  {
    "id": "ABC",
    "issuedBy": 42,
    "issuedAt": 1746785907329,
    "label": "ABC",
    "isDefault": true,
    "hiddenAtUi": false,
    "overallRebates": "50"
  }
]

```


Returns referral links issued by the user.

### Response


|Parameter     |Required|Type   |Description                                              |
|--------------|--------|-------|---------------------------------------------------------|
|id            |yes     |string |Link ID.                                                 |
|issuedBy      |yes     |number |Referral client ID.                                      |
|issuedAt      |yes     |number |Link issue timestamp (Unix).                             |
|label         |yes     |string |Label added by user.                                     |
|isDefault     |yes     |boolean|Link set as default for the client. Can be true or false.|
|hiddenAtUi    |yes     |boolean|Link is visible for the client. Can be true or false.    |
|overallRebates|yes     |number |Total rebates for the link.                              |


Get referral dashboard
----------------------

`GET /api/v1/user/referrals/dashboard?period={PERIOD}`

> Response example:

```
{
  "referralLinkToDirectKeyMetrics": {
    "ABC": {
      "rebateEarned": {
        "current": "200",
        "previous": "100"
      },
      "totalFeesPaid": {
        "current": "2000",
        "previous": "1000"
      },
      "tradingVolume": {
        "current": "20000",
        "previous": "10000"
      },
      "activeTraders": {
        "current": 200,
        "previous": 100
      }
    }
  },
  "subaffiliateToKeyMetrics": {
    "2": {
      "rebateEarned": {
        "current": "200",
        "previous": "100"
      },
      "subaffiliateEarnings": {
        "current": "2500",
        "previous": "1250"
      }
    }
  },
  "activeSubaffiliates": {
    "current": 1,
    "previous": 0
  },
  "affiliates": [
    {
      "clientId": 2,
      "name": "RUSLAN",
      "onboarded": 1746792229516,
      "mainGroup": {
        "id": 1,
        "schedule": {
          "tiers": [
            {
              "totalVolume": "0",
              "rebateRate": "0.1",
              "volumeLimitPerReferral": "0"
            }
          ]
        },
        "subaffiliateRate": "0"
      }
    }
  ],
  "users": [
    {
      "firstTradedOn": 1746792228516,
      "wallet": "0x42...a8a91",
      "rebate": "100",
      "tradedVolume": "10000",
      "totalFees": "1000"
    }
  ],
  "daily": [
    {
      "date": "2025-05-09",
      "subaffiliates": [
        {
          "id": 2,
          "rebate": "5",
          "activeUsers": 2,
          "referredTradingVolume": "100",
          "earnings": "10"
        }
      ],
      "links": [
        {
          "link": "ABC",
          "rebate": "10",
          "activeUsers": 4,
          "referredTradingVolume": "200",
          "referredFees": "20",
          "referredL30Volume": "2000"
        }
      ]
    },
    {
      "date": "2025-05-08",
      "subaffiliates": [],
      "links": []
    }
  ],
  "weekly": [
    {
      "date": "2025-05-09",
      "subaffiliates": [],
      "links": []
    },
    {
      "date": "2025-05-02",
      "subaffiliates": [],
      "links": []
    }
  ],
  "monthly": [
    {
      "date": "2025-05-09",
      "subaffiliates": [],
      "links": []
    },
    {
      "date": "2025-04-11",
      "subaffiliates": [],
      "links": []
    },
    {
      "date": "2025-04-13",
      "subaffiliates": [],
      "links": []
    }
  ]
}

```


Returns referral program statistic for the selected period.

### Request parameters


|Parameter|Required|Type  |Description      |
|---------|--------|------|-----------------|
|period   |yes     |string|Requested period.|


### Response

The `Affiliate` object is described in the Shared objects section of [Referrals documentation](https://api.docs.extended.exchange/#referrals). The descriptions of other objects returned by this endpoint are provided below.



* Parameter: referralLinkToDirectKeyMetrics
  * Required: yes
  * Type: object
  * Description: Metrics aggregated by referral codes (Map).
* Parameter: subaffiliateToKeyMetrics
  * Required: yes
  * Type: object
  * Description: Metrics aggregated by subaffiliates (Map).
* Parameter: activeSubaffiliates
  * Required: yes
  * Type: number
  * Description: Number of active subaffiliates.
* Parameter: affiliates
  * Required: yes
  * Type: object[]
  * Description: List of Affiliate objects for subaffiliates active during the period.
* Parameter: users
  * Required: yes
  * Type: object[]
  * Description: List of UserStat objects for users active during the period.
* Parameter: daily
  * Required: yes
  * Type: object[]
  * Description: List of AffiliateStat objects for the period with 1 day granularity.
* Parameter: weekly
  * Required: yes
  * Type: object[]
  * Description: List of AffiliateStat objects for the period with 1 week granularity.
* Parameter: monthly
  * Required: yes
  * Type: object[]
  * Description: List of AffiliateStat objects for the period with 1 month granularity.


### CurrentToPrevious<_T_\>


|Parameter|Required|Type  |Description                  |
|---------|--------|------|-----------------------------|
|current  |yes     |object|<T> data for current period. |
|previous |yes     |object|<T> data for previous period.|


### DirectKeyMetrics



* Parameter: rebateEarned
  * Required: yes
  * Type: object
  * Description: CurrentToPrevious<Number>. Rebates earned during the period.
* Parameter: totalFeesPaid
  * Required: yes
  * Type: object
  * Description: CurrentToPrevious<Number>. Total amount of fees paid by referrals during the period.
* Parameter: tradingVolume
  * Required: yes
  * Type: object
  * Description: CurrentToPrevious<Number>. Referred volume during the period.
* Parameter: activeTraders
  * Required: yes
  * Type: object
  * Description: CurrentToPrevious<Number>. Number of active traders among referrals during the period.


### SubaffiliateKeyMetrics



* Parameter: rebateEarned
  * Required: yes
  * Type: object
  * Description: CurrentToPrevious<Number>. Rebates earned during the period.
* Parameter: subaffiliateEarnings
  * Required: yes
  * Type: object
  * Description: CurrentToPrevious<Number>. Total rebates earned by subaffiliates during the period.


### UserStat


|Parameter    |Required|Type  |Description                                       |
|-------------|--------|------|--------------------------------------------------|
|firstTradedOn|no      |number|Referral's first trade timestamp (Unix).          |
|wallet       |yes     |string|Masked referral's wallet.                         |
|referredBy   |no      |number|User's referee.                                   |
|referralLink |no      |string|Referral link code used by the referral.          |
|rebate       |yes     |number|Rebate.                                           |
|tradedVolume |yes     |number|Referral's traded volume during the period.       |
|totalFees    |yes     |number|Total fees paid by the referral during the period.|


### AffiliateStat



* Parameter: date
  * Required: yes
  * Type: string
  * Description: Last date of the period.
* Parameter: subaffiliates
  * Required: yes
  * Type: object[]
  * Description: List of SubaffiliateStat objects for the period grouped by subaffiliates.
* Parameter: links
  * Required: yes
  * Type: object[]
  * Description: List of LinkStat objects for the period grouped by links.


### SubaffiliateStat



* Parameter: id
  * Required: yes
  * Type: number
  * Description: Subaffiliate's client ID on Extended.
* Parameter: rebate
  * Required: yes
  * Type: number
  * Description: Rebate earned by Subaffiliate (rebate from referrals of his referrals).
* Parameter: activeUsers
  * Required: yes
  * Type: number
  * Description: Number of active traders among Subaffiliate's referrals.
* Parameter: referredTradingVolume
  * Required: yes
  * Type: number
  * Description: Subaffiliate's referred volume.
* Parameter: earnings
  * Required: yes
  * Type: number
  * Description: Subaffiliate's rebate.


### LinkStat


|Parameter            |Required|Type  |Description                                           |
|---------------------|--------|------|------------------------------------------------------|
|link                 |yes     |string|Referral link code.                                   |
|rebate               |yes     |number|Rebate earned through the link.                       |
|activeUsers          |yes     |number|Count of active referrals invited through the link.   |
|referredTradingVolume|yes     |number|Volume referred through the link.                     |
|referredFees         |yes     |number|Total fees paid by referrals invited through the link.|
|referredL30Volume    |yes     |number|Last 30D volume referred through the link.            |


Use referral link
-----------------

`POST /api/v1/user/referrals/links`

> Request example: `json { "code": "ABC" }`

Activate referral link for the authenticated client.

Create referral link code
-------------------------

`POST /api/v1/user/referrals`

> Request example: `json { "id": "ABC", "isDefault": true, "hiddenAtUi": false }`

Create referral link code.

Update referral link code
-------------------------

`PUT /api/v1/user/referrals`

Update referral link code.

> Request example: `json { "id": "ABC", "isDefault": true, "hiddenAtUi": false }`

Points
------

Points-related endpoints let users view their earned points and leaderboard ranking.

Get Earned Points
-----------------

### HTTP Request

`GET /api/v1/user/rewards/earned`

Returns points earned by the authenticated client across all seasons and epochs.

### Authentication

This endpoint requires authentication.

> Response example: `json { "status": "OK", "data": [ { "seasonId": 1, "epochRewards": [ { "epochId": 1, "startDate": "2023-01-01T00:00:00Z", "endDate": "2023-01-31T23:59:59Z", "pointsReward": "50.25" } ] } ] }`

### Response


|Parameter                       |Type  |Description                              |
|--------------------------------|------|-----------------------------------------|
|data[].seasonId                 |number|The ID of the reward season.             |
|data[].epochRewards             |array |List of rewards earned in each epoch.    |
|data[].epochRewards.epochId     |number|The ID of the epoch.                     |
|data[].epochRewards.startDate   |string|The start date of the epoch (ISO format).|
|data[].epochRewards.endDate     |string|The end date of the epoch (ISO format).  |
|data[].epochRewards.pointsReward|string|The number of points earned in the epoch.|


Get points leaderboard stats
----------------------------

### HTTP Request

`GET /api/v1/user/rewards/leaderboard/stats`

Returns the leaderboard statistics for the authenticated client, including total points, leaderboard rank, and points league levels.

### Authentication

This endpoint requires authentication.

> Response example: `json { "status": "OK", "data": { "totalPoints": "1250.75", "rank": 42, "tradingRewardLeague": "QUEEN", "liquidityRewardLeague": "PAWN", "referralRewardLeague": "KING" } }`

### Response


|Parameter            |Type  |Description                              |
|---------------------|------|-----------------------------------------|
|totalPoints          |string|The total number of points earned.       |
|rank                 |number|The client's rank on the leaderboard.    |
|tradingRewardLeague  |string|The client's league for trading points.  |
|liquidityRewardLeague|string|The client's league for liquidity points.|
|referralRewardLeague |string|The client's league for referral points. |


Points league levels
--------------------

The following table describes the points-league levels for `tradingRewardLeague`, `liquidityRewardLeague`, and `referralRewardLeague`.


|Value |Description                        |
|------|-----------------------------------|
|KING  |King league - highest tier.        |
|QUEEN |Queen league - second-highest tier.|
|ROOK  |Rook league - advanced tier.       |
|KNIGHT|Knight league - intermediate tier. |
|PAWN  |Pawn league - entry-level tier.    |


Public WebSocket streams
------------------------

Extended offers a WebSocket API for streaming updates.

Connect to the WebSocket streams using `wss://api.starknet.extended.exchange` as the host.

The server sends pings every 15 seconds and expects a pong response within 10 seconds. Although the server does not require pings from the client, it will respond with a pong if one is received.

Order book stream
-----------------

### HTTP Request

`GET /stream.extended.exchange/v1/orderbooks/{market}`

Subscribe to the orderbooks stream for a specific market or for all available markets. If the market parameter is not submitted, the stream will include data for all available markets.

In the current version we support the following depth specifications:

*   Full orderbook. Push frequency: 100ms. The initial response from the stream will be a snapshot of the order book. Subsequent snapshot updates will occur every minute, while updates between snapshots are delivered in delta format, reflecting only changes since the last update. Best Bid & Ask updates are always provided as snapshots.
    
*   Best bid & ask. Push frequency: 10ms. To subscribe for Best bid & ask use `GET /stream.extended.exchange/v1/orderbooks/{market}?depth=1`. Best bid & ask updates are always snapshots.
    

### URL Parameters



* Parameter: market
  * Required: no
  * Type: string
  * Description: Select an individual market. If not specified, the subscription includes all markets.


### Query Parameters


|Parameter|Required|Type  |Description                                            |
|---------|--------|------|-------------------------------------------------------|
|depth    |no      |string|Specify '1' to receive updates for best bid & ask only.|


> Response example:

```
{
  "ts": 1701563440000,
  "type": "SNAPSHOT",
  "data": {
    "m": "BTC-USD",
    "b": [
      {
        "p": "25670",
        "q": "0.1"
      }
    ],
    "a": [
      {
        "p": "25770",
        "q": "0.1"
      }
    ]
  },
  "seq": 1
}

```


### Response



* Parameter: type
  * Type: string
  * Description: Type of message. Can be SNAPSHOT or DELTA.
* Parameter: ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the system generated the data.
* Parameter: data.m
  * Type: string
  * Description: Market name.
* Parameter: data.t
  * Type: string
  * Description: Type of message. Can be SNAPSHOT or DELTA.
* Parameter: data.b
  * Type: object[]
  * Description: List of bid orders. For a snapshot, bids are sorted by price in descending order.
* Parameter: data.b[].p
  * Type: string
  * Description: Bid price.
* Parameter: data.b[].q
  * Type: string
  * Description: Bid size. For a snapshot, this represents the absolute size; for a delta, the change in size.
* Parameter: data.a
  * Type: object[]
  * Description: List of ask orders. For a snapshot, asks are sorted by price in ascending order.
* Parameter: data.a[].p
  * Type: string
  * Description: Ask price.
* Parameter: data.a[].q
  * Type: string
  * Description: Ask size. For a snapshot, this represents the absolute size; for a delta, the change in size.
* Parameter: seq
  * Type: number
  * Description: Monothonic sequence number. '1' corresponds to the first snapshot, and all subsequent numbers correspond to deltas. If a client receives a sequence out of order, it should reconnect.


Trades stream
-------------

### HTTP Request

`GET /stream.extended.exchange/v1/publicTrades/{market}`

Subscribe to the trades stream for a specific market or for all available markets. If the market parameter is not submitted, the stream will include data for all available markets.

Historical trade data is currently available only to authorized accounts via the private REST API.

### URL Parameters



* Parameter: market
  * Required: no
  * Type: string
  * Description: Select an individual market. If not specified, the subscription includes all markets.


> Response example:

```
{
  "ts": 1701563440000,
  "data": [
    {
      "m": "BTC-USD",
      "S": "BUY",
      "tT": "TRADE",
      "T": 1701563440000,
      "p": "25670",
      "q": "0.1",
      "i": 25124
    }
  ],
  "seq": 2
}

```


### Response



* Parameter: ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the system generated the data.
* Parameter: data[].m
  * Type: string
  * Description: Market name.
* Parameter: data[].S
  * Type: string
  * Description: Side of taker trades. Can be BUY or SELL.
* Parameter: data[].tT
  * Type: string
  * Description: Trade type. Can be TRADE, LIQUIDATION or DELEVERAGE.
* Parameter: data[].T
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the trade happened.
* Parameter: data[].p
  * Type: string
  * Description: Trade price.
* Parameter: data[].q
  * Type: string
  * Description: Trade quantity in base asset.
* Parameter: data[].i
  * Type: number
  * Description: Trade ID.
* Parameter: seq
  * Type: number
  * Description: Monotonic sequence: Since there are no deltas, clients can skip trades that arrive out of sequence.


Funding rates stream
--------------------

### HTTP Request

`GET /stream.extended.exchange/v1/funding/{market}`

Subscribe to the funding rates stream for a specific market or for all available markets. If the market parameter is not submitted, the stream will include data for all available markets.

For historical funding rates data, use the `Get funding rates history` endpoint.

While the funding rate is calculated every minute, it is applied only once per hour. The records include only those funding rates that were used for funding fee payments.

### URL Parameters



* Parameter: market
  * Required: no
  * Type: string
  * Description: Select an individual market. If not specified, the subscription includes all markets.


> Response example:

```
{
  "ts": 1701563440000,
  "data": {
      "m": "BTC-USD",
      "T": 1701563440000,
      "f": "0.001"
  },
  "seq": 2
}

```


### Response



* Parameter: ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the system generated the data.
* Parameter: data[].m
  * Type: string
  * Description: Market name.
* Parameter: data[].T
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the funding rate was calculated and applied.
* Parameter: data[].f
  * Type: string
  * Description: Funding rates that were applied for funding fee payments.
* Parameter: seq
  * Type: number
  * Description: Monotonic sequence: Since there are no deltas, clients can skip funding rates that arrive out of sequence.


Candles stream
--------------

### HTTP Request

`GET /stream.extended.exchange/v1/candles/{market}/{candleType}?interval={interval}`

Subscribe to the candles stream for a specific market.

The interval parameter should be specified in the ISO 8601 duration format. Available intervals include: P30D (Calendar month), P7D (Calendar week), PT24H, PT12H, PT8H, PT4H, PT2H, PT1H, PT30M, PT15M, PT5M and PT1M.

> Trades price response example:

```
{
  "ts": 1695738675123,
  "data": [ 
    {
      "T": 1695738674000,
      "o": "1000.0000",
      "l": "800.0000",
      "h": "2400.0000",
      "c": "2100.0000",
      "v": "10.0000"
    }
  ],
  "seq": 1
}

```


> Mark and Index price response example:

```
{
  "ts": 1695738675123,
  "data": [
    {
      "T": 1695738674000,
      "o": "1000.0000",
      "l": "800.0000",
      "h": "2400.0000",
      "c": "2100.0000"
    }
  ],
  "seq": 1
}

```


Available price types include:

1.  Last price: `GET /stream.extended.exchange/v1/candles/{market}/trades?interval=PT1M`
    
2.  Mark price: `GET /stream.extended.exchange/v1/candles/{market}/mark-prices?interval=PT1M`
    
3.  Index price: `GET /stream.extended.exchange/v1/candles/{market}/index-prices?interval=PT1M`
    

Push frequency: 1-10s.

### URL Parameters


|Parameter |Required|Type  |Description                                            |
|----------|--------|------|-------------------------------------------------------|
|market    |yes     |string|Select an individual market.                           |
|candleType|yes     |string|Price type. Can be trades, mark-prices or index-prices.|


### Query Parameters


|Parameter|Required|Type  |Description                               |
|---------|--------|------|------------------------------------------|
|interval |yes     |string|Duration of candle (duration in ISO 8601).|


### Response



* Parameter: ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the system generated the data.
* Parameter: data[].T
  * Type: number
  * Description: Starting timestamp (in epoch milliseconds) of the candle.
* Parameter: data[].o
  * Type: string
  * Description: Open price.
* Parameter: data[].c
  * Type: string
  * Description: Close price.
* Parameter: data[].h
  * Type: string
  * Description: Highest price.
* Parameter: data[].l
  * Type: string
  * Description: Lowest price.
* Parameter: data[].v
  * Type: string
  * Description: Trading volume (only for trade candles).
* Parameter: seq
  * Type: number
  * Description: Monothonic sequence number. '1' corresponds to the first snapshot, and all subsequent numbers correspond to deltas. If a client receives a sequence out of order, it should reconnect.


Mark price stream
-----------------

### HTTP Request

`GET /stream.extended.exchange/v1/prices/mark/{market}`

Subscribe to the mark price stream for a specific market or for all available markets. If the market parameter is not submitted, the stream will include data for all available markets.

Mark prices are used to calculate unrealized P&L and serve as the reference for liquidations. The stream provides real-time updates whenever a mark price changes.

### URL Parameters



* Parameter: market
  * Required: no
  * Type: string
  * Description: Select an individual market. If not specified, the subscription includes all markets.


> Response example:

```
{
  "type": "MP",
  "data": {
    "m": "BTC-USD",
    "p": "25670",
    "ts": 1701563440000
  },
  "ts": 1701563440000,
  "seq": 1,
  "sourceEventId": null
}

```


### Response



* Parameter: type
  * Type: string
  * Description: Type identifier for mark price stream ("MP").
* Parameter: data.m
  * Type: string
  * Description: Market name.
* Parameter: data.p
  * Type: string
  * Description: Mark price value.
* Parameter: data.ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the price was calculated.
* Parameter: ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the system generated the data.
* Parameter: seq
  * Type: number
  * Description: Monotonic sequence number. Clients can use this to ensure they process messages in the correct order. If a client receives a sequence out of order, it should reconnect.
* Parameter: sourceEventId
  * Type: number
  * Description: ID of the source event that triggered this update (null for regular updates).


Index price stream
------------------

### HTTP Request

`GET /stream.extended.exchange/v1/prices/index/{market}`

Subscribe to the index price stream for a specific market or for all available markets. If the market parameter is not submitted, the stream will include data for all available markets.

An index price is a composite spot price sourced from multiple external providers. It is used as the reference for funding-rate calculations.

### URL Parameters



* Parameter: market
  * Required: no
  * Type: string
  * Description: Select an individual market. If not specified, the subscription includes all markets.


> Response example:

```
{
  "type": "IP",
  "data": {
    "m": "BTC-USD",
    "p": "25680",
    "ts": 1701563440000
  },
  "ts": 1701563440000,
  "seq": 1,
  "sourceEventId": null
}

```


### Response



* Parameter: type
  * Type: string
  * Description: Type identifier for index price stream ("IP").
* Parameter: data.m
  * Type: string
  * Description: Market name.
* Parameter: data.p
  * Type: string
  * Description: Index price value.
* Parameter: data.ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the price was calculated.
* Parameter: ts
  * Type: number
  * Description: Timestamp (in epoch milliseconds) when the system generated the data.
* Parameter: seq
  * Type: number
  * Description: Monotonic sequence number. Clients can use this to ensure they process messages in the correct order. If a client receives a sequence out of order, it should reconnect.
* Parameter: sourceEventId
  * Type: number
  * Description: ID of the source event that triggered this update (null for regular updates).


Private WebSocket streams
-------------------------

Connect to the WebSocket streams using `ws://api.starknet.extended.exchange` as the host.

The server sends pings every 15 seconds and expects a pong response within 10 seconds. Although the server does not require pings from clients, it will respond with a pong if it receives one.

Extended employs a simplified authentication scheme for API access. Authenticate by using your API key, which should be included in an HTTP header as follows: `X-Api-Key: <API_KEY_FROM_API_MANAGEMENT_PAGE_OF_UI>`.

Account updates stream
----------------------

### HTTP Request

`GET /stream.extended.exchange/v1/account`

> Orders updates response example:

```
{
  "type": "ORDER",
  "data": {
    "orders": [
      {
        "id": 1791181340771614723,
        "accountId": 1791181340771614721,
        "externalId": "-1771812132822291885",
        "market": "BTC-USD",
        "type": "LIMIT",
        "side": "BUY",
        "status": "NEW",
        "price": "12400.000000",
        "averagePrice": "13140.000000",
        "qty": "10.000000",
        "filledQty": "3.513000",
        "payedFee": "0.513000",
        "trigger": {
          "triggerPrice": "1220.00000",
          "triggerPriceType": "LAST",
          "direction": "UP",
          "executionPriceType": "LIMIT"
        },
        "tpSlType": "ORDER",
        "takeProfit": {
          "triggerPrice": "1.00000",
          "triggerPriceType": "LAST",
          "price": "1.00000",
          "priceType": "LIMIT"
        },
        "stopLoss": {
          "triggerPrice": "1.00000",
          "triggerPriceType": "LAST",
          "price": "1.00000",
          "priceType": "LIMIT"
        },
        "reduceOnly": true,
        "postOnly": false,
        "createdTime": 1715885888571,
        "updatedTime": 1715885888571,
        "expireTime": 1715885888571
      }
    ]
  },
  "ts": 1715885884837,
  "seq": 1
}

```


> Trades updates response example:

```
{
  "type": "TRADE",
  "data": {
    "trades": [
      {
        "id": 1784963886257016832,
        "accountId": 3017,
        "market": "BTC-USD",
        "orderId": 9223372036854775808,
        "externalOrderId": "ext-1",
        "side": "BUY",
        "price": "58853.4000000000000000",
        "qty": "0.0900000000000000",
        "value": "5296.8060000000000000",
        "fee": "0.0000000000000000",
        "tradeType": "DELEVERAGE",
        "createdTime": 1701563440000,
        "isTaker": true
      }
    ]
  },
  "ts": 1715885884837,
  "seq": 1
}

```


> Account balance updates response example:

```
{
  "type": "BALANCE",
  "data": {
    "balance": {
      "collateralName": "BTC",
      "balance": "100.000000",
      "equity": "20.000000",
      "availableForTrade": "3.000000",
      "availableForWithdrawal": "4.000000",
      "unrealisedPnl": "1.000000",
      "initialMargin": "0.140000",
      "marginRatio": "1.500000",
      "updatedTime": 1699976104901,
      "exposure": "12751.859629",
      "leverage": "1275.1860"
    }
  },
  "ts": 1715885952304,
  "seq": 1
}

```


> Positions updates response example:

```
{
  "type": "POSITION",
  "data": {
    "positions": [
      {
        "id": 1791183357858545669,
        "accountId": 1791183357858545665,
        "market": "BTC-USD",
        "side": "SHORT",
        "leverage": "5.0",
        "size": "0.3",
        "value": "12751.8596295830",
        "openPrice": "42508.00",
        "markPrice": "42506.1987652769",
        "liquidationPrice": "75816.37",
        "margin": "637.59",
        "unrealisedPnl": "100.000000",
        "realisedPnl": "200.000000",
        "tpTriggerPrice": "1600.0000",
        "tpLimitPrice": "1500.0000",
        "slTriggerPrice": "1300.0000",
        "slLimitPrice": "1250.0000",
        "adl": 1,
        "createdAt": 1715886365748,
        "updatedAt": 1715886365748
      }
    ]
  },
  "ts": 1715886365748,
  "seq": 1
}

```


Subscribe to the account updates stream.

The initial responses will include comprehensive information about the account, including balance, open positions, and open orders, i.e. everything from `GET /v1/user/balance`, `GET /v1/user/positions`, `GET /v1/user/orders`.

Subsequent responses will contain all updates related to open orders, trades, account balance or open positions in a single message.

The response attributes will align with the responses from the corresponding REST API endpoints: `Get trades`, `Get positions`, `Get open orders` and `Get balance`. Refer to the [Account section](https://api.docs.extended.exchange/#account) for details.

Error responses
---------------

Unless specified otherwise for a particular endpoint and HTTP status code, the error response model follows the general response format and includes an error code along with a descriptive message for most errors.



* Error code: GENERAL
  * Error: 
  * Description: 
* Error code: 400
  * Error: BadRequest
  * Description: Invalid or missing parameters.
* Error code: 401
  * Error: Unauthorized
  * Description: Authentication failure.
* Error code: 403
  * Error: Forbidden
  * Description: Access denied.
* Error code: 404
  * Error: NotFound
  * Description: Resource not found.
* Error code: 422
  * Error: UnprocessableEntity
  * Description: Request format is correct, but data is invalid.
* Error code: 429
  * Error: RateLimited
  * Description: Number of calls from the IP address has exceeded the rate limit.
* Error code: 500
  * Error: InternalServerError
  * Description: Internal server error.
* Error code: MARKET,
  * Error: ASSET & ACCOUNT
  * Description: 
* Error code: 1000
  * Error: AssetNotFound
  * Description: Asset not found.
* Error code: 1001
  * Error: MarketNotFound
  * Description: Market not found.
* Error code: 1002
  * Error: MarketDisabled
  * Description: Market is disabled.
* Error code: 1003
  * Error: MarketGroupNotFound
  * Description: Market group not found.
* Error code: 1004
  * Error: AccountNotFound
  * Description: Account not found.
* Error code: 1005
  * Error: NotSupportedInterval
  * Description: Not supported interval.
* Error code: 1006
  * Error: UnhandledError
  * Description: Application error.
* Error code: 1008
  * Error: ClientNotFound
  * Description: Client not found.
* Error code: 1009
  * Error: ActionNotAllowed
  * Description: Action is not allowed.
* Error code: 1010
  * Error: MaintenanceMode
  * Description: Maintenance mode.
* Error code: 1011
  * Error: PostOnlyMode
  * Description: Post only mode.
* Error code: 1012
  * Error: ReduceOnlyMode
  * Description: Reduce only mode.
* Error code: 1013
  * Error: InvalidPercentage
  * Description: Percentage should be between 0 and 1.
* Error code: 1014
  * Error: MarketReduceOnly
  * Description: Market is in reduce only mode, non-reduce only orders are not allowed.
* Error code: LEVERAGE
  * Error: UPDATE
  * Description: 
* Error code: 1049
  * Error: InvalidLeverageBelowMinLeverage
  * Description: Leverage below min leverage.
* Error code: 1050
  * Error: InvalidLeverageExceedsMaxLeverage
  * Description: Leverage exceeds max leverage.
* Error code: 10501
  * Error: InvalidLeverageMaxPositionValueExceeded
  * Description: Max position value exceeded for new leverage.
* Error code: 1052
  * Error: InvalidLeverageInsufficientMargin
  * Description: Insufficient margin for new leverage.
* Error code: 1053
  * Error: InvalidLeverageInvalidPrecision
  * Description: Leverage has invalid precision.
* Error code: STARKNET
  * Error: SIGNATURES
  * Description: 
* Error code: 1100
  * Error: InvalidStarknetPublicKey
  * Description: Invalid Starknet public key.
* Error code: 1101
  * Error: InvalidStarknetSignature
  * Description: Invalid Starknet signature.
* Error code: 1102
  * Error: InvalidStarknetVault
  * Description: Invalid Starknet vault.
* Error code: ORDER
  * Error: 
  * Description: 
* Error code: 1120
  * Error: OrderQtyLessThanMinTradeSize
  * Description: Order quantity less than min trade size, based on market-specific trading rules.
* Error code: 1121
  * Error: InvalidQtyWrongSizeIncrement
  * Description: Invalid quantity due to the wrong size increment, based on market-specific Minimum Change in Trade Size trading rule.
* Error code: 1122
  * Error: OrderValueExceedsMaxOrderValue
  * Description: Order value exceeds max order value, based on market-specific trading rules.
* Error code: 1123
  * Error: InvalidQtyPrecision
  * Description: Invalid quantity precision, currently equals to market-specific Minimum Change in Trade Size.
* Error code: 1124
  * Error: InvalidPriceWrongPriceMovement
  * Description: Invalid price due to wrong price movement, based on market-specific Minimum Price Change trading rule.
* Error code: 1125
  * Error: InvalidPricePrecision
  * Description: Invalid price precision, currently equals to market-specific Minimum Price Change.
* Error code: 1126
  * Error: MaxOpenOrdersNumberExceeded
  * Description: Max open orders number exceeded, currently 200 orders per market.
* Error code: 1127
  * Error: MaxPositionValueExceeded
  * Description: Max position value exceeded, based on the Margin schedule.
* Error code: 1128
  * Error: InvalidTradingFees
  * Description: Trading fees are invalid. Refer to Order management section for details.
* Error code: 1129
  * Error: InvalidPositionTpslQty
  * Description: Invalid quantity for position TP/SL.
* Error code: 1130
  * Error: MissingOrderPrice
  * Description: Order price is missing.
* Error code: 1131
  * Error: MissingTpslTrigger
  * Description: TP/SL order trigger is missing.
* Error code: 1132
  * Error: NotAllowedOrderType
  * Description: Order type is not allowed.
* Error code: 1133
  * Error: InvalidOrderParameters
  * Description: Invalid order parameters.
* Error code: 1134
  * Error: DuplicateOrder
  * Description: Duplicate Order.
* Error code: 1135
  * Error: InvalidOrderExpiration
  * Description: Order expiration date must be within 90 days for the Mainnet, 28 days for the Testnet.
* Error code: 1136
  * Error: ReduceOnlyOrderSizeExceedsPositionSize
  * Description: Reduce-only order size exceeds open position size.
* Error code: 1137
  * Error: ReduceOnlyOrderPositionIsMissing
  * Description: Position is missing for a reduce-only order.
* Error code: 1138
  * Error: ReduceOnlyOrderPositionSameSide
  * Description: Position is the same side as a reduce-only order.
* Error code: 1139
  * Error: MarketOrderMustBeIOC
  * Description: Market order must have time in force IOC.
* Error code: 1140
  * Error: OrderCostExceedsBalance
  * Description: New order cost exceeds available balance.
* Error code: 1141
  * Error: InvalidPriceAmount
  * Description: Invalid price value.
* Error code: 1142
  * Error: EditOrderNotFound
  * Description: Edit order not found.
* Error code: 1143
  * Error: MissingConditionalTrigger
  * Description: Conditional order trigger is missing.
* Error code: 1144
  * Error: PostOnlyCantBeOnConditionalMarketOrder
  * Description: Conditional market order can't be Post-only.
* Error code: 1145
  * Error: NonReduceOnlyOrdersNotAllowed
  * Description: Non reduce-only orders are not allowed.
* Error code: 1146
  * Error: TwapOrderMustBeGTT
  * Description: Twap order must have time in force GTT.
* Error code: 1147
  * Error: OpenLossExceedsEquity
  * Description: Open loss exceeds equity.
* Error code: 1148
  * Error: TPSLOpenLossExceedsEquity
  * Description: TP/SL open loss exceeds equity.
* Error code: GENERAL
  * Error: ACCOUNT
  * Description: 
* Error code: 1500
  * Error: AccountNotSelected
  * Description: Account not selected.
* Error code: WITHDRAWAL
  * Error: 
  * Description: 
* Error code: 1600
  * Error: WithdrawalAmountMustBePositive
  * Description: Withdrawal amount must be positive.
* Error code: 1601
  * Error: WithdrawalDescriptionToLong
  * Description: Withdrawal description is too long.
* Error code: 1602
  * Error: WithdrawalRequestDoesNotMatchSettlement
  * Description: Withdrawal request does not match settlement.
* Error code: 1604
  * Error: WithdrawalExpirationTimeIsTooSoon
  * Description: Withdrawal expiration time is below the 14 days minimum.
* Error code: 1605
  * Error: WithdrawalInvalidAsset
  * Description: Withdrawal asset is not valid.
* Error code: 1607
  * Error: WithdrawalBlockedForAccount
  * Description: Withdrawals blocked for the account. Please contact the team on Discord to unblock the withdrawals.
* Error code: 1608
  * Error: WithdrawalAccountDoesNotBelongToUser
  * Description: The withdrawal address does not match the account address.
* Error code: TRANSFERS
  * Error: 
  * Description: 
* Error code: 1650
  * Error: InvalidVaultTransferAmount
  * Description: Vault transfer amount is incorrect.
* Error code: REFERRAL
  * Error: CODE
  * Description: 
* Error code: 1700
  * Error: ReferralCodeAlreadyExist
  * Description: Referral code already exist.
* Error code: 1701
  * Error: ReferralCodeInvalid
  * Description: Referral code is not valid.
* Error code: 1703
  * Error: ReferralProgramIsNotEnabled
  * Description: Referral program is not enabled.
* Error code: 1704
  * Error: ReferralCodeAlreadyApplied
  * Description: Referral code already applied.


Legacy: StarkEx SDK
-------------------

> SDK configuration

```
from dataclasses import dataclass


@dataclass
class EndpointConfig:
    chain_rpc_url: str
    api_base_url: str
    stream_url: str
    onboarding_url: str
    signing_domain: str
    collateral_asset_contract: str
    asset_operations_contract: str
    collateral_asset_on_chain_id: str
    collateral_decimals: int

TESTNET_CONFIG_LEGACY_SIGNING_DOMAIN = EndpointConfig(
    chain_rpc_url="https://rpc.sepolia.org",
    api_base_url="https://api.testnet.extended.exchange/api/v1",
    stream_url="wss://api.testnet.extended.exchange/stream.extended.exchange/v1",
    onboarding_url="https://api.testnet.extended.exchange",
    signing_domain="x10.exchange",
    collateral_asset_contract="0x0c9165046063b7bcd05c6924bbe05ed535c140a1",
    asset_operations_contract="0x7f0C670079147C5c5C45eef548E55D2cAc53B391",
    collateral_asset_on_chain_id="0x31857064564ed0ff978e687456963cba09c2c6985d8f9300a1de4962fafa054",
    collateral_decimals=6,
)

STARKEX_MAINNET_CONFIG = EndpointConfig(
    chain_rpc_url="https://cloudflare-eth.com",
    api_base_url="https://api.extended.exchange/api/v1",
    stream_url="wss://api.extended.exchange/stream.extended.exchange/v1",
    onboarding_url="https://api.extended.exchange",
    signing_domain="extended.exchange",
    collateral_asset_contract="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    asset_operations_contract="0x1cE5D7f52A8aBd23551e91248151CA5A13353C65",
    collateral_asset_on_chain_id="0x2893294412a4c8f915f75892b395ebbf6859ec246ec365c3b1f56f47c3a0a5d",
    collateral_decimals=6,
)

```


Extended now operates on the Starknet instance. The wind-down plan for the StarkEx instance can be found [here](https://docs.extended.exchange/starknet-migration/migration-guide#migration-stages). StarkEx-specific details apply only to users whose Extended account was created before August 12, 2025, and who have not yet migrated to Starknet. In all other cases, please follow the Starknet-specific logic described above.

StarkEx Python SDK:

*   For installation instructions, please refer to the [description](https://github.com/x10xchange/python_sdk/blob/starkex/README.md) provided.
    
*   For reference implementations, explore the [examples folder](https://github.com/x10xchange/python_sdk/tree/starkex/examples).
    
*   For SDK configuration, please refer to the [config description](https://github.com/x10xchange/python_sdk/blob/starkex/x10/perpetual/configuration.py).
    

Supported Features:

*   Account creation and authorisation.
    
*   Order Management.
    
*   Account Management.
    
*   Deposits, Transfers and Withdrawals.
    
*   Market Information.