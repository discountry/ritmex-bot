# ReqGetNextNonce


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**api_key_index** | **int** |  | 

## Example

```python
from lighter.models.req_get_next_nonce import ReqGetNextNonce

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetNextNonce from a JSON string
req_get_next_nonce_instance = ReqGetNextNonce.from_json(json)
# print the JSON string representation of the object
print(ReqGetNextNonce.to_json())

# convert the object into a dict
req_get_next_nonce_dict = req_get_next_nonce_instance.to_dict()
# create an instance of ReqGetNextNonce from a dict
req_get_next_nonce_from_dict = ReqGetNextNonce.from_dict(req_get_next_nonce_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


