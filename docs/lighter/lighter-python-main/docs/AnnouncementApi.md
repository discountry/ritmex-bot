# lighter.AnnouncementApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**announcement**](AnnouncementApi.md#announcement) | **GET** /api/v1/announcement | announcement


# **announcement**
> Announcements announcement()

announcement

Get announcement

### Example


```python
import lighter
from lighter.models.announcements import Announcements
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
    api_instance = lighter.AnnouncementApi(api_client)

    try:
        # announcement
        api_response = await api_instance.announcement()
        print("The response of AnnouncementApi->announcement:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AnnouncementApi->announcement: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**Announcements**](Announcements.md)

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

