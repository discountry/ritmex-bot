# Liquidation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**market_id** | **int** |  | 
**type** | **str** |  | 
**trade** | [**LiqTrade**](LiqTrade.md) |  | 
**info** | [**LiquidationInfo**](LiquidationInfo.md) |  | 
**executed_at** | **int** |  | 

## Example

```python
from lighter.models.liquidation import Liquidation

# TODO update the JSON string below
json = "{}"
# create an instance of Liquidation from a JSON string
liquidation_instance = Liquidation.from_json(json)
# print the JSON string representation of the object
print(Liquidation.to_json())

# convert the object into a dict
liquidation_dict = liquidation_instance.to_dict()
# create an instance of Liquidation from a dict
liquidation_from_dict = Liquidation.from_dict(liquidation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


