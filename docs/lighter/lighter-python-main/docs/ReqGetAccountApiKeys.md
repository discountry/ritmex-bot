# ReqGetAccountApiKeys


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**api_key_index** | **int** |  | [optional] 

## Example

```python
from lighter.models.req_get_account_api_keys import ReqGetAccountApiKeys

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountApiKeys from a JSON string
req_get_account_api_keys_instance = ReqGetAccountApiKeys.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountApiKeys.to_json())

# convert the object into a dict
req_get_account_api_keys_dict = req_get_account_api_keys_instance.to_dict()
# create an instance of ReqGetAccountApiKeys from a dict
req_get_account_api_keys_from_dict = ReqGetAccountApiKeys.from_dict(req_get_account_api_keys_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


