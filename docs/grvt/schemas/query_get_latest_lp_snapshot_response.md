!!! info "[QueryGetLatestLPSnapshotResponse](/../../schemas/query_get_latest_lp_snapshot_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |snapshot<br>`s` |LPSnapshot|True|The latest LP snapshot|
    ??? info "[LPSnapshot](/../../schemas/lp_snapshot)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |main_account_id<br>`ma` |string|True|The main account id|
        |lp_asset<br>`la` |string|True|The LP Asset|
        |underlying_multiplier<br>`um` |string|True|Underlying multiplier|
        |maker_trading_volume<br>`mt` |string|True|Maker trading volume|
        |bid_fast_market_multiplier<br>`bf` |integer|True|Fast market multiplier|
        |ask_fast_market_multiplier<br>`af` |integer|True|Fast market multiplier|
        |liquidity_score<br>`ls` |string|True|Liquidity score|
        |calculate_at<br>`ca` |string|True|The time when the snapshot was calculated|
