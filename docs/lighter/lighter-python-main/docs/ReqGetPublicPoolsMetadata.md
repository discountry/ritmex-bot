# ReqGetPublicPoolsMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  | [optional] 
**filter** | **str** |  | [optional] 
**index** | **int** |  | 
**limit** | **int** |  | 
**account_index** | **int** |  | [optional] 

## Example

```python
from lighter.models.req_get_public_pools_metadata import ReqGetPublicPoolsMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetPublicPoolsMetadata from a JSON string
req_get_public_pools_metadata_instance = ReqGetPublicPoolsMetadata.from_json(json)
# print the JSON string representation of the object
print(ReqGetPublicPoolsMetadata.to_json())

# convert the object into a dict
req_get_public_pools_metadata_dict = req_get_public_pools_metadata_instance.to_dict()
# create an instance of ReqGetPublicPoolsMetadata from a dict
req_get_public_pools_metadata_from_dict = ReqGetPublicPoolsMetadata.from_dict(req_get_public_pools_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


