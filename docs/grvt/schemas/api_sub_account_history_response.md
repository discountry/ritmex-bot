!!! info "[ApiSubAccountHistoryResponse](/../../schemas/api_sub_account_history_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[SubAccount]|True|The sub account history matching the request sub account|
    |next<br>`n` |string|True|The cursor to indicate when to start the next query from|
    ??? info "[SubAccount](/../../schemas/sub_account)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
        |sub_account_id<br>`sa` |string|True|The sub account ID this entry refers to|
        |margin_type<br>`mt` |MarginType|True|The type of margin algorithm this subaccount uses|
        |settle_currency<br>`sc` |string|True|The settlement, margin, and reporting currency of this account.<br>This subaccount can only open positions quoted in this currency<br><br>In the future, when users select a Multi-Currency Margin Type, this will be USD<br>All other assets are converted to this currency for the purpose of calculating margin|
        |unrealized_pnl<br>`up` |string|True|The total unrealized PnL of all positions owned by this subaccount, denominated in quote currency decimal units.<br>`unrealized_pnl = sum(position.unrealized_pnl * position.quote_index_price) / settle_index_price`|
        |total_equity<br>`te` |string|True|The notional value of your account if all positions are closed, excluding trading fees (reported in `settle_currency`).<br>`total_equity = sum(spot_balance.balance * spot_balance.index_price) / settle_index_price + unrealized_pnl`|
        |initial_margin<br>`im` |string|True|The `total_equity` required to open positions in the account (reported in `settle_currency`).<br>Computation is different depending on account's `margin_type`|
        |maintenance_margin<br>`mm` |string|True|The `total_equity` required to avoid liquidation of positions in the account (reported in `settle_currency`).<br>Computation is different depending on account's `margin_type`|
        |available_balance<br>`ab` |string|True|The notional value available to transfer out of the trading account into the funding account (reported in `settle_currency`).<br>`available_balance = total_equity - initial_margin - min(unrealized_pnl, 0)`|
        |spot_balances<br>`sb` |[SpotBalance]|True|The list of spot assets owned by this sub account, and their balances|
        |positions<br>`p` |[Positions]|True|The list of positions owned by this sub account|
        |settle_index_price<br>`si` |string|True|The index price of the settle currency. (reported in `USD`)|
        |is_vault<br>`iv` |boolean|False<br>`None`|Whether this sub account is a vault|
        |vault_im_additions<br>`vi` |string|False<br>`None`|Total amount of IM (reported in `settle_currency`) deducted from the vault due to redemptions nearing the end of their redemption period|
        |derisk_margin<br>`dm` |string|True|The derisk margin of this sub account|
        |derisk_to_maintenance_margin_ratio<br>`dt` |string|True|The derisk margin to maintenance margin ratio of this sub account|
        ??? info "[MarginType](/../../schemas/margin_type)"
            |Value| Description |
            |-|-|
            |`SIMPLE_CROSS_MARGIN` = 2|Simple Cross Margin Mode: all assets have a predictable margin impact, the whole subaccount shares a single margin|
            |`PORTFOLIO_CROSS_MARGIN` = 3|Portfolio Cross Margin Mode: asset margin impact is analysed on portfolio level, the whole subaccount shares a single margin|
        ??? info "[SpotBalance](/../../schemas/spot_balance)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |currency<br>`c` |string|True|The currency you hold a spot balance in|
            |balance<br>`b` |string|True|This currency's balance in this trading account.|
            |index_price<br>`ip` |string|True|The index price of this currency. (reported in `USD`)|
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
