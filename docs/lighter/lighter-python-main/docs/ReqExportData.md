# ReqExportData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  | [optional] 
**account_index** | **int** |  | [optional] [default to -1]
**market_id** | **int** |  | [optional] 
**type** | **str** |  | 

## Example

```python
from lighter.models.req_export_data import ReqExportData

# TODO update the JSON string below
json = "{}"
# create an instance of ReqExportData from a JSON string
req_export_data_instance = ReqExportData.from_json(json)
# print the JSON string representation of the object
print(ReqExportData.to_json())

# convert the object into a dict
req_export_data_dict = req_export_data_instance.to_dict()
# create an instance of ReqExportData from a dict
req_export_data_from_dict = ReqExportData.from_dict(req_export_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


