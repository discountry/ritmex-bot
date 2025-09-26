!!! info "[ApiUserCategoryAffinityScoreResponse](/../../schemas/api_user_category_affinity_score_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[UserCategoryAffinityScore]|True|The list of categoryAffinities score|
    ??? info "[UserCategoryAffinityScore](/../../schemas/user_category_affinity_score)"
        <br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |account_id<br>`ai` |string|True|The off chain account id|
        |category_id<br>`ci` |string|True|target category|
        |affinity_score<br>`as` |number|True|affinity score|
