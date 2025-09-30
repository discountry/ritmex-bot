# Fundings


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**resolution** | **str** |  | 
**fundings** | [**List[Funding]**](Funding.md) |  | 

## Example

```python
from lighter.models.fundings import Fundings

# TODO update the JSON string below
json = "{}"
# create an instance of Fundings from a JSON string
fundings_instance = Fundings.from_json(json)
# print the JSON string representation of the object
print(Fundings.to_json())

# convert the object into a dict
fundings_dict = fundings_instance.to_dict()
# create an instance of Fundings from a dict
fundings_from_dict = Fundings.from_dict(fundings_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


