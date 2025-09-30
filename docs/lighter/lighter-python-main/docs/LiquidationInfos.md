# LiquidationInfos


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**liquidations** | [**List[Liquidation]**](Liquidation.md) |  | 
**next_cursor** | **str** |  | [optional] 

## Example

```python
from lighter.models.liquidation_infos import LiquidationInfos

# TODO update the JSON string below
json = "{}"
# create an instance of LiquidationInfos from a JSON string
liquidation_infos_instance = LiquidationInfos.from_json(json)
# print the JSON string representation of the object
print(LiquidationInfos.to_json())

# convert the object into a dict
liquidation_infos_dict = liquidation_infos_instance.to_dict()
# create an instance of LiquidationInfos from a dict
liquidation_infos_from_dict = LiquidationInfos.from_dict(liquidation_infos_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


