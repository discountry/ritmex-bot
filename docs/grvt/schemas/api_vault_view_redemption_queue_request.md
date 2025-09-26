!!! info "[ApiVaultViewRedemptionQueueRequest](/../../schemas/api_vault_view_redemption_queue_request)"
    Request payload for a vault manager to view the redemption queue for their vault.<br><br>Fetches the redemption queue for a vault, ordered by descending priority.<br><br><b>Urgent</b> redemption requests, defined as having been pending >90% of the manager-defined maximum redemption period, have top priority (following insertion order).<br><br><b>Non-urgent</b> redemption requests are otherwise prioritized by insertion order, <b>unless</b> they are >5x the size of the smallest redemption request.<br><br>E.g., If FIFO ordering (all non-urgent) is 1k -> 50k -> 100k -> 20k -> 10k -> 25k, then priority ordering is 1k -> 10k -> 50k -> 20k -> 100k -> 25k.<br><br>Only displays redemption requests that are eligible for automated redemption, i.e., have been pending for the manager-defined minimum redemption period.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |vault_id<br>`vi` |string|True|The unique identifier of the vault to fetch the redemption queue for.|
