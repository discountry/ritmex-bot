!!! info "[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)"
    Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.<br><br>### Fields:<br>- **triggerBy**: Defines the price type that activates the order (e.g., index price).<br>- **triggerPrice**: The price at which the order is triggered, expressed in `9` decimal precision.<br><br><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |trigger_by<br>`tb` |TriggerBy|True|Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order|
    |trigger_price<br>`tp` |string|True|The Trigger Price of the order, expressed in `9` decimals.|
    |close_position<br>`cp` |boolean|True|If True, the order will close the position when the trigger price is reached|
    ??? info "[TriggerBy](/../../schemas/trigger_by)"
        Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.<br><br>Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.<br><br><br>

        |Value| Description |
        |-|-|
        |`UNSPECIFIED` = 0|no trigger condition|
        |`INDEX` = 1|INDEX - Order is activated when the index price reaches the trigger price|
        |`LAST` = 2|LAST - Order is activated when the last trade price reaches the trigger price|
        |`MID` = 3|MID - Order is activated when the mid price reaches the trigger price|
        |`MARK` = 4|MARK - Order is activated when the mark price reaches the trigger price|
