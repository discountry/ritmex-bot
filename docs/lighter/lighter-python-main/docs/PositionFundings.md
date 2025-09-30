# PositionFundings


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**position_fundings** | [**List[PositionFunding]**](PositionFunding.md) |  | 
**next_cursor** | **str** |  | [optional] 

## Example

```python
from lighter.models.position_fundings import PositionFundings

# TODO update the JSON string below
json = "{}"
# create an instance of PositionFundings from a JSON string
position_fundings_instance = PositionFundings.from_json(json)
# print the JSON string representation of the object
print(PositionFundings.to_json())

# convert the object into a dict
position_fundings_dict = position_fundings_instance.to_dict()
# create an instance of PositionFundings from a dict
position_fundings_from_dict = PositionFundings.from_dict(position_fundings_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


