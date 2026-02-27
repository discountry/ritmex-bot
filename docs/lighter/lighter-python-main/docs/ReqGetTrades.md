# ReqGetTrades


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  | [optional] 
**market_id** | **int** |  | [optional] 
**account_index** | **int** |  | [optional] [default to -1]
**order_index** | **int** |  | [optional] 
**sort_by** | **str** |  | 
**sort_dir** | **str** |  | [optional] [default to 'desc']
**cursor** | **str** |  | [optional] 
**var_from** | **int** |  | [optional] [default to -1]
**ask_filter** | **int** |  | [optional] 
**role** | **str** |  | [optional] [default to 'all']
**type** | **str** |  | [optional] [default to 'all']
**limit** | **int** |  | 
**aggregate** | **bool** |  | [optional] [default to False]

## Example

```python
from lighter.models.req_get_trades import ReqGetTrades

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetTrades from a JSON string
req_get_trades_instance = ReqGetTrades.from_json(json)
# print the JSON string representation of the object
print(ReqGetTrades.to_json())

# convert the object into a dict
req_get_trades_dict = req_get_trades_instance.to_dict()
# create an instance of ReqGetTrades from a dict
req_get_trades_from_dict = ReqGetTrades.from_dict(req_get_trades_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


