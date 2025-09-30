# ReqGetWithdrawHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**auth** | **str** |  made optional to support header auth clients | [optional] 
**cursor** | **str** |  | [optional] 
**filter** | **str** |  | [optional] 

## Example

```python
from lighter.models.req_get_withdraw_history import ReqGetWithdrawHistory

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetWithdrawHistory from a JSON string
req_get_withdraw_history_instance = ReqGetWithdrawHistory.from_json(json)
# print the JSON string representation of the object
print(ReqGetWithdrawHistory.to_json())

# convert the object into a dict
req_get_withdraw_history_dict = req_get_withdraw_history_instance.to_dict()
# create an instance of ReqGetWithdrawHistory from a dict
req_get_withdraw_history_from_dict = ReqGetWithdrawHistory.from_dict(req_get_withdraw_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


