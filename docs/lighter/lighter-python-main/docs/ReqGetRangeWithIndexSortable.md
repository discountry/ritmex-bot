# ReqGetRangeWithIndexSortable


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**index** | **int** |  | [optional] 
**limit** | **int** |  | [optional] 
**sort** | **str** |  | [optional] [default to 'asc']

## Example

```python
from lighter.models.req_get_range_with_index_sortable import ReqGetRangeWithIndexSortable

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetRangeWithIndexSortable from a JSON string
req_get_range_with_index_sortable_instance = ReqGetRangeWithIndexSortable.from_json(json)
# print the JSON string representation of the object
print(ReqGetRangeWithIndexSortable.to_json())

# convert the object into a dict
req_get_range_with_index_sortable_dict = req_get_range_with_index_sortable_instance.to_dict()
# create an instance of ReqGetRangeWithIndexSortable from a dict
req_get_range_with_index_sortable_from_dict = ReqGetRangeWithIndexSortable.from_dict(req_get_range_with_index_sortable_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


