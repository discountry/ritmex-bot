!!! info "[TriggerBy](/../../schemas/trigger_by)"
    Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.<br><br>Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.<br><br><br>

    |Value| Description |
    |-|-|
    |`UNSPECIFIED` = 0|no trigger condition|
    |`INDEX` = 1|INDEX - Order is activated when the index price reaches the trigger price|
    |`LAST` = 2|LAST - Order is activated when the last trade price reaches the trigger price|
    |`MID` = 3|MID - Order is activated when the mid price reaches the trigger price|
    |`MARK` = 4|MARK - Order is activated when the mark price reaches the trigger price|
