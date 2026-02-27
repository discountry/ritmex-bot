---
title: "Change Log | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/change-log"
fetched_at: "2026-01-27T05:28:00.328Z"
---
# Change Log

## 2026-01-09[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin and Portfolio Margin Pro

-   New endpoints for switch to Delta Mode:
    -   `POST /sapi/v1/portfolio/delta-mode`: Switch the Delta Mode for existing PM PRO / PM RETAIL accounts.
    -   `GET /sapi/v1/portfolio/delta-mode`: Query the Delta mode status of current account.

## 2026-01-07[​](https://developers.binance.com/docs/derivatives/change-log)

Option

-   New REST APIs:
    -   `GET /eapi/v1/commission`: query user commission rate

## 2025-12-29[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   The parameter "filterType": "MAX\_NUM\_ALGO\_ORDERS" has been removed from the endpoint `GET /fapi/v1/exchangeInfo`. The condtional order limits is 200 across all symbols.
-   Effective on 2025-12-31, field `nq` will be available in `<symbol>@aggTrade` stream. For this new field, only normal market trades will be aggregated， which means the trades involving RPI orders won't be aggregated.

## 2025-12-11[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New REST APIs:
    -   `GET /fapi/v1/tradingSchedule`: query trading session schedules for a one-week period
    -   `POST /fapi/v1/stock/contract`: sign TradFi-Perps agreement contract
-   New Websocket API:
    -   `tradingSession`: query current trading session information

## 2025-12-10[​](https://developers.binance.com/docs/derivatives/change-log)

-   Since conditional orders have been migrated to the Algo Service, the event `CONDITIONAL_ORDER_TRIGGER_REJECT` will be deprecated effective December 15, 2025. Any conditional order rejection reasons are provided within the `ALGO_UPDATE` event.

## 2025-12-09[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   Effective on 2025-12-10, Order expire reason field `er` will be available in `ORDER_TRADE_UPDATE` stream.

## 2025-11-25[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Effective on **2025-11-26**, RPI commisson fee is available in the response of User Commission Rate endpoint
    -   REST
        -   `GET /fapi/v1/commissionRate`
-   New endpoints to fetch RPI order book
    -   REST
        -   `GET /fapi/v1/rpiDepth`
    -   WebSocket
        -   `<symbol>@rpiDepth@500ms`

## 2025-11-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   REST API
    -   `GET /fapi/v1/symbolAdlRisk`: New endpoints to query ADL risk rating

## 2025-11-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   The RPI order is introduced to USDⓈ-M Futures
    -   New time-in-force ENUM value - RPI is supported in
        -   REST
            -   `POST /fapi/v1/order`
            -   `POST /fapi/v1/batchOrders`
        -   WebSocket
            -   `order.place`
    -   New fields in the market data response - Boolean "IsRPITrade" available in
        -   REST
            -   `GET /fapi/v1/trades`
            -   `GET /fapi/v1/historicalTrades`
    -   Order Book Exclusion - RPI orders don't appear in
        -   REST
            -   `GET /fapi/v1/depth`
            -   `GET /fapi/v1/ticker/bookTicker`
        -   WebSocket
            -   `ticker.book`
            -   `<symbol>@bookTicker`
            -   `!bookTicker`
            -   `<symbol>@depth<levels>`
            -   `<symbol>@depth`
-   For more details, please refer to [https://www.binance.com/en/support/faq/92c83c53173947c4a44f9a7277c3b9ce](https://www.binance.com/en/support/faq/92c83c53173947c4a44f9a7277c3b9ce)

## 2025-11-12[​](https://developers.binance.com/docs/derivatives/change-log)

Binance Derivative is rebuilding the Options system to enhance overall stability, performance, and scalability, while also introducing new features.

As the first step, a new Options Demo API environment has been launched to help existing users adapt their code to the updated system. Documentation is available under the "Options Demo Trading" tab.

To get started, please visit [https://demo.binance.com/zh-CN/my/settings/api-management](https://demo.binance.com/zh-CN/my/settings/api-management) to create a new API key. This key can be used to access the new Options Demo Trading environment.

## 2025-11-10[​](https://developers.binance.com/docs/derivatives/change-log)

-   As BFUSD has been migrated to Binance Earn on 2025-08-13. The following endpoints is deprecated:
    -   `POST sapi/v1/portfolio/mint`
    -   `POST sapi/v1/portfolio/redeem`

## 2025-11-06[​](https://developers.binance.com/docs/derivatives/change-log)

-   Effective on **2025-12-09**, USDⓈ-M Futures will migrate conditional orders to the Algo Service, which will affect the following order types: `STOP_MARKET`/`TAKE_PROFIT_MARKET`/`STOP`/`TAKE_PROFIT`/`TRAILING_STOP_MARKET`.
    
-   The new endpoints for conditional orders of REST API :
    
    -   `POST fapi/v1/algoOrder`: Place an algo order
    -   `DELETE /fapi/v1/algoOrder`: Cancel an algo order
    -   `DELETE fapi/v1/algoOpenOrders`: Cancel all open algo orders
    -   `GET /fapi/v1/algoOrder`: Query an algo order
    -   `GET /fapi/v1/openAlgoOrders`: Query algo open order(s)
    -   `GET /fapi/v1/allAlgoOrders`: Query algo order(s)
-   The following enpoints will block the requests for order types after the migration: `STOP_MARKET`/`TAKE_PROFIT_MARKET`/`STOP`/`TAKE_PROFIT`/`TRAILING_STOP_MARKET`. The error code `-4120` STOP\_ORDER\_SWITCH\_ALGO will be encountered.
    
    -   `POST /fapi/v1/order`
    -   `POST /fapi/v1/batchOrders`
-   Websocket User Stream Update
    
    -   New algo order event: `ALGO_UPDATE`
-   Websocket API Update
    
    -   New algo order : `algoOrder.place`
    -   Cancel algo order: `algoOrder.cancel`
-   Please note that after the migration:
    
    -   No margin check before the conditional order gets triggered.
    -   GTE\_GTC orders no longer depend on open orders of the opposite side, but rather on positions only.
    -   There should be no latency increase in order triggering.
    -   Modification of untriggered conditional orders is not supported.

## 2025-10-21[​](https://developers.binance.com/docs/derivatives/change-log)

-   Effective **2025-10-23**, the `priceMatch` enum values **`OPPONENT_10`** and **`OPPONENT_20`** are temporarily removed from **place/amend** flows, other enums are not impacted. Affected endpoints:
    
    **USDT-M Futures (`/fapi`)**
    
    -   `POST /fapi/v1/order`
    -   `POST /fapi/v1/batchOrders`
    -   `PUT /fapi/v1/order`
    -   `PUT /fapi/v1/batchOrders`
    
    **COIN-M Futures (`/dapi`)**
    
    -   `POST /dapi/v1/order`
    -   `POST /dapi/v1/batchOrders`
    -   `PUT /dapi/v1/order`
    -   `PUT /dapi/v1/batchOrders`
    
    **Portfolio Margin (`/papi`)**
    
    -   `POST /papi/v1/um/order`
    -   `PUT /papi/v1/um/order`
    -   `POST /papi/v1/um/conditional/order`
    -   `POST /papi/v1/cm/order`
    -   `PUT /papi/v1/cm/order`
    -   `POST /papi/v1/cm/conditional/order`

## 2025-10-20[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Effective 2025-10-23, Order expire reason field `er` will be available in `ORDER_TRADE_UPDATE` stream.

## 2025-10-14[​](https://developers.binance.com/docs/derivatives/change-log)

-   Effective 2025-10-23, the error message for the code below will be updated:

```
{    "code": -1008,    "msg": "Request throttled by system-level protection. Reduce-only/close-position orders are exempt. Please try again."}
```

## 2025-10-09[​](https://developers.binance.com/docs/derivatives/change-log)

-   Futures now supports trading pair symbols in Chinese. Example from `exchangeInfo`: `"symbol": "测试USDT"`.
-   When placing orders via API, if `symbol` contains Chinese characters, it **must** be URL-encoded (UTF-8 percent-encoding). Example:  
    `https://fapi.binance.com/fapi/v1/order?symbol=%E6%B5%8B%E8%AF%95USDT&side=BUY&type=TAKE_PROFIT_MARKET&timeInForce=GTE_GTC&quantity=1&stopPrice=30&timestamp=1760000007980`
-   The `symbol` field in push messages (WebSocket/User Data Stream) may also contain Chinese. Ensure clients/downstream systems handle decoding and rendering properly.
-   Requests with unencoded Chinese `symbol` may fail or return parameter parsing errors.

## 2025-08-11[​](https://developers.binance.com/docs/derivatives/change-log)

-   BFUSD will be migrated to Binance Earn on 2025-08-13. The following endpoints will be deprecated after the migration:
    -   `POST sapi/v1/portfolio/mint`
    -   `POST sapi/v1/portfolio/redeem`
-   Error code `-21015` ENDPOINT\_GONE will be encountered.
-   Portfolio Margin and Portfolio Margin Pro users can switch to Binance Earn for BFUSD minting and redeeming. After the migration, the existing BFUSD under the Portfolio Margin wallet can use the aggregate balance function(`POST /sapi/v1/portfolio/asset-collection`) first, and transfer from Portfolio Margin wallet to Spot wallet for redemption.

## 2025-07-25[​](https://developers.binance.com/docs/derivatives/change-log)

-   Added new error code in fapi:
    -   `-4109`: _This account is inactive. Please activate it before trading._  
        This indicates the account has been archived due to inactivity. To activate it, transfer any amount of asset to the USDM Futures account.

## 2025-07-02[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   REST API
    
    -   `GET /futures/data/openInterestHist`: add response field `CMCCirculatingSupply`
-   Websocket Market Streams
    
    -   A single connection of maximum streams change from 200 to 1024.

## 2025-04-23[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   REST API
    -   `GET /fapi/v1/insuranceBalance`: New endpoints to query insurance fund balance snapshot
    -   `GET /fapi/v1/constituents`: add response field `price` and `weight`

## 2025-04-15[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin and Portfolio Margin Pro

-   New endpoints for Earn Asset transfer as collateral:
    -   `POST /sapi/v1/portfolio/earn-asset-transfer`: Transfer LDUSDT for Portfolio Margin
    -   `GET /sapi/v1/portfolio/earn-asset-balance`: Get Transferable Earn Asset Balance for Portfolio Margin

## 2025-02-28[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints to query user pmloan repay record(Release on 2025-02-28):
    -   `GET /sapi/v1/portfolio/pmloan-history`

## 2025-02-20[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEBSOCKET API

-   Websocket API will be available on 2025-02-25 and can be accessed through this URL: `wss://ws-dapi.binance.com/ws-dapi/v1`
-   WebSocket API allows placing orders, canceling orders, etc. through a WebSocket connection.
-   WebSocket API is a separate service from WebSocket Market Data streams. I.e., placing orders and listening to market data requires two separate WebSocket connections.
-   WebSocket API is subject to the same Filter and Rate Limit rules as REST API.
-   WebSocket API and REST API are functionally equivalent: they provide the same features, accept the same parameters, return the same status and error codes.

## 2025-01-20[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints to query user negative balance auto exchange record(Release on 2025-01-22):
    -   `GET /papi/v1/portfolio/negative-balance-exchange-record`

## 2025-01-13[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures & COIN-M Futures

-   The following endpoints will be updated at 2024-01-14:
    
    -   `GET /fapi/v1/historicalTrades`
    -   `GET /dapi/v1/historicalTrades`
    
    Changes to the request parameter `limit`:
    
    -   Maximum value changed from 1000 to 500
    -   Default value changed from 500 to 100

## 2025-01-06[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints to query user rate limit:
    -   `GET papi/v1/rateLimit/order`

## 2024-12-19[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin Pro & Portfolio Margin

-   New endpoints for BFUSD mint and redeem(Release on 2024-12-20):
    -   `POST sapi/v1/portfolio/mint`
    -   `POST sapi/v1/portfolio/redeem`

## 2024-12-17[​](https://developers.binance.com/docs/derivatives/change-log)

Options

-   REST API: Added new endpoint `GET /eapi/v1/blockTrades` to get recent block trades
    
-   Websocket Market Streams: Add field `X` in streams `<symbol>@trade` and `<underlyingAsset>@trade` to show trade type
    

## 2024-12-02[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   The following error code will be added on 2024-12-03:
    -   `-4116`: ClientOrderId is duplicated.
    -   `-4117`: Stop order is in triggering process. Please try again later.

## 2024-11-04[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures & COIN-M Futures

-   `GET /fapi/v1/pmExchangeInfo` and `GET /dapi/v1/pmExchangeInfo` will be deprecated on 2024-11-15

## 2024-11-01[​](https://developers.binance.com/docs/derivatives/change-log)

Options

-   Add block trade endpoints:
    -   `POST eapi/v1/block/order/create`
    -   `PUT eapi/v1/block/order/create`
    -   `DELETE eapi/v1/block/order/create`
    -   `GET eapi/v1/block/order/orders`
    -   `POST eapi/v1/block/order/execute`
    -   `GET eapi/v1/block/order/execute`
    -   `GET eapi/v1/block/user-trades`

## 2024-10-29[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin Pro

-   The following REST endpoints will be adjusted:
    -   `POST /sapi/v1/portfolio/repay-futures-switch`: Effective on 2024-11-01, rate limit will be adjusted to 20/day.

Portfolio Margin

-   The following REST endpoints will be adjusted:
    -   `POST /papi/v1/repay-futures-switch`: Effective on 2024-11-01, rate limit will be adjusted to 20/day.

## 2024-10-24[​](https://developers.binance.com/docs/derivatives/change-log)

Options

-   API Field Removal(Effective 2024-10-28):
    -   In the `GET /eapi/v1/exchangeInfo` endpoint, the `id` field will be removed from `optionContracts`, the `id` field will been removed from `optionAssets`, and both the `contractId` and `id` fields have been removed from `optionSymbols`.
    -   The `id` and `cid` fields will been removed from the `option_pair` websocket stream

## 2024-10-21[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures & COIN-M Futures

-   Effective from 2024-10-30 00:00 (UTC), the endpoints will only support querying futures trade histories within the most recent 6 months:
    -   `GET /fapi/v1/userTrades`
    -   `GET /dapi/v1/userTrades`

COIN-M Futures

-   Add new historical data download endpoint:
    -   `GET /dapi/v1/order/asyn`: to get Download Id For Futures Order History
    -   `GET /dapi/v1/order/asyn/id`: to get Futures Order History Download Link by Id
    -   `GET /dapi/v1/trade/asyn`: to get Download Id For Futures Trade History
    -   `GET /dapi/v1/trade/asyn/id`: to get Futures Trade History Download Link by Id

## 2024-10-15[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin Pro(Release date 2024-10-18)

-   New endpoint to get Portfolio Margin Pro SPAN Account Info(For Portfolio Margin Pro SPAN users only):
    -   `GET /sapi/v2/portfolio/account`
-   New endpoint to get Portfolio Margin Pro Account Balance Info:
    -   `GET /sapi/v1/portfolio/balance`

Portfolio Margin

-   New endpoint to get download id for UM futures trade history:
    -   `GET /papi/v1/um/trade/asyn`
-   New endpoint to get UM futures trade download link by Id:
    -   `GET /papi/v1/um/trade/asyn/id`
-   New endpoint to get download id for UM futures order history:
    -   `GET /papi/v1/um/order/asyn`
-   New endpoint to get UM futures order download link by Id:
    -   `GET /papi/v1/um/order/asyn/id`
-   New endpoint to get download id for UM futures transaction history:
    -   `GET /papi/v1/um/income/asyn`
-   New endpoint to get UM futures transaction download link by Id:
    -   `GET /papi/v1/um/income/asyn/id`

## 2024-10-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   The following REST endpoints will be adjusted:
    -   `POST /fapi/v1/convert/getQuote`: Effective on 2024-10-19, rate limit will be adjusted to 360/hour, 500/day.
    -   `POST /fapi/v1/convert/getQuote`: `validTime` can only be set to `10s`

## 2024-10-11[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   **Self-Trade Prevention**:
    
-   Self-Trade Prevention (aka STP) is added to the system. This prevents orders from matching with orders from the same account, or accounts under the same `tradeGroupId`(currently only support same account). For more detail, please check [FAQ](https://www.binance.com/zh-CN/support/faq/what-is-self-trade-prevention-0941126f6413485b9a3df964a9aa2306)
    
-   User can set `selfTradePreventionMode` when placing new orders. All symbols support the following STP mode:
    
    -   NONE: No Self-Trade Prevention
    -   EXPIRE\_TAKER: expire taker order when STP trigger
    -   EXPIRE\_BOTH: expire taker and maker order when STP trigger
    -   EXPIRE\_MAKER: expire maker order when STP trigger
-   REST Update:
    
    -   New order status `EXPIRED_IN_MATCH` - This means that the order expired due to STP being triggered.
    -   Add optional parameter `selfTradePreventionMode` in the endpoints below to set order's STP mode:
        -   `POST /dapi/v1/order`
        -   `POST /dapi/v1/batchOrders`
    -   Add new field `selfTradePreventionMode` in response of the endpoints below to show order's STP mode:
        -   `POST /dapi/v1/order`
        -   `POST /dapi/v1/batchOrders`
        -   `GET /dapi/v1/order`
        -   `GET /dapi/v1/openOrders`
        -   `GET /dapi/v1/allOrders`
        -   `PUT /dapi/v1/order`
        -   `PUT /dapi/v1/batchOrders`
        -   `DELETE /dapi/v1/order`
        -   `DELETE /dapi/v1/batchOrders`
-   WEBSOCKET User Data Stream:
    
    -   Add new field `V` in `ORDER_TRADE_UPDATE` to order STP mode.
-   **Price Match**
    
-   Coin margin future supports order price match function. This feature allows users' LIMIT/STOP/TAKE\_PROFIT orders to be placed without entering a price. The price match function will automatically determine the order price in real-time based on the price match mode and the order book.
    
-   The following priceMatch modes are supported on order level:
    
    -   NONE: no price match
    -   OPPONENT: counterparty best price
    -   OPPONENT\_5: counterparty 5th best price
    -   OPPONENT\_10: counterparty 10th best price
    -   OPPONENT\_20: counterparty 20th best price
    -   QUEUE: the best price on the same side of the order book
    -   QUEUE\_5: the 5th best price on the same side of the order book
    -   QUEUE\_10: the 10th best price on the same side of the order book
    -   QUEUE\_20: the 20th best price on the same side of the order book
-   Example:
    
    -   User places buy order and set priceMatch as QUEUE\_5, the order price will be 5th best bid price of the orderbook
    -   User places buy order and set priceMatch as OPPONENT, the order price will be best ask price of the orderbook
-   REST Update:
    
-   Add optional parameter priceMatch in the endpoints below to set order's priceMatch mode:
    
    -   `POST /dapi/v1/order`
    -   `POST /dapi/v1/batchOrders`
-   Add new field priceMatch in response of the endpoints below to show order's priceMatch mode:
    
    -   `POST /dapi/v1/order`
    -   `POST /dapi/v1/batchOrders`
    -   `GET /dapi/v1/order`
    -   `GET /dapi/v1/openOrders`
    -   `GET /dapi/v1/allOrders`
    -   `PUT /dapi/v1/order`
    -   `PUT /dapi/v1/batchOrders`
    -   `DELETE /dapi/v1/order`
    -   `DELETE /dapi/v1/batchOrders`
-   WEBSOCKET User Data Stream:
    
    -   Add new field `pm` in `ORDER_TRADE_UPDATE` to show price match mode.

## 2024-10-10[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Binance will update the following endpoints, estimated to be in force on 2024-10-17 03:00 (UTC). After 2024-10-17 03:00 (UTC), the endpoints will support querying futures trade histories that are not older than one year:
    
    -   `GET /fapi/v1/aggTrades`
    -   `GET /dapi/v1/aggTrades`
-   Binance will update the following endpoints, estimated to be in force on 2024-10-16 03:00 (UTC). After 2024-10-16 03:00 (UTC), the endpoint will support querying future histories that are not older than 30 days:
    
    -   `GET /fapi/v1/positionMargin/history`

## 2024-10-08[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   The most recent 7-days data is returned by default when requesting the following endpoints. The query time period for these endpoints must be less than 7 days:
    
    -   `GET /dapi/v1/allOrders`
    -   `GET /dapi/v1/userTrades`
-   The following endpoints will be adjusted to keep only recent three month data:
    
    -   `GET /dapi/v1/order`
    -   `GET /dapi/v1/allOrders`

## 2024-09-27[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   The following websocket user data requests are deprecated:
    -   `listenkey@account`
    -   `listenkey@balance`
    -   `listenkey@position`

COIN-M Futures

-   The following websocket user data requests are deprecated:
    -   `listenkey@account`
    -   `listenkey@balance`
    -   `listenkey@position`

## 2024-09-19[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoint to repay debt for Margin:
    -   `POST /papi/v1/margin/repay-debt`: Repay debt for a margin loan.

## 2024-09-06[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   Update endpoint for Portfolio Margin/Trade(Release date 2024-09-06):
    
    -   `POST /papi/v1/um/order`: add parameter `priceMatch` to support priceMatch for place order
    -   `POST/papi/v1/um/conditional/order`: add parameter `priceMatch` to support priceMatch for plac conditional order
    -   `PUT /papi/v1/um/order`: add parameter `priceMatch` to ssupport priceMatch for order modification
-   Add new field `priceMatch` in response of the endpoints below to show order's priceMatch:
    
    -   `POST /papi/v1/um/order`
    -   `POST/papi/v1/um/conditional/order`
    -   `PUT /papi/v1/um/order`
    -   `GET /papi/v1/um/orderAmendment`
    -   `GET /papi/v1/um/order`
    -   `GET /papi/v1/um/openOrder`
    -   `GET /papi/v1/um/openOrders`
    -   `GET /papi/v1/um/allOrders`
    -   `GET /papi/v1/um/conditional/openOrder`
    -   `GET /papi/v1/um/conditional/openOrders`
    -   `GET /papi/v1/um/conditional/orderHistory`
    -   `GET /papi/v1/um/conditional/allOrders`
    -   `DELETE /papi/v1/um/order`
    -   `DELETE /papi/v1/um/conditional/order`
-   WEBSOCKET
    
    -   Add new field `pm` in `ORDER_TRADE_UPDATE` and `CONDITIONAL_ORDER_TRADE_UPDATE`, which represents priceMatch .

## 2024-09-05[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin Pro

-   New endpoint to query Portfolio Margin Pro Tiered Collateral Rate:
    -   `GET /sapi/v2/portfolio/collateralRate`: Query Portfolio Margin Pro Tiered Collateral Rate.

## 2024-09-03[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   User data stream will add `TRADE_LITE` event. `TRADE_LITE` event designed to reduce user data latency by focusing solely on ‘TRADE’ execution type and minimizing the number of user data fields, providing a faster and more efficient experience compared to the original `ORDER_TRADE_UPDATE` user data stream.

## 2024-08-26[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint to Future Convert:
    -   `GET /fapi/v1/convert/exchangeInfo`
    -   `POST /fapi/v1/convert/getQuote`
    -   `POST /fapi/v1/convert/acceptQuote`
    -   `GET /fapi/v1/convert/orderStatus`

## 2024-08-23[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoint to toggle UM Futures BNB Burn:
    -   `POST /papi/v1/um/feeBurn`: Toggle BNB Burn on UM Futures Trade.
    -   `GET /papi/v1/um/feeBurn`: Get UM Futures BNB Burn status.
-   New Endpoints to Query Account Information:
    -   `GET /papi/v1/um/accountConfig`: Query user UM account configuration.
    -   `GET /papi/v1/um/symbolConfig`: Query user symbol configuration.
    -   `GET /papi/v2/um/account`: Compared to `GET /papi/v1/um/account`, this endpoint only returns symbols that the user has positions or open orders in. Configuration-related fields have been removed and can now be queried from `GET /papi/v1/um/symbolConfig` and `GET /papi/v1/um/accountConfig`. The V2 endpoint also offers better performance.

## 2024-08-07[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   The following endpoints IP weight limit will be adjusted from 2024-09-03:
    
    -   REST API:
        -   `GET /fapi/v2/balance`: 5->10
        -   `GET /fapi/v2/account`: 5->10
        -   `GET /fapi/v2/positionRisk`: 5->10
    -   Websocket API:
        -   `account.status`: 5->10
        -   `account.balance`: 5->10
        -   `account.position`: 5->10
-   The following WebSocket User Data Requests will be deprecated from 2024-09-03
    
    -   <listenKey>@account
    -   <listenKey>@balance
    -   <listenKey>@position

Please refer to [annoucement](https://www.binance.com/en/support/announcement/notice-on-upcoming-binance-api-update-2024-09-03-19d4e3cd0758426584dd9686eb56ec64) for api replacement

## 2024-08-06[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

`GET /dapi/v1/pmExchangeInfo` will be deprecated on August 6,2024 due to removing `notionalLimit` restriction.

## 2024-07-24[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

#### REST API[​](https://developers.binance.com/docs/derivatives/change-log)

-   New Endpoints to Query Account Information:
    
    -   `GET /fapi/v1/symbolConfig`: Query user symbol configuration.
    -   `GET /fapi/v1/accountConfig`: Query user account configuration.
    -   `GET /fapi/v3/account`: Compared to `GET /fapi/v2/account`, this endpoint only returns symbols that the user has positions or open orders in. Configuration-related fields have been removed and can now be queried from `GET /fapi/v1/symbolConfig` and `GET /fapi/v1/accountConfig`. The V3 endpoint also offers better performance.
    -   `GET /fapi/v3/balance`: Query user account balance.
-   New Endpoints to Query Trade Information:
    
    -   `GET /fapi/v3/positionRisk`: Compared to `GET /fapi/v2/positionRisk`, this endpoint only returns symbols that the user has positions or open orders in. Configuration-related fields have been removed and can now be queried from `GET /fapi/v1/symbolConfig`. The V3 endpoint also offers better performance.

#### WebSocket API[​](https://developers.binance.com/docs/derivatives/change-log)

-   New Endpoints to Query Account Information:
    -   `v2/account.status`: Compared to `account.status`, this endpoint only returns symbols that the user has positions or open orders in. Configuration-related fields have been removed and can now be queried from `GET /fapi/v1/symbolConfig` and `GET /fapi/v1/accountConfig`. The V2 endpoint also offers better performance.
    -   `v2/account.balance`: Query user account balance.
    -   `v2/account.position`: Compared to `account.position`, this endpoint only returns symbols that the user has positions or open orders in. Configuration-related fields have been removed and can now be queried from `GET /fapi/v1/symbolConfig`. The V2 endpoint also offers better performance.

**Deprecation Notice:**

-   The following endpoints will be deprecated in the coming months (exact date to be announced later). Please switch to the new endpoints listed above:
    -   REST API:
        -   `GET /fapi/v2/balance`
        -   `GET /fapi/v2/account`
        -   `GET /fapi/v2/positionRisk`
    -   Websocket API:
        -   `account.status`
        -   `account.balance`
        -   `account.position`

---

## 2024-07-17[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

REST API

-   The response field `marginAsset` in `GET /papi/v1/um/userTrades` will be removed on 2024-07-17.

---

## 2024-06-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST API

-   The response field `marginAsset` in `GET /fapi/v1/userTrades` will be removed on 2024-06-25.

---

## 2024-05-22[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST API & Websocket API

-   New endpoint to toggle BNB Burn:
    -   `POST /fapi/v1/feeBurn` to toggle BNB Burn on Futures Trade.
    -   `GET /fapi/v1/feeBurn` to get BNB Burn status.

---

## 2024-04-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST API & Websocket API

-   The new field listenKey will be integrated into the response received from the `PUT /fapi/v1/listenKey` endpoint and WebSocket api `userDataStream.ping`. This enhancement will allow users to view the key that has been kept alive. This update is scheduled to take effect on 2024-04-25.

```
{    "listenKey": "3HBntNTepshgEdjIwSUIBgB9keLyOCg5qv3n6bYAtktG8ejcaW5HXz9Vx1JgIieg"}
```

---

## 2024-04-09[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures/ COIN-M Futures / Portfolio Margin

WEBSOCKET API

-   Good-Till-Cancel (GTC) timeInForce will have a one-year validity period after order placement. GTC orders longer than one-year will be automatically canceled. This applies to all order types including reduceOnly but does not affect part-filled orders or strategy trading or copy-trading orders.

---

## 2024-04-01[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET API

-   Websocket API is now available and can be accessed through this URL: `wss://ws-fapi.binance.com/ws-fapi/v1`
-   WebSocket API allows placing orders, canceling orders, etc. through a WebSocket connection.
-   WebSocket API is a separate service from WebSocket Market Data streams. I.e., placing orders and listening to market data requires two separate WebSocket connections.
-   WebSocket API is subject to the same Filter and Rate Limit rules as REST API.
-   WebSocket API and REST API are functionally equivalent: they provide the same features, accept the same parameters, return the same status and error codes.

---

## 2024-03-11[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Add new Account Endpoints:
    -   `GET /fapi/v1/rateLimit/order`: query user order rate limits

---

## 2024-02-09[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

Binance Future is doing Websocket Service upgrade and the upgrade impacts the following：

-   Before upgrade:
    
    -   The websocket server will send a ping frame every 3 minutes. If the websocket server does not receive a pong frame back from the connection within a 10 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.
-   After upgrade:
    
    -   Websocket server will send a `ping frame` every 3 minutes.
        -   If the websocket server does not receive a `pong frame` back from the connection within a 10 minute period, the connection will be disconnected.
        -   When you receive a ping, you must send a pong with a copy of ping's payload as soon as possible.
        -   Unsolicited `pong frames` are allowed, but will not prevent disconnection. **It is recommended that the payload for these pong frames are empty.**

---

## 2024-01-24[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

Testnet WEBSOCKET

-   The Websocket baseurl for **testnet** is updated to "wss://fstream.binancefuture.com"

---

## 2024-01-19[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   REST
    
    -   New endpoints `PUT /papi/v1/um/order` and `PUT /papi/v1/cm/order` to support UM/CM limit order modify
    -   New endpoints `GET /papi/v1/um/orderAmendment` and `GET /papi/v1/cm/orderAmendment` to get UM/CM order modify history

---

## 2024-01-11[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   **Self-Trade Prevention(Released):**
    
-   Self-Trade Prevention (aka STP) will be added to the system. This will prevent orders from matching with orders from the same account, or accounts under the same `tradeGroupId`. For more detail, please check [FAQ](https://www.binance.com/en/support/faq/what-is-self-trade-prevention-stp-0941126f6413485b9a3df964a9aa2306)
    
-   User can set `selfTradePreventionMode` when placing new orders. All symbols support the following STP mode:
    
    -   NONE: No Self-Trade Prevention
    -   EXPIRE\_TAKER: expire taker order when STP trigger
    -   EXPIRE\_BOTH: expire taker and maker order when STP trigger
    -   EXPIRE\_MAKER: expire maker order when STP trigger
-   REST Update:
    
    -   New order status `EXPIRED_IN_MATCH` - This means that the order expired due to STP being triggered.
        
    -   GET /papi/v1/um/account: Add new field `tradeGroupId` in response to show user's tradeGroupId
        
    -   Add optional parameter `selfTradePreventionMode` in the endpoints below to set order's STP mode:
        
        -   POST /papi/v1/um/order
        -   POST/papi/v1/um/conditional/order
        -   POST /papi/v1/margin/order
        -   POST /papi/v1/margin/order/oco
    -   Add new field `selfTradePreventionMode` in response of the endpoints below to show order's STP mode:
        
        -   POST /papi/v1/um/order
            
        -   POST/papi/v1/um/conditional/order
            
        -   GET /papi/v1/um/order
            
        -   GET /papi/v1/um/openOrder
            
        -   GET /papi/v1/um/openOrders
            
        -   GET /papi/v1/um/allOrders
            
        -   GET /papi/v1/um/conditional/openOrder
            
        -   GET /papi/v1/um/conditional/openOrders
            
        -   GET /papi/v1/um/conditional/orderHistory
            
        -   GET /papi/v1/um/conditional/allOrders
            
        -   DELETE /papi/v1/um/order
            
        -   DELETE /papi/v1/um/conditional/order
            
        -   DELETE /papi/v1/margin/order
            
        -   DELETE /papi/v1/margin/allOpenOrders
            
        -   DELETE /papi/v1/margin/orderList
            
        -   GET /papi/v1/margin/order
            
        -   GET /papi/v1/margin/allOrders
            
        -   GET /papi/v1/margin/orderList
            
        -   GET /papi/v1/margin/allOrderList
            
        -   GET /papi/v1/margin/openOrderList
            
-   WEBSOCKET User Data Stream:
    
    -   Add new field `V` in `ORDER_TRADE_UPDATE` and `CONDITIONAL_ORDER_TRADE_UPDATE` to order STP mode.
    -   New fields for `executionReport` (These fields will only appear if the order has expired due to STP trigger)
        -   `u` - `tradeGroupId`
        -   `v` - `preventedMatchId`
        -   `U` - `counterOrderId`
        -   `A` - `preventedQuantity`
        -   `B` - `lastPreventedQuantity`
-   **Good Till Date TIF(Released)**
    
-   USDⓈ margin future will support Good To Date TIF. Orders with the TIF set to GTD will be automatically canceled by the `goodTillDate` time.
    
-   REST Update:
    
    -   Add optional parameter `goodTillDate` in the endpoints below to set order's `goodTillDate` :
        
        -   POST /papi/v1/um/order
        -   POST/papi/v1/um/conditional/order
    -   Add new field `goodTillDate` in response of the endpoints below to show order's `goodTillDate`:
        
        -   POST /papi/v1/um/order
        -   POST/papi/v1/um/conditional/order
        -   GET /papi/v1/um/order
        -   GET /papi/v1/um/openOrder
        -   GET /papi/v1/um/openOrders
        -   GET /papi/v1/um/allOrders
        -   GET /papi/v1/um/conditional/openOrder
        -   GET /papi/v1/um/conditional/openOrders
        -   GET /papi/v1/um/conditional/orderHistory
        -   GET /papi/v1/um/conditional/allOrders
        -   DELETE /papi/v1/um/order
        -   DELETE /papi/v1/um/conditional/order
-   WEBSOCKET User Data Stream:
    
    -   Add new field `gtd` in `ORDER_TRADE_UPDATE` and `CONDITIONAL_ORDER_TRADE_UPDATE` to order good till date.
-   **Breakeven Price(Released)**
    
-   REST Update
    
    -   Add new field `breakEvenPrice` in The following endpoint
        -   GET /papi/v1/um/account
        -   GET /papi/v1/um/positionRisk
        -   GET /papi/v1/cm/account
        -   GET /papi/v1/cm/positionRisk
-   WEBSOCKET
    
    -   New field `bep` represents Break-Even Price in position `P` of payload to event: Balance and Position Update – "e": "ACCOUNT\_UPDATE"

---

## 2024-01-08[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Update endpoint for Account/Trade(Release date 2023-01-11):
    -   `PUT /fapi/v1/order`: add parameter `priceMatch` to support priceMatch for order modification
    -   `PUT /fapi/v1/batchOrders`: add parameter `priceMatch` to support priceMatch for order modification
    -   Order modification will preserve the original `selfTradePreventionMode` of the order

---

## 2023-12-12[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   Update speed for stream `!bookTicker` will be modified from real-time to every 5 seconds on starting December 20, 2023. Individual Symbol Book Ticker Streams `<symbol>@bookticker` will remain unaffected by this update

---

## 2023-11-15[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Add new Market Data Endpoints:
    -   `GET /fapi/v2/ticker/price`: this is v2 endpoint for querying latest price. It has same parameters and response as the `GET /fapi/v1/ticker/price`, and it offers lower latency and consume less of the IP rate limit. Please note that the `GET /fapi/v1/ticker/price` will be deprecated in the future, with the exact timing to be determined.

WEBSOCKET

-   Binance Futures will retire the `wss://fstream-auth.binance.com` domain at 2023-12-15 06:00. API users are advised to establish a new WebSocket connection to `wss://fstream.binance.com`. Please note that the connection method for `wss://fstream.binance.com` is different from that of `wss://fstream-auth.binance.com`. For instance:
    -   `wss://fstream-auth.binance.com/ws/<ListenKey>?listenKey=<ListenKey>` should change to `wss://fstream.binance.com/ws/<ListenKey>`

---

## 2023-11-01[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   Update on `GET dapi/v1/fundingRate`:
    -   add response field `markPrice` to display mark price associated with a particular funding fee charge

---

## 2023-11-01[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Add new Market Data Endpoints:
    
    -   `GET /futures/data/basis`: query basis data
-   Update on `GET /fapi/v1/fundingRate`:
    
    -   add response field `markPrice` to display mark price associated with a particular funding fee charge

---

## 2023-10-19[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New Market Data Endpoints
    -   `GET /futures/data/delivery-price`: query quarterly contract settlement price
-   Update Rate Limit to 1000/5min/IP on Market Data Endpoints below:
    -   `GET /futures/data/openInterestHist`
    -   `GET /futures/data/topLongShortAccountRatio`
    -   `GET /futures/data/topLongShortPositionRatio`
    -   `GET /futures/data/globalLongShortAccountRatio`
    -   `GET /futures/data/takerlongshortRatio`

---

## 2023-10-19[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

Binance Option is doing Websocket Service upgrade and the upgrade impacts the following：

-   Before upgrade:
    
    -   The websocket server will send a ping frame every 5 minutes. If the websocket server does not receive a pong frame back from the connection within a 15 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.
    -   To connect websocket server without subscription, user can connect by using
        -   `wss://nbstream.binance.com/eoptions/ws`
        -   `wss://nbstream.binance.com/eoptions/stream`
        -   `wss://nbstream.binance.com/eoptions/ws/`
        -   `wss://nbstream.binance.com/eoptions/stream/`
-   After upgrade:
    
    -   The websocket server will send a ping frame every 3 minutes. If the websocket server does not receive a pong frame back from the connection within a 10 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.
    -   To connect websocket server without subscription:
    -   Connect websocket server with subscription:
        -   `wss://nbstream.binance.com/eoptions/ws`
        -   `wss://nbstream.binance.com/eoptions/stream`
        -   `/` at the end is no longer supported
    -   Raw stream like `wss://nbstream.binance.com/eoptions/illegal_parameter/stream?steams=<streamName>` or `wss://fstream.binance.com/illegal_parameter/ws/<streamName>`is not supported, please use remove `illegal_parameter/` before `/ws` and `/stream`.

---

## 2023-10-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New Market Data Endpoints
    -   `GET /futures/data/delivery-price`: query quarterly contract settlement price
-   Update Rate Limit to 1000/5min/IP on Market Data Endpoints below:
    -   `GET /futures/data/openInterestHist`
    -   `GET /futures/data/topLongShortAccountRatio`
    -   `GET /futures/data/topLongShortPositionRatio`
    -   `GET /futures/data/globalLongShortAccountRatio`
    -   `GET /futures/data/takerlongshortRatio`
-   Update Rate Limit to 500/5min/IP on Market Data Endpoints below:
    -   `GET /fapi/v1/fundingRate`
    -   `GET /fapi/v1/fundingInfo`

---

## 2023-10-16[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New Market Data Endpoints
    -   `GET /dapi/v1/constituents`: query index constituents

---

## 2023-10-16[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New Market Data Endpoints
    -   `GET /fapi/v1/constituents`: query index constituents

---

## 2023-10-11[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Account Endpoints IP Weight Update:
    -   `GET /fapi/v1/income/asyn`: 5->1000
    -   `GET /fapi/v1/order/asyn`: 5->1000
    -   `GET /fapi/v1/trade/asyn`: 5->1000
    -   `GET /fapi/v1/income/asyn/id`: 5->10
    -   `GET /fapi/v1/order/asyn/id`: 5->10
    -   `GET /fapi/v1/trade/asyn/id`: 5->10

---

## 2023-09-25[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New Market Data Endpoints Update
    -   `GET /dapi/v1/fundingInfo`: query adjusted funding info

---

## 2023-09-25[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New Market Data Endpoints Update
    -   `GET /fapi/v1/fundingInfo`: query adjusted funding info

---

## 2023-09-22[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   Update on endpoints:
    
    -   `GET /papi/v1/um/positionRisk`: add response field `liquidationPrice`
    -   `GET /papi/v1/cm/positionRisk`: add response field `liquidationPrice`
    -   `GET /papi/v1/um/leverageBracket`: add response field `notionalCoef`
    -   `GET /papi/v1/cm/leverageBracket`: add response field `notionalCoef`
-   Websocket User Data Streams Update:
    
    -   `outboundAccountPosition` event add new field updateId `U`
    -   `balanceUpdate` event add new field updateId `U`

---

## 2023-09-20[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   Update on `GET /dapi/v1/ticker/bookTicker`:
    
    -   add response field `lastUpdateId`
-   Update on `GET /dapi/v1/account`:
    
    -   add response field `updateTime` in `assets`

---

## 2023-09-20[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Update on `GET /fapi/v1/ticker/bookTicker`:
    -   add response field `lastUpdateId`

---

## 2023-09-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

```
{    "code": -1008,    "msg": "Server is currently overloaded with other requests. Please try again in a few minutes."}
```

-   New error code message for http `503` return code, endpoints below might have this response during high traffic:
    -   `POST /fapi/v1/order`
    -   `PUT /fapi/v1/order`
    -   `DELETE /fapi/v1/order`
    -   `POST /fapi/v1/batchOrder`
    -   `PUT /fapi/v1/batchOrder`
    -   `DELETE /fapi/v1/batchOrder`
    -   `POST /fapi/v1/order/test`
    -   `DELETE /fapi/v1/allOpenOrders`
-   This is a failure API operation and you can resend your request if you need.

---

## 2023-09-07[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New endpoint`GET /dapi/v1/income/asyn`to get Download Id For Futures Transaction History
-   New endpoint`GET /dapi/v1/income/asyn/id`to get Futures Transaction History Download Link by Id

---

## 2023-09-05[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   As per the [announcement](https://www.binance.com/en/support/announcement/binance-futures-launches-self-trade-prevention-stp-function-for-usd%E2%93%A2-margined-futures-on-api-32916877372243d69154c345200e34b8), Self Trade Prevention is enabled at **2023-09-05**.
-   Price Match/ Good Till Date TIF/ Breakeven Price(detail in 2023-08-29 changelog) are released at **2023-09-05**

---

## 2023-09-04[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

**Expect 2023-09-07 Release**

-   Overall papi order ratelimit change from 2400 orders/min to 1200 orders/min, impacted endpoints are:
    -   POST `/papi/v1/um/order`
    -   POST `/papi/v1/cm/order`
    -   POST `/papi/v1/margin/order`
    -   POST `/papi/v1/margin/order/oco`
    -   POST `/papi/v1/um/conditional/order`
    -   POST `/papi/v1/cm/conditional/order`

---

## 2023-08-31[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

Binance Future is doing Websocket Service upgrade and the upgrade impacts the following：

-   Before upgrade:
    
    -   The websocket server will send a ping frame every 5 minutes. If the websocket server does not receive a pong frame back from the connection within a 15 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.
-   After upgrade:
    
    -   The websocket server will send a ping frame every 3 minutes. If the websocket server does not receive a pong frame back from the connection within a 10 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.

---

## 2023-08-31[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

Binance Future is doing Websocket Service upgrade and the upgrade impacts the following：

-   Before upgrade:
    
    -   The websocket server will send a ping frame every 5 minutes. If the websocket server does not receive a pong frame back from the connection within a 15 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.
-   After upgrade:
    
    -   The websocket server will send a ping frame every 3 minutes. If the websocket server does not receive a pong frame back from the connection within a 10 minute period, the connection will be disconnected. Unsolicited pong frames are allowed.

---

## 2023-08-29[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   `GET /eapi/v1/account`: add new field `riskLevel` to show account risk level
-   `GET /eapi/v1/marginAccount`: add new field`riskLevel` to show account risk level

Websocket User Data Stream

-   Add new event `RISK_LEVEL_CHANGE` to show account riskLevel change

---

## 2023-08-29[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   **Self-Trade Prevention(Release Date TBD)**:
    
-   Self-Trade Prevention (aka STP) will be added to the system. This will prevent orders from matching with orders from the same account, or accounts under the same `tradeGroupId`. For more detail, please check [FAQ](https://www.binance.com/zh-CN/support/faq/what-is-self-trade-prevention-0941126f6413485b9a3df964a9aa2306)
    
-   User can set `selfTradePreventionMode` when placing new orders. All symbols support the following STP mode:
    
    -   NONE: No Self-Trade Prevention
    -   EXPIRE\_TAKER: expire taker order when STP trigger
    -   EXPIRE\_BOTH: expire taker and maker order when STP trigger
    -   EXPIRE\_MAKER: expire maker order when STP trigger
-   REST Update:
    
    -   New order status `EXPIRED_IN_MATCH` - This means that the order expired due to STP being triggered.
    -   `GET /fapi/v2/account`: Add new field `tradeGroupId` in response to show user's tradeGroupId
    -   Add optional parameter `selfTradePreventionMode` in the endpoints below to set order's STP mode:
        -   `POST /fapi/v1/order`
        -   `POST /fapi/v1/batchOrders`
    -   Add new field `selfTradePreventionMode` in response of the endpoints below to show order's STP mode:
        -   `POST /fapi/v1/order`
        -   `POST /fapi/v1/batchOrders`
        -   `POST /fapi/v1/order`
        -   `POST /fapi/v1/order`
        -   `GET /fapi/v1/order`
        -   `GET /fapi/v1/openOrders`
        -   `GET /fapi/v1/allOrders`
        -   `PUT /fapi/v1/order`
        -   `PUT /fapi/v1/batchOrders`
        -   `DELETE /fapi/v1/order`
        -   `DELETE /fapi/v1/batchOrders`
-   WEBSOCKET User Data Stream:
    
    -   Add new field `V` in `ORDER_TRADE_UPDATE` to order STP mode.

---

## 2023-08-25[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   Binance Future is doing Websocket Service upgrade and the upgrade impacts the following：
    -   Connect websocket server without subscription:
        -   Before upgrade, user can connect by using:
            -   `wss://dstream.binance.com/ws`
            -   `wss://dstream.binance.com/stream`
            -   `wss://dstream.binance.com/ws/`
            -   `wss://dstream.binance.com/stream/`
        -   After upgrade, user can connect by using:
            -   `wss://dstream.binance.com/ws`
            -   `wss://dstream.binance.com/stream`
            -   `/` at the end is no longer supported
    -   Connect websocket server with subscription:
        -   Raw stream like `wss://dstream.binance.com/illegal_parameter/stream?steams=<streamName>` or `wss://dstream.binance.com/illegal_parameter/ws/<streamName>`is not supported, please use remove `illegal_parameter/` before `/ws` and `/stream`.

---

## 2023-08-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Binance Future is doing Websocket Service upgrade and the upgrade impacts the following：
    -   Connect websocket server without subscription:
        -   Before upgrade, user can connect by using:
            -   `wss://fstream.binance.com/ws`
            -   `wss://fstream.binance.com/stream`
            -   `wss://fstream.binance.com/ws/`
            -   `wss://fstream.binance.com/stream/`
        -   After upgrade, user can connect by using:
            -   `wss://fstream.binance.com/ws`
            -   `wss://fstream.binance.com/stream`
            -   `/` at the end is no longer supported
    -   Connect websocket server with subscription:
        -   Raw stream like `wss://fstream.binance.com/illegal_parameter/stream?steams=<streamName>` or `wss://fstream.binance.com/illegal_parameter/ws/<streamName>`is not supported, please use remove `illegal_parameter/` before `/ws` and `/stream`.

---

## 2023-08-18[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints for Query Order:
    -   `GET /papi/v1/margin/order`: Query Margin Account Order
    -   `GET /papi/v1/margin/openOrders`: Query Current Margin Open Order
    -   `GET /papi/v1/margin/allOrders`: Query All Margin Account Orders
    -   `GET /papi/v1/margin/orderList`: Query Margin Account's OCO
    -   `GET /papi/v1/margin/allOrderList`: Query Margin Account's all OCO
    -   `GET /papi/v1/margin/openOrderList`: Query Margin Account's Open OCO
    -   `GET /papi/v1/margin/myTrades`: Query Margin Account's Trade List

---

## 2023-08-14[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   Update endpoint for Account/Trade:
    -   `GET /dapi/v1/income`: Add parameter `page` for pagination

---

## 2023-08-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Update endpoint for Account/Trade:
    -   `GET /fapi/v1/income`: Add parameter `page` for pagination

---

## 2023-07-28[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints for account:
    -   `POST /papi/v1/asset-collection`: Fund Collection by Asset

---

## 2023-07-21[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   New endpoint`GET /eapi/v1/income/asyn`to get Download Id For Option Transaction History
-   New endpoint`GET /eapi/v1/income/asyn/id`to get Option Transaction History Download Link by Id

---

## 2023-07-20[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints for account:
    -   `GET /papi/v1/um/adlQuantile`: UM Position ADL Quantile Estimation
    -   `GET /papi/v1/cm/adlQuantile`: CM Position ADL Quantile Estimation

---

## 2023-07-19[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   Add field `notionalCoef` in `GET /dapi/v2/leverageBracket` to show the bracket multiplier comparing to default leverage bracket

---

## 2023-07-18[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New endpoints for account:
    -   `POST /papi/v1/repay-futures-switch`: Change Auto-repay-futures Status
    -   `GET /papi/v1/repay-futures-switch`: Get Auto-repay-futures Status
    -   `POST /papi/v1/repay-futures-negative-balance`: Repay futures Negative Balance

---

## 2023-07-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Add field `notionalCoef` in `GET /fapi/v1/leverageBracket` to show the bracket multiplier comparing to default leverage bracket

---

## 2023-07-13[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

Websocket Market Streams

-   These change will be effective from 2023-07-14:
    -   Add field `T` in streams `<symbol>@ticker` and `<underlyingAsset>@ticker@<expirationDate>` to show transaction time
    -   Add field `E` in stream `<symbol>@depth<levels>` to show event time

---

## 2023-07-13[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   New USER DATA STREAM event `riskLevelChange`（effective 2023-07-14）

---

## 2023-07-12[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New field `breakEvenPrice` represents Break-Even Price in position of response to:
    -   GET /dapi/v1/account (HMAC SHA256)
    -   GET /dapi/v1/positionRisk (HMAC SHA256)

WEBSOCKET

-   New field `bep` represents Break-Even Price in position `P` of payload to event: Balance and Position Update – "e": "ACCOUNT\_UPDATE"

---

## 2023-07-11[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

REST

-   Add new endpoint `POST /papi/v1/ping` for connectivity test

---

## 2023-07-04[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   The following endpoints will be adjust to keep only recent three month data：
    -   `GET /fapi/v1/order`(effective 2023-07-27)
    -   `GET /fapi/v1/allOrders`(effective 2023-07-27)
    -   `GET /fapi/v1/userTrades`(exact time TBD)
-   Please maintain and record old order/trade infomation or switch querying historical order/trade using new endpoint below:
    -   New endpoint`GET /fapi/v1/order/asyn`to get Download Id For Futures Order History
    -   New endpoint`GET /fapi/v1/order/asyn/id`to get Futures Order History Download Link by Id
    -   New endpoint`GET /fapi/v1/trade/asyn`to get Download Id For Futures Trade History
    -   New endpoint`GET /fapi/v1/trade/asyn/id`to get Futures Trade History Download Link by Id

---

## 2023-06-28[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**Notice:**

REST

-   The following endpoints will no longer be supported from 2023-07-15:
    -   `GET /fapi/v1/account`
    -   `GET /fapi/v1/balance`
    -   `GET /fapi/v1/positionRisk`
-   Please switch to corresponding v2 endpoints:
    -   `GET /fapi/v2/account`
    -   `GET /fapi/v2/balance`
    -   `GET /fapi/v2/positionRisk`

---

## 2023-06-22[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

**Notice:**

WEBSOCKET

-   Raw stream like **/ws?<streamName>** is not supported, for example `wss://dstream.binance.com/ws?btcusd@depth` is invalid.
-   Sending websocket message with invalid JSON format will cause disconnection now, returning this error `{"error":{"code":3,"msg":"Invalid JSON: expected value at line 1 column 1"}}`

---

## 2023-06-22[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**Notice:**

WEBSOCKET

-   Raw stream like **/ws?<streamName>** is not supported, for example `wss://fstream.binance.com/ws?btcusdt@depth` is invalid.
-   Sending websocket message with invalid JSON format will cause disconnection now, returning this error `{"error":{"code":3,"msg":"Invalid JSON: expected value at line 1 column 1"}}`

---

## 2023-06-19[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

REST

-   Add fields `CONTRACT_PRICE`，`priceProtect` in endpoints `POST /papi/v1/um/conditional/order` and `POST/papi/v1/cm/conditional/order`

---

## 2023-06-16[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**Notice:**

-   It is recommended to use standard HTTP request formats, non-standard request formats will not be supported in fapi, below are some examples for correct code practice:
    
    -   Escaping (") with '\\x22' is no longer supported, please use the standard '%22' instead. It is necessary to URL encode the square brackets \[\] and the double quotes（"）inside the square brackets.
        
        ```
        DELETE /fapi/v1/batchOrders?origClientOrderIdList=Unsupported:
        ```
        
        \[\\x229151944646313025900\\x22\]
        
        ```
        Suggest:
        ```
        
        \["9151944646313025900"\]
        
        ```
        --After URL encode--
        ```
        
        DELETE /fapi/v1/batchOrders?origClientOrderIdList=%5B%229151944646313025900%22%5D
        
    -   Non-standard nested JSON formats are not supported,
        
        ```
        POST /fapi/v1/batchOrders?batchOrders=Unsupported:
        ```
        
        \["{\\"type\\":\\"LIMIT\\",\\"timeInForce\\":\\"GTC\\"}"\]
        
        ```
        Suggest:
        ```
        
        \[{"type":"LIMIT","timeInForce":"GTC"}\]
        
        ```
        --After URL encode--
        ```
        
        POST /fapi/v1/batchOrders?batchOrders=%5B%7B%22type%22%3A%22LIMIT%22%2C%22timeInForce%22%3A%22GTC%22%7D%5D
        
    -   Using incorrect data type is not supported
        
        ```
        DELETE /fapi/v1/batchOrders?orderIdList=As the data type of the 'orderIdList' parameter is LIST\<LONG\>Unsupported:
        ```
        
        \["159856286502","159856313662"\]
        
        ```
        Suggest:
        ```
        
        \[159856286502,159856313662\]
        
        ```
        --After URL encode--
        ```
        
        DELETE /fapi/v1/batchOrders?orderIdList=%5B159856286502%2C159856313662%5D
        
    -   Invalid whitespace characters from the request parameters are not supported
        
        ```
        Unsupported:
        ```
        
        POST symbol=BTCUSDT& price= 40000.0 & signature=2d24a314
        
        ```
        Suggest:
        ```
        
        POST symbol=BTCUSDT&&price=40000.0&signature=2d24a314
        
    -   Passing empty values in request parameters is not supported
        
        ```
        Unsupported:
        ```
        
        GET symbol=BTCUSDT&orderId=&signature=2d24a314
        
        Suggest:
        
        GET symbol=BTCUSDT&signature=2d24a314
        

---

## 2023-06-14[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEBSOCKET

-   New field `i` for quote asset and index price added in streams `<symbol>@markPrice` and `<pair>@markPrice`

---

## 2023-06-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New WebSocket stream `!assetIndex@arr`OR`<assetSymbol>@assetIndex` for multi-assets mode asset index update

---

## 2023-06-01[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

REST

-   The endpoints below will be deployed on 2023-06-02:
    -   New endpoints `GET /papi/v1/um/income` and `GET /papi/v1/cm/income` to query portfolio margin UM/CM income history
    -   New endpoints `GET /papi/v1/um/account` and `GET /papi/v1/cm/account` to query portfolio margin UM/CM account history

---

## 2023-05-31[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   Add user data stream:
    -   new event `CONDITIONAL_ORDER_TRIGGER_REJECT` to the order reject reason for triggered TP/SL order

---

## 2023-05-30[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

General Information on Endpoints

-   For `GET` endpoints, parameters must be sent as a `query string` without setting content type in the http headers.

---

## 2023-05-05[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New endpoints `PUT /fapi/v1/order` and `PUT /fapi/v1/batchOrders` to support limit order modify
-   New endpoint `GET /fapi/v1/orderAmendment` to get order modify history

WEBSOCKET

-   New type "AMENDMENT" as order modify in Execution Type `x` of Order Update event `ORDER_TRADE_UPDATE`

---

## 2023-05-04[​](https://developers.binance.com/docs/derivatives/change-log)

Portfolio Margin

-   API doc for portfolio margin

---

## 2023-04-17[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

**RELEASE DATE TBD**

The `recvWindow` check will also be performed when orders reach matching engine. The `recvWindow` will be checked more precisely on order placing endpoints.

```
{    "code": -4188,    "msg": "Timestamp for this request is outside of the ME recvWindow"}
```

**recvWindow Logic Before Release:**

-   The order placing requests are valid if `recvWindow` + `timestamp` => REST API service server `timestamp`

**recvWindow Logic After Release:**

-   Add new recwWindow check: the order placing requests are valid if `recvWindow` + `timestamp` => matching engine `timestamp`
    
-   Impacted Endpoints:
    
    -   POST /dapi/v1/order (HMAC SHA256)
    -   PUT /dapi/v1/order (HMAC SHA256)
    -   POST /dapi/v1/batchOrders (HMAC SHA256)
    -   PUT /dapi/v1/batchOrders (HMAC SHA256)

---

## 2023-04-17[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**RELEASE DATE 2023-04-18**

The `recvWindow` check will also be performed when orders reach matching engine. The `recvWindow` will be checked more precisely on order placing endpoints.

```
{    "code": -5028,    "msg": "Timestamp for this request is outside of the ME recvWindow"}
```

**recvWindow Logic Before Release:**

-   The order placing requests are valid if `recvWindow` + `timestamp` => REST API service server `timestamp`

**recvWindow Logic After Release:**

-   Add new recwWindow check: the order placing requests are valid if `recvWindow` + `timestamp` => matching engine `timestamp`
    
-   Impacted Endpoints:
    
    -   POST /fapi/v1/order
    -   PUT /fapi/v1/order
    -   POST /fapi/v1/batchOrders
    -   PUT /fapi/v1/batchOrders

---

## 2023-03-28[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**Referal Rebate Logic Before Release**

-   For every trade，the referal rebate balance change will be reflected in `ACCOUNT_UPDATE` event of USER-DATA-STREAM in real time：

```
{  "e": "ACCOUNT_UPDATE",  "T": 1679974782150,  "E": 1679974782155,  "a": {    "B": [	  {       "a": "USDT",       "wb": "685.31478079",       "cw": "677.17212454",       "bc": "0.00258637"      }	],    "P": [],    "m": "ADMIN_DEPOSIT"  }}
```

**Referal Rebate Logic After Release**

-   Referral rebates are aggregated every 20 minutes and reflected as a single push in the `ACCOUNT_UPDATE` event of the USER-DATA-STREAM, showing the total sum of rebates earned from multiple referrals.

---

## 2023-03-08[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**RELEASE DATE 2023-03-22**

**Order Logic Before Release:**

-   When placing order with `timeInForce` `FOK` or `GTX`(Post-only), user will get order response with `status` = “NEW“ and corresponding `order_trade_update` with `x` = “NEW”, `X` = “NEW”. If the orders can't meet execution criteria, user will receive another websocket `order_trade_update` message `x` = “EXPIRED”, `X` = “EXPIRED”. The order can be found in `GET /fapi/v1/order` or `GET /fapi/v1/allOrders`.

```
{    "code": -5021,    "msg": "Due to the order could not be filled immediately, the FOK order has been rejected. The order will not be recorded in the order history"}
```

**Order Logic After Release:**

-   When placing order with `timeInForce` `FOK` or `GTX`(Post-only), if the order can't meet execution criteria, order will get rejected directly and receive error response, no `order_trade_update` message in websocket. The order can't be found in `GET /fapi/v1/order` or `GET /fapi/v1/allOrders`.

```
{    "code": -5022,    "msg": "Due to the order could not be executed as maker, the Post Only order will be rejected. The order will not be recorded in the order history"}
```

-   Impacted Endpoints:
    -   POST /fapi/v1/order
    -   POST /fapi/v1/batchOrders
    -   GET /fapi/v1/order
    -   GET /fapi/v1/allOrders

---

## 2023-02-02[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   Endpoint `POST /eapi/v1/transfer` is disabled.

---

## 2023-01-11[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   Add endpoint `GET /eapi/v1/order` to check order status.

---

## 2023-01-04[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   Delete Order Status `NEW_INSURANCE` and `NEW_ADL` in Order Update Event

---

## 2022-12-16[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEBSOCKET

-   New WebSocket stream `!contractInfo` for symbol information update

---

## 2022-12-16[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New WebSocket stream `!contractInfo` for symbol information update

---

## 2022-12-13[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

WEBSOCKET

-   Add `u` and `pu` in stream`<symbol>@depth1000` to get diff orderbook update.

---

## 2022-12-09[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   Add updateId field `u` in `GET /eapi/v1/depth`
-   Add parameter `underlying` in `GET /eapi/v1/exerciseHistory` to query exercise histroy by underlying

---

## 2022-11-29[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEB SOCKET USER DATA STREAM

-   New WebSocket stream `STRATEGY_UPDATE` in USER-DATA-STREAM: update when a strategy is created/cancelled/expired, ...etc.
-   New WebSocket stream `GRID_UPDATE` in USER-DATA-STREAM: update when a sub order of a grid is filled or partially filled.

---

## 2022-11-29[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEB SOCKET USER DATA STREAM

-   New WebSocket stream `STRATEGY_UPDATE` in USER-DATA-STREAM: update when a strategy is created/cancelled/expired, ...etc.
-   New WebSocket stream `GRID_UPDATE` in USER-DATA-STREAM: update when a sub order of a grid is filled or partially filled.

---

## 2022-11-18[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   New endpoint `GET /eapi/v1/openInterest` is added to get options open interest for specific underlying on certain expiration date.

WEBSOCKET

-   New stream `<underlyingAsset>@openInterest@<expirationDate>` is added for real-time option open interest feed.

---

## 2022-11-16[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

WEBSOCKET

-   New trade stream `<underlyingAsset>@trade` is added for all option trades on specific underlying asset.
-   Adjust format in stream `option_pair`.

---

## 2022-11-03[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   New endpoint for Auto-Cancel All Open Orders will be added on 2022-11-07:
    -   `POST /eapi/v1/countdownCancelAll`：Set Auto-Cancel All Open Orders (Kill-Switch) Config
    -   `GET /eapi/v1/countdownCancelAll`：Get Auto-Cancel All Open Orders (Kill-Switch) Config
    -   `POST /eapi/v1/countdownCancelAllHeartBeat`：Auto-Cancel All Open Orders (Kill-Switch) Heartbeat

---

## 2022-10-13[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

**Note:** This change will be effictive on 2022-10-17

REST RATE LIMIT WEIGHT

Endpoint `GET /dapi/v1/ticker/bookTicker`

**Weight Update:**

**2** for a single symbol;  
**5** when the symbol parameter is omitted

---

## 2022-10-13[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

**Note:** This change will be effictive on 2022-10-17

REST RATE LIMIT WEIGHT

Endpoint `GET /fapi/v1/ticker/bookTicker`

**Weight Update:**

**2** for a single symbol;  
**5** when the symbol parameter is omitted

---

## 2022-09-22[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   Add new endpoint for Portfolio Margin:
    -   `GET /dapi/v1/pmAccountInfo`: Get Portfolio Margin current account information.

---

## 2022-09-22[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Update endpoint for Account/Trade:
    -   `GET /fapi/v1/income`: Support more incomeType
-   Add new endpoint for Portfolio Margin:
    -   `GET /fapi/v1/pmAccountInfo`: Get Portfolio Margin current account information.

---

## 2022-09-20[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

WEBSOCKET

-   New streams `<underlyingAsset>@markPrice` and `<underlyingAsset>@ticker@<expirationDate>` are added.
-   Streams `<!miniTicker@arr>` will be deprecated on 2022/10/30.

---

## 2022-09-14[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   Adjust endpoint field `strikePrice`,`makerFeeRate`,`takerFeeRate`,`minQty`,`maxQty`,`initialMargin`,`maintenanceMargin`,`minInitialMargin`,`minMaintenanceMargin` to string in endpoint `GET /eapi/v1/exchangeInfo`
-   Only finished orders within 5 days can be queried in `GET /eapi/v1/historyOrders`

---

## 2022-09-05[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   Adjust response result in endpoint `DELETE /eapi/v1/allOpenOrdersByUnderlying`

---

## 2022-08-22[​](https://developers.binance.com/docs/derivatives/change-log)

European Options

REST

-   Add `rateLimits` information in endpoint `GET /eapi/v1/exchangeInfo`
-   Parameters `symbol` set to not mandatory in `GET /eapi/v1/userTrades`

---

## 2022-07-27[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST RATE LIMIT WEIGHT

-   The weight of endpoint `GET /dapi/v1/trades` is updated to 5

---

## 2022-07-27[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST RATE LIMIT WEIGHT

-   The weight of endpoint `GET /fapi/v1/trades` is updated to 5

---

## 2022-06-28[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New endpoint `GET /dapi/v1/pmExchangeInfo` to get current Portfolio Margin exchange trading rules.

---

## 2022-06-28[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New endpoint `GET /fapi/v1/pmExchangeInfo` to get current Portfolio Margin exchange trading rules.

---

## 2022-04-28[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New endpoints `PUT /dapi/v1/order` and `PUT /dapi/v1/batchOrders` to support limit order modify
-   New endpoint `GET /dapi/v1/orderAmendment` to get order modify history

WEBSOCKET

-   New type "AMENDMENT" as order modify in Execution Type `x` of Order Update event `ORDER_TRADE_UPDATE`

---

## 2022-04-14[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEB SOCKET USER DATA STREAM

-   New WebSocket stream `ACCOUNT_CONFIG_UPDATE` in USER-DATA-STREAM for leverage changed update

---

## 2022-03-01[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New endpoint`GET /fapi/v1/income/asyn`to get Download Id For Futures Transaction History
-   New endpoint`GET /fapi/v1/income/asyn/id`to get Futures Transaction History Download Link by Id

---

## 2022-02-18[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   The maximum value of `limit` in `GET /dapi/v1/userTrades` is adjusted to 1000

---

## 2022-02-10[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Update `GET /fapi/v2/account` endpoints:
    -   If user is in multiAssetsMargin mode, all assets will be included in calculation for fields `totalInitialMargin``totalMaintMargin``totalWalletBalance``totalUnrealizedProfit``totalMarginBalance``totalPositionInitialMargin``totalOpenOrderInitialMargin``totalCrossWalletBalance``totalCrossUnPnl``availableBalance``maxWithdrawAmount` and the results will be show as value in USD
    -   If user is in singleAssetsMargin mode, only USDT assets are included in the calculation(same as before)

---

## 2021-12-30[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New connection method for WEBSOCKET.
    -   Base Url is `wss://fstream-auth.binance.com`
    -   Streams can be access either in a single raw stream or a combined stream
    -   Raw streams are accessed at `/ws/<streamName>?listenKey=<validateListenKey>`
    -   Combined streams are accessed at `/stream?streams=<streamName1>/<streamName2>/<streamName3>&listenKey=<validateListenKey>`
    -   `<validateListenKey>` must be a valid listenKey when you establish a connection.
-   More details: [Websocket Market Streams](https://developers.binance.com/docs/derivatives/change-log) and [User Data Streams](https://developers.binance.com/docs/derivatives/change-log)

---

## 2021-11-02[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New endpoint`GET /fapi/v1/assetIndex`to get asset index for Multi-Assets mode margin asset

---

## 2021-08-18[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New field `positionAmt` as position amount in response of `GET /dapi/v1/account`

---

## 2021-08-17[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New endpoints `PUT /dapi/v1/order` and `PUT /dapi/v1/batchOrders` to support limit order modify
-   New endpoint `GET /dapi/v1/orderAmendment` to get order modify history

WEBSOCKET

-   New type "AMENDMENT" as order modify in Execution Type `x` of Order Update event `ORDER_TRADE_UPDATE`

---

## 2021-07-23[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New field `updateTime` as last update time of asset and position in response of `GET /dapi/v1/account` and `GET /dapi/v1/positionRisk`

---

## 2021-07-06[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   New fields in the response of `GET /dapi/v1/exchangeInfo`:
    -   "liquidationFee" for liquidation fee rate
    -   "marketTakeBound" for he max price difference rate( from mark price) a market order can make

---

## 2021-07-06[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   New field `updateTime` as last update time of asset and position in response of `GET /fapi/v2/account` and `GET /fapi/v2/positionRisk`
-   New fields in the response of `GET /fapi/v1/exchangeInfo`:
    -   "liquidationFee" for liquidation fee rate
    -   "marketTakeBound" for he max price difference rate( from mark price) a market order can make

---

## 2021-06-15[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New fields "q" and "i" for quote asset and index price added in stream `<symbol>@compositeIndex`

REST

-   Update endpoints:
    -   New fields `component` and `quoteAsset` as component asset and quote asset added in response of `GET /fapi/v1/indexInfo`

---

## 2021-05-06[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEBSOCKET

-   New field "bc" for balance change in event "ACCOUNT\_UPDATE"

---

## 2021-05-06[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   Update streams:
    -   Previous Leverage Update event `ACCOUNT_CONFIG_UPDATE` expanded as account configuration update event, including leverage update and Multi-Assets margin status update.
    -   Balance and Position Update event `ACCOUNT_UPDATE` add new event reason type `m` as `AUTO_EXCHANGE`to represent Multi-Assets margin auto-exchange event

REST

-   New endpoints:
    
    -   `POST /fapi/v1/multiAssetsMargin` to change Multi-Assets margin mode
    -   `GET /fapi/v1/multiAssetsMargin` to check Multi-Assets margin mode
-   Update endpoints:
    
    -   New object `assets` as asset information in response of `GET /fapi/v1/exchangeInfo`.
    -   New field `marginAvailable` in response of `GET /fapi/v2/balance` and `GET /fapi/v2/account` to indicate whether the asset can be used as margin in Multi-Assets mode.

---

## 2021-04-27[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEBSOCKET

-   The following liquidation orders streams do not push realtime order data anymore. Instead, they push snapshot order data at a maximum frequency of 1 order push per second.:
    -   `<symbol>@forceOrder`
    -   `!forceOrder@arr`

REST

-   The endpoint `GET /dapi/v1/allForceOrders` stop being maintained and no longer accepts request.

---

## 2021-04-27[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   The following liquidation orders streams do not push realtime order data anymore. Instead, they push snapshot order data at a maximum frequency of 1 order push per second.:
    -   `<symbol>@forceOrder`
    -   `!forceOrder@arr`

REST

-   The endpoint `GET /fapi/v1/allForceOrders` stop being maintained and no longer accepts request.

---

## 2021-04-22[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New field "bc" for balance change in event "ACCOUNT\_UPDATE"

---

## 2021-03-10[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   The query time period for endpoint `GET /dapi/v1/allForceOrders` must be less than 7 days (default as the recent 7 days).

---

## 2021-03-02[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/indexPriceKlines` to get index price kline/candlestick data.
    
-   New endpoint `GET /fapi/v1/markPriceKlines` to get mark price kline/candlestick data.
    

---

## 2021-02-24[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST RATE LIMIT WEIGHT

-   The weight of endpoint `GET /fapi/v2/balance` is updated to 5
-   The weight of endpoint `GET /fapi/v2/positionRisk` is updated to 5

---

## 2021-02-22[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST RATE LIMIT WEIGHT

-   The weight of endpoint `GET /fapi/v1/income` is updated to 30

REST

-   The query time period for endpoint `GET /fapi/v1/allOrders` must be less than 7 days.
-   The query time period for endpoint `GET /fapi/v1/allForceOrders` must be within the recent 7 days.

---

## 2021-01-26[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST RATE LIMIT WEIGHT

-   Following endpoints' weights will be updated to 20 with symbol and 50 without symbol:
    -   `GET /dapi/v1/allForceOrders`
    -   `GET /dapi/v1/forceOrders`

---

## 2021-01-26[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEB SOCKET USER DATA STREAM

-   New WebSocket stream `ACCOUNT_CONFIG_UPDATE` in USER-DATA-STREAM for leverage changed update

REST RATE LIMIT WEIGHT

-   Following endpoints' weights will be updated to 20 with symbol and 50 without symbol:
    -   `GET /fapi/v1/allForceOrders`
    -   `GET /fapi/v1/forceOrders`

REST

-   New filter "MIN\_NOTIONAL" whicht defines the minimum notional value allowed for an order on a symbol, and shown in the `/fapi/v1/exchangeInfo`

---

## 2021-01-21[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

The regular expression rule for `newClientOrderId` updated as `^[\.A-Z\:/a-z0-9_-]{1,36}$`

---

## 2021-01-21[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

The regular expression rule for `newClientOrderId` updated as `^[\.A-Z\:/a-z0-9_-]{1,36}$`

---

## 2021-01-04[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST RATE LIMIT WEIGHT

-   Following endpoints will use new weight rule based on the paremeter "LIMIT" in the request:
    
    -   `GET /fapi/v1/klines`
    -   `GET /fapi/v1/continuousKlines`
-   Following endpoints' weights will be updated to 20:
    
    -   `GET /fapi/v1/historicalTrades`
    -   `GET /fapi/v1/allForceOrders`
    -   `GET /fapi/v1/forceOrders`
    -   `GET /fapi/v1/aggTrades`

---

## 2020-12-30[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

REST

-   Following DAPI endpoints will use new weight rule based on the parameter "LIMIT" in the request:
    
    -   `GET /dapi/v1/klines`
    -   `GET /dapi/v1/continuousKlines`
    -   `GET /dapi/v1/indexPriceKlines`
    -   `GET /dapi/v1/markPriceKlines`
-   Following DAPI endpoints' weights will be updated to 20:
    
    -   `GET /dapi/v1/historicalTrades`
    -   `GET /dapi/v1/allForceOrders`
    -   `GET /dapi/v1/forceOrders`
    -   `GET /dapi/v1/aggTrades`

---

## 2020-12-08[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New field `e` for event type in payload of streams `<symbol>@bookTicker` and `!bookTicker`
-   New field `P` for estimated settle price in payload of streams `<symbol>@markPrice`, `<symbol>@markPrice@1s`, `!markPrice@arr`, and `!markPrice@arr@1s`.
-   New stream `<pair>_<contractType>@continuousKline_<interval>` for continuous contract kline

REST API

-   New field "estimatedSettlePrice" in response to `GET /fapi/v1/premiumIndex`
    
-   New fields in response to `GET /fapi/v1/exchangeInfo`:
    
    -   "pair"
    -   "contractType"
    -   "deliveryDate"
    -   "onboardDate"
-   New endpoint `GET /fapi/v1/continuousKlines` to get continuous contract kline data
    

ENUM

-   Contract types:
    -   PERPETUAL
    -   CURRENT\_MONTH
    -   NEXT\_MONTH
    -   CURRENT\_QUARTER
    -   NEXT\_QUARTER

---

## 2020-11-27[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   New endpoint `GET /dapi/v1/commissionRate` to get user commission rate.

---

## 2020-11-27[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/commissionRate` to get user commission rate.

---

## 2020-11-13[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEB SOCKET STREAM

-   In order to provide users with more secure and stable services, the update time of `<symbol>depth@0ms` and `<symbol>@depth<level>@0ms` is dynamically adjusted according to the total amount of data traffic and other objective conditions.

---

## 2020-11-10[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New field "marginAsset" for margin asset in the response to `GET /fapi/v1/exchangeInfo`.
-   New field "positionAmt" for position amount in the response to `GET /fapi/v2/account`.

---

## 2020-11-09[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEB SOCKET USER DATA STREAM

Please notice: new streamlined and optimized push rules on event `ACCOUNT_UPDATE` in USER-DATA-STREAM

-   When an asset of a user is changed:
    
    -   Only this asset and its balance information will be pushed
    -   Other assets and information will no longer be pushed even the balances may not be 0
    -   If none of the open positions change, the position "P" will only return an empty `[]`
-   When a position or the margin type of a symbol is changed:
    
    -   "P" will push the details in the "BOTH" position of this symbol
    -   If the change happens in "LONG" or "SHORT" position, the changed "LONG" or "SHORT" position of this symbol will be pushed
    -   Initialized "LONG" or "SHORT" isolated position of this symbol will also be pushed
    -   Position information of other symbols will no longer be pushed, even their positions may not be 0
-   In short, the **full** information of assets and positions should be obtained via the related RESTful endpoints(`GET /fapi/v2/account` and `GET /fapi/v2/positionRisk`), and the locally cached asset or position data can be updated via the event `ACCOUNT_UPDATE` in Websocket USER-DATA-STREAM with the information of **changed** asset or position.
    
-   Please visit [here](https://dev.binance.vision/t/838) to get examples for helping to understand the upgrade.
    

---

## 2020-10-27[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEB SOCKET STREAM

-   The maximum stream number that a single connection can listen to changes as 200.

---

## 2020-10-10[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New WebSocket streams `<symbol>@compositeIndex` for composite index symbol information.

---

## 2020-10-09[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/indexInfo` to get information of composite index.

---

## 2020-09-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/apiTradingStatus` to get futures API trading quantitative rules indicators

---

## 2020-09-16[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/lvtKlines` to get gistorical BLVT Kline.  
    The BLVT NAV system is working relatively with Binance Futures, so the endpoint is based on fapi.

WEBSOCKET

-   New WebSocket streams for BLVT  
    The BLVT NAV system is working relatively with Binance Futures, so the endpoint is based on futures websocket service.  
    \_ `<tokenName>@tokenNav` for BLVT Info streams \_ `<tokenName>@nav_kline_<interval>` for BLVT NAV Kline streams

---

## 2020-09-09[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Some orders that were cancelled/expired will be removed gradually from API endpoints.
    -   Orders that meet criteria
        -   order status is `CANCELED` or `EXPIRED`, **AND**
        -   order has NO filled trade, **AND**
        -   created time + 7 days < current time
    -   These endpoints are affected:
        -   `GET /fapi/v1/order`
        -   `GET /fapi/v1/allOrders`

---

## 2020-08-16[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

WEBSOCKET

-   Websocket Request for user data:
    -   `<listenKey>@account` request for user's account information
    -   `<listenKey>@balance` request for user's account balance
    -   `<listenKey>@balance` request for user's position information

REST

-   New endpoint `GET /dapi/v1/adlQuantile` to get the positions' ADL quantile estimation values

---

## 2020-08-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New field "indexPrice" in response to endpoint `GET /fapi/v1/premiumIndex`.
-   New field "i" for indexPrice in payload of ws streams:
    -   `<symbol>@markPrice`,
    -   `<symbol>@markPrice@1s`,
    -   `!markPrice@arr`,
    -   `!markPrice@arr@1s`

---

## 2020-08-12[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   New endpoint `GET /dapi/v1/forceOrders` to get the user's force orderes.

---

## 2020-08-12[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/forceOrders` to get the user's force orderes.

---

## 2020-08-11[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

COIN MARGINED PERPETUAL FUTURES

-   New contract type ("contractType") `PERPETUAL` for coin margined perpetual futures countract.
    
-   New fields in the reponse to endpoint `GET /dapi/v1/premiumIndex`:
    
    -   `lastFundingRate` for the lasted funding rate of the perpetual futures contract
    -   `nextFundingTime` for the next funding time of the perpetual futures contract
-   New endpoint `GET /dapi/v1/fundingRate` to get funding rate history of perpetual futures
    
-   New fields in the payload of WSS `<symbol>@markPrice`, `<symbol>@markPrice@1s`, `<pair>@markPrice`, and `<pair>@markPrice@1s`:
    
    -   `r` for the lasted funding rate of the perpetual futures contract
    -   `T` for the next funding time of the perpetual futures contract

---

## 2020-07-30[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/adlQuantile` to get the positions' ADL quantile estimation values

---

## 2020-07-22[​](https://developers.binance.com/docs/derivatives/change-log)

COIN-M Futures

-   New endpoints of coin margined futures trading data:
    -   `GET /futures/data/openInterestHist`
    -   `GET /futures/data/topLongShortAccountRatio`
    -   `GET /futures/data/topLongShortPositionRatio`
    -   `GET /futures/data/globalLongShortAccountRatio`
    -   `GET /futures/data/takerBuySellVol`
    -   `GET /futures/data/basis`

---

## 2020-07-17[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Weights of endpoint `GET /fapi/v1/income` has been changed as 20

---

## 2020-07-02[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEBSOCKET

-   New field "m" for event reason type in event "ACCOUNT\_UPDATE"
-   New field "rp" for the realized profit of the trade in event "ORDER\_TRADE\_UPDATE"

---

## 2020-06-15[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New fields in responses to `GET /fapi/v2/account` and `GET /fapi/v2/balance`:
    -   `availableBalance`
    -   `maxWithdrawAmount`

---

## 2020-06-04[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoints of version 2 of fapi, having better performance than the v1 endpoints:
    -   `GET /fapi/v2/account`
    -   `GET /fapi/v2/balance`

---

## 2020-06-02[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v2/positionRisk` in version 2 of fapi:
    -   User can choose to send specific "symbol".
    -   All symbols in the market can be returned.
    -   Different responses for "One-way" or "Hedge" position mode.
    -   Better performance than the v1 endpoint.

---

## 2020-05-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New parameter `closePosition` for endpoint `POST /fapi/v1/order`:  
    If a `STOP_MARKET` or `TAKE_PROFIT_MARKET` order with `closePosition=true` is triggered，all of the current long position( if `SELL` order) or current short position( if `BUY` order) will be closed.
-   New field `closePosition` in response to endpoints:
    -   `POST /fapi/v1/order`
    -   `POST /fapi/v1/batchOrders`
    -   `GET /fapi/v1/order`
    -   `DELETE /fapi/v1/order`
    -   `DELETE /fapi/v1/batchOrders`
    -   `GET /fapi/v1/openOrder`
    -   `GET /fapi/v1/openOrders`
    -   `GET /fapi/v1/allOrders`

---

## 2020-05-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Some orders that were cancelled/expired will be removed gradually from API endpoints, but they are still available from Web UI.
    -   Orders that meet criteria
        -   order status is `CANCELED` or `EXPIRED`, **AND**
        -   order has NO filled trade, **AND**
        -   created time + 30 days < current time
    -   These endpoints are affected:
        -   `GET /fapi/v1/order`
        -   `GET /fapi/v1/allOrders`

---

## 2020-05-15[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New fields in payloads of `<symbol>@bookTicker` and `!bookTicker`:
    -   `E` for event time
    -   `T` for transaction time

---

## 2020-05-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New field `time` for transaction time in response to endpoints：
    -   `GET /fapi/v1/ticker/price`
    -   `GET /fapi/v1/ticker/bookTicker`
    -   `GET /fapi/v1/openInterest`

---

## 2020-05-11[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `POST /fapi/v1/countdownCancelAll` to cancel all open orders of the specified symbol at the end of the specified countdown.  
    This rest endpoint means to ensure your open orders are canceled in case of an outage. The endpoint should be called repeatedly as heartbeats so that the existing countdown time can be canceled and repalced by a new one.

---

## 2020-05-06[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

REST

-   Endpoint `GET /fapi/v1/leverageBracket` is changed as "USER-DATA". It need to be signed, and timestamp is needed.

WEB SOCKET USER DATA STREAM

-   Please notice: event `ACCOUNT_UPDATE` in USER-DATA-STREAM will be pushed with only account balance or relative position when "FUNDING FEE" occurs.
    -   When "FUNDING FEE" occurs in a **crossed position**, `ACCOUNT_UPDATE` will be pushed with only the balance `B`(including the "FUNDING FEE" asset only), without any position `P` message.
    -   When "FUNDING FEE" occurs in an **isolated position**, `ACCOUNT_UPDATE` will be pushed with only the balance `B`(including the "FUNDING FEE" asset only) and the relative position message `P`( including the isolated position on which the "FUNDING FEE" occurs only, without any other position message).

---

## 2020-04-25[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New fields in USER DATA STREAM event `ORDER_TRADE_UPDATE` :
    
    -   `cp` stands for Close-All conditional order
    -   `AP` for Activation Price with `TRAILING_STOP_MARKET` order
    -   `cr` for Callback Rate with `TRAILING_STOP_MARKET` order
-   New USER DATA STREAM event `MARGIN_CALL`.
    

---

## 2020-04-17[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New parameter `newOrderRespType` for response type in endpoint `POST /fapi/v1/order`.  
    `ACK` and `RESULT` are supported. And for `newOrderRespType= RESULT`: \_ `MARKET` order: the final FILLED result of the order will be return directly. \_ `LIMIT` order with special `timeInForce`: the final status result of the order(FILLED or EXPIRED) will be returned directly.

---

## 2020-04-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

WEB SOCKET STREAM

-   WebSocket connections have a limit of 10 incoming messages per second. A message is considered:
    -   A PING frame
    -   A PONG frame
    -   A JSON control message (e.g. subscribe, unsubscribe)
-   A connection that goes beyond the limit will be disconnected; IPs that are repeatedly disconnected may be banned.
-   A single connection can listen to a maximum of 200 streams.

---

## 2020-04-09[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint of futures trading data: `GET /futures/data/takerlongshortRatio`

---

## 2020-04-08[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/positionSide/dual` to get current position mode.
-   New endpoint `POST /fapi/v1/batchOrders` to place multiple orders.

---

## 2020-04-06[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Please notice: event `ACCOUNT_UPDATE` in USER-DATA-STREAM will not be pushed without update of account balances or positions.
    
    -   `ACCOUNT_UPDATE` will be pushed only when update happens on user's account, including changes on balances, positions, or margin type.
    -   Unfilled orders or cancelled orders will not make the event `ACCOUNT_UPDATE` pushed, since there's no change on positions.
    -   Only positions of symbols with non-zero isolatd wallet or non-zero position amount will be pushed in the "position" part of the event `ACCOUNT_UPDATE`.
-   New endpoint `POST /fapi/v1/positionSide/dual` to change position mode: Hedge Mode or One-way Mode.
    
-   New parameter `positionSide` in the following endpoints：
    
    -   `POST /fapi/v1/order`
    -   `POST /fapi/v1/positionMargin`
-   New field `positionSide` in the responses to the following endpoints：
    
    -   `POST /fapi/v1/order`
    -   `GET /fapi/v1/order`
    -   `DELETE /fapi/v1/order`
    -   `DELETE /fapi/v1/batchOrders`
    -   `GET /fapi/v1/openOrder`
    -   `GET /fapi/v1/openOrders`
    -   `GET /fapi/v1/allOrders`
    -   `GET /fapi/v1/account`
    -   `GET /fapi/v1/positionMargin/history`
    -   `GET /fapi/v1/positionRisk`
    -   `GET /fapi/v1/userTrades`
-   New field `ps` for "position side"in USER\_DATA\_STREAM events `ACCOUNT_UPDATE` and `ORDER_TRADE_UPDATE`.
    

---

## 2020-03-30[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoints of futures trading data:
    -   `GET /futures/data/openInterestHist`
    -   `GET /futures/data/topLongShortAccountRatio`
    -   `GET /futures/data/topLongShortPositionRatio`
    -   `GET /futures/data/globalLongShortAccountRatio`

## 2020-02-26[​](https://developers.binance.com/docs/derivatives/change-log)

-   New order type: `TRAILING_STOP_MARKET`

---

## 2020-02-20[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint to query specific current open order: `GET /fapi/v1/openOrder`

---

## 2020-02-17[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Update time changed as 1000ms for streams `<symbol>@ticker` and `!ticker@arr`
-   New diff depth data with 500ms updates: `<symbol>@depth@500ms`
-   New partial depth data with 500ms updates: `<symbol>@depth<level>@500ms`

---

## 2020-02-12[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New [SDK and Code Demonstration](https://developers.binance.com/docs/derivatives/change-log) on Java
    
-   Faster mark price websocket data with 1s updates: `<symbol>@markPrice@1s` and `!markPrice@arr@1s`
    

---

## 2020-02-05[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New market data endpoint`GET /fapi/v1/leverageBracket` to check notional and leverage brackets.

---

## 2020-01-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   "cumQty" is going to be removed from the responses to `DELETE /fapi/v1/order`, `DELETE /fapi/v1/batchOrders` and other `order` relatived endpoints in the coming weeks.  
    Please use "executedQty" instead.

---

## 2020-01-17[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New [SDK and Code Demonstration](https://developers.binance.com/docs/derivatives/change-log) on Python

---

## 2020-01-06[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Faster diff data with real time updates: `<symbol>@depth@0ms`

---

## 2020-01-03[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoints related to isolated position：
    
    -   `POST /fapi/v1/marginType`
    -   `POST /fapi/v1/positionMargin`
    -   `GET /fapi/v1/positionMargin/history`
-   New field in response to `GET /fapi/v1/positionRisk` related to isolated position:
    
    -   `marginType`
    -   `isolatedMargin`
-   New field in response to `GET /fapi/v1/account`related to isolated position: `isolated`
    
-   New field in event `ACCOUNT_UPDATE`:
    
    -   "cw" for cross wallet
    -   "mt" for margin type
    -   "iw" for isolated wallet (if isolated)

---

## 2019-12-19[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/openInterest` to get present open interest of a specific symbol.

---

## 2019-12-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New event type in user data stream：`listenKeyExpired`.

---

## 2019-12-12[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `DELETE /fapi/v1/allOpenOrders` to cancel all open orders of a specific symbol.
-   New endpoint`DELETE /fapi/v1/batchOrders` to cancel a list of open orders.
-   `reduceOnly` has been supported in orders with type:
    -   `TAKE_PROFIT`
    -   `TAKE_PROFIT_MARKET`
    -   `STOP`
    -   `STOP_MARKET`

---

## 2019-11-29[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `GET /fapi/v1/allForceOrders` to get all liquidation orders.
-   New websocket streams:
    -   `<symbol>@forceOrder`for liquidation order streams
    -   `!forceOrder@arr` for all market liquidation order streams

---

## 2019-11-25[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   `GET /fapi/v1/account` has new field: `positions`
-   Added new field `time` for order creation time in:
    -   `GET /fapi/v1/openOrders`
    -   `GET /fapi/v1/order`
    -   `GET /fapi/v1/allOrders`

---

## 2019-11-15[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New websocket streams：
    -   `!miniTicker@arr`: All market 24hr mini-tickers stream.
    -   `!ticker@arr`: : All market 24hr tickers stream.

---

## 2019-11-12[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   WSS now supports live subscribing/unsubscribing to streams.

---

## 2019-11-05[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New order type:
    -   `STOP_MARKET`，
    -   `TAKE_PROFIT_MARKET`.
-   New parameter `workingType` in `POST /fapi/v1/order`:  
    order with stop price can be triggered by "CONTRACT\_PRICE" or "MARK\_PRICE"
-   New keys in USER-DATA-STREAMS：
    -   in `ORDER_TRADE_UPDATE`:
        -   "T" as transaction time
        -   "wt" as workingType
    -   in `ACCOUNT_UPDATE`:
        -   "T" as transaction time

---

## 2019-10-28[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New rest endpoint for income flow history `GET /fapi/v1/income`

---

## 2019-10-25[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Added "up" in event `ACCOUNT_UPDATE` in user data stream: the unrealized PnL of the position.
-   Added "R" in event `ORDER_TRADE_UPDATE` in user data stream, showing if the trade is reduce only.

---

## 2019-10-24[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New WebSocket streams for booktickers added: `<symbol>@bookTicker` and `!bookTicker`.
-   New WebSocket streams for partial orderbook added: `<symbol>@depth<levels>` and `<symbol>@depth<levels>@100ms`
-   Faster diff data with 100ms updates: `<symbol>@depth@100ms`
-   Added `Update Speed`: to `Websocket Market Streams`

---

## 2019-10-18[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New endpoint `POST /fapi/v1/leverage` for changing user's initial leverage in specific symbol market.
-   Added "leverage" for current initial leverage and "maxNotionalValue" for notional value limit of current initial leverage in response to `GET /fapi/v1/positionRisk`.
-   `reduceOnly` now is supported in the `MARKET` orders.

---

## 2019-10-14[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Added `GET /fapi/v1/fundingRate` for getting funding fee rate history.

---

## 2019-10-11[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   Added "m" in event `ORDER_TRADE_UPDATE` in user data stream, showing if the trade is the maker side.

---

## 2019-10-08[​](https://developers.binance.com/docs/derivatives/change-log)

USDⓈ-M Futures

-   New order parameter `reduceOnly` for `LIMIT` orders.
-   New order type `TAKE_PROFIT`.

---

-   [2026-01-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2026-01-07](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-12-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-12-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-12-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-12-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-11-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-11-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-11-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-11-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-11-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-11-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-10-21](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-10-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-10-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-10-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-08-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-07-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-07-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-04-23](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-04-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-02-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-02-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-01-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-01-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2025-01-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-12-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-12-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-12-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-11-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-11-01](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-24](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-21](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-10-08](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-09-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-09-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-09-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-09-05](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-09-03](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-08-26](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-08-23](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-08-07](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-08-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-07-24](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-07-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-06-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-05-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-04-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-04-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-04-01](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-03-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-02-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-01-24](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-01-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-01-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2024-01-08](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-12-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-11-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-11-01](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-11-01](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-10-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-10-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-10-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-10-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-10-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-10-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-07](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-05](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-09-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-31](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-31](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-08-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-21](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-07-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-06-01](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-05-31](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-05-30](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-05-05](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-05-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-04-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-04-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-03-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-03-08](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-02-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-01-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2023-01-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-12-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-12-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-12-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-12-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-11-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-11-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-11-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-11-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-11-03](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-10-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-10-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-09-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-09-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-09-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-09-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-09-05](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-08-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-07-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-07-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-06-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-06-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-04-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-04-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-03-01](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-02-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2022-02-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-12-30](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-11-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-08-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-08-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-07-23](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-07-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-07-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-06-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-05-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-05-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-04-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-04-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-04-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-03-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-03-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-02-24](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-02-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-01-26](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-01-26](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-01-21](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-01-21](https://developers.binance.com/docs/derivatives/change-log)
-   [2021-01-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-12-30](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-12-08](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-11-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-11-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-11-13](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-11-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-11-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-10-27](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-10-10](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-10-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-09-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-09-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-09-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-08-16](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-08-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-08-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-08-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-08-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-07-30](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-07-22](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-07-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-07-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-06-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-06-04](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-06-02](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-05-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-05-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-05-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-05-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-05-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-05-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-04-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-04-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-04-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-04-09](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-04-08](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-04-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-03-30](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-02-26](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-02-20](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-02-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-02-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-02-05](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-01-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-01-17](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-01-06](https://developers.binance.com/docs/derivatives/change-log)
-   [2020-01-03](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-12-19](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-12-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-12-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-11-29](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-11-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-11-15](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-11-12](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-11-05](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-28](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-25](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-24](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-18](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-14](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-11](https://developers.binance.com/docs/derivatives/change-log)
-   [2019-10-08](https://developers.binance.com/docs/derivatives/change-log)
