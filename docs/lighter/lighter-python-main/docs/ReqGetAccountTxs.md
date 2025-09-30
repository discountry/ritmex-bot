# ReqGetAccountTxs


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**index** | **int** |  | [optional] 
**limit** | **int** |  | [optional] 
**by** | **str** |  | [optional] 
**value** | **str** |  | [optional] 
**types** | **List[int]** |  | [optional] 
**auth** | **str** |  | [optional] 

## Example

```python
from lighter.models.req_get_account_txs import ReqGetAccountTxs

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountTxs from a JSON string
req_get_account_txs_instance = ReqGetAccountTxs.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountTxs.to_json())

# convert the object into a dict
req_get_account_txs_dict = req_get_account_txs_instance.to_dict()
# create an instance of ReqGetAccountTxs from a dict
req_get_account_txs_from_dict = ReqGetAccountTxs.from_dict(req_get_account_txs_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


