# ReqGetRecentTrades


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**limit** | **int** |  | 

## Example

```python
from lighter.models.req_get_recent_trades import ReqGetRecentTrades

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetRecentTrades from a JSON string
req_get_recent_trades_instance = ReqGetRecentTrades.from_json(json)
# print the JSON string representation of the object
print(ReqGetRecentTrades.to_json())

# convert the object into a dict
req_get_recent_trades_dict = req_get_recent_trades_instance.to_dict()
# create an instance of ReqGetRecentTrades from a dict
req_get_recent_trades_from_dict = ReqGetRecentTrades.from_dict(req_get_recent_trades_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


