# SubAccounts


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**l1_address** | **str** |  | 
**sub_accounts** | [**List[Account]**](Account.md) |  | 

## Example

```python
from lighter.models.sub_accounts import SubAccounts

# TODO update the JSON string below
json = "{}"
# create an instance of SubAccounts from a JSON string
sub_accounts_instance = SubAccounts.from_json(json)
# print the JSON string representation of the object
print(SubAccounts.to_json())

# convert the object into a dict
sub_accounts_dict = sub_accounts_instance.to_dict()
# create an instance of SubAccounts from a dict
sub_accounts_from_dict = SubAccounts.from_dict(sub_accounts_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


