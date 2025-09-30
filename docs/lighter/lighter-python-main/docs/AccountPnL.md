# AccountPnL


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**resolution** | **str** |  | 
**pnl** | [**List[PnLEntry]**](PnLEntry.md) |  | 

## Example

```python
from lighter.models.account_pn_l import AccountPnL

# TODO update the JSON string below
json = "{}"
# create an instance of AccountPnL from a JSON string
account_pn_l_instance = AccountPnL.from_json(json)
# print the JSON string representation of the object
print(AccountPnL.to_json())

# convert the object into a dict
account_pn_l_dict = account_pn_l_instance.to_dict()
# create an instance of AccountPnL from a dict
account_pn_l_from_dict = AccountPnL.from_dict(account_pn_l_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


