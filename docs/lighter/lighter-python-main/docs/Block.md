# Block


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**commitment** | **str** |  | 
**height** | **int** |  | 
**state_root** | **str** |  | 
**priority_operations** | **int** |  | 
**on_chain_l2_operations** | **int** |  | 
**pending_on_chain_operations_pub_data** | **str** |  | 
**committed_tx_hash** | **str** |  | 
**committed_at** | **int** |  | 
**verified_tx_hash** | **str** |  | 
**verified_at** | **int** |  | 
**txs** | [**List[Tx]**](Tx.md) |  | 
**status** | **int** |  | 
**size** | **int** |  | 

## Example

```python
from lighter.models.block import Block

# TODO update the JSON string below
json = "{}"
# create an instance of Block from a JSON string
block_instance = Block.from_json(json)
# print the JSON string representation of the object
print(Block.to_json())

# convert the object into a dict
block_dict = block_instance.to_dict()
# create an instance of Block from a dict
block_from_dict = Block.from_dict(block_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


