# lighter.BlockApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**block**](BlockApi.md#block) | **GET** /api/v1/block | block
[**blocks**](BlockApi.md#blocks) | **GET** /api/v1/blocks | blocks
[**current_height**](BlockApi.md#current_height) | **GET** /api/v1/currentHeight | currentHeight


# **block**
> Blocks block(by, value)

block

Get block by its height or commitment

### Example


```python
import lighter
from lighter.models.blocks import Blocks
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
    api_instance = lighter.BlockApi(api_client)
    by = 'by_example' # str | 
    value = 'value_example' # str | 

    try:
        # block
        api_response = await api_instance.block(by, value)
        print("The response of BlockApi->block:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BlockApi->block: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **by** | **str**|  | 
 **value** | **str**|  | 

### Return type

[**Blocks**](Blocks.md)

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

# **blocks**
> Blocks blocks(limit, index=index, sort=sort)

blocks

Get blocks

### Example


```python
import lighter
from lighter.models.blocks import Blocks
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
    api_instance = lighter.BlockApi(api_client)
    limit = 56 # int | 
    index = 56 # int |  (optional)
    sort = asc # str |  (optional) (default to asc)

    try:
        # blocks
        api_response = await api_instance.blocks(limit, index=index, sort=sort)
        print("The response of BlockApi->blocks:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BlockApi->blocks: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int**|  | 
 **index** | **int**|  | [optional] 
 **sort** | **str**|  | [optional] [default to asc]

### Return type

[**Blocks**](Blocks.md)

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

# **current_height**
> CurrentHeight current_height()

currentHeight

Get current height

### Example


```python
import lighter
from lighter.models.current_height import CurrentHeight
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
    api_instance = lighter.BlockApi(api_client)

    try:
        # currentHeight
        api_response = await api_instance.current_height()
        print("The response of BlockApi->current_height:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BlockApi->current_height: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**CurrentHeight**](CurrentHeight.md)

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

