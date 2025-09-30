# ValidatorInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **str** |  | 
**is_active** | **bool** |  | 

## Example

```python
from lighter.models.validator_info import ValidatorInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ValidatorInfo from a JSON string
validator_info_instance = ValidatorInfo.from_json(json)
# print the JSON string representation of the object
print(ValidatorInfo.to_json())

# convert the object into a dict
validator_info_dict = validator_info_instance.to_dict()
# create an instance of ValidatorInfo from a dict
validator_info_from_dict = ValidatorInfo.from_dict(validator_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


