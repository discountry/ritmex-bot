!!! info "[CancelStatus](/../../schemas/cancel_status)"
    |Value| Description |
    |-|-|
    |`EXPIRED` = 1|Cancellation has expired because corresponding order had not arrived within the defined time-to-live window.|
    |`DROPPED_DUPLICATE` = 2|This cancellation request was dropped because its TTL window overlaps with another cancellation request for the same order.|
