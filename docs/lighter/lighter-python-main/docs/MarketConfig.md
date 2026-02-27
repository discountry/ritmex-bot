# MarketConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_margin_mode** | **int** |  | 
**insurance_fund_account_index** | **int** |  | 
**liquidation_mode** | **int** |  | 
**force_reduce_only** | **bool** |  | 
**trading_hours** | **str** |  | 

## Example

```python
from lighter.models.market_config import MarketConfig

# TODO update the JSON string below
json = "{}"
# create an instance of MarketConfig from a JSON string
market_config_instance = MarketConfig.from_json(json)
# print the JSON string representation of the object
print(MarketConfig.to_json())

# convert the object into a dict
market_config_dict = market_config_instance.to_dict()
# create an instance of MarketConfig from a dict
market_config_from_dict = MarketConfig.from_dict(market_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


