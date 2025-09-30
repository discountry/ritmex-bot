# Txs


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**txs** | [**List[Tx]**](Tx.md) |  | 

## Example

```python
from lighter.models.txs import Txs

# TODO update the JSON string below
json = "{}"
# create an instance of Txs from a JSON string
txs_instance = Txs.from_json(json)
# print the JSON string representation of the object
print(Txs.to_json())

# convert the object into a dict
txs_dict = txs_instance.to_dict()
# create an instance of Txs from a dict
txs_from_dict = Txs.from_dict(txs_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


