# ReqGetPublicPools


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
from lighter.models.req_get_public_pools import ReqGetPublicPools

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetPublicPools from a JSON string
req_get_public_pools_instance = ReqGetPublicPools.from_json(json)
# print the JSON string representation of the object
print(ReqGetPublicPools.to_json())

# convert the object into a dict
req_get_public_pools_dict = req_get_public_pools_instance.to_dict()
# create an instance of ReqGetPublicPools from a dict
req_get_public_pools_from_dict = ReqGetPublicPools.from_dict(req_get_public_pools_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


