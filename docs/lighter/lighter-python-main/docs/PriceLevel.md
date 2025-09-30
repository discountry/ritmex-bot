# PriceLevel


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**price** | **str** |  | 
**size** | **str** |  | 

## Example

```python
from lighter.models.price_level import PriceLevel

# TODO update the JSON string below
json = "{}"
# create an instance of PriceLevel from a JSON string
price_level_instance = PriceLevel.from_json(json)
# print the JSON string representation of the object
print(PriceLevel.to_json())

# convert the object into a dict
price_level_dict = price_level_instance.to_dict()
# create an instance of PriceLevel from a dict
price_level_from_dict = PriceLevel.from_dict(price_level_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


