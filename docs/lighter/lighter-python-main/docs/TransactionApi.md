# lighter.TransactionApi

All URIs are relative to *https://mainnet.zklighter.elliot.ai*

Method | HTTP request | Description
------------- | ------------- | -------------
[**account_txs**](TransactionApi.md#account_txs) | **GET** /api/v1/accountTxs | accountTxs
[**block_txs**](TransactionApi.md#block_txs) | **GET** /api/v1/blockTxs | blockTxs
[**deposit_history**](TransactionApi.md#deposit_history) | **GET** /api/v1/deposit/history | deposit_history
[**next_nonce**](TransactionApi.md#next_nonce) | **GET** /api/v1/nextNonce | nextNonce
[**send_tx**](TransactionApi.md#send_tx) | **POST** /api/v1/sendTx | sendTx
[**send_tx_batch**](TransactionApi.md#send_tx_batch) | **POST** /api/v1/sendTxBatch | sendTxBatch
[**transfer_history**](TransactionApi.md#transfer_history) | **GET** /api/v1/transfer/history | transfer_history
[**tx**](TransactionApi.md#tx) | **GET** /api/v1/tx | tx
[**tx_from_l1_tx_hash**](TransactionApi.md#tx_from_l1_tx_hash) | **GET** /api/v1/txFromL1TxHash | txFromL1TxHash
[**txs**](TransactionApi.md#txs) | **GET** /api/v1/txs | txs
[**withdraw_history**](TransactionApi.md#withdraw_history) | **GET** /api/v1/withdraw/history | withdraw_history


# **account_txs**
> Txs account_txs(limit, by, value, authorization=authorization, index=index, types=types, auth=auth)

accountTxs

Get transactions of a specific account

### Example


```python
import lighter
from lighter.models.txs import Txs
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
    api_instance = lighter.TransactionApi(api_client)
    limit = 56 # int | 
    by = 'by_example' # str | 
    value = 'value_example' # str | 
    authorization = 'authorization_example' # str |  (optional)
    index = 56 # int |  (optional)
    types = [56] # List[int] |  (optional)
    auth = 'auth_example' # str |  (optional)

    try:
        # accountTxs
        api_response = await api_instance.account_txs(limit, by, value, authorization=authorization, index=index, types=types, auth=auth)
        print("The response of TransactionApi->account_txs:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->account_txs: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int**|  | 
 **by** | **str**|  | 
 **value** | **str**|  | 
 **authorization** | **str**|  | [optional] 
 **index** | **int**|  | [optional] 
 **types** | [**List[int]**](int.md)|  | [optional] 
 **auth** | **str**|  | [optional] 

### Return type

[**Txs**](Txs.md)

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

# **block_txs**
> Txs block_txs(by, value)

blockTxs

Get transactions in a block

### Example


```python
import lighter
from lighter.models.txs import Txs
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
    api_instance = lighter.TransactionApi(api_client)
    by = 'by_example' # str | 
    value = 'value_example' # str | 

    try:
        # blockTxs
        api_response = await api_instance.block_txs(by, value)
        print("The response of TransactionApi->block_txs:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->block_txs: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **by** | **str**|  | 
 **value** | **str**|  | 

### Return type

[**Txs**](Txs.md)

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

# **deposit_history**
> DepositHistory deposit_history(account_index, l1_address, authorization=authorization, auth=auth, cursor=cursor, filter=filter)

deposit_history

Get deposit history

### Example


```python
import lighter
from lighter.models.deposit_history import DepositHistory
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
    api_instance = lighter.TransactionApi(api_client)
    account_index = 56 # int | 
    l1_address = 'l1_address_example' # str | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)
    cursor = 'cursor_example' # str |  (optional)
    filter = 'filter_example' # str |  (optional)

    try:
        # deposit_history
        api_response = await api_instance.deposit_history(account_index, l1_address, authorization=authorization, auth=auth, cursor=cursor, filter=filter)
        print("The response of TransactionApi->deposit_history:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->deposit_history: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **l1_address** | **str**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 
 **cursor** | **str**|  | [optional] 
 **filter** | **str**|  | [optional] 

### Return type

[**DepositHistory**](DepositHistory.md)

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

# **next_nonce**
> NextNonce next_nonce(account_index, api_key_index)

nextNonce

Get next nonce for a specific account and api key

### Example


```python
import lighter
from lighter.models.next_nonce import NextNonce
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
    api_instance = lighter.TransactionApi(api_client)
    account_index = 56 # int | 
    api_key_index = 56 # int | 

    try:
        # nextNonce
        api_response = await api_instance.next_nonce(account_index, api_key_index)
        print("The response of TransactionApi->next_nonce:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->next_nonce: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **api_key_index** | **int**|  | 

### Return type

[**NextNonce**](NextNonce.md)

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

# **send_tx**
> RespSendTx send_tx(tx_type, tx_info, price_protection=price_protection)

sendTx

You need to sign the transaction body before sending it to the server. More details can be found in the Get Started docs: [Get Started For Programmers](https://apidocs.lighter.xyz/docs/get-started-for-programmers)

### Example


```python
import lighter
from lighter.models.resp_send_tx import RespSendTx
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
    api_instance = lighter.TransactionApi(api_client)
    tx_type = 56 # int | 
    tx_info = 'tx_info_example' # str | 
    price_protection = True # bool |  (optional) (default to True)

    try:
        # sendTx
        api_response = await api_instance.send_tx(tx_type, tx_info, price_protection=price_protection)
        print("The response of TransactionApi->send_tx:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->send_tx: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tx_type** | **int**|  | 
 **tx_info** | **str**|  | 
 **price_protection** | **bool**|  | [optional] [default to True]

### Return type

[**RespSendTx**](RespSendTx.md)

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

# **send_tx_batch**
> RespSendTxBatch send_tx_batch(tx_types, tx_infos)

sendTxBatch

You need to sign the transaction body before sending it to the server. More details can be found in the Get Started docs: [Get Started For Programmers](https://apidocs.lighter.xyz/docs/get-started-for-programmers)

### Example


```python
import lighter
from lighter.models.resp_send_tx_batch import RespSendTxBatch
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
    api_instance = lighter.TransactionApi(api_client)
    tx_types = 'tx_types_example' # str | 
    tx_infos = 'tx_infos_example' # str | 

    try:
        # sendTxBatch
        api_response = await api_instance.send_tx_batch(tx_types, tx_infos)
        print("The response of TransactionApi->send_tx_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->send_tx_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tx_types** | **str**|  | 
 **tx_infos** | **str**|  | 

### Return type

[**RespSendTxBatch**](RespSendTxBatch.md)

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

# **transfer_history**
> TransferHistory transfer_history(account_index, authorization=authorization, auth=auth, cursor=cursor)

transfer_history

Get transfer history

### Example


```python
import lighter
from lighter.models.transfer_history import TransferHistory
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
    api_instance = lighter.TransactionApi(api_client)
    account_index = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)
    cursor = 'cursor_example' # str |  (optional)

    try:
        # transfer_history
        api_response = await api_instance.transfer_history(account_index, authorization=authorization, auth=auth, cursor=cursor)
        print("The response of TransactionApi->transfer_history:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->transfer_history: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 
 **cursor** | **str**|  | [optional] 

### Return type

[**TransferHistory**](TransferHistory.md)

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

# **tx**
> EnrichedTx tx(by, value)

tx

Get transaction by hash or sequence index

### Example


```python
import lighter
from lighter.models.enriched_tx import EnrichedTx
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
    api_instance = lighter.TransactionApi(api_client)
    by = 'by_example' # str | 
    value = 'value_example' # str | 

    try:
        # tx
        api_response = await api_instance.tx(by, value)
        print("The response of TransactionApi->tx:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->tx: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **by** | **str**|  | 
 **value** | **str**|  | 

### Return type

[**EnrichedTx**](EnrichedTx.md)

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

# **tx_from_l1_tx_hash**
> EnrichedTx tx_from_l1_tx_hash(hash)

txFromL1TxHash

Get L1 transaction by L1 transaction hash

### Example


```python
import lighter
from lighter.models.enriched_tx import EnrichedTx
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
    api_instance = lighter.TransactionApi(api_client)
    hash = 'hash_example' # str | 

    try:
        # txFromL1TxHash
        api_response = await api_instance.tx_from_l1_tx_hash(hash)
        print("The response of TransactionApi->tx_from_l1_tx_hash:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->tx_from_l1_tx_hash: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **hash** | **str**|  | 

### Return type

[**EnrichedTx**](EnrichedTx.md)

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

# **txs**
> Txs txs(limit, index=index)

txs

Get transactions which are already packed into blocks

### Example


```python
import lighter
from lighter.models.txs import Txs
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
    api_instance = lighter.TransactionApi(api_client)
    limit = 56 # int | 
    index = 56 # int |  (optional)

    try:
        # txs
        api_response = await api_instance.txs(limit, index=index)
        print("The response of TransactionApi->txs:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->txs: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int**|  | 
 **index** | **int**|  | [optional] 

### Return type

[**Txs**](Txs.md)

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

# **withdraw_history**
> WithdrawHistory withdraw_history(account_index, authorization=authorization, auth=auth, cursor=cursor, filter=filter)

withdraw_history

Get withdraw history

### Example


```python
import lighter
from lighter.models.withdraw_history import WithdrawHistory
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
    api_instance = lighter.TransactionApi(api_client)
    account_index = 56 # int | 
    authorization = 'authorization_example' # str |  make required after integ is done (optional)
    auth = 'auth_example' # str |  made optional to support header auth clients (optional)
    cursor = 'cursor_example' # str |  (optional)
    filter = 'filter_example' # str |  (optional)

    try:
        # withdraw_history
        api_response = await api_instance.withdraw_history(account_index, authorization=authorization, auth=auth, cursor=cursor, filter=filter)
        print("The response of TransactionApi->withdraw_history:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TransactionApi->withdraw_history: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account_index** | **int**|  | 
 **authorization** | **str**|  make required after integ is done | [optional] 
 **auth** | **str**|  made optional to support header auth clients | [optional] 
 **cursor** | **str**|  | [optional] 
 **filter** | **str**|  | [optional] 

### Return type

[**WithdrawHistory**](WithdrawHistory.md)

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

