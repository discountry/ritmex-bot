# TransferHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**transfers** | [**List[TransferHistoryItem]**](TransferHistoryItem.md) |  | 
**cursor** | **str** |  | 

## Example

```python
from lighter.models.transfer_history import TransferHistory

# TODO update the JSON string below
json = "{}"
# create an instance of TransferHistory from a JSON string
transfer_history_instance = TransferHistory.from_json(json)
# print the JSON string representation of the object
print(TransferHistory.to_json())

# convert the object into a dict
transfer_history_dict = transfer_history_instance.to_dict()
# create an instance of TransferHistory from a dict
transfer_history_from_dict = TransferHistory.from_dict(transfer_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


