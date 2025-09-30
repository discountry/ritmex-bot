# Funding


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **int** |  | 
**value** | **str** |  | 
**rate** | **str** |  | 
**direction** | **str** |  | 

## Example

```python
from lighter.models.funding import Funding

# TODO update the JSON string below
json = "{}"
# create an instance of Funding from a JSON string
funding_instance = Funding.from_json(json)
# print the JSON string representation of the object
print(Funding.to_json())

# convert the object into a dict
funding_dict = funding_instance.to_dict()
# create an instance of Funding from a dict
funding_from_dict = Funding.from_dict(funding_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


