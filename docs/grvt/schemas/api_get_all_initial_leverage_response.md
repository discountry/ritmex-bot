!!! info "[ApiGetAllInitialLeverageResponse](/../../schemas/api_get_all_initial_leverage_response)"
    The response to get the initial leverage of a sub account<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |results<br>`r` |[InitialLeverageResult]|True|The initial leverage of the sub account|
    ??? info "[InitialLeverageResult](/../../schemas/initial_leverage_result)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |instrument<br>`i` |string|True|The instrument to get the leverage for|
        |leverage<br>`l` |string|True|The initial leverage of the sub account|
        |min_leverage<br>`ml` |string|True|The min leverage this sub account can set|
        |max_leverage<br>`ml1` |string|True|The max leverage this sub account can set|
