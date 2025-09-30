# ResultCode


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 

## Example

```python
from lighter.models.result_code import ResultCode

# TODO update the JSON string below
json = "{}"
# create an instance of ResultCode from a JSON string
result_code_instance = ResultCode.from_json(json)
# print the JSON string representation of the object
print(ResultCode.to_json())

# convert the object into a dict
result_code_dict = result_code_instance.to_dict()
# create an instance of ResultCode from a dict
result_code_from_dict = ResultCode.from_dict(result_code_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


