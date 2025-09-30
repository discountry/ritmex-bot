# ReqGetBlockTxs


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**by** | **str** |  | 
**value** | **str** |  | 

## Example

```python
from lighter.models.req_get_block_txs import ReqGetBlockTxs

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetBlockTxs from a JSON string
req_get_block_txs_instance = ReqGetBlockTxs.from_json(json)
# print the JSON string representation of the object
print(ReqGetBlockTxs.to_json())

# convert the object into a dict
req_get_block_txs_dict = req_get_block_txs_instance.to_dict()
# create an instance of ReqGetBlockTxs from a dict
req_get_block_txs_from_dict = ReqGetBlockTxs.from_dict(req_get_block_txs_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


