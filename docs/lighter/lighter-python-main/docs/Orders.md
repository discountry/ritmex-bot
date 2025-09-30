# Orders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**next_cursor** | **str** |  | [optional] 
**orders** | [**List[Order]**](Order.md) |  | 

## Example

```python
from lighter.models.orders import Orders

# TODO update the JSON string below
json = "{}"
# create an instance of Orders from a JSON string
orders_instance = Orders.from_json(json)
# print the JSON string representation of the object
print(Orders.to_json())

# convert the object into a dict
orders_dict = orders_instance.to_dict()
# create an instance of Orders from a dict
orders_from_dict = Orders.from_dict(orders_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


