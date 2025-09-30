# OrderBookDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**symbol** | **str** |  | 
**market_id** | **int** |  | 
**status** | **str** |  | 
**taker_fee** | **str** |  | 
**maker_fee** | **str** |  | 
**liquidation_fee** | **str** |  | 
**min_base_amount** | **str** |  | 
**min_quote_amount** | **str** |  | 
**supported_size_decimals** | **int** |  | 
**supported_price_decimals** | **int** |  | 
**supported_quote_decimals** | **int** |  | 
**size_decimals** | **int** |  | 
**price_decimals** | **int** |  | 
**quote_multiplier** | **int** |  | 
**default_initial_margin_fraction** | **int** |  | 
**min_initial_margin_fraction** | **int** |  | 
**maintenance_margin_fraction** | **int** |  | 
**closeout_margin_fraction** | **int** |  | 
**last_trade_price** | **float** |  | 
**daily_trades_count** | **int** |  | 
**daily_base_token_volume** | **float** |  | 
**daily_quote_token_volume** | **float** |  | 
**daily_price_low** | **float** |  | 
**daily_price_high** | **float** |  | 
**daily_price_change** | **float** |  | 
**open_interest** | **float** |  | 
**daily_chart** | **Dict[str, float]** |  | 

## Example

```python
from lighter.models.order_book_detail import OrderBookDetail

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBookDetail from a JSON string
order_book_detail_instance = OrderBookDetail.from_json(json)
# print the JSON string representation of the object
print(OrderBookDetail.to_json())

# convert the object into a dict
order_book_detail_dict = order_book_detail_instance.to_dict()
# create an instance of OrderBookDetail from a dict
order_book_detail_from_dict = OrderBookDetail.from_dict(order_book_detail_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


