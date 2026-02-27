# SpotOrderBookDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**market_id** | **int** |  | 
**market_type** | **str** |  | 
**base_asset_id** | **int** |  | 
**quote_asset_id** | **int** |  | 
**status** | **str** |  | 
**taker_fee** | **str** |  | 
**maker_fee** | **str** |  | 
**liquidation_fee** | **str** |  | 
**min_base_amount** | **str** |  | 
**min_quote_amount** | **str** |  | 
**order_quote_limit** | **str** |  | 
**supported_size_decimals** | **int** |  | 
**supported_price_decimals** | **int** |  | 
**supported_quote_decimals** | **int** |  | 
**size_decimals** | **int** |  | 
**price_decimals** | **int** |  | 
**last_trade_price** | **float** |  | 
**daily_trades_count** | **int** |  | 
**daily_base_token_volume** | **float** |  | 
**daily_quote_token_volume** | **float** |  | 
**daily_price_low** | **float** |  | 
**daily_price_high** | **float** |  | 
**daily_price_change** | **float** |  | 
**daily_chart** | **Dict[str, float]** |  | 

## Example

```python
from lighter.models.spot_order_book_detail import SpotOrderBookDetail

# TODO update the JSON string below
json = "{}"
# create an instance of SpotOrderBookDetail from a JSON string
spot_order_book_detail_instance = SpotOrderBookDetail.from_json(json)
# print the JSON string representation of the object
print(SpotOrderBookDetail.to_json())

# convert the object into a dict
spot_order_book_detail_dict = spot_order_book_detail_instance.to_dict()
# create an instance of SpotOrderBookDetail from a dict
spot_order_book_detail_from_dict = SpotOrderBookDetail.from_dict(spot_order_book_detail_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


