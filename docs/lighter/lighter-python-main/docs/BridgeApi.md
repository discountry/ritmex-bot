# lighter.BridgeApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bridges**](BridgeApi.md#bridges) | **GET** /api/v1/bridges | bridges
[**bridges_is_next_bridge_fast**](BridgeApi.md#bridges_is_next_bridge_fast) | **GET** /api/v1/bridges/isNextBridgeFast | bridges_isNextBridgeFast
[**fastbridge_info**](BridgeApi.md#fastbridge_info) | **GET** /api/v1/fastbridge/info | fastbridge_info


# **bridges**
> RespGetBridgesByL1Addr bridges(l1_address)

bridges

Get bridges for given l1 address

### Example


```python
import lighter
from lighter.models.resp_get_bridges_by_l1_addr import RespGetBridgesByL1Addr
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
    api_instance = lighter.BridgeApi(api_client)
    l1_address = 'l1_address_example' # str | 

    try:
        # bridges
        api_response = await api_instance.bridges(l1_address)
        print("The response of BridgeApi->bridges:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BridgeApi->bridges: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **l1_address** | **str**|  | 

### Return type

[**RespGetBridgesByL1Addr**](RespGetBridgesByL1Addr.md)

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

# **bridges_is_next_bridge_fast**
> RespGetIsNextBridgeFast bridges_is_next_bridge_fast(l1_address)

bridges_isNextBridgeFast

Get if next bridge is fast

### Example


```python
import lighter
from lighter.models.resp_get_is_next_bridge_fast import RespGetIsNextBridgeFast
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
    api_instance = lighter.BridgeApi(api_client)
    l1_address = 'l1_address_example' # str | 

    try:
        # bridges_isNextBridgeFast
        api_response = await api_instance.bridges_is_next_bridge_fast(l1_address)
        print("The response of BridgeApi->bridges_is_next_bridge_fast:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BridgeApi->bridges_is_next_bridge_fast: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **l1_address** | **str**|  | 

### Return type

[**RespGetIsNextBridgeFast**](RespGetIsNextBridgeFast.md)

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

# **fastbridge_info**
> RespGetFastBridgeInfo fastbridge_info()

fastbridge_info

Get fast bridge info

### Example


```python
import lighter
from lighter.models.resp_get_fast_bridge_info import RespGetFastBridgeInfo
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
    api_instance = lighter.BridgeApi(api_client)

    try:
        # fastbridge_info
        api_response = await api_instance.fastbridge_info()
        print("The response of BridgeApi->fastbridge_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BridgeApi->fastbridge_info: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**RespGetFastBridgeInfo**](RespGetFastBridgeInfo.md)

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

