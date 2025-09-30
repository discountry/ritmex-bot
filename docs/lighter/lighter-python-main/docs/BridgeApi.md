# lighter.BridgeApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fastbridge_info**](BridgeApi.md#fastbridge_info) | **GET** /api/v1/fastbridge/info | fastbridge_info


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

