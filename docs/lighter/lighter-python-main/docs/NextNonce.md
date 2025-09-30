# NextNonce


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**nonce** | **int** |  | 

## Example

```python
from lighter.models.next_nonce import NextNonce

# TODO update the JSON string below
json = "{}"
# create an instance of NextNonce from a JSON string
next_nonce_instance = NextNonce.from_json(json)
# print the JSON string representation of the object
print(NextNonce.to_json())

# convert the object into a dict
next_nonce_dict = next_nonce_instance.to_dict()
# create an instance of NextNonce from a dict
next_nonce_from_dict = NextNonce.from_dict(next_nonce_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


