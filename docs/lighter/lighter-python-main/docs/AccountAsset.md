# AccountAsset


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**asset_id** | **int** |  | 
**balance** | **str** |  | 
**locked_balance** | **str** |  | 

## Example

```python
from lighter.models.account_asset import AccountAsset

# TODO update the JSON string below
json = "{}"
# create an instance of AccountAsset from a JSON string
account_asset_instance = AccountAsset.from_json(json)
# print the JSON string representation of the object
print(AccountAsset.to_json())

# convert the object into a dict
account_asset_dict = account_asset_instance.to_dict()
# create an instance of AccountAsset from a dict
account_asset_from_dict = AccountAsset.from_dict(account_asset_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


