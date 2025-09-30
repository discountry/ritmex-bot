# AccountStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**collateral** | **str** |  | 
**portfolio_value** | **str** |  | 
**leverage** | **str** |  | 
**available_balance** | **str** |  | 
**margin_usage** | **str** |  | 
**buying_power** | **str** |  | 
**cross_stats** | [**AccountMarginStats**](AccountMarginStats.md) |  | 
**total_stats** | [**AccountMarginStats**](AccountMarginStats.md) |  | 

## Example

```python
from lighter.models.account_stats import AccountStats

# TODO update the JSON string below
json = "{}"
# create an instance of AccountStats from a JSON string
account_stats_instance = AccountStats.from_json(json)
# print the JSON string representation of the object
print(AccountStats.to_json())

# convert the object into a dict
account_stats_dict = account_stats_instance.to_dict()
# create an instance of AccountStats from a dict
account_stats_from_dict = AccountStats.from_dict(account_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


