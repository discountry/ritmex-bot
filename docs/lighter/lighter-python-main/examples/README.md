## Setup steps for testnet
- Go to https://testnet.app.lighter.xyz/ and connect a wallet to receive $500
- run `system_setup.py` with the correct ETH Private key configured
  - set an API key index which is not 0, so you won't override the one used by [app.lighter.xyz](https://app.lighter.xyz/)
  - this will require you to enter your Ethereum private key
  - the eth private key will only be used in the Py SDK to sign a message
  - the eth private key is not required in order to trade on the platform
  - the eth private key is not passed to the binary 
  - the API key config is saved in a local file `./api_key_config.json`

## Start trading on testnet
- `create_modify_cancel_order_http.py`
  - creates an ask (sell) order for 0.1 ETH @ $4050
  - modified the order and increases the size to 0.11 ETH and increases the price to $4100
  - cancels the order
  - Note: all of these operations use the client order index of the order. You can use the order from the exchange as well
  
- `create_modify_cancel_order_ws.py`
  - same flow as `create_modify_cancel_order_http.py`
  - sends TXs over WS instead of HTTP

- `create_market_order_eth_buy.py`
  - creates a market buy order for 0.1 ETH @ market price
- `create_market_order_eth_sell.py`
  - creates a market sell order for 0.1 ETH @ market price

- `create_grouped_ioc_with_attached_sl_tp.py`
  - creates an ask (sell) IoC order for 0.1 ETH
  - along w/ the order, it sets up a Stop Loss (SL) and a Take Profit (TP) order for the whole size of the order
  - the size of the SL/TP will be equal to the executed size of the order
  - the SL/TP orders are canceled when the sign of your position changes

- `create_position_tied_sl_tp.py`
  - creates a bid (buy) Stop Loss (SL) and a Take Profit (TP) to close your short position
  - the size of the orders will be for your whole position (because BaseAmount=0)
  - the orders will grow / shrink as you accumulate more position
  - the SL/TP orders are canceled when the sign of your position changes

## On SL/TP orders
SL/TP orders need to be configured beyond just setting the trigger price. When the trigger price is set, 
the order will just be executed, like a normal order. This means that a market order, for example, might not have enough slippage! \
Let's say that you have a 1 BTC long position, and the current price is $110'000. \
You want to set up a take profit at $120'000
- order should be an ask (sell) order, to close your position
- the trigger price should be $120'000

What about the order types? Just as normal orders, SL/TP orders trigger an order, which can be:
- market order
- limit IOC / GTC

## Modify leverage / Margin Mode (Cross, Isolated) / Add Collateral to isolated-only positions
- `margin_eth_20x_cross_http`
  - sets ETH market to 20x leverage and cross-margin mode, using HTTP
- `margin_eth_50x_isolate_ws`
  - sets ETH market to 50x leverage and isolated margin mode, using HTTP
- `margin_eth_add_collateral_http.py`
  - adds $10.5 USDC to the ETH position (must be opened and in isolated mode)
- `margin_eth_remove_collateral_ws.py`
  - removes $5 USDC from the ETH position (must be opened and in isolated mode)

## Batch orders
- `send_batch_tx_http.py`
  - sends multiple orders in a single HTTP request
- `send_batch_tx_ws.py`
  - sends multiple orders in a single WS request`

Batch TXs will be executed back to back, without the possibility of other TXs interfering.

## Spot Trading
To trade spot markets, you need to have spot USDC. USDC used in your perpetual account will be used as collateral for your cross-positions.  
USDC deposited in the spot account can only be used to buy spot assets.  
To transfer USDC between spot <> perp balance, or vice verse, check out
- `spot_self_transfer_perp_spot.py`
- `spot_self_transfer_spot_perp.py`

Order placement / trades work in the same way as for perpetual markets.  
The fee will be paid in the received asset for premium spot trades.   
This means that if you sell ETH, you'll receive less USDC, and if you BUY 1 ETH, you'll receive slightly less than 1 ETH.  
You can check out the following examples, which should work on spot ETH by changing the market index to 2048 instead of 0.
- `create_modify_cancel_order_http.py`
- `create_modify_cancel_order_ws.py`
- `create_market_order_eth_buy.py`
- `create_market_order_eth_sell.py`
- `send_batch_tx_http.py`
- `send_batch_tx_ws.py`

Trading setup is very similar to perpetual markets.  
The only difference is that you'll need to hold USDC / ETH before placing an order.  
For example, on perp markets you can place an order to short (sell) ETH without having to worry that much.    
The limitation there would be to have enough available collateral to cover the order.  
On spot orders, you need to have enough assets in your spot account to cover all open orders.  
If you want to place two orders, to buy 1000 USDC worth of ETH and 1000 USDC worth of ZK, you'll need to have at least 2000 available USDC.  

You can get the order book details (including symbol and market index) as well as quote asset id (ETH) and base asset id (USDC)  
by following the example below:
- `spot_get_order_books.py`

Note: you'll need the quote asset id and base asset id to check available balance.  
Available balance is not locked in open orders.

To keep track of your spot balance, you can use HTTP calls or a websocket subscription.  
Examples on how to do this can be found here:
- `spot_get_account_assets_http.py`
- `spot_get_account_assets_ws.py`

Moving money to / from subaccounts is possible for spot assets. 
For USDC, you can move directly from main perp balance to subaccount spot balance, for example.
More details can be found in the following example:
- `sub_account_create.py`
- `sub_account_transfer_eth.py`
- `sub_account_transfer_usdc.py`

## Public Pools
Public pools behave just like subaccounts, except that anyone can join them.  
You can create / modify a public pool using the SDK. Check out the following example:
- `public_pool_create_modify.py` 

To create API keys for a public pool, you need to run the setup script but specify the `ACCOUNT_INDEX` to be the one of the public pool.  
After that, you can trade from the public as from any other account.

If you want to deposit / withdraw from a public pool, check the following example:
- `public_pool_deposit.py`
- `public_pool_withdraw.py`

To get information about pools, check:
- `public_pool_info.py`

## Moving funds around
- `withdraw_fast.py`
  - send USDC directly from Lighter to Arbitrum
- `withdraw_normal.py`
  - send USDC/ETH from Lighter to Ethereum
- `transfer.py`
  - generic example of how to transfer funds between accounts.
  - same functionality as `sub_account_transfer_eth` and `sub_account_transfer_usdc`

## Transfer Notes
The `memo` field is a user message, and it has to be exactly 32 bytes long. In case of fast withdrawals, you need to specify the recipient in the memo.  
This is the case since the memo is part of the signature. This way, the recipient is verified.   

When calling `client.transfer`, you pass the amount without needing to worry about the decimals.   
When calling `client.sign_transfer` on the other hand, you need to specify the decimals and pass an integer.  

The `fee` field can be obtained by calling `info_api.transfer_fee_info(...)`. The field can be passed as it is.  
Transfers between subaccounts are free for all assets.

When sending assets, you can specify the source and destination routes.  
A route is either `perp` or `spot`. You can send USDC directly from your perp balance to another person's spot balance.  
If you receive USDC in your perp account, it will be instantly used as collateral for open positions.  
This also allows you to move USDC from your spot balance to your perp balance.  
Spot assets (like ETH) need to have both the from and to route set to `spot`. 
You can get all `asset_id`s by following the example below: 
- `spot_get_order_books.py`

## Setup steps for mainnet
- deposit money on Lighter to create an account first
- change the URL to `mainnet.zklighter.elliot.ai`
- repeat setup step