!!! info "[ApiGetMarginTiersResponse](/../../schemas/api_get_margin_tiers_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |results<br>`r` |[AssetMarginTierResponse]|True||
    ??? info "[AssetMarginTierResponse](/../../schemas/asset_margin_tier_response)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |asset<br>`a` |string|True||
        |tiers<br>`t` |[MarginTierResponse]|True||
        ??? info "[MarginTierResponse](/../../schemas/margin_tier_response)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |lower_bound<br>`lb` |string|True||
            |rate<br>`r` |string|True||
