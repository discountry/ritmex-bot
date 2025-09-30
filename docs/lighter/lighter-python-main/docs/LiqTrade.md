# LiqTrade


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**price** | **str** |  | 
**size** | **str** |  | 
**taker_fee** | **str** |  | 
**maker_fee** | **str** |  | 

## Example

```python
from lighter.models.liq_trade import LiqTrade

# TODO update the JSON string below
json = "{}"
# create an instance of LiqTrade from a JSON string
liq_trade_instance = LiqTrade.from_json(json)
# print the JSON string representation of the object
print(LiqTrade.to_json())

# convert the object into a dict
liq_trade_dict = liq_trade_instance.to_dict()
# create an instance of LiqTrade from a dict
liq_trade_from_dict = LiqTrade.from_dict(liq_trade_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


