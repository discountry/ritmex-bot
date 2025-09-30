# ReqGetL1Metadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  made optional to support header auth clients | [optional] 
**l1_address** | **str** |  | 

## Example

```python
from lighter.models.req_get_l1_metadata import ReqGetL1Metadata

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetL1Metadata from a JSON string
req_get_l1_metadata_instance = ReqGetL1Metadata.from_json(json)
# print the JSON string representation of the object
print(ReqGetL1Metadata.to_json())

# convert the object into a dict
req_get_l1_metadata_dict = req_get_l1_metadata_instance.to_dict()
# create an instance of ReqGetL1Metadata from a dict
req_get_l1_metadata_from_dict = ReqGetL1Metadata.from_dict(req_get_l1_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


