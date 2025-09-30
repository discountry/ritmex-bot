# TxHash


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**tx_hash** | **str** |  | 

## Example

```python
from lighter.models.tx_hash import TxHash

# TODO update the JSON string below
json = "{}"
# create an instance of TxHash from a JSON string
tx_hash_instance = TxHash.from_json(json)
# print the JSON string representation of the object
print(TxHash.to_json())

# convert the object into a dict
tx_hash_dict = tx_hash_instance.to_dict()
# create an instance of TxHash from a dict
tx_hash_from_dict = TxHash.from_dict(tx_hash_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


