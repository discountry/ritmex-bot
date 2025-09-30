# AccountMetadatas


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**account_metadatas** | [**List[AccountMetadata]**](AccountMetadata.md) |  | 

## Example

```python
from lighter.models.account_metadatas import AccountMetadatas

# TODO update the JSON string below
json = "{}"
# create an instance of AccountMetadatas from a JSON string
account_metadatas_instance = AccountMetadatas.from_json(json)
# print the JSON string representation of the object
print(AccountMetadatas.to_json())

# convert the object into a dict
account_metadatas_dict = account_metadatas_instance.to_dict()
# create an instance of AccountMetadatas from a dict
account_metadatas_from_dict = AccountMetadatas.from_dict(account_metadatas_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


