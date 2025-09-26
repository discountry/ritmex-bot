!!! info "[OrderStatus](/../../schemas/order_status)"
    |Value| Description |
    |-|-|
    |`PENDING` = 1|Order has been sent to the matching engine and is pending a transition to open/filled/rejected.|
    |`OPEN` = 2|Order is actively matching on the matching engine, could be unfilled or partially filled.|
    |`FILLED` = 3|Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.|
    |`REJECTED` = 4|Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.|
    |`CANCELLED` = 5|Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.|
