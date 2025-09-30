# lighter.OrderApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**account_active_orders**](OrderApi.md#account_active_orders) | **GET** /api/v1/accountActiveOrders | accountActiveOrders
[**account_inactive_orders**](OrderApi.md#account_inactive_orders) | **GET** /api/v1/accountInactiveOrders | accountInactiveOrders
[**exchange_stats**](OrderApi.md#exchange_stats) | **GET** /api/v1/exchangeStats | exchangeStats
[**export**](OrderApi.md#export) | **GET** /api/v1/export | export
[**order_book_details**](OrderApi.md#order_book_details) | **GET** /api/v1/orderBookDetails | orderBookDetails
[**order_book_orders**](OrderApi.md#order_book_orders) | **GET** /api/v1/orderBookOrders | orderBookOrders
[**order_books**](OrderApi.md#order_books) | **GET** /api/v1/orderBooks | orderBooks
[**recent_trades**](OrderApi.md#recent_trades) | **GET** /api/v1/recentTrades | recentTrades
[**trades**](OrderApi.md#trades) | **GET** /api/v1/trades | trades


# **account_active_orders**
> Orders account_active_orders(account_index, market_id, authorization=authorization, auth=auth)

accountActiveOrders

Get account active orders. `auth` can be generated using the SDK.

### Example


```python
import lighter
from lighter.models.orders import Orders
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
    api_instance = lighter.OrderApi(api_client)
    account_index = 56 # int | 
    market_id = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)

    try:
        # accountActiveOrders
        api_response = await api_instance.account_active_orders(account_index, market_id, authorization=authorization, auth=auth)
        print("The response of OrderApi->account_active_orders:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->account_active_orders: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **market_id** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 

### Return type

[**Orders**](Orders.md)

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

# **account_inactive_orders**
> Orders account_inactive_orders(account_index, limit, authorization=authorization, auth=auth, market_id=market_id, ask_filter=ask_filter, between_timestamps=between_timestamps, cursor=cursor)

accountInactiveOrders

Get account inactive orders

### Example


```python
import lighter
from lighter.models.orders import Orders
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
    api_instance = lighter.OrderApi(api_client)
    account_index = 56 # int | 
    limit = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)
    market_id = 255 # int |  (optional) (default to 255)
    ask_filter = -1 # int |  (optional) (default to -1)
    between_timestamps = 'between_timestamps_example' # str |  (optional)
    cursor = 'cursor_example' # str |  (optional)

    try:
        # accountInactiveOrders
        api_response = await api_instance.account_inactive_orders(account_index, limit, authorization=authorization, auth=auth, market_id=market_id, ask_filter=ask_filter, between_timestamps=between_timestamps, cursor=cursor)
        print("The response of OrderApi->account_inactive_orders:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->account_inactive_orders: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **limit** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 
 **market_id** | **int**|  | [optional] [default to 255]
 **ask_filter** | **int**|  | [optional] [default to -1]
 **between_timestamps** | **str**|  | [optional] 
 **cursor** | **str**|  | [optional] 

### Return type

[**Orders**](Orders.md)

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

# **exchange_stats**
> ExchangeStats exchange_stats()

exchangeStats

Get exchange stats

### Example


```python
import lighter
from lighter.models.exchange_stats import ExchangeStats
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
    api_instance = lighter.OrderApi(api_client)

    try:
        # exchangeStats
        api_response = await api_instance.exchange_stats()
        print("The response of OrderApi->exchange_stats:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->exchange_stats: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**ExchangeStats**](ExchangeStats.md)

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

# **export**
> ExportData export(type, authorization=authorization, auth=auth, account_index=account_index, market_id=market_id)

export

Export data

### Example


```python
import lighter
from lighter.models.export_data import ExportData
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
    api_instance = lighter.OrderApi(api_client)
    type = 'type_example' # str | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)
    account_index = -1 # int |  (optional) (default to -1)
    market_id = 255 # int |  (optional) (default to 255)

    try:
        # export
        api_response = await api_instance.export(type, authorization=authorization, auth=auth, account_index=account_index, market_id=market_id)
        print("The response of OrderApi->export:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->export: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **str**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 
 **account_index** | **int**|  | [optional] [default to -1]
 **market_id** | **int**|  | [optional] [default to 255]

### Return type

[**ExportData**](ExportData.md)

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

# **order_book_details**
> OrderBookDetails order_book_details(market_id=market_id)

orderBookDetails

Get order books metadata

### Example


```python
import lighter
from lighter.models.order_book_details import OrderBookDetails
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
    api_instance = lighter.OrderApi(api_client)
    market_id = 255 # int |  (optional) (default to 255)

    try:
        # orderBookDetails
        api_response = await api_instance.order_book_details(market_id=market_id)
        print("The response of OrderApi->order_book_details:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->order_book_details: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **market_id** | **int**|  | [optional] [default to 255]

### Return type

[**OrderBookDetails**](OrderBookDetails.md)

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

# **order_book_orders**
> OrderBookOrders order_book_orders(market_id, limit)

orderBookOrders

Get order book orders

### Example


```python
import lighter
from lighter.models.order_book_orders import OrderBookOrders
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
    api_instance = lighter.OrderApi(api_client)
    market_id = 56 # int | 
    limit = 56 # int | 

    try:
        # orderBookOrders
        api_response = await api_instance.order_book_orders(market_id, limit)
        print("The response of OrderApi->order_book_orders:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->order_book_orders: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **market_id** | **int**|  | 
 **limit** | **int**|  | 

### Return type

[**OrderBookOrders**](OrderBookOrders.md)

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

# **order_books**
> OrderBooks order_books(market_id=market_id)

orderBooks

Get order books metadata.<hr>**Response Description:**<br><br>1) **Taker and maker fees** are in percentage.<br>2) **Min base amount:** The amount of base token that can be traded in a single order.<br>3) **Min quote amount:** The amount of quote token that can be traded in a single order.<br>4) **Supported size decimals:** The number of decimal places that can be used for the size of the order.<br>5) **Supported price decimals:** The number of decimal places that can be used for the price of the order.<br>6) **Supported quote decimals:** Size Decimals + Quote Decimals.

### Example


```python
import lighter
from lighter.models.order_books import OrderBooks
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
    api_instance = lighter.OrderApi(api_client)
    market_id = 255 # int |  (optional) (default to 255)

    try:
        # orderBooks
        api_response = await api_instance.order_books(market_id=market_id)
        print("The response of OrderApi->order_books:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->order_books: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **market_id** | **int**|  | [optional] [default to 255]

### Return type

[**OrderBooks**](OrderBooks.md)

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

# **recent_trades**
> Trades recent_trades(market_id, limit)

recentTrades

Get recent trades

### Example


```python
import lighter
from lighter.models.trades import Trades
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
    api_instance = lighter.OrderApi(api_client)
    market_id = 56 # int | 
    limit = 56 # int | 

    try:
        # recentTrades
        api_response = await api_instance.recent_trades(market_id, limit)
        print("The response of OrderApi->recent_trades:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->recent_trades: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **market_id** | **int**|  | 
 **limit** | **int**|  | 

### Return type

[**Trades**](Trades.md)

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

# **trades**
> Trades trades(sort_by, limit, authorization=authorization, auth=auth, market_id=market_id, account_index=account_index, order_index=order_index, sort_dir=sort_dir, cursor=cursor, var_from=var_from, ask_filter=ask_filter)

trades

Get trades

### Example


```python
import lighter
from lighter.models.trades import Trades
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
    api_instance = lighter.OrderApi(api_client)
    sort_by = 'sort_by_example' # str | 
    limit = 56 # int | 
    authorization = 'authorization_example' # str |  (optional)
    auth = 'auth_example' # str |  (optional)
    market_id = 255 # int |  (optional) (default to 255)
    account_index = -1 # int |  (optional) (default to -1)
    order_index = 56 # int |  (optional)
    sort_dir = desc # str |  (optional) (default to desc)
    cursor = 'cursor_example' # str |  (optional)
    var_from = -1 # int |  (optional) (default to -1)
    ask_filter = -1 # int |  (optional) (default to -1)

    try:
        # trades
        api_response = await api_instance.trades(sort_by, limit, authorization=authorization, auth=auth, market_id=market_id, account_index=account_index, order_index=order_index, sort_dir=sort_dir, cursor=cursor, var_from=var_from, ask_filter=ask_filter)
        print("The response of OrderApi->trades:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrderApi->trades: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sort_by** | **str**|  | 
 **limit** | **int**|  | 
 **authorization** | **str**|  | [optional] 
 **auth** | **str**|  | [optional] 
 **market_id** | **int**|  | [optional] [default to 255]
 **account_index** | **int**|  | [optional] [default to -1]
 **order_index** | **int**|  | [optional] 
 **sort_dir** | **str**|  | [optional] [default to desc]
 **cursor** | **str**|  | [optional] 
 **var_from** | **int**|  | [optional] [default to -1]
 **ask_filter** | **int**|  | [optional] [default to -1]

### Return type

[**Trades**](Trades.md)

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

