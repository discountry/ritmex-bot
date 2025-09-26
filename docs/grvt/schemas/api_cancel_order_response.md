!!! info "[ApiCancelOrderResponse](/../../schemas/api_cancel_order_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |Order|True|The cancelled order|
    ??? info "[Order](/../../schemas/order)"
        Order is a typed payload used throughout the GRVT platform to express all orderbook, RFQ, and liquidation orders.<br>GRVT orders are capable of expressing both single-legged, and multi-legged orders by default.<br>This increases the learning curve slightly but reduces overall integration load, since the order payload is used across all GRVT trading venues.<br>Given GRVT's trustless settlement model, the Order payload also carries the signature, required to trade the order on our ZKSync Hyperchain.<br><br>All fields in the Order payload (except `id`, `metadata`, and `state`) are trustlessly enforced on our Hyperchain.<br>This minimizes the amount of trust users have to offer to GRVT<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |order_id<br>`oi` |string|False<br>`0`|[Filled by GRVT Backend] A unique 128-bit identifier for the order, deterministically generated within the GRVT backend|
        |sub_account_id<br>`sa` |string|True|The subaccount initiating the order|
        |is_market<br>`im` |boolean|False<br>`false`|If the order is a market order<br>Market Orders do not have a limit price, and are always executed according to the maker order price.<br>Market Orders must always be taker orders|
        |time_in_force<br>`ti` |TimeInForce|True|Four supported types of orders: GTT, IOC, AON, FOK:<ul><br><li>PARTIAL EXECUTION = GTT / IOC - allows partial size execution on each leg</li><br><li>FULL EXECUTION = AON / FOK - only allows full size execution on all legs</li><br><li>TAKER ONLY = IOC / FOK - only allows taker orders</li><br><li>MAKER OR TAKER = GTT / AON - allows maker or taker orders</li><br></ul>Exchange only supports (GTT, IOC, FOK)<br>RFQ Maker only supports (GTT, AON), RFQ Taker only supports (FOK)|
        |post_only<br>`po` |boolean|False<br>`false`|If True, Order must be a maker order. It has to fill the orderbook instead of match it.<br>If False, Order can be either a maker or taker order. <b>In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.</b><br><br>|               | Must Fill All | Can Fill Partial |<br>| -             | -             | -                |<br>| Must Be Taker | FOK + False   | IOC + False      |<br>| Can Be Either | AON + False   | GTC + False      |<br>| Must Be Maker | AON + True    | GTC + True       |<br>|
        |reduce_only<br>`ro` |boolean|False<br>`false`|If True, Order must reduce the position size, or be cancelled|
        |legs<br>`l` |[OrderLeg]|True|The legs present in this order<br>The legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice|
        |signature<br>`s` |Signature|True|The signature approving this order|
        |metadata<br>`m` |OrderMetadata|True|Order Metadata, ignored by the smart contract, and unsigned by the client|
        |state<br>`s1` |OrderState|False<br>`''`|[Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client|
        ??? info "[TimeInForce](/../../schemas/time_in_force)"
            |                       | Must Fill All | Can Fill Partial |
            | -                     | -             | -                |
            | Must Fill Immediately | FOK           | IOC              |
            | Can Fill Till Time    | AON           | GTC              |
            <br>

            |Value| Description |
            |-|-|
            |`GOOD_TILL_TIME` = 1|GTT - Remains open until it is cancelled, or expired|
            |`ALL_OR_NONE` = 2|AON - Either fill the whole order or none of it (Block Trades Only)|
            |`IMMEDIATE_OR_CANCEL` = 3|IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it|
            |`FILL_OR_KILL` = 4|FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it|
        ??? info "[OrderLeg](/../../schemas/order_leg)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |instrument<br>`i` |string|True|The instrument to trade in this leg|
            |size<br>`s` |string|True|The total number of assets to trade in this leg, expressed in base asset decimal units.|
            |limit_price<br>`lp` |string|False<br>`0`|The limit price of the order leg, expressed in `9` decimals.<br>This is the number of quote currency units to pay/receive for this leg.<br>This should be `null/0` if the order is a market order|
            |is_buying_asset<br>`ib` |boolean|True|Specifies if the order leg is a buy or sell|
        ??? info "[Signature](/../../schemas/signature)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |signer<br>`s` |string|True|The address (public key) of the wallet signing the payload|
            |r<br>`r` |string|True|Signature R|
            |s<br>`s1` |string|True|Signature S|
            |v<br>`v` |integer|True|Signature V|
            |expiration<br>`e` |string|True|Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days|
            |nonce<br>`n` |integer|True|Users can randomly generate this value, used as a signature deconflicting key.<br>ie. You can send the same exact instruction twice with different nonces.<br>When the same nonce is used, the same payload will generate the same signature.<br>Our system will consider the payload a duplicate, and ignore it.|
        ??? info "[OrderMetadata](/../../schemas/order_metadata)"
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
                    ??? info "[TriggerBy](/../../schemas/trigger_by)"
                        Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.<br><br>Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.<br><br><br>

                        |Value| Description |
                        |-|-|
                        |`UNSPECIFIED` = 0|no trigger condition|
                        |`INDEX` = 1|INDEX - Order is activated when the index price reaches the trigger price|
                        |`LAST` = 2|LAST - Order is activated when the last trade price reaches the trigger price|
            ??? info "[BrokerTag](/../../schemas/broker_tag)"
                BrokerTag is a tag for the broker that the order is sent from.<br>

                |Value| Description |
                |-|-|
                |`UNSPECIFIED` = 0||
                |`COIN_ROUTES` = 1|CoinRoutes|
                |`ALERTATRON` = 2|Alertatron|
                |`ORIGAMI` = 3|Origami|
        ??? info "[OrderState](/../../schemas/order_state)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |status<br>`s` |OrderStatus|True|The status of the order|
            |reject_reason<br>`rr` |OrderRejectReason|True|The reason for rejection or cancellation|
            |book_size<br>`bs` |[string]|True|The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs|
            |traded_size<br>`ts` |[string]|True|The total number of assets traded. Sorted in same order as Order.Legs|
            |update_time<br>`ut` |string|True|Time at which the order was updated by GRVT, expressed in unix nanoseconds|
            |avg_fill_price<br>`af` |[string]|True|The average fill price of the order. Sorted in same order as Order.Legs|
            ??? info "[OrderStatus](/../../schemas/order_status)"
                |Value| Description |
                |-|-|
                |`PENDING` = 1|Order has been sent to the matching engine and is pending a transition to open/filled/rejected.|
                |`OPEN` = 2|Order is actively matching on the matching engine, could be unfilled or partially filled.|
                |`FILLED` = 3|Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.|
                |`REJECTED` = 4|Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.|
                |`CANCELLED` = 5|Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.|
            ??? info "[OrderRejectReason](/../../schemas/order_reject_reason)"
                |Value| Description |
                |-|-|
                |`UNSPECIFIED` = 0|order is not cancelled or rejected|
                |`CLIENT_CANCEL` = 1|client called a Cancel API|
                |`CLIENT_BULK_CANCEL` = 2|client called a Bulk Cancel API|
                |`CLIENT_SESSION_END` = 3|client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'|
                |`MARKET_CANCEL` = 4|the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons|
                |`IOC_CANCEL` = 5|the IOC order was cancelled after no/partial fill|
                |`AON_CANCEL` = 6|the AON order was cancelled as it could not be fully matched|
                |`FOK_CANCEL` = 7|the FOK order was cancelled as it could not be fully matched|
                |`EXPIRED` = 8|the order was cancelled as it has expired|
                |`FAIL_POST_ONLY` = 9|the post-only order could not be posted into the orderbook|
                |`FAIL_REDUCE_ONLY` = 10|the reduce-only order would have caused position size to increase|
                |`MM_PROTECTION` = 11|the order was cancelled due to market maker protection trigger|
                |`SELF_TRADE_PROTECTION` = 12|the order was cancelled due to self-trade protection trigger|
                |`SELF_MATCHED_SUBACCOUNT` = 13|the order matched with another order from the same sub account|
                |`OVERLAPPING_CLIENT_ORDER_ID` = 14|an active order on your sub account shares the same clientOrderId|
                |`BELOW_MARGIN` = 15|the order will bring the sub account below initial margin requirement|
                |`LIQUIDATION` = 16|the sub account is liquidated (and all open orders are cancelled by Gravity)|
                |`INSTRUMENT_INVALID` = 17|instrument is invalid or not found on Gravity|
                |`INSTRUMENT_DEACTIVATED` = 18|instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)|
                |`SYSTEM_FAILOVER` = 19|system failover resulting in loss of order state|
                |`UNAUTHORISED` = 20|the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action|
                |`SESSION_KEY_EXPIRED` = 21|the session key used to sign the order expired|
                |`SUB_ACCOUNT_NOT_FOUND` = 22|the subaccount does not exist|
                |`NO_TRADE_PERMISSION` = 23|the signature used to sign the order has no trade permission|
                |`UNSUPPORTED_TIME_IN_FORCE` = 24|the order payload does not contain a supported TimeInForce value|
                |`MULTI_LEGGED_ORDER` = 25|the order has multiple legs, but multiple legs are not supported by this venue|
                |`EXCEED_MAX_POSITION_SIZE` = 26|the order would have caused the subaccount to exceed the max position size|
                |`EXCEED_MAX_SIGNATURE_EXPIRATION` = 27|the signature supplied is more than 30 days in the future|
                |`MARKET_ORDER_WITH_LIMIT_PRICE` = 28|the market order has a limit price set|
                |`CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED` = 29|client cancel on disconnect triggered|
                |`OCO_COUNTER_PART_TRIGGERED` = 30|the OCO counter part order was triggered|
