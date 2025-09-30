# ReqGetAccountMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**by** | **str** |  | 
**value** | **str** |  | 
**auth** | **str** |  | [optional] 

## Example

```python
from lighter.models.req_get_account_metadata import ReqGetAccountMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountMetadata from a JSON string
req_get_account_metadata_instance = ReqGetAccountMetadata.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountMetadata.to_json())

# convert the object into a dict
req_get_account_metadata_dict = req_get_account_metadata_instance.to_dict()
# create an instance of ReqGetAccountMetadata from a dict
req_get_account_metadata_from_dict = ReqGetAccountMetadata.from_dict(req_get_account_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


