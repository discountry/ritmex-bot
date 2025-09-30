# WithdrawHistory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**withdraws** | [**List[WithdrawHistoryItem]**](WithdrawHistoryItem.md) |  | 
**cursor** | **str** |  | 

## Example

```python
from lighter.models.withdraw_history import WithdrawHistory

# TODO update the JSON string below
json = "{}"
# create an instance of WithdrawHistory from a JSON string
withdraw_history_instance = WithdrawHistory.from_json(json)
# print the JSON string representation of the object
print(WithdrawHistory.to_json())

# convert the object into a dict
withdraw_history_dict = withdraw_history_instance.to_dict()
# create an instance of WithdrawHistory from a dict
withdraw_history_from_dict = WithdrawHistory.from_dict(withdraw_history_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


