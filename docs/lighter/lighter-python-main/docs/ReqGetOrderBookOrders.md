# ReqGetOrderBookOrders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**limit** | **int** |  | 

## Example

```python
from lighter.models.req_get_order_book_orders import ReqGetOrderBookOrders

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetOrderBookOrders from a JSON string
req_get_order_book_orders_instance = ReqGetOrderBookOrders.from_json(json)
# print the JSON string representation of the object
print(ReqGetOrderBookOrders.to_json())

# convert the object into a dict
req_get_order_book_orders_dict = req_get_order_book_orders_instance.to_dict()
# create an instance of ReqGetOrderBookOrders from a dict
req_get_order_book_orders_from_dict = ReqGetOrderBookOrders.from_dict(req_get_order_book_orders_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


