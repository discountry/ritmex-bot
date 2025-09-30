# MarketInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**index_price** | **str** |  | 
**mark_price** | **str** |  | 
**open_interest** | **str** |  | 
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
from lighter.models.market_info import MarketInfo

# TODO update the JSON string below
json = "{}"
# create an instance of MarketInfo from a JSON string
market_info_instance = MarketInfo.from_json(json)
# print the JSON string representation of the object
print(MarketInfo.to_json())

# convert the object into a dict
market_info_dict = market_info_instance.to_dict()
# create an instance of MarketInfo from a dict
market_info_from_dict = MarketInfo.from_dict(market_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


