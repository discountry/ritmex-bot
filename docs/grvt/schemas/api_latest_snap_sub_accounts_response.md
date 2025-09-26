!!! info "[ApiLatestSnapSubAccountsResponse](/../../schemas/api_latest_snap_sub_accounts_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[SubAccount]|True|The sub account history matching the request sub account|
    ??? info "[SubAccount](/../../schemas/sub_account)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
        |sub_account_id<br>`sa` |string|True|The sub account ID this entry refers to|
        |margin_type<br>`mt` |MarginType|True|The type of margin algorithm this subaccount uses|
        |settle_currency<br>`sc` |Currency|True|The settlement, margin, and reporting currency of this account.<br>This subaccount can only open positions quoted in this currency<br><br>In the future, when users select a Multi-Currency Margin Type, this will be USD<br>All other assets are converted to this currency for the purpose of calculating margin|
        |unrealized_pnl<br>`up` |string|True|The total unrealized PnL of all positions owned by this subaccount, denominated in quote currency decimal units.<br>`unrealized_pnl = sum(position.unrealized_pnl * position.quote_index_price) / settle_index_price`|
        |total_equity<br>`te` |string|True|The notional value of your account if all positions are closed, excluding trading fees (reported in `settle_currency`).<br>`total_equity = sum(spot_balance.balance * spot_balance.index_price) / settle_index_price + unrealized_pnl`|
        |initial_margin<br>`im` |string|True|The `total_equity` required to open positions in the account (reported in `settle_currency`).<br>Computation is different depending on account's `margin_type`|
        |maintenance_margin<br>`mm` |string|True|The `total_equity` required to avoid liquidation of positions in the account (reported in `settle_currency`).<br>Computation is different depending on account's `margin_type`|
        |available_balance<br>`ab` |string|True|The notional value available to transfer out of the trading account into the funding account (reported in `settle_currency`).<br>`available_balance = total_equity - initial_margin - min(unrealized_pnl, 0)`|
        |spot_balances<br>`sb` |[SpotBalance]|True|The list of spot assets owned by this sub account, and their balances|
        |positions<br>`p` |[Positions]|True|The list of positions owned by this sub account|
        |settle_index_price<br>`si` |string|True|The index price of the settle currency. (reported in `USD`)|
        ??? info "[MarginType](/../../schemas/margin_type)"
            |Value| Description |
            |-|-|
            |`SIMPLE_CROSS_MARGIN` = 2|Simple Cross Margin Mode: all assets have a predictable margin impact, the whole subaccount shares a single margin|
            |`PORTFOLIO_CROSS_MARGIN` = 3|Portfolio Cross Margin Mode: asset margin impact is analysed on portfolio level, the whole subaccount shares a single margin|
        ??? info "[Currency](/../../schemas/currency)"
            The list of Currencies that are supported on the GRVT exchange<br>

            |Value| Description |
            |-|-|
            |`USD` = 1|the USD fiat currency|
            |`USDC` = 2|the USDC token|
            |`USDT` = 3|the USDT token|
            |`ETH` = 4|the ETH token|
            |`BTC` = 5|the BTC token|
            |`SOL` = 6|the SOL token|
            |`ARB` = 7|the ARB token|
            |`BNB` = 8|the BNB token|
            |`ZK` = 9|the ZK token|
            |`POL` = 10|the POL token|
            |`OP` = 11|the OP token|
            |`ATOM` = 12|the ATOM token|
            |`KPEPE` = 13|the 1000PEPE token|
            |`TON` = 14|the TON token|
            |`XRP` = 15|the XRP token|
            |`TRUMP` = 20|the TRUMP token|
            |`SUI` = 21|the SUI token|
            |`LINK` = 25|the LINK token|
            |`JUP` = 27|the JUP token|
            |`FARTCOIN` = 28|the FARTCOIN token|
            |`ENA` = 29|the ENA token|
            |`DOGE` = 30|the DOGE token|
            |`ADA` = 33|the ADA token|
            |`AAVE` = 34|the AAVE token|
            |`BERA` = 35|the BERA token|
            |`IP` = 40|the IP token|
        ??? info "[SpotBalance](/../../schemas/spot_balance)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |currency<br>`c` |Currency|True|The currency you hold a spot balance in|
            |balance<br>`b` |string|True|This currency's balance in this trading account.|
            |index_price<br>`ip` |string|True|The index price of this currency. (reported in `USD`)|
            ??? info "[Currency](/../../schemas/currency)"
                The list of Currencies that are supported on the GRVT exchange<br>

                |Value| Description |
                |-|-|
                |`USD` = 1|the USD fiat currency|
                |`USDC` = 2|the USDC token|
                |`USDT` = 3|the USDT token|
                |`ETH` = 4|the ETH token|
                |`BTC` = 5|the BTC token|
                |`SOL` = 6|the SOL token|
                |`ARB` = 7|the ARB token|
                |`BNB` = 8|the BNB token|
                |`ZK` = 9|the ZK token|
                |`POL` = 10|the POL token|
                |`OP` = 11|the OP token|
                |`ATOM` = 12|the ATOM token|
                |`KPEPE` = 13|the 1000PEPE token|
                |`TON` = 14|the TON token|
                |`XRP` = 15|the XRP token|
                |`TRUMP` = 20|the TRUMP token|
                |`SUI` = 21|the SUI token|
                |`LINK` = 25|the LINK token|
                |`JUP` = 27|the JUP token|
                |`FARTCOIN` = 28|the FARTCOIN token|
                |`ENA` = 29|the ENA token|
                |`DOGE` = 30|the DOGE token|
                |`ADA` = 33|the ADA token|
                |`AAVE` = 34|the AAVE token|
                |`BERA` = 35|the BERA token|
                |`IP` = 40|the IP token|
        ??? info "[Positions](/../../schemas/positions)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
            |sub_account_id<br>`sa` |string|True|The sub account ID that participated in the trade|
            |instrument<br>`i` |string|True|The instrument being represented|
            |size<br>`s` |string|True|The size of the position, expressed in base asset decimal units. Negative for short positions|
            |notional<br>`n` |string|True|The notional value of the position, negative for short assets, expressed in quote asset decimal units|
            |entry_price<br>`ep` |string|True|The entry price of the position, expressed in `9` decimals<br>Whenever increasing the size of a position, the entry price is updated to the new average entry price<br>`new_entry_price = (old_entry_price * old_size + trade_price * trade_size) / (old_size + trade_size)`|
            |exit_price<br>`ep1` |string|True|The exit price of the position, expressed in `9` decimals<br>Whenever decreasing the size of a position, the exit price is updated to the new average exit price<br>`new_exit_price = (old_exit_price * old_exit_trade_size + trade_price * trade_size) / (old_exit_trade_size + trade_size)`|
            |mark_price<br>`mp` |string|True|The mark price of the position, expressed in `9` decimals|
            |unrealized_pnl<br>`up` |string|True|The unrealized PnL of the position, expressed in quote asset decimal units<br>`unrealized_pnl = (mark_price - entry_price) * size`|
            |realized_pnl<br>`rp` |string|True|The realized PnL of the position, expressed in quote asset decimal units<br>`realized_pnl = (exit_price - entry_price) * exit_trade_size`|
            |total_pnl<br>`tp` |string|True|The total PnL of the position, expressed in quote asset decimal units<br>`total_pnl = realized_pnl + unrealized_pnl`|
            |roi<br>`r` |string|True|The ROI of the position, expressed as a percentage<br>`roi = (total_pnl / (entry_price * abs(size))) * 100^`|
            |quote_index_price<br>`qi` |string|True|The index price of the quote currency. (reported in `USD`)|
            |est_liquidation_price<br>`el` |string|True|The estimated liquidation price|
            |leverage<br>`l` |string|True|The current leverage value for this position|
