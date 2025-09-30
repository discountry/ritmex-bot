# TxHashes


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**tx_hash** | **List[str]** |  | 

## Example

```python
from lighter.models.tx_hashes import TxHashes

# TODO update the JSON string below
json = "{}"
# create an instance of TxHashes from a JSON string
tx_hashes_instance = TxHashes.from_json(json)
# print the JSON string representation of the object
print(TxHashes.to_json())

# convert the object into a dict
tx_hashes_dict = tx_hashes_instance.to_dict()
# create an instance of TxHashes from a dict
tx_hashes_from_dict = TxHashes.from_dict(tx_hashes_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


