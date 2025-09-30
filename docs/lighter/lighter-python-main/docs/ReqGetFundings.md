# ReqGetFundings


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**resolution** | **str** |  | 
**start_timestamp** | **int** |  | 
**end_timestamp** | **int** |  | 
**count_back** | **int** |  | 

## Example

```python
from lighter.models.req_get_fundings import ReqGetFundings

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetFundings from a JSON string
req_get_fundings_instance = ReqGetFundings.from_json(json)
# print the JSON string representation of the object
print(ReqGetFundings.to_json())

# convert the object into a dict
req_get_fundings_dict = req_get_fundings_instance.to_dict()
# create an instance of ReqGetFundings from a dict
req_get_fundings_from_dict = ReqGetFundings.from_dict(req_get_fundings_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


