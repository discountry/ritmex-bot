!!! info "[ApiGetCurrencyResponse](/../../schemas/api_get_currency_response)"
    The list of currencies<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[CurrencyDetail]|True|The list of currencies|
    ??? info "[CurrencyDetail](/../../schemas/currency_detail)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |id<br>`i` |integer|True|The integer value of the currency|
        |symbol<br>`s` |string|True|The name of the currency|
        |balance_decimals<br>`bd` |integer|True|The balance decimals of the currency|
        |quantity_multiplier<br>`qm` |string|True|The quantity multiplier of the currency|
