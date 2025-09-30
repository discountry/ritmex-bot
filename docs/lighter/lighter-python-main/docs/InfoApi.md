# lighter.InfoApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**transfer_fee_info**](InfoApi.md#transfer_fee_info) | **GET** /api/v1/transferFeeInfo | transferFeeInfo
[**withdrawal_delay**](InfoApi.md#withdrawal_delay) | **GET** /api/v1/withdrawalDelay | withdrawalDelay


# **transfer_fee_info**
> TransferFeeInfo transfer_fee_info(account_index, authorization=authorization, auth=auth, to_account_index=to_account_index)

transferFeeInfo

Transfer fee info

### Example


```python
import lighter
from lighter.models.transfer_fee_info import TransferFeeInfo
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
    api_instance = lighter.InfoApi(api_client)
    account_index = 56 # int | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)
    to_account_index = -1 # int |  (optional) (default to -1)

    try:
        # transferFeeInfo
        api_response = await api_instance.transfer_fee_info(account_index, authorization=authorization, auth=auth, to_account_index=to_account_index)
        print("The response of InfoApi->transfer_fee_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InfoApi->transfer_fee_info: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 
 **to_account_index** | **int**|  | [optional] [default to -1]

### Return type

[**TransferFeeInfo**](TransferFeeInfo.md)

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

# **withdrawal_delay**
> RespWithdrawalDelay withdrawal_delay()

withdrawalDelay

Withdrawal delay in seconds

### Example


```python
import lighter
from lighter.models.resp_withdrawal_delay import RespWithdrawalDelay
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
    api_instance = lighter.InfoApi(api_client)

    try:
        # withdrawalDelay
        api_response = await api_instance.withdrawal_delay()
        print("The response of InfoApi->withdrawal_delay:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InfoApi->withdrawal_delay: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**RespWithdrawalDelay**](RespWithdrawalDelay.md)

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

