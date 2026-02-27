# OrderBookDepth


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**asks** | [**List[PriceLevel]**](PriceLevel.md) |  | 
**bids** | [**List[PriceLevel]**](PriceLevel.md) |  | 
**offset** | **int** |  | 
**nonce** | **int** |  | 

## Example

```python
from lighter.models.order_book_depth import OrderBookDepth

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBookDepth from a JSON string
order_book_depth_instance = OrderBookDepth.from_json(json)
# print the JSON string representation of the object
print(OrderBookDepth.to_json())

# convert the object into a dict
order_book_depth_dict = order_book_depth_instance.to_dict()
# create an instance of OrderBookDepth from a dict
order_book_depth_from_dict = OrderBookDepth.from_dict(order_book_depth_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


