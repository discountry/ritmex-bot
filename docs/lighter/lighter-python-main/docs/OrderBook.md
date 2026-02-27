# OrderBook


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**market_id** | **int** |  | 
**market_type** | **str** |  | 
**base_asset_id** | **int** |  | 
**quote_asset_id** | **int** |  | 
**status** | **str** |  | 
**taker_fee** | **str** |  | 
**maker_fee** | **str** |  | 
**liquidation_fee** | **str** |  | 
**min_base_amount** | **str** |  | 
**min_quote_amount** | **str** |  | 
**order_quote_limit** | **str** |  | 
**supported_size_decimals** | **int** |  | 
**supported_price_decimals** | **int** |  | 
**supported_quote_decimals** | **int** |  | 

## Example

```python
from lighter.models.order_book import OrderBook

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBook from a JSON string
order_book_instance = OrderBook.from_json(json)
# print the JSON string representation of the object
print(OrderBook.to_json())

# convert the object into a dict
order_book_dict = order_book_instance.to_dict()
# create an instance of OrderBook from a dict
order_book_from_dict = OrderBook.from_dict(order_book_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


