# RiskInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cross_risk_parameters** | [**RiskParameters**](RiskParameters.md) |  | 
**isolated_risk_parameters** | [**List[RiskParameters]**](RiskParameters.md) |  | 

## Example

```python
from lighter.models.risk_info import RiskInfo

# TODO update the JSON string below
json = "{}"
# create an instance of RiskInfo from a JSON string
risk_info_instance = RiskInfo.from_json(json)
# print the JSON string representation of the object
print(RiskInfo.to_json())

# convert the object into a dict
risk_info_dict = risk_info_instance.to_dict()
# create an instance of RiskInfo from a dict
risk_info_from_dict = RiskInfo.from_dict(risk_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


