# lighter.RootApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**info**](RootApi.md#info) | **GET** /info | info
[**status**](RootApi.md#status) | **GET** / | status


# **info**
> ZkLighterInfo info()

info

Get info of zklighter

### Example


```python
import lighter
from lighter.models.zk_lighter_info import ZkLighterInfo
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
    api_instance = lighter.RootApi(api_client)

    try:
        # info
        api_response = await api_instance.info()
        print("The response of RootApi->info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RootApi->info: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**ZkLighterInfo**](ZkLighterInfo.md)

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

# **status**
> Status status()

status

Get status of zklighter

### Example


```python
import lighter
from lighter.models.status import Status
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
    api_instance = lighter.RootApi(api_client)

    try:
        # status
        api_response = await api_instance.status()
        print("The response of RootApi->status:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RootApi->status: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**Status**](Status.md)

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

