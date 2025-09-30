# FundingRates


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**funding_rates** | [**List[FundingRate]**](FundingRate.md) |  | 

## Example

```python
from lighter.models.funding_rates import FundingRates

# TODO update the JSON string below
json = "{}"
# create an instance of FundingRates from a JSON string
funding_rates_instance = FundingRates.from_json(json)
# print the JSON string representation of the object
print(FundingRates.to_json())

# convert the object into a dict
funding_rates_dict = funding_rates_instance.to_dict()
# create an instance of FundingRates from a dict
funding_rates_from_dict = FundingRates.from_dict(funding_rates_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


