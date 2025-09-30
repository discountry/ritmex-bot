# AccountApiKeys


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**api_keys** | [**List[ApiKey]**](ApiKey.md) |  | 

## Example

```python
from lighter.models.account_api_keys import AccountApiKeys

# TODO update the JSON string below
json = "{}"
# create an instance of AccountApiKeys from a JSON string
account_api_keys_instance = AccountApiKeys.from_json(json)
# print the JSON string representation of the object
print(AccountApiKeys.to_json())

# convert the object into a dict
account_api_keys_dict = account_api_keys_instance.to_dict()
# create an instance of AccountApiKeys from a dict
account_api_keys_from_dict = AccountApiKeys.from_dict(account_api_keys_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


