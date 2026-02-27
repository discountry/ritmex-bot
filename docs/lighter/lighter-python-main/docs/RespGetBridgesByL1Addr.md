# RespGetBridgesByL1Addr


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**bridges** | [**List[Bridge]**](Bridge.md) |  | 

## Example

```python
from lighter.models.resp_get_bridges_by_l1_addr import RespGetBridgesByL1Addr

# TODO update the JSON string below
json = "{}"
# create an instance of RespGetBridgesByL1Addr from a JSON string
resp_get_bridges_by_l1_addr_instance = RespGetBridgesByL1Addr.from_json(json)
# print the JSON string representation of the object
print(RespGetBridgesByL1Addr.to_json())

# convert the object into a dict
resp_get_bridges_by_l1_addr_dict = resp_get_bridges_by_l1_addr_instance.to_dict()
# create an instance of RespGetBridgesByL1Addr from a dict
resp_get_bridges_by_l1_addr_from_dict = RespGetBridgesByL1Addr.from_dict(resp_get_bridges_by_l1_addr_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


