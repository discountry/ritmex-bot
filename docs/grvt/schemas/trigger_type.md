!!! info "[TriggerType](/../../schemas/trigger_type)"
    Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.<br><br>Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.<br><br><br>

    |Value| Description |
    |-|-|
    |`UNSPECIFIED` = 0|Not a trigger order. The order executes normally without any trigger conditions.|
    |`TAKE_PROFIT` = 1|Take Profit Order - Executes when the price reaches a specified level to secure profits.|
    |`STOP_LOSS` = 2|Stop Loss Order - Executes when the price reaches a specified level to limit losses.|
