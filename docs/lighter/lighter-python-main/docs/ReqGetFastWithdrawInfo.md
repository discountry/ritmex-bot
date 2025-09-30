# ReqGetFastWithdrawInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**auth** | **str** |  made optional to support header auth clients | [optional] 

## Example

```python
from lighter.models.req_get_fast_withdraw_info import ReqGetFastWithdrawInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetFastWithdrawInfo from a JSON string
req_get_fast_withdraw_info_instance = ReqGetFastWithdrawInfo.from_json(json)
# print the JSON string representation of the object
print(ReqGetFastWithdrawInfo.to_json())

# convert the object into a dict
req_get_fast_withdraw_info_dict = req_get_fast_withdraw_info_instance.to_dict()
# create an instance of ReqGetFastWithdrawInfo from a dict
req_get_fast_withdraw_info_from_dict = ReqGetFastWithdrawInfo.from_dict(req_get_fast_withdraw_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


