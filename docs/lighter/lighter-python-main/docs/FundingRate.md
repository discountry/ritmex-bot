# FundingRate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**exchange** | **str** |  | 
**symbol** | **str** |  | 
**rate** | **float** |  | 

## Example

```python
from lighter.models.funding_rate import FundingRate

# TODO update the JSON string below
json = "{}"
# create an instance of FundingRate from a JSON string
funding_rate_instance = FundingRate.from_json(json)
# print the JSON string representation of the object
print(FundingRate.to_json())

# convert the object into a dict
funding_rate_dict = funding_rate_instance.to_dict()
# create an instance of FundingRate from a dict
funding_rate_from_dict = FundingRate.from_dict(funding_rate_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


