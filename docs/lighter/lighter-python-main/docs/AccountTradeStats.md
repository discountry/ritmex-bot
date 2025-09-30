# AccountTradeStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**daily_trades_count** | **int** |  | 
**daily_volume** | **float** |  | 
**weekly_trades_count** | **int** |  | 
**weekly_volume** | **float** |  | 
**monthly_trades_count** | **int** |  | 
**monthly_volume** | **float** |  | 
**total_trades_count** | **int** |  | 
**total_volume** | **float** |  | 

## Example

```python
from lighter.models.account_trade_stats import AccountTradeStats

# TODO update the JSON string below
json = "{}"
# create an instance of AccountTradeStats from a JSON string
account_trade_stats_instance = AccountTradeStats.from_json(json)
# print the JSON string representation of the object
print(AccountTradeStats.to_json())

# convert the object into a dict
account_trade_stats_dict = account_trade_stats_instance.to_dict()
# create an instance of AccountTradeStats from a dict
account_trade_stats_from_dict = AccountTradeStats.from_dict(account_trade_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


