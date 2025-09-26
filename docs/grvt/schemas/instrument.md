!!! info "[Instrument](/../../schemas/instrument)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |instrument_hash<br>`ih` |string|True|The asset ID used for instrument signing.|
    |base<br>`b` |string|True|The base currency|
    |quote<br>`q` |string|True|The quote currency|
    |kind<br>`k` |Kind|True|The kind of instrument|
    |venues<br>`v` |[Venue]|True|Venues that this instrument can be traded at|
    |settlement_period<br>`sp1` |InstrumentSettlementPeriod|True|The settlement period of the instrument|
    |base_decimals<br>`bd` |integer|True|The smallest denomination of the base asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1)|
    |quote_decimals<br>`qd` |integer|True|The smallest denomination of the quote asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1)|
    |tick_size<br>`ts` |string|True|The size of a single tick, expressed in price decimal units|
    |min_size<br>`ms` |string|True|The minimum contract size, expressed in base asset decimal units|
    |create_time<br>`ct` |string|True|Creation time in unix nanoseconds|
    |max_position_size<br>`mp` |string|True|The maximum position size, expressed in base asset decimal units|
    ??? info "[Kind](/../../schemas/kind)"
        The list of asset kinds that are supported on the GRVT exchange<br>

        |Value| Description |
        |-|-|
        |`PERPETUAL` = 1|the perpetual asset kind|
        |`FUTURE` = 2|the future asset kind|
        |`CALL` = 3|the call option asset kind|
        |`PUT` = 4|the put option asset kind|
    ??? info "[Venue](/../../schemas/venue)"
        The list of Trading Venues that are supported on the GRVT exchange<br>

        |Value| Description |
        |-|-|
        |`ORDERBOOK` = 1|the trade is cleared on the orderbook venue|
        |`RFQ` = 2|the trade is cleared on the RFQ venue|
    ??? info "[InstrumentSettlementPeriod](/../../schemas/instrument_settlement_period)"
        |Value| Description |
        |-|-|
        |`PERPETUAL` = 1|Instrument settles through perpetual funding cycles|
        |`DAILY` = 2|Instrument settles at an expiry date, marked as a daily instrument|
        |`WEEKLY` = 3|Instrument settles at an expiry date, marked as a weekly instrument|
        |`MONTHLY` = 4|Instrument settles at an expiry date, marked as a monthly instrument|
        |`QUARTERLY` = 5|Instrument settles at an expiry date, marked as a quarterly instrument|
