# ReqGetRangeWithCursor


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cursor** | **str** |  | [optional] 
**limit** | **int** |  | 

## Example

```python
from lighter.models.req_get_range_with_cursor import ReqGetRangeWithCursor

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetRangeWithCursor from a JSON string
req_get_range_with_cursor_instance = ReqGetRangeWithCursor.from_json(json)
# print the JSON string representation of the object
print(ReqGetRangeWithCursor.to_json())

# convert the object into a dict
req_get_range_with_cursor_dict = req_get_range_with_cursor_instance.to_dict()
# create an instance of ReqGetRangeWithCursor from a dict
req_get_range_with_cursor_from_dict = ReqGetRangeWithCursor.from_dict(req_get_range_with_cursor_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


