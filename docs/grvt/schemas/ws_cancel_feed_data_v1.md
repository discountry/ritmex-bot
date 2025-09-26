!!! info "[WSCancelFeedDataV1](/../../schemas/ws_cancel_feed_data_v1)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|Stream name|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |CancelStatusFeed|True|Data relating to the status of the cancellation attempt|
    ??? info "[CancelStatusFeed](/../../schemas/cancel_status_feed)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |sub_account_id<br>`sa` |string|True|The subaccount ID that requested the cancellation|
        |client_order_id<br>`co` |string|True|A unique identifier for the active order within a subaccount, specified by the client|
        |order_id<br>`oi` |string|True|A unique 128-bit identifier for the order, deterministically generated within the GRVT backend|
        |reason<br>`r` |OrderRejectReason|True|The user-provided reason for cancelling the order|
        |update_time<br>`ut` |string|False<br>`0`|[Filled by GRVT Backend] Time at which the cancellation status was updated by GRVT in unix nanoseconds|
        |cancel_status<br>`cs` |CancelStatus|True|Status of the cancellation attempt|
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
            |`REDUCE_ONLY_LIMIT` = 31|the remaining order size was cancelled because it exceeded current position size|
            |`CLIENT_REPLACE` = 32|the order was replaced by a client replace request|
            |`DERISK_MUST_BE_IOC` = 33|the derisk order must be an IOC order|
            |`DERISK_MUST_BE_REDUCE_ONLY` = 34|the derisk order must be a reduce-only order|
            |`DERISK_NOT_SUPPORTED` = 35|derisk is not supported|
            |`INVALID_ORDER_TYPE` = 36|the order type is invalid|
            |`CURRENCY_NOT_DEFINED` = 37|the currency is not defined|
        ??? info "[CancelStatus](/../../schemas/cancel_status)"
            |Value| Description |
            |-|-|
            |`EXPIRED` = 1|Cancellation has expired because corresponding order had not arrived within the defined time-to-live window.|
            |`DROPPED_DUPLICATE` = 2|This cancellation request was dropped because its TTL window overlaps with another cancellation request for the same order.|
