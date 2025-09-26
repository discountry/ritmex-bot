!!! info "[ApiCancelOrderRequest](/../../schemas/api_cancel_order_request)"
    Cancel an order on the orderbook for this trading account. Either `order_id` or `client_order_id` must be provided.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The subaccount ID cancelling the order|
    |order_id<br>`oi` |string|False<br>`0`|Cancel the order with this `order_id`|
    |client_order_id<br>`co` |string|False<br>`0`|Cancel the order with this `client_order_id`|
    |time_to_live_ms<br>`tt` |string|False<br>`100`|Specifies the time-to-live (in milliseconds) for this cancellation.<br>During this period, any order creation with a matching `client_order_id` will be cancelled and not be added to the GRVT matching engine.<br>This mechanism helps mitigate time-of-flight issues where cancellations might arrive before the corresponding orders.<br>Hence, cancellation by `order_id` ignores this field as the exchange can only assign `order_id`s to already-processed order creations.<br>The duration cannot be negative, is rounded down to the nearest 100ms (e.g., `'670'` -> `'600'`, `'30'` -> `'0'`) and capped at 5 seconds (i.e., `'5000'`).<br>Value of `'0'` or omission results in the default time-to-live value being applied.<br>If the caller requests multiple successive cancellations for a given order, such that the time-to-live windows overlap, only the first request will be considered.<br>|
