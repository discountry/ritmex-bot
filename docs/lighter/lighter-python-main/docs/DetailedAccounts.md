# DetailedAccounts


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**total** | **int** |  | 
**accounts** | [**List[DetailedAccount]**](DetailedAccount.md) |  | 

## Example

```python
from lighter.models.detailed_accounts import DetailedAccounts

# TODO update the JSON string below
json = "{}"
# create an instance of DetailedAccounts from a JSON string
detailed_accounts_instance = DetailedAccounts.from_json(json)
# print the JSON string representation of the object
print(DetailedAccounts.to_json())

# convert the object into a dict
detailed_accounts_dict = detailed_accounts_instance.to_dict()
# create an instance of DetailedAccounts from a dict
detailed_accounts_from_dict = DetailedAccounts.from_dict(detailed_accounts_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


