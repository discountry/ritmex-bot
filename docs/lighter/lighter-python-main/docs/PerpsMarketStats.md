# PerpsMarketStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**market_id** | **int** |  | 
**index_price** | **str** |  | 
**mark_price** | **str** |  | 
**open_interest** | **str** |  | 
**open_interest_limit** | **str** |  | 
**funding_clamp_small** | **str** |  | 
**funding_clamp_big** | **str** |  | 
**last_trade_price** | **str** |  | 
**current_funding_rate** | **str** |  | 
**funding_rate** | **str** |  | 
**funding_timestamp** | **int** |  | 
**daily_base_token_volume** | **float** |  | 
**daily_quote_token_volume** | **float** |  | 
**daily_price_low** | **float** |  | 
**daily_price_high** | **float** |  | 
**daily_price_change** | **float** |  | 

## Example

```python
from lighter.models.perps_market_stats import PerpsMarketStats

# TODO update the JSON string below
json = "{}"
# create an instance of PerpsMarketStats from a JSON string
perps_market_stats_instance = PerpsMarketStats.from_json(json)
# print the JSON string representation of the object
print(PerpsMarketStats.to_json())

# convert the object into a dict
perps_market_stats_dict = perps_market_stats_instance.to_dict()
# create an instance of PerpsMarketStats from a dict
perps_market_stats_from_dict = PerpsMarketStats.from_dict(perps_market_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


