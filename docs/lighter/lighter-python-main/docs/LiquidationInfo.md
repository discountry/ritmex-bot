# LiquidationInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**positions** | [**List[AccountPosition]**](AccountPosition.md) |  | 
**risk_info_before** | [**RiskInfo**](RiskInfo.md) |  | 
**risk_info_after** | [**RiskInfo**](RiskInfo.md) |  | 
**mark_prices** | **Dict[str, float]** |  | 

## Example

```python
from lighter.models.liquidation_info import LiquidationInfo

# TODO update the JSON string below
json = "{}"
# create an instance of LiquidationInfo from a JSON string
liquidation_info_instance = LiquidationInfo.from_json(json)
# print the JSON string representation of the object
print(LiquidationInfo.to_json())

# convert the object into a dict
liquidation_info_dict = liquidation_info_instance.to_dict()
# create an instance of LiquidationInfo from a dict
liquidation_info_from_dict = LiquidationInfo.from_dict(liquidation_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


