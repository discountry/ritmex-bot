# ContractAddress


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**address** | **str** |  | 

## Example

```python
from lighter.models.contract_address import ContractAddress

# TODO update the JSON string below
json = "{}"
# create an instance of ContractAddress from a JSON string
contract_address_instance = ContractAddress.from_json(json)
# print the JSON string representation of the object
print(ContractAddress.to_json())

# convert the object into a dict
contract_address_dict = contract_address_instance.to_dict()
# create an instance of ContractAddress from a dict
contract_address_from_dict = ContractAddress.from_dict(contract_address_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


