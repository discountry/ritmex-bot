# lighter.AccountApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**account**](AccountApi.md#account) | **GET** /api/v1/account | account
[**account_limits**](AccountApi.md#account_limits) | **GET** /api/v1/accountLimits | accountLimits
[**account_metadata**](AccountApi.md#account_metadata) | **GET** /api/v1/accountMetadata | accountMetadata
[**accounts_by_l1_address**](AccountApi.md#accounts_by_l1_address) | **GET** /api/v1/accountsByL1Address | accountsByL1Address
[**apikeys**](AccountApi.md#apikeys) | **GET** /api/v1/apikeys | apikeys
[**change_account_tier**](AccountApi.md#change_account_tier) | **POST** /api/v1/changeAccountTier | changeAccountTier
[**l1_metadata**](AccountApi.md#l1_metadata) | **GET** /api/v1/l1Metadata | l1Metadata
[**liquidations**](AccountApi.md#liquidations) | **GET** /api/v1/liquidations | liquidations
[**pnl**](AccountApi.md#pnl) | **GET** /api/v1/pnl | pnl
[**position_funding**](AccountApi.md#position_funding) | **GET** /api/v1/positionFunding | positionFunding
[**public_pools_metadata**](AccountApi.md#public_pools_metadata) | **GET** /api/v1/publicPoolsMetadata | publicPoolsMetadata


# **account**
> DetailedAccounts account(by, value)

account

Get account by account's index. <br>More details about account index: [Account Index](https://apidocs.lighter.xyz/docs/account-index)<hr>**Response Description:**<br><br>1) **Status:** 1 is active 0 is inactive.<br>2) **Collateral:** The amount of collateral in the account.<hr>**Position Details Description:**<br>1) **OOC:** Open order count in that market.<br>2) **Sign:** 1 for Long, -1 for Short.<br>3) **Position:** The amount of position in that market.<br>4) **Avg Entry Price:** The average entry price of the position.<br>5) **Position Value:** The value of the position.<br>6) **Unrealized PnL:** The unrealized profit and loss of the position.<br>7) **Realized PnL:** The realized profit and loss of the position.

### Example


```python
import lighter
from lighter.models.detailed_accounts import DetailedAccounts
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    by = 'by_example' # str | 
    value = 'value_example' # str | 

    try:
        # account
        api_response = await api_instance.account(by, value)
        print("The response of AccountApi->account:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->account: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **by** | **str**|  | 
 **value** | **str**|  | 

### Return type

[**DetailedAccounts**](DetailedAccounts.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **account_limits**
> AccountLimits account_limits(account_index, authorization=authorization, auth=auth)

accountLimits

Get account limits

### Example


```python
import lighter
from lighter.models.account_limits import AccountLimits
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    account_index = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # accountLimits
        api_response = await api_instance.account_limits(account_index, authorization=authorization, auth=auth)
        print("The response of AccountApi->account_limits:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->account_limits: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**AccountLimits**](AccountLimits.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **account_metadata**
> AccountMetadatas account_metadata(by, value, authorization=authorization, auth=auth)

accountMetadata

Get account metadatas

### Example


```python
import lighter
from lighter.models.account_metadatas import AccountMetadatas
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    by = 'by_example' # str | 
    value = 'value_example' # str | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)

    try:
        # accountMetadata
        api_response = await api_instance.account_metadata(by, value, authorization=authorization, auth=auth)
        print("The response of AccountApi->account_metadata:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->account_metadata: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **by** | **str**|  | 
 **value** | **str**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 

### Return type

[**AccountMetadatas**](AccountMetadatas.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **accounts_by_l1_address**
> SubAccounts accounts_by_l1_address(l1_address)

accountsByL1Address

Get accounts by l1_address returns all accounts associated with the given L1 address

### Example


```python
import lighter
from lighter.models.sub_accounts import SubAccounts
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    l1_address = 'l1_address_example' # str | 

    try:
        # accountsByL1Address
        api_response = await api_instance.accounts_by_l1_address(l1_address)
        print("The response of AccountApi->accounts_by_l1_address:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->accounts_by_l1_address: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **l1_address** | **str**|  | 

### Return type

[**SubAccounts**](SubAccounts.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apikeys**
> AccountApiKeys apikeys(account_index, api_key_index=api_key_index)

apikeys

Get account api key. Set `api_key_index` to 255 to retrieve all api keys associated with the account.

### Example


```python
import lighter
from lighter.models.account_api_keys import AccountApiKeys
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    account_index = 56 # int | 
    api_key_index = 255 # int |  (optional) (default to 255)

    try:
        # apikeys
        api_response = await api_instance.apikeys(account_index, api_key_index=api_key_index)
        print("The response of AccountApi->apikeys:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->apikeys: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **api_key_index** | **int**|  | [optional] [default to 255]

### Return type

[**AccountApiKeys**](AccountApiKeys.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **change_account_tier**
> RespChangeAccountTier change_account_tier(account_index, new_tier, authorization=authorization, auth=auth)

changeAccountTier

Change account tier

### Example


```python
import lighter
from lighter.models.resp_change_account_tier import RespChangeAccountTier
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    account_index = 56 # int | 
    new_tier = 'new_tier_example' # str | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # changeAccountTier
        api_response = await api_instance.change_account_tier(account_index, new_tier, authorization=authorization, auth=auth)
        print("The response of AccountApi->change_account_tier:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->change_account_tier: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **new_tier** | **str**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**RespChangeAccountTier**](RespChangeAccountTier.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **l1_metadata**
> L1Metadata l1_metadata(l1_address, authorization=authorization, auth=auth)

l1Metadata

Get L1 metadata

### Example


```python
import lighter
from lighter.models.l1_metadata import L1Metadata
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    l1_address = 'l1_address_example' # str | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # l1Metadata
        api_response = await api_instance.l1_metadata(l1_address, authorization=authorization, auth=auth)
        print("The response of AccountApi->l1_metadata:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->l1_metadata: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **l1_address** | **str**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**L1Metadata**](L1Metadata.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **liquidations**
> LiquidationInfos liquidations(account_index, limit, authorization=authorization, auth=auth, market_id=market_id, cursor=cursor)

liquidations

Get liquidation infos

### Example


```python
import lighter
from lighter.models.liquidation_infos import LiquidationInfos
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    account_index = 56 # int | 
    limit = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)
    market_id = 255 # int |  (optional) (default to 255)
    cursor = 'cursor_example' # str |  (optional)

    try:
        # liquidations
        api_response = await api_instance.liquidations(account_index, limit, authorization=authorization, auth=auth, market_id=market_id, cursor=cursor)
        print("The response of AccountApi->liquidations:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->liquidations: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **limit** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 
 **market_id** | **int**|  | [optional] [default to 255]
 **cursor** | **str**|  | [optional] 

### Return type

[**LiquidationInfos**](LiquidationInfos.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pnl**
> AccountPnL pnl(by, value, resolution, start_timestamp, end_timestamp, count_back, authorization=authorization, auth=auth, ignore_transfers=ignore_transfers)

pnl

Get account PnL chart

### Example


```python
import lighter
from lighter.models.account_pn_l import AccountPnL
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    by = 'by_example' # str | 
    value = 'value_example' # str | 
    resolution = 'resolution_example' # str | 
    start_timestamp = 56 # int | 
    end_timestamp = 56 # int | 
    count_back = 56 # int | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)
    ignore_transfers = False # bool |  (optional) (default to False)

    try:
        # pnl
        api_response = await api_instance.pnl(by, value, resolution, start_timestamp, end_timestamp, count_back, authorization=authorization, auth=auth, ignore_transfers=ignore_transfers)
        print("The response of AccountApi->pnl:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->pnl: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **by** | **str**|  | 
 **value** | **str**|  | 
 **resolution** | **str**|  | 
 **start_timestamp** | **int**|  | 
 **end_timestamp** | **int**|  | 
 **count_back** | **int**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 
 **ignore_transfers** | **bool**|  | [optional] [default to False]

### Return type

[**AccountPnL**](AccountPnL.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **position_funding**
> PositionFundings position_funding(account_index, limit, authorization=authorization, auth=auth, market_id=market_id, cursor=cursor, side=side)

positionFunding

Get accounts position fundings

### Example


```python
import lighter
from lighter.models.position_fundings import PositionFundings
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    account_index = 56 # int | 
    limit = 56 # int | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)
    market_id = 255 # int |  (optional) (default to 255)
    cursor = 'cursor_example' # str |  (optional)
    side = all # str |  (optional) (default to all)

    try:
        # positionFunding
        api_response = await api_instance.position_funding(account_index, limit, authorization=authorization, auth=auth, market_id=market_id, cursor=cursor, side=side)
        print("The response of AccountApi->position_funding:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->position_funding: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **limit** | **int**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 
 **market_id** | **int**|  | [optional] [default to 255]
 **cursor** | **str**|  | [optional] 
 **side** | **str**|  | [optional] [default to all]

### Return type

[**PositionFundings**](PositionFundings.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **public_pools_metadata**
> RespPublicPoolsMetadata public_pools_metadata(index, limit, authorization=authorization, auth=auth, filter=filter, account_index=account_index)

publicPoolsMetadata

Get public pools metadata

### Example


```python
import lighter
from lighter.models.resp_public_pools_metadata import RespPublicPoolsMetadata
from lighter.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://mainnet.zklighter.elliot.ai
# See configuration.py for a list of all supported configuration parameters.
configuration = lighter.Configuration(
    host = "https://mainnet.zklighter.elliot.ai"
)


# Enter a context with an instance of the API client
async with lighter.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = lighter.AccountApi(api_client)
    index = 56 # int | 
    limit = 56 # int | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)
    filter = 'filter_example' # str |  (optional)
    account_index = 56 # int |  (optional)

    try:
        # publicPoolsMetadata
        api_response = await api_instance.public_pools_metadata(index, limit, authorization=authorization, auth=auth, filter=filter, account_index=account_index)
        print("The response of AccountApi->public_pools_metadata:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AccountApi->public_pools_metadata: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index** | **int**|  | 
 **limit** | **int**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 
 **filter** | **str**|  | [optional] 
 **account_index** | **int**|  | [optional] 

### Return type

[**RespPublicPoolsMetadata**](RespPublicPoolsMetadata.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A successful response. |  -  |
**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

