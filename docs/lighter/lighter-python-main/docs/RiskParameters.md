# RiskParameters


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**collateral** | **str** |  | 
**total_account_value** | **str** |  | 
**initial_margin_req** | **str** |  | 
**maintenance_margin_req** | **str** |  | 
**close_out_margin_req** | **str** |  | 

## Example

```python
from lighter.models.risk_parameters import RiskParameters

# TODO update the JSON string below
json = "{}"
# create an instance of RiskParameters from a JSON string
risk_parameters_instance = RiskParameters.from_json(json)
# print the JSON string representation of the object
print(RiskParameters.to_json())

# convert the object into a dict
risk_parameters_dict = risk_parameters_instance.to_dict()
# create an instance of RiskParameters from a dict
risk_parameters_from_dict = RiskParameters.from_dict(risk_parameters_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


