# WebSocket
URL: `wss://mainnet.zklighter.elliot.ai/stream`

You can directly connect to the WebSocket server using wscat:

```
wscat -c 'wss://mainnet.zklighter.elliot.ai/stream'
```


You can send transactions using the websocket as follows:

```
{
    "type": "jsonapi/sendtx",
    "data": {
        "tx_type": INTEGER,
        "tx_info": ...
    }
}
```


The _tx\_type_ options can be found in the [SignerClient](https://github.com/elliottech/lighter-python/blob/main/lighter/signer_client.py) file, while _tx\_info_ can be generated using the sign methods in the SignerClient.

Example: [ws\_send\_tx.py](https://github.com/elliottech/lighter-python/blob/main/examples/ws_send_tx.py)

You can send batch transactions to execute up to 50 transactions in a single message.

```
{
    "type": "jsonapi/sendtxbatch",
    "data": {
        "tx_types": "[INTEGER]",
        "tx_infos": "[tx_info]"
    }
}
```


The _tx\_type_ options can be found in the [SignerClient](https://github.com/elliottech/lighter-python/blob/main/lighter/signer_client.py) file, while _tx\_info_ can be generated using the sign methods in the SignerClient.

Example: [ws\_send\_batch\_tx.py](https://github.com/elliottech/lighter-python/blob/main/examples/ws_send_batch_tx.py)

We first need to define some types that appear often in the JSONs.

```
Transaction = {
    "hash": STRING,
    "type": INTEGER,
    "info": STRING, // json object as string, attributes depending on the tx type
    "event_info": STRING, // json object as string, attributes depending on the tx type
    "status": INTEGER,
    "transaction_index": INTEGER,
    "l1_address": STRING,
    "account_index": INTEGER,
    "nonce": INTEGER,
    "expire_at": INTEGER,
    "block_height": INTEGER,
    "queued_at": INTEGER,
    "executed_at": INTEGER,
    "sequence_index": INTEGER,
    "parent_hash": STRING
}
```


Example:

```
{
    "hash": "0xabc123456789def",
    "type": 15,
    "info": "{\"AccountIndex\":1,\"ApiKeyIndex\":2,\"MarketIndex\":3,\"Index\":404,\"ExpiredAt\":1700000000000,\"Nonce\":1234,\"Sig\":\"0xsigexample\"}",
    "event_info": "{\"a\":1,\"i\":404,\"u\":123,\"ae\":\"\"}",
    "status": 2,
    "transaction_index": 10,
    "l1_address": "0x123abc456def789",
    "account_index": 101,
    "nonce": 12345,
    "expire_at": 1700000000000,
    "block_height": 1500000,
    "queued_at": 1699999990000,
    "executed_at": 1700000000005,
    "sequence_index": 5678,
    "parent_hash": "0xparenthash123456"
}
```


Used in: [Transaction](https://apibetadocs.lighter.xyz/docs/websocket-reference#transaction), [Executed Transaction](https://apibetadocs.lighter.xyz/docs/websocket-reference#executed-transaction), [Account Tx](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-tx).

```
Order = {
    "order_index": INTEGER,
    "client_order_index": INTEGER,
    "order_id": STRING, // same as order_index but string
    "client_order_id": STRING, // same as client_order_index but string
    "market_index": INTEGER,
    "owner_account_index": INTEGER,
    "initial_base_amount": STRING,
    "price": STRING,
    "nonce": INTEGER,
    "remaining_base_amount": STRING,
    "is_ask": BOOL,
    "base_size": INTEGER,
    "base_price": INTEGER,
    "filled_base_amount": STRING,
    "filled_quote_amount": STRING,
    "side": STRING,
    "type": STRING,
    "time_in_force": STRING,
    "reduce_only": BOOL,
    "trigger_price": STRING,
    "order_expiry": INTEGER,
    "status": STRING,
    "trigger_status": STRING,
    "trigger_time": INTEGER,
    "parent_order_index": INTEGER,
    "parent_order_id": STRING,
    "to_trigger_order_id_0": STRING,
    "to_trigger_order_id_1": STRING,
    "to_cancel_order_id_0": STRING,
    "block_height": INTEGER,
    "timestamp": INTEGER,
}
```


Used in: [Account Market](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-market), [Account All Orders](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all-orders), [Account Orders](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-orders).

```
Trade = {
    "trade_id": INTEGER,
    "tx_hash": STRING,
    "type": STRING,
    "market_id": INTEGER,
    "size": STRING,
    "price": STRING,
    "usd_amount": STRING,
    "ask_id": INTEGER,
    "bid_id": INTEGER,
    "ask_account_id": INTEGER,
    "bid_account_id": INTEGER,
    "is_maker_ask": BOOLEAN,
    "block_height": INTEGER,
    "timestamp": INTEGER,
    "taker_fee": INTEGER (omitted when zero),
    "taker_position_size_before": STRING (omitted when empty),
    "taker_entry_quote_before": STRING (omitted when empty),
    "taker_initial_margin_fraction_before": INTEGER (omitted when zero),
    "taker_position_sign_changed": BOOL (omitted when false),
    "maker_fee": INTEGER (omitted when zero),
    "maker_position_size_before": STRING (omitted when empty),
    "maker_entry_quote_before": STRING (omitted when empty),
    "maker_initial_margin_fraction_before": INTEGER (omitted when zero),
    "maker_position_sign_changed": BOOL (omitted when false),
}
```


Example:

```
{
    "trade_id": 401,
    "tx_hash": "0xabc123456789",
    "type": "buy",
    "market_id": 101,
    "size": "0.5",
    "price": "20000.00",
    "usd_amount": "10000.00",
    "ask_id": 501,
    "bid_id": 502,
    "ask_account_id": 123456,
    "bid_account_id": 654321,
    "is_maker_ask": true,
    "block_height": 1500000,
    "timestamp": 1700000000,
    "taker_position_size_before":"1.14880",
    "taker_entry_quote_before":"136130.046511",
    "taker_initial_margin_fraction_before":500,
    "maker_position_size_before":"-0.02594",
    "maker_entry_quote_before":"3075.396750",
    "maker_initial_margin_fraction_before":400
}
```


Used in: [Trade](https://apibetadocs.lighter.xyz/docs/websocket-reference#trade), [Account All](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all), [Account Market](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-market), [Account All Trades](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all-trades).

```
Position = {
    "market_id": INTEGER,
    "symbol": STRING,
    "initial_margin_fraction": STRING,
    "open_order_count": INTEGER,
    "pending_order_count": INTEGER,
    "position_tied_order_count": INTEGER,
    "sign": INTEGER,
    "position": STRING,
    "avg_entry_price": STRING,
    "position_value": STRING,
    "unrealized_pnl": STRING,
    "realized_pnl": STRING,
    "liquidation_price": STRING,
    "total_funding_paid_out": STRING (omitted when empty),
    "margin_mode": INT,
    "allocated_margin": STRING,
}
```


Example:

```
{
    "market_id": 101,
    "symbol": "BTC-USD",
    "initial_margin_fraction": "0.1",
    "open_order_count": 2,
    "pending_order_count": 1,
    "position_tied_order_count": 3,
    "sign": 1,
    "position": "0.5",
    "avg_entry_price": "20000.00",
    "position_value": "10000.00",
    "unrealized_pnl": "500.00",
    "realized_pnl": "100.00",
    "liquidation_price": "3024.66",
    "total_funding_paid_out": "34.2",
    "margin_mode": 1,
    "allocated_margin": "46342",
}
```


Used in: [Account All](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all), [Account Market](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-market), [Account All Positions](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all-positions).

```
PoolShares = {
    "public_pool_index": INTEGER,
    "shares_amount": INTEGER,
    "entry_usdc": STRING
}
```


Example:

```
{
    "public_pool_index": 1,
    "shares_amount": 100,
    "entry_usdc": "1000.00"
}
```


Used in: [Account All](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all), [Account All Positions](https://apibetadocs.lighter.xyz/docs/websocket-reference#account-all-positions).

The order book channel sends the new ask and bid orders for the given market.

```
{
    "type": "subscribe",
    "channel": "order_book/{MARKET_INDEX}"
}
```


**Example Subscription**

```
{
    "type": "subscribe",
    "channel": "order_book/0"
}
```


**Response Structure**

```
{
    "channel": "order_book:{MARKET_INDEX}",
    "offset": INTEGER,
    "order_book": {
        "code": INTEGER,
        "asks": [
            {
                "price": STRING,
                "size": STRING
            }
        ],
        "bids": [
            {
                "price": STRING,
                "size": STRING
            }
        ],
        "offset": INTEGER
    },
    "type": "update/order_book"
}
```


**Example Response**

```
{
    "channel": "order_book:0",
    "offset": 41692864,
    "order_book": {
        "code": 0,
        "asks": [
            {
                "price": "3327.46",
                "size": "29.0915"
            }
        ],
        "bids": [
            {
                "price": "3338.80",
                "size": "10.2898"
            }
        ],
        "offset": 41692864
    },
    "type": "update/order_book"
}
```


The market stats channel sends the market stat data for the given market.

```
{
    "type": "subscribe",
    "channel": "market_stats/{MARKET_INDEX}"
}
```


or

```
{
    "type": "subscribe",
    "channel": "market_stats/all"
}
```


**Example Subscription**

```
{
    "type": "subscribe",
    "channel": "market_stats/0"
}
```


**Response Structure**

```
{
    "channel": "market_stats:{MARKET_INDEX}",
    "market_stats": {
        "market_id": INTEGER,
        "index_price": STRING,
        "mark_price": STRING,
        "open_interest": STRING,
        "last_trade_price": STRING,
      	"current_funding_rate": STRING,
        "funding_rate": STRING,
        "funding_timestamp": INTEGER,
        "daily_base_token_volume": FLOAT,
        "daily_quote_token_volume": FLOAT,
        "daily_price_low": FLOAT,
        "daily_price_high": FLOAT,
        "daily_price_change": FLOAT
    },
    "type": "update/market_stats"
}
```


**Example Response**

```
{
    "channel": "market_stats:0",
    "market_stats": {
        "market_id": 0,
        "index_price": "3335.04",
        "mark_price": "3335.09",
        "open_interest": "235.25",
        "last_trade_price": "3335.65",
        "current_funding_rate": "0.0057",
        "funding_rate": "0.0005",
        "funding_timestamp": 1722337200000,
        "daily_base_token_volume": 230206.48999999944,
        "daily_quote_token_volume": 765295250.9804002,
        "daily_price_low": 3265.13,
        "daily_price_high": 3386.01,
        "daily_price_change": -1.1562612047992835
    },
    "type": "update/market_stats"
}
```


The trade channel sends the new trade data for the given market.

```
{
    "type": "subscribe",
    "channel": "trade/{MARKET_INDEX}"
}
```


**Example Subscription**

```
{
    "type": "subscribe",
    "channel": "trade/0"
}
```


**Response Structure**

```
{
    "channel": "trade:{MARKET_INDEX}",
    "trades": [Trade]
    ],
    "type": "update/trade"
}
```


**Example Response**

```
{
    "channel": "trade:0",
    "trades": [
        {
            "trade_id": 14035051,
            "tx_hash": "189068ebc6b5c7e5efda96f92842a2fafd280990692e56899a98de8c4a12a38c",
            "type": "trade",
            "market_id": 0,
            "size": "0.1187",
            "price": "3335.65",
            "usd_amount": "13.67",
            "ask_id": 41720126,
            "bid_id": 41720037,
            "ask_account_id": 2304,
            "bid_account_id": 21504,
            "is_maker_ask": false,
            "block_height": 2204468,
            "timestamp": 1722339648
        }
    ],
    "type": "update/trade"
}
```


The account all channel sends specific account market data for all markets.

```
{
    "type": "subscribe",
    "channel": "account_all/{ACCOUNT_ID}"
}
```


**Example Subscription**

```
{
    "type": "subscribe",
    "channel": "account_all/1"
}
```


**Response Structure**

```
{
    "account": INTEGER,
    "channel": "account_all:{ACCOUNT_ID}",
    "daily_trades_count": INTEGER,
    "daily_volume": INTEGER,
    "weekly_trades_count": INTEGER,
    "weekly_volume": INTEGER,
    "monthly_trades_count": INTEGER,
    "monthly_volume": INTEGER,
    "total_trades_count": INTEGER,
    "total_volume": INTEGER,
    "funding_histories": {
    	"{MARKET_INDEX}": [
        {
          "timestamp": INTEGER,
          "market_id": INTEGER,
          "funding_id": INTEGER,
          "change": STRING,
          "rate": STRING,
          "position_size": STRING,
          "position_side": STRING
        }
      ]
    },
    "positions": {
        "{MARKET_INDEX}": Position
    },
    "shares": [PoolShares],
    "trades": {
        "{MARKET_INDEX}": [Trade]
    },
    "type": "update/account_all"
}
```


**Example Response**

```
{
    "account": 10,
    "channel": "account_all:10",
    "daily_trades_count": 123,
    "daily_volume": 234,
    "weekly_trades_count": 345,
    "weekly_volume": 456,
    "monthly_trades_count": 567,
    "monthly_volume": 678,
    "total_trades_count": 891,
    "total_volume": 912,
    "funding_histories": {
        "1": [
            {
                "timestamp": 1700000000,
                "market_id": 101,
                "funding_id": 2001,
                "change": "0.001",
                "rate": "0.0001",
                "position_size": "0.5",
                "position_side": "long"
            }
        ]
    },
    "positions": {
        "1": {
            "market_id": 101,
            "symbol": "BTC-USD",
            "initial_margin_fraction": "0.1",
            "open_order_count": 2,
            "pending_order_count": 1,
            "position_tied_order_count": 3,
            "sign": 1,
            "position": "0.5",
            "avg_entry_price": "20000.00",
            "position_value": "10000.00",
            "unrealized_pnl": "500.00",
            "realized_pnl": "100.00",
            "liquidation_price": "3024.66",
            "total_funding_paid_out": "34.2",
            "margin_mode": 1,
            "allocated_margin": "46342",
        }
    },
    "shares": [
        {
            "public_pool_index": 1,
            "shares_amount": 100,
            "entry_usdc": "1000.00"
        }
    ],
    "trades": {
        "1": [
            {
                "trade_id": 401,
                "tx_hash": "0xabc123456789",
                "type": "buy",
                "market_id": 101,
                "size": "0.5",
                "price": "20000.00",
                "usd_amount": "10000.00",
                "ask_id": 501,
                "bid_id": 502,
                "ask_account_id": 123456,
                "bid_account_id": 654321,
                "is_maker_ask": true,
                "block_height": 1500000,
                "timestamp": 1700000000,
                "taker_position_size_before":"1.14880",
                "taker_entry_quote_before":"136130.046511",
                "taker_initial_margin_fraction_before":500,
                "maker_position_size_before":"-0.02594",
                "maker_entry_quote_before":"3075.396750",
                "maker_initial_margin_fraction_before":400
            }
        ]
    },
    "type": "update/account"
}
```


The account market channel sends specific account market data for a market.

```
{
    "type": "subscribe",
    "channel": "account_market/{MARKET_ID}/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Example Subscription**

```
{
    "type": "subscribe",
    "channel": "account_market/0/40",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "account": INTEGER,
    "channel": "account_all/{MARKET_ID}/{ACCOUNT_ID}",
    "funding_history": {
        "timestamp": INTEGER,
        "market_id": INTEGER,
        "funding_id": INTEGER,
        "change": STRING,
        "rate": STRING,
        "position_size": STRING,
        "position_side": STRING
        },
    "orders": [Order],
    "position": Position,
    "trades": [Trade],
    "type": "update/account_market"
}
```


The account stats channel sends account stats data for the specific account.

```
{
    "type": "subscribe",
    "channel": "user_stats/{ACCOUNT_ID}"
}
```


**Example Subscription**

```
{
    "type": "subscribe",
    "channel": "user_stats/0"
}
```


**Response Structure**

```
{
    "channel": "user_stats:{ACCOUNT_ID}",
    "stats": {
        "collateral": STRING,
        "portfolio_value": STRING,
        "leverage": STRING,
        "available_balance": STRING,      
        "margin_usage": STRING,
        "buying_power": STRING,        
				"cross_stats":{
           "collateral": STRING,
           "portfolio_value": STRING,
           "leverage": STRING,
           "available_balance": STRING,
           "margin_usage": STRING,
           "buying_power": STRING
        },
        "total_stats":{
           "collateral": STRING,
           "portfolio_value": STRING,
           "leverage": STRING,
           "available_balance": STRING,
           "margin_usage": STRING,
           "buying_power": STRING
        }

    },
    "type": "update/user_stats"
}
```


**Example Response**

```
{
    "channel": "user_stats:10",
    "stats": {
        "collateral": "5000.00",
        "portfolio_value": "15000.00",
        "leverage": "3.0",
        "available_balance": "2000.00",
        "margin_usage": "0.80",
        "buying_power": "4000.00",
        "cross_stats":{
           "collateral":"0.000000",
           "portfolio_value":"0.000000",
           "leverage":"0.00",
           "available_balance":"0.000000",
           "margin_usage":"0.00",
           "buying_power":"0"
        },
        "total_stats":{
           "collateral":"0.000000",
           "portfolio_value":"0.000000",
           "leverage":"0.00",
           "available_balance":"0.000000",
           "margin_usage":"0.00",
           "buying_power":"0"
        }
    },
    "type": "update/user_stats"
}
```


The transaction channel sends all new transactions.

```
{
    "type": "subscribe",
    "channel": "transaction"
}
```


**Response Structure**

```
{
    "channel": "transaction",
    "txs": [Transaction],
    "type": "update/transaction"
}
```


The structure is the same as with [Transaction](#transaction) channel. But this channel sends only executed transactions.

```
{
    "type": "subscribe",
    "channel": "executed_transaction"
}
```


The structure is the same as with [Transaction](#transaction) channel. But this channel sends only transactions related to a specific account.

```
{
    "type": "subscribe",
    "channel": "account_tx/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


The account all orders channel sends data about all the orders of an account.

```
{
    "type": "subscribe",
    "channel": "account_all_orders/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "channel": "account_all_orders:{ACCOUNT_ID}",
    "orders": {
        "{MARKET_INDEX}": [Order]
    },
    "type": "update/account_all_orders"
}
```


Blockchain height updates

```
{
    "type": "subscribe",
    "channel": "height",
}
```


**Response Structure**

```
{
    "channel": "height",
    "height": INTEGER,
    "type": "update/height"
}
```


Provides data about pool activities: trades, orders, positions, shares and funding histories.

```
{
    "type": "subscribe",
    "channel": "pool_data/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "channel": "pool_data:{ACCOUNT_ID}",
    "account": INTEGER,
    "trades": {
        "{MARKET_INDEX}": [Trade]
    },
    "orders": {
        "{MARKET_INDEX}": [Order]
    },
    "positions": {
        "{MARKET_INDEX}": Position
    },
    "shares": [PoolShares],
    "funding_histories": {
        "{MARKET_INDEX}": [PositionFunding]
    },
    "type": "subscribed/pool_data"
}
```


Provides information about pools.

```
{
    "type": "subscribe",
    "channel": "pool_info/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "channel": "pool_info:{ACCOUNT_ID}",
    "pool_info": {
        "status": INTEGER,
        "operator_fee": STRING,
        "min_operator_share_rate": STRING,
        "total_shares": INTEGER,
        "operator_shares": INTEGER,
        "annual_percentage_yield": FLOAT,
        "daily_returns": [
            {
                "timestamp": INTEGER,
                "daily_return": FLOAT
            }
        ],
        "share_prices": [
            {
                "timestamp": INTEGER,
                "share_price": FLOAT
            }
        ]
    },
    "type": "subscribed/pool_info"
}
```


Provides notifications received by an account. Notifications can be of three kinds: liquidation, deleverage, or announcement. Each kind has a different content structure.

```
{
    "type": "subscribe",
    "channel": "notification/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "channel": "notification:{ACCOUNT_ID}",
    "notifs": [
        {
            "id": STRING,
            "created_at": STRING,
            "updated_at": STRING,
            "kind": STRING,
            "account_index": INTEGER,
            "content": NotificationContent,
            "ack": BOOLEAN,
            "acked_at": STRING
        }
    ],
    "type": "subscribed/notification"
}
```


**Liquidation Notification Content**

```
{
    "id": STRING,
    "is_ask": BOOL,
    "usdc_amount": STRING,
    "size": STRING,
    "market_index": INTEGER,
    "price": STRING,
    "timestamp": INTEGER,
    "avg_price": STRING
}
```


**Deleverage Notification Content**

```
{
    "id": STRING,
    "usdc_amount": STRING,
    "size": STRING,
    "market_index": INTEGER,
    "settlement_price": STRING,
    "timestamp": INTEGER
}
```


**Announcement Notification Content**

```
{
    "title": STRING,
    "content": STRING, 
    "created_at": INTEGER
}
```


**Example response**

```
{
    "channel": "notification:12345",
    "notifs": [
        {
            "id": "notif_123",
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z",
            "kind": "liquidation",
            "account_index": 12345,
            "content": {
                "id": "notif_123",
                "is_ask": false,
                "usdc_amount": "1500.50",
                "size": "0.500000",
                "market_index": 1,
                "price": "3000.00",
                "timestamp": 1705312200,
                "avg_price": "3000.00"
            },
            "ack": false,
            "acked_at": null
        },
        {
            "id": "notif_124",
            "created_at": "2024-01-15T11:00:00Z",
            "updated_at": "2024-01-15T11:00:00Z",
            "kind": "deleverage",
            "account_index": 12345,
            "content": {
                "id": "notif_124",
                "usdc_amount": "500.25",
                "size": "0.200000",
                "market_index": 1,
                "settlement_price": "2501.25",
                "timestamp": 1705314000
            },
            "ack": false,
            "acked_at": null
        }
    ],
    "type": "update/notification"
}
```


The account all orders channel sends data about the orders of an account on a certain market.

```
{
    "type": "subscribe",
    "channel": "account_orders/{MARKET_INDEX}/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "account": {ACCOUNT_INDEX}, 
    "channel": "account_orders:{MARKET_INDEX}",
    "nonce": INTEGER,
    "orders": {
        "{MARKET_INDEX}": [Order] // the only present market index will be the one provided
    },
    "type": "update/account_orders"
}
```


The account all trades channel sends data about all the trades of an account.

```
{
    "type": "subscribe",
    "channel": "account_all_trades/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "channel": "account_all_trades:{ACCOUNT_ID}",
    "trades": {
        "{MARKET_INDEX}": [Trade]
    },
    "total_volume": FLOAT,
    "monthly_volume": FLOAT,
    "weekly_volume": FLOAT,
    "daily_volume": FLOAT,
    "type": "update/account_all_trades"
}
```


The account all orders channel sends data about all the order of an account.

```
{
    "type": "subscribe",
    "channel": "account_all_positions/{ACCOUNT_ID}",
    "auth": "{AUTH_TOKEN}"
}
```


**Response Structure**

```
{
    "channel": "account_all_positions:{ACCOUNT_ID}",
    "positions": {
        "{MARKET_INDEX}": Position
    },
    "shares": [PoolShares],
    "type": "update/account_all_positions"
}
```


Updated 30 days ago

* * *