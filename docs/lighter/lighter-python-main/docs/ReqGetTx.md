# ReqGetTx


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**by** | **str** |  | 
**value** | **str** |  | 

## Example

```python
from lighter.models.req_get_tx import ReqGetTx

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetTx from a JSON string
req_get_tx_instance = ReqGetTx.from_json(json)
# print the JSON string representation of the object
print(ReqGetTx.to_json())

# convert the object into a dict
req_get_tx_dict = req_get_tx_instance.to_dict()
# create an instance of ReqGetTx from a dict
req_get_tx_from_dict = ReqGetTx.from_dict(req_get_tx_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


