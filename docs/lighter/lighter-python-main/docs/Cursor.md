# Cursor


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**next_cursor** | **str** |  | [optional] 

## Example

```python
from lighter.models.cursor import Cursor

# TODO update the JSON string below
json = "{}"
# create an instance of Cursor from a JSON string
cursor_instance = Cursor.from_json(json)
# print the JSON string representation of the object
print(Cursor.to_json())

# convert the object into a dict
cursor_dict = cursor_instance.to_dict()
# create an instance of Cursor from a dict
cursor_from_dict = Cursor.from_dict(cursor_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


