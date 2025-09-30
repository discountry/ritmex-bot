# RespGetFastBridgeInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**fast_bridge_limit** | **str** |  | 

## Example

```python
from lighter.models.resp_get_fast_bridge_info import RespGetFastBridgeInfo

# TODO update the JSON string below
json = "{}"
# create an instance of RespGetFastBridgeInfo from a JSON string
resp_get_fast_bridge_info_instance = RespGetFastBridgeInfo.from_json(json)
# print the JSON string representation of the object
print(RespGetFastBridgeInfo.to_json())

# convert the object into a dict
resp_get_fast_bridge_info_dict = resp_get_fast_bridge_info_instance.to_dict()
# create an instance of RespGetFastBridgeInfo from a dict
resp_get_fast_bridge_info_from_dict = RespGetFastBridgeInfo.from_dict(resp_get_fast_bridge_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


