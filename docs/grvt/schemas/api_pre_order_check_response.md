!!! info "[ApiPreOrderCheckResponse](/../../schemas/api_pre_order_check_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |results<br>`r` |[PreOrderCheckResult]|True|Pre order check for each new order in the request|
    ??? info "[PreOrderCheckResult](/../../schemas/pre_order_check_result)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |max_qty<br>`mq` |[AssetMaxQty]|True|The maximum quantity for each leg|
        |margin_required<br>`mr` |string|True|The margin required for the order (reported in `settle_currency`)|
        |order_valid<br>`ov` |boolean|True|Whether the order is valid|
        |reason<br>`r` |string|True|The reason the order is invalid, if any|
        |settle_currency<br>`sc` |Currency|True|The subAccount settle currency|
        ??? info "[AssetMaxQty](/../../schemas/asset_max_qty)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |asset<br>`a` |string|True|The asset associated with the max quantity|
            |max_buy_qty<br>`mb` |string|True|The maximum buy quantity|
            |max_sell_qty<br>`ms` |string|True|The maximum sell quantity|
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
