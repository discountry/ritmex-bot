# lighter.ReferralApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**referral_kickback_update**](ReferralApi.md#referral_kickback_update) | **POST** /api/v1/referral/kickback/update | referral_kickback_update
[**referral_points**](ReferralApi.md#referral_points) | **GET** /api/v1/referral/points | referral_points
[**referral_update**](ReferralApi.md#referral_update) | **POST** /api/v1/referral/update | referral_update


# **referral_kickback_update**
> RespUpdateKickback referral_kickback_update(account_index, kickback_percentage, authorization=authorization, auth=auth)

referral_kickback_update

Update kickback percentage for referral rewards

### Example


```python
import lighter
from lighter.models.resp_update_kickback import RespUpdateKickback
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
    api_instance = lighter.ReferralApi(api_client)
    account_index = 56 # int | 
    kickback_percentage = 3.4 # float | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # referral_kickback_update
        api_response = await api_instance.referral_kickback_update(account_index, kickback_percentage, authorization=authorization, auth=auth)
        print("The response of ReferralApi->referral_kickback_update:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ReferralApi->referral_kickback_update: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **kickback_percentage** | **float**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**RespUpdateKickback**](RespUpdateKickback.md)

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

# **referral_points**
> ReferralPoints referral_points(account_index, authorization=authorization, auth=auth)

referral_points

Get referral points

### Example


```python
import lighter
from lighter.models.referral_points import ReferralPoints
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
    api_instance = lighter.ReferralApi(api_client)
    account_index = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # referral_points
        api_response = await api_instance.referral_points(account_index, authorization=authorization, auth=auth)
        print("The response of ReferralApi->referral_points:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ReferralApi->referral_points: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**ReferralPoints**](ReferralPoints.md)

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

# **referral_update**
> RespUpdateReferralCode referral_update(account_index, new_referral_code, authorization=authorization, auth=auth)

referral_update

Update referral code (allowed once per account)

### Example


```python
import lighter
from lighter.models.resp_update_referral_code import RespUpdateReferralCode
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
    api_instance = lighter.ReferralApi(api_client)
    account_index = 56 # int | 
    new_referral_code = 'new_referral_code_example' # str | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # referral_update
        api_response = await api_instance.referral_update(account_index, new_referral_code, authorization=authorization, auth=auth)
        print("The response of ReferralApi->referral_update:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ReferralApi->referral_update: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **new_referral_code** | **str**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**RespUpdateReferralCode**](RespUpdateReferralCode.md)

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

