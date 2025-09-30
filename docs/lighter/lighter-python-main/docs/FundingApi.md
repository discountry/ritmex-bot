# lighter.FundingApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**funding_rates**](FundingApi.md#funding_rates) | **GET** /api/v1/funding-rates | funding-rates


# **funding_rates**
> FundingRates funding_rates()

funding-rates

Get funding rates

### Example


```python
import lighter
from lighter.models.funding_rates import FundingRates
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
    api_instance = lighter.FundingApi(api_client)

    try:
        # funding-rates
        api_response = await api_instance.funding_rates()
        print("The response of FundingApi->funding_rates:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FundingApi->funding_rates: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**FundingRates**](FundingRates.md)

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

