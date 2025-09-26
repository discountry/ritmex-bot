!!! info "[ApiSubAccountHistoryRequest](/../../schemas/api_sub_account_history_request)"
    The request to get the history of a sub account<br>SubAccount Summary values are snapshotted once every hour<br>No snapshots are taken if the sub account has no activity in the hourly window<br>History is preserved only for the last 30 days<br><br>Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The sub account ID to request for|
    |start_time<br>`st` |string|False<br>`0`|Start time of sub account history in unix nanoseconds|
    |end_time<br>`et` |string|False<br>`now()`|End time of sub account history in unix nanoseconds|
    |limit<br>`l` |integer|False<br>`500`|The limit to query for. Defaults to 500; Max 1000|
    |cursor<br>`c` |string|False<br>`''`|The cursor to indicate when to start the next query from|
