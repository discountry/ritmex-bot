# WithdrawHistoryItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**asset_id** | **int** |  | 
**amount** | **str** |  | 
**timestamp** | **int** |  | 
**status** | **str** |  | 
**type** | **str** |  | 
**l1_tx_hash** | **str** |  | 

## Example

```python
from lighter.models.withdraw_history_item import WithdrawHistoryItem

# TODO update the JSON string below
json = "{}"
# create an instance of WithdrawHistoryItem from a JSON string
withdraw_history_item_instance = WithdrawHistoryItem.from_json(json)
# print the JSON string representation of the object
print(WithdrawHistoryItem.to_json())

# convert the object into a dict
withdraw_history_item_dict = withdraw_history_item_instance.to_dict()
# create an instance of WithdrawHistoryItem from a dict
withdraw_history_item_from_dict = WithdrawHistoryItem.from_dict(withdraw_history_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


