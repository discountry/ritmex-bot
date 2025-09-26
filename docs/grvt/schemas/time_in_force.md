!!! info "[TimeInForce](/../../schemas/time_in_force)"
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
    |`RETAIL_PRICE_IMPROVEMENT` = 5|RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.|
