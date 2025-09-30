# SimpleOrder


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**order_index** | **int** |  | 
**order_id** | **str** |  | 
**owner_account_index** | **int** |  | 
**initial_base_amount** | **str** |  | 
**remaining_base_amount** | **str** |  | 
**price** | **str** |  | 
**order_expiry** | **int** |  | 

## Example

```python
from lighter.models.simple_order import SimpleOrder

# TODO update the JSON string below
json = "{}"
# create an instance of SimpleOrder from a JSON string
simple_order_instance = SimpleOrder.from_json(json)
# print the JSON string representation of the object
print(SimpleOrder.to_json())

# convert the object into a dict
simple_order_dict = simple_order_instance.to_dict()
# create an instance of SimpleOrder from a dict
simple_order_from_dict = SimpleOrder.from_dict(simple_order_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


