# ExchangeStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**total** | **int** |  | 
**order_book_stats** | [**List[OrderBookStats]**](OrderBookStats.md) |  | 
**daily_usd_volume** | **float** |  | 
**daily_trades_count** | **int** |  | 

## Example

```python
from lighter.models.exchange_stats import ExchangeStats

# TODO update the JSON string below
json = "{}"
# create an instance of ExchangeStats from a JSON string
exchange_stats_instance = ExchangeStats.from_json(json)
# print the JSON string representation of the object
print(ExchangeStats.to_json())

# convert the object into a dict
exchange_stats_dict = exchange_stats_instance.to_dict()
# create an instance of ExchangeStats from a dict
exchange_stats_from_dict = ExchangeStats.from_dict(exchange_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


