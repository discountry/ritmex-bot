# ReqGetTransferHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**auth** | **str** |  made optional to support header auth clients | [optional] 
**cursor** | **str** |  | [optional] 

## Example

```python
from lighter.models.req_get_transfer_history import ReqGetTransferHistory

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetTransferHistory from a JSON string
req_get_transfer_history_instance = ReqGetTransferHistory.from_json(json)
# print the JSON string representation of the object
print(ReqGetTransferHistory.to_json())

# convert the object into a dict
req_get_transfer_history_dict = req_get_transfer_history_instance.to_dict()
# create an instance of ReqGetTransferHistory from a dict
req_get_transfer_history_from_dict = ReqGetTransferHistory.from_dict(req_get_transfer_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


