# TransferHistoryItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**asset_id** | **int** |  | 
**amount** | **str** |  | 
**timestamp** | **int** |  | 
**type** | **str** |  | 
**from_l1_address** | **str** |  | 
**to_l1_address** | **str** |  | 
**from_account_index** | **int** |  | 
**to_account_index** | **int** |  | 
**from_route** | **str** |  | 
**to_route** | **str** |  | 
**tx_hash** | **str** |  | 

## Example

```python
from lighter.models.transfer_history_item import TransferHistoryItem

# TODO update the JSON string below
json = "{}"
# create an instance of TransferHistoryItem from a JSON string
transfer_history_item_instance = TransferHistoryItem.from_json(json)
# print the JSON string representation of the object
print(TransferHistoryItem.to_json())

# convert the object into a dict
transfer_history_item_dict = transfer_history_item_instance.to_dict()
# create an instance of TransferHistoryItem from a dict
transfer_history_item_from_dict = TransferHistoryItem.from_dict(transfer_history_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


