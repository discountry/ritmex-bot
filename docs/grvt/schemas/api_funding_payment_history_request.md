!!! info "[ApiFundingPaymentHistoryRequest](/../../schemas/api_funding_payment_history_request)"
    Query for all historical funding payments made by a single account.<br><br>Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The sub account ID to request for|
    |instrument<br>`i` |string|False<br>`all`|The perpetual instrument to filter for|
    |start_time<br>`st` |string|False<br>`0`|The start time to apply in unix nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned|
    |end_time<br>`et` |string|False<br>`now()`|The end time to apply in unix nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned|
    |limit<br>`l` |integer|False<br>`500`|The limit to query for. Defaults to 500; Max 1000|
    |cursor<br>`c` |string|False<br>`''`|The cursor to indicate when to start the query from|
