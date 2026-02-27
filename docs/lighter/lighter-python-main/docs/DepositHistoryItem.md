# DepositHistoryItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**asset_id** | **int** |  | 
**amount** | **str** |  | 
**timestamp** | **int** |  | 
**status** | **str** |  | 
**l1_tx_hash** | **str** |  | 

## Example

```python
from lighter.models.deposit_history_item import DepositHistoryItem

# TODO update the JSON string below
json = "{}"
# create an instance of DepositHistoryItem from a JSON string
deposit_history_item_instance = DepositHistoryItem.from_json(json)
# print the JSON string representation of the object
print(DepositHistoryItem.to_json())

# convert the object into a dict
deposit_history_item_dict = deposit_history_item_instance.to_dict()
# create an instance of DepositHistoryItem from a dict
deposit_history_item_from_dict = DepositHistoryItem.from_dict(deposit_history_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


