# CurrentHeight


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**height** | **int** |  | 

## Example

```python
from lighter.models.current_height import CurrentHeight

# TODO update the JSON string below
json = "{}"
# create an instance of CurrentHeight from a JSON string
current_height_instance = CurrentHeight.from_json(json)
# print the JSON string representation of the object
print(CurrentHeight.to_json())

# convert the object into a dict
current_height_dict = current_height_instance.to_dict()
# create an instance of CurrentHeight from a dict
current_height_from_dict = CurrentHeight.from_dict(current_height_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


