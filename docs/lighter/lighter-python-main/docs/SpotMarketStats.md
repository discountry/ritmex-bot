# SpotMarketStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**market_id** | **int** |  | 
**index_price** | **str** |  | 
**mid_price** | **str** |  | 
**last_trade_price** | **str** |  | 
**daily_base_token_volume** | **float** |  | 
**daily_quote_token_volume** | **float** |  | 
**daily_price_low** | **float** |  | 
**daily_price_high** | **float** |  | 
**daily_price_change** | **float** |  | 

## Example

```python
from lighter.models.spot_market_stats import SpotMarketStats

# TODO update the JSON string below
json = "{}"
# create an instance of SpotMarketStats from a JSON string
spot_market_stats_instance = SpotMarketStats.from_json(json)
# print the JSON string representation of the object
print(SpotMarketStats.to_json())

# convert the object into a dict
spot_market_stats_dict = spot_market_stats_instance.to_dict()
# create an instance of SpotMarketStats from a dict
spot_market_stats_from_dict = SpotMarketStats.from_dict(spot_market_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


