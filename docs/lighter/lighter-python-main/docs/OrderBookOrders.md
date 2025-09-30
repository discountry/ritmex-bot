# OrderBookOrders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**total_asks** | **int** |  | 
**asks** | [**List[SimpleOrder]**](SimpleOrder.md) |  | 
**total_bids** | **int** |  | 
**bids** | [**List[SimpleOrder]**](SimpleOrder.md) |  | 

## Example

```python
from lighter.models.order_book_orders import OrderBookOrders

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBookOrders from a JSON string
order_book_orders_instance = OrderBookOrders.from_json(json)
# print the JSON string representation of the object
print(OrderBookOrders.to_json())

# convert the object into a dict
order_book_orders_dict = order_book_orders_instance.to_dict()
# create an instance of OrderBookOrders from a dict
order_book_orders_from_dict = OrderBookOrders.from_dict(order_book_orders_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


