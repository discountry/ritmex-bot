!!! info "[UserTrackingEvent](/../../schemas/user_tracking_event)"
    event of user<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |event_id<br>`ei` |string|True|uuid for event|
    |tracking_version<br>`tv` |integer|True|version of tracking|
    |event_time<br>`et` |string|True|timestamp of event|
    |event_type<br>`et1` |string|True|event type|
    |event_sub_type<br>`es` |string|True|event sub type|
    |client_session_id<br>`cs` |string|True|unique identity of the session generated from client|
    |device_os<br>`do` |string|True|OS of user's device|
    |device_os_version<br>`do1` |string|True|OS version of user's device|
    |sub_account_id<br>`sa` |string|True|sub account id|
    |trading_address<br>`ta` |string|True|trading session key|
    |screen_size<br>`ss` |string|True|screen size|
    |event_data<br>`ed` |string|True|event data|
    |user_id<br>`ui` |string|True|user id|
    |account_id<br>`ai` |string|True|account id|
    |auth_session_hash<br>`as` |string|True|auth session hash of the authenticated session on backend|
    |country_code<br>`cc` |string|True|country code of user based on IP address|
