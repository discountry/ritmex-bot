# ReqGetDepositHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**auth** | **str** |  made optional to support header auth clients | [optional] 
**l1_address** | **str** |  | 
**cursor** | **str** |  | [optional] 
**filter** | **str** |  | [optional] 

## Example

```python
from lighter.models.req_get_deposit_history import ReqGetDepositHistory

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetDepositHistory from a JSON string
req_get_deposit_history_instance = ReqGetDepositHistory.from_json(json)
# print the JSON string representation of the object
print(ReqGetDepositHistory.to_json())

# convert the object into a dict
req_get_deposit_history_dict = req_get_deposit_history_instance.to_dict()
# create an instance of ReqGetDepositHistory from a dict
req_get_deposit_history_from_dict = ReqGetDepositHistory.from_dict(req_get_deposit_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


