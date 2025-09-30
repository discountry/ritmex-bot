# DepositHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**deposits** | [**List[DepositHistoryItem]**](DepositHistoryItem.md) |  | 
**cursor** | **str** |  | 

## Example

```python
from lighter.models.deposit_history import DepositHistory

# TODO update the JSON string below
json = "{}"
# create an instance of DepositHistory from a JSON string
deposit_history_instance = DepositHistory.from_json(json)
# print the JSON string representation of the object
print(DepositHistory.to_json())

# convert the object into a dict
deposit_history_dict = deposit_history_instance.to_dict()
# create an instance of DepositHistory from a dict
deposit_history_from_dict = DepositHistory.from_dict(deposit_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


