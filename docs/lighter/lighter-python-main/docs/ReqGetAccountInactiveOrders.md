# ReqGetAccountInactiveOrders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  made optional to support header auth clients | [optional] 
**account_index** | **int** |  | 
**market_id** | **int** |  | [optional] 
**ask_filter** | **int** |  | [optional] 
**between_timestamps** | **str** |  | [optional] 
**cursor** | **str** |  | [optional] 
**limit** | **int** |  | 

## Example

```python
from lighter.models.req_get_account_inactive_orders import ReqGetAccountInactiveOrders

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountInactiveOrders from a JSON string
req_get_account_inactive_orders_instance = ReqGetAccountInactiveOrders.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountInactiveOrders.to_json())

# convert the object into a dict
req_get_account_inactive_orders_dict = req_get_account_inactive_orders_instance.to_dict()
# create an instance of ReqGetAccountInactiveOrders from a dict
req_get_account_inactive_orders_from_dict = ReqGetAccountInactiveOrders.from_dict(req_get_account_inactive_orders_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


