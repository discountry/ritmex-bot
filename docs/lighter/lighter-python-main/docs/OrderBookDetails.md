# OrderBookDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**order_book_details** | [**List[PerpsOrderBookDetail]**](PerpsOrderBookDetail.md) |  | 
**spot_order_book_details** | [**List[SpotOrderBookDetail]**](SpotOrderBookDetail.md) |  | 

## Example

```python
from lighter.models.order_book_details import OrderBookDetails

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBookDetails from a JSON string
order_book_details_instance = OrderBookDetails.from_json(json)
# print the JSON string representation of the object
print(OrderBookDetails.to_json())

# convert the object into a dict
order_book_details_dict = order_book_details_instance.to_dict()
# create an instance of OrderBookDetails from a dict
order_book_details_from_dict = OrderBookDetails.from_dict(order_book_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


