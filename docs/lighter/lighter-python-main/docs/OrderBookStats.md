# OrderBookStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**last_trade_price** | **float** |  | 
**daily_trades_count** | **int** |  | 
**daily_base_token_volume** | **float** |  | 
**daily_quote_token_volume** | **float** |  | 
**daily_price_change** | **float** |  | 

## Example

```python
from lighter.models.order_book_stats import OrderBookStats

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBookStats from a JSON string
order_book_stats_instance = OrderBookStats.from_json(json)
# print the JSON string representation of the object
print(OrderBookStats.to_json())

# convert the object into a dict
order_book_stats_dict = order_book_stats_instance.to_dict()
# create an instance of OrderBookStats from a dict
order_book_stats_from_dict = OrderBookStats.from_dict(order_book_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


