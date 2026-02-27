# RespUpdateKickback


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**success** | **bool** |  | 

## Example

```python
from lighter.models.resp_update_kickback import RespUpdateKickback

# TODO update the JSON string below
json = "{}"
# create an instance of RespUpdateKickback from a JSON string
resp_update_kickback_instance = RespUpdateKickback.from_json(json)
# print the JSON string representation of the object
print(RespUpdateKickback.to_json())

# convert the object into a dict
resp_update_kickback_dict = resp_update_kickback_instance.to_dict()
# create an instance of RespUpdateKickback from a dict
resp_update_kickback_from_dict = RespUpdateKickback.from_dict(resp_update_kickback_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


