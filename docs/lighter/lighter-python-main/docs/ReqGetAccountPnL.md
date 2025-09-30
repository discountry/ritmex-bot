# ReqGetAccountPnL


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  | [optional] 
**by** | **str** |  | 
**value** | **str** |  | 
**resolution** | **str** |  | 
**start_timestamp** | **int** |  | 
**end_timestamp** | **int** |  | 
**count_back** | **int** |  | 
**ignore_transfers** | **bool** |  | [optional] [default to False]

## Example

```python
from lighter.models.req_get_account_pn_l import ReqGetAccountPnL

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountPnL from a JSON string
req_get_account_pn_l_instance = ReqGetAccountPnL.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountPnL.to_json())

# convert the object into a dict
req_get_account_pn_l_dict = req_get_account_pn_l_instance.to_dict()
# create an instance of ReqGetAccountPnL from a dict
req_get_account_pn_l_from_dict = ReqGetAccountPnL.from_dict(req_get_account_pn_l_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


