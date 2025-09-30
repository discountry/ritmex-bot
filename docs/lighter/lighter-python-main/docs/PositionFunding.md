# PositionFunding


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **int** |  | 
**market_id** | **int** |  | 
**funding_id** | **int** |  | 
**change** | **str** |  | 
**rate** | **str** |  | 
**position_size** | **str** |  | 
**position_side** | **str** |  | 

## Example

```python
from lighter.models.position_funding import PositionFunding

# TODO update the JSON string below
json = "{}"
# create an instance of PositionFunding from a JSON string
position_funding_instance = PositionFunding.from_json(json)
# print the JSON string representation of the object
print(PositionFunding.to_json())

# convert the object into a dict
position_funding_dict = position_funding_instance.to_dict()
# create an instance of PositionFunding from a dict
position_funding_from_dict = PositionFunding.from_dict(position_funding_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


