# AccountMarginStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**collateral** | **str** |  | 
**portfolio_value** | **str** |  | 
**leverage** | **str** |  | 
**available_balance** | **str** |  | 
**margin_usage** | **str** |  | 
**buying_power** | **str** |  | 

## Example

```python
from lighter.models.account_margin_stats import AccountMarginStats

# TODO update the JSON string below
json = "{}"
# create an instance of AccountMarginStats from a JSON string
account_margin_stats_instance = AccountMarginStats.from_json(json)
# print the JSON string representation of the object
print(AccountMarginStats.to_json())

# convert the object into a dict
account_margin_stats_dict = account_margin_stats_instance.to_dict()
# create an instance of AccountMarginStats from a dict
account_margin_stats_from_dict = AccountMarginStats.from_dict(account_margin_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


