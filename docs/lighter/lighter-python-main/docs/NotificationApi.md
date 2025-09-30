# lighter.NotificationApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**notification_ack**](NotificationApi.md#notification_ack) | **POST** /api/v1/notification/ack | notification_ack


# **notification_ack**
> ResultCode notification_ack(notif_id, account_index, authorization=authorization, auth=auth)

notification_ack

Ack notification

### Example


```python
import lighter
from lighter.models.result_code import ResultCode
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
    api_instance = lighter.NotificationApi(api_client)
    notif_id = 'notif_id_example' # str | 
    account_index = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # notification_ack
        api_response = await api_instance.notification_ack(notif_id, account_index, authorization=authorization, auth=auth)
        print("The response of NotificationApi->notification_ack:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling NotificationApi->notification_ack: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notif_id** | **str**|  | 
 **account_index** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**ResultCode**](ResultCode.md)

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

