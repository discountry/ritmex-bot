# ReqGetAccountActiveOrders


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**market_id** | **int** |  | 
**auth** | **str** |  made optional to support header auth clients | [optional] 

## Example

```python
from lighter.models.req_get_account_active_orders import ReqGetAccountActiveOrders

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountActiveOrders from a JSON string
req_get_account_active_orders_instance = ReqGetAccountActiveOrders.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountActiveOrders.to_json())

# convert the object into a dict
req_get_account_active_orders_dict = req_get_account_active_orders_instance.to_dict()
# create an instance of ReqGetAccountActiveOrders from a dict
req_get_account_active_orders_from_dict = ReqGetAccountActiveOrders.from_dict(req_get_account_active_orders_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


