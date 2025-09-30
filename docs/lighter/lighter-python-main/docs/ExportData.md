# ExportData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**data_url** | **str** |  | 

## Example

```python
from lighter.models.export_data import ExportData

# TODO update the JSON string below
json = "{}"
# create an instance of ExportData from a JSON string
export_data_instance = ExportData.from_json(json)
# print the JSON string representation of the object
print(ExportData.to_json())

# convert the object into a dict
export_data_dict = export_data_instance.to_dict()
# create an instance of ExportData from a dict
export_data_from_dict = ExportData.from_dict(export_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


