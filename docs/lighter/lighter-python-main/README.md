# Lighter Python

Python SDK for Lighter

## Requirements.

Python 3.8+

## Installation & Usage
### pip install

If the python package is hosted on a repository, you can install directly using:

```sh
pip install git+https://github.com/elliottech/lighter-python.git
```


Then import the package:
```python
import lighter
```

### Tests

Execute `pytest` to run the tests.

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

```python

import lighter
import asyncio

async def main():
    client = lighter.ApiClient()
    try:
        account_api = lighter.AccountApi(client)
        account = await account_api.account(by="index", value="1")
        print(account)
    finally:
        await client.close()  # Make sure connection is cleanly closed

if __name__ == "__main__":
    asyncio.run(main())

```

# Examples
## [Read API Functions](examples/get_info.py)
```sh
python examples/get_info.py
```

## [Websocket Sync Order Books & Accounts](examples/ws.py)
```sh
python examples/ws.py
```

## [Create & Cancel Orders](examples/create_cancel_order.py)
```sh
python examples/create_cancel_order.py
```

## Documentation for API Endpoints

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AccountApi* | [**account**](docs/AccountApi.md#account) | **GET** /api/v1/account | account
*AccountApi* | [**accounts_by_l1_address**](docs/AccountApi.md#accounts_by_l1_address) | **GET** /api/v1/accountsByL1Address | accountsByL1Address
*AccountApi* | [**apikeys**](docs/AccountApi.md#apikeys) | **GET** /api/v1/apikeys | apikeys
*AccountApi* | [**pnl**](docs/AccountApi.md#pnl) | **GET** /api/v1/pnl | pnl
*AccountApi* | [**public_pools**](docs/AccountApi.md#public_pools) | **GET** /api/v1/publicPools | publicPools
*BlockApi* | [**block**](docs/BlockApi.md#block) | **GET** /api/v1/block | block
*BlockApi* | [**blocks**](docs/BlockApi.md#blocks) | **GET** /api/v1/blocks | blocks
*BlockApi* | [**current_height**](docs/BlockApi.md#current_height) | **GET** /api/v1/currentHeight | currentHeight
*CandlestickApi* | [**candlesticks**](docs/CandlestickApi.md#candlesticks) | **GET** /api/v1/candlesticks | candlesticks
*CandlestickApi* | [**fundings**](docs/CandlestickApi.md#fundings) | **GET** /api/v1/fundings | fundings
*OrderApi* | [**account_inactive_orders**](docs/OrderApi.md#account_inactive_orders) | **GET** /api/v1/accountInactiveOrders | accountInactiveOrders
*OrderApi* | [**exchange_stats**](docs/OrderApi.md#exchange_stats) | **GET** /api/v1/exchangeStats | exchangeStats
*OrderApi* | [**order_book_details**](docs/OrderApi.md#order_book_details) | **GET** /api/v1/orderBookDetails | orderBookDetails
*OrderApi* | [**order_book_orders**](docs/OrderApi.md#order_book_orders) | **GET** /api/v1/orderBookOrders | orderBookOrders
*OrderApi* | [**order_books**](docs/OrderApi.md#order_books) | **GET** /api/v1/orderBooks | orderBooks
*OrderApi* | [**recent_trades**](docs/OrderApi.md#recent_trades) | **GET** /api/v1/recentTrades | recentTrades
*OrderApi* | [**trades**](docs/OrderApi.md#trades) | **GET** /api/v1/trades | trades
*RootApi* | [**info**](docs/RootApi.md#info) | **GET** /info | info
*RootApi* | [**status**](docs/RootApi.md#status) | **GET** / | status
*TransactionApi* | [**account_txs**](docs/TransactionApi.md#account_txs) | **GET** /api/v1/accountTxs | accountTxs
*TransactionApi* | [**block_txs**](docs/TransactionApi.md#block_txs) | **GET** /api/v1/blockTxs | blockTxs
*TransactionApi* | [**deposit_history**](docs/TransactionApi.md#deposit_history) | **GET** /api/v1/deposit/history | deposit_history
*TransactionApi* | [**next_nonce**](docs/TransactionApi.md#next_nonce) | **GET** /api/v1/nextNonce | nextNonce
*TransactionApi* | [**send_tx**](docs/TransactionApi.md#send_tx) | **POST** /api/v1/sendTx | sendTx
*TransactionApi* | [**send_tx_batch**](docs/TransactionApi.md#send_tx_batch) | **POST** /api/v1/sendTxBatch | sendTxBatch
*TransactionApi* | [**tx**](docs/TransactionApi.md#tx) | **GET** /api/v1/tx | tx
*TransactionApi* | [**tx_from_l1_tx_hash**](docs/TransactionApi.md#tx_from_l1_tx_hash) | **GET** /api/v1/txFromL1TxHash | txFromL1TxHash
*TransactionApi* | [**txs**](docs/TransactionApi.md#txs) | **GET** /api/v1/txs | txs
*TransactionApi* | [**withdraw_history**](docs/TransactionApi.md#withdraw_history) | **GET** /api/v1/withdraw/history | withdraw_history


## Documentation For Models

 - [Account](docs/Account.md)
 - [AccountApiKeys](docs/AccountApiKeys.md)
 - [AccountMarketStats](docs/AccountMarketStats.md)
 - [AccountMetadata](docs/AccountMetadata.md)
 - [AccountPnL](docs/AccountPnL.md)
 - [AccountPosition](docs/AccountPosition.md)
 - [AccountStats](docs/AccountStats.md)
 - [ApiKey](docs/ApiKey.md)
 - [Block](docs/Block.md)
 - [Blocks](docs/Blocks.md)
 - [BridgeSupportedNetwork](docs/BridgeSupportedNetwork.md)
 - [Candlestick](docs/Candlestick.md)
 - [Candlesticks](docs/Candlesticks.md)
 - [ContractAddress](docs/ContractAddress.md)
 - [CurrentHeight](docs/CurrentHeight.md)
 - [Cursor](docs/Cursor.md)
 - [DepositHistory](docs/DepositHistory.md)
 - [DepositHistoryItem](docs/DepositHistoryItem.md)
 - [DetailedAccount](docs/DetailedAccount.md)
 - [DetailedAccounts](docs/DetailedAccounts.md)
 - [DetailedCandlestick](docs/DetailedCandlestick.md)
 - [EnrichedTx](docs/EnrichedTx.md)
 - [ExchangeStats](docs/ExchangeStats.md)
 - [Funding](docs/Funding.md)
 - [Fundings](docs/Fundings.md)
 - [L1ProviderInfo](docs/L1ProviderInfo.md)
 - [Liquidation](docs/Liquidation.md)
 - [MarketInfo](docs/MarketInfo.md)
 - [NextNonce](docs/NextNonce.md)
 - [Order](docs/Order.md)
 - [OrderBook](docs/OrderBook.md)
 - [OrderBookDepth](docs/OrderBookDepth.md)
 - [OrderBookDetail](docs/OrderBookDetail.md)
 - [OrderBookDetails](docs/OrderBookDetails.md)
 - [OrderBookOrders](docs/OrderBookOrders.md)
 - [OrderBookStats](docs/OrderBookStats.md)
 - [OrderBooks](docs/OrderBooks.md)
 - [Orders](docs/Orders.md)
 - [PnLEntry](docs/PnLEntry.md)
 - [PositionFunding](docs/PositionFunding.md)
 - [PriceLevel](docs/PriceLevel.md)
 - [PublicPool](docs/PublicPool.md)
 - [PublicPoolInfo](docs/PublicPoolInfo.md)
 - [PublicPoolShare](docs/PublicPoolShare.md)
 - [PublicPools](docs/PublicPools.md)
 - [ReqGetAccount](docs/ReqGetAccount.md)
 - [ReqGetAccountApiKeys](docs/ReqGetAccountApiKeys.md)
 - [ReqGetAccountByL1Address](docs/ReqGetAccountByL1Address.md)
 - [ReqGetAccountInactiveOrders](docs/ReqGetAccountInactiveOrders.md)
 - [ReqGetAccountPnL](docs/ReqGetAccountPnL.md)
 - [ReqGetAccountTxs](docs/ReqGetAccountTxs.md)
 - [ReqGetBlock](docs/ReqGetBlock.md)
 - [ReqGetBlockTxs](docs/ReqGetBlockTxs.md)
 - [ReqGetByAccount](docs/ReqGetByAccount.md)
 - [ReqGetCandlesticks](docs/ReqGetCandlesticks.md)
 - [ReqGetDepositHistory](docs/ReqGetDepositHistory.md)
 - [ReqGetFundings](docs/ReqGetFundings.md)
 - [ReqGetL1Tx](docs/ReqGetL1Tx.md)
 - [ReqGetLatestDeposit](docs/ReqGetLatestDeposit.md)
 - [ReqGetNextNonce](docs/ReqGetNextNonce.md)
 - [ReqGetOrderBookDetails](docs/ReqGetOrderBookDetails.md)
 - [ReqGetOrderBookOrders](docs/ReqGetOrderBookOrders.md)
 - [ReqGetOrderBooks](docs/ReqGetOrderBooks.md)
 - [ReqGetPublicPools](docs/ReqGetPublicPools.md)
 - [ReqGetRangeWithCursor](docs/ReqGetRangeWithCursor.md)
 - [ReqGetRangeWithIndex](docs/ReqGetRangeWithIndex.md)
 - [ReqGetRangeWithIndexSortable](docs/ReqGetRangeWithIndexSortable.md)
 - [ReqGetRecentTrades](docs/ReqGetRecentTrades.md)
 - [ReqGetTrades](docs/ReqGetTrades.md)
 - [ReqGetTx](docs/ReqGetTx.md)
 - [ReqGetWithdrawHistory](docs/ReqGetWithdrawHistory.md)
 - [ResultCode](docs/ResultCode.md)
 - [SimpleOrder](docs/SimpleOrder.md)
 - [Status](docs/Status.md)
 - [SubAccounts](docs/SubAccounts.md)
 - [Ticker](docs/Ticker.md)
 - [Trade](docs/Trade.md)
 - [Trades](docs/Trades.md)
 - [Tx](docs/Tx.md)
 - [TxHash](docs/TxHash.md)
 - [TxHashes](docs/TxHashes.md)
 - [Txs](docs/Txs.md)
 - [ValidatorInfo](docs/ValidatorInfo.md)
 - [WithdrawHistory](docs/WithdrawHistory.md)
 - [WithdrawHistoryItem](docs/WithdrawHistoryItem.md)
 - [ZkLighterInfo](docs/ZkLighterInfo.md)


[//]: # (<a id="documentation-for-authorization"></a>)

[//]: # (## Documentation For Authorization)

[//]: # ()
[//]: # (Endpoints do not require authorization.)


