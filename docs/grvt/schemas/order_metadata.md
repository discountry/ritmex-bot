!!! info "[OrderMetadata](/../../schemas/order_metadata)"
    Metadata fields are used to support Backend only operations. These operations are not trustless by nature.<br>Hence, fields in here are never signed, and is never transmitted to the smart contract.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |client_order_id<br>`co` |string|True|A unique identifier for the active order within a subaccount, specified by the client<br>This is used to identify the order in the client's system<br>This field can be used for order amendment/cancellation, but has no bearing on the smart contract layer<br>This field will not be propagated to the smart contract, and should not be signed by the client<br>This value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expected<br>Gravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]<br>To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]<br><br>When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId|
    |create_time<br>`ct` |string|False<br>`0`|[Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds|
    |trigger<br>`t` |TriggerOrderMetadata|False<br>``|Trigger fields are used to support any type of trigger order such as TP/SL|
    |broker<br>`b` |BrokerTag|False<br>``|Specifies the broker who brokered the order|
    ??? info "[TriggerOrderMetadata](/../../schemas/trigger_order_metadata)"
        Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).<br><br>Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.<br><br><br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |trigger_type<br>`tt` |TriggerType|True|Type of the trigger order. eg: Take Profit, Stop Loss, etc|
        |tpsl<br>`t` |TPSLOrderMetadata|True|Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.<br><br>|
        ??? info "[TriggerType](/../../schemas/trigger_type)"
            Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.<br><br>Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.<br><br><br>

            |Value| Description |
            |-|-|
            |`UNSPECIFIED` = 0|Not a trigger order. The order executes normally without any trigger conditions.|
            |`TAKE_PROFIT` = 1|Take Profit Order - Executes when the price reaches a specified level to secure profits.|
            |`STOP_LOSS` = 2|Stop Loss Order - Executes when the price reaches a specified level to limit losses.|
        ??? info "[TPSLOrderMetadata](/../../schemas/tpsl_order_metadata)"
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
    ??? info "[BrokerTag](/../../schemas/broker_tag)"
        BrokerTag is a tag for the broker that the order is sent from.<br>

        |Value| Description |
        |-|-|
        |`UNSPECIFIED` = 0||
        |`COIN_ROUTES` = 1|CoinRoutes|
        |`ALERTATRON` = 2|Alertatron|
        |`ORIGAMI` = 3|Origami|
