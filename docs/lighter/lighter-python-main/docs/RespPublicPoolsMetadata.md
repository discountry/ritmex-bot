# RespPublicPoolsMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**public_pools** | [**List[PublicPoolMetadata]**](PublicPoolMetadata.md) |  | 

## Example

```python
from lighter.models.resp_public_pools_metadata import RespPublicPoolsMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of RespPublicPoolsMetadata from a JSON string
resp_public_pools_metadata_instance = RespPublicPoolsMetadata.from_json(json)
# print the JSON string representation of the object
print(RespPublicPoolsMetadata.to_json())

# convert the object into a dict
resp_public_pools_metadata_dict = resp_public_pools_metadata_instance.to_dict()
# create an instance of RespPublicPoolsMetadata from a dict
resp_public_pools_metadata_from_dict = RespPublicPoolsMetadata.from_dict(resp_public_pools_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


