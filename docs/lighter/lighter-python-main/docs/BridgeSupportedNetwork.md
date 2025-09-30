# BridgeSupportedNetwork


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**chain_id** | **str** |  | 
**explorer** | **str** |  | 

## Example

```python
from lighter.models.bridge_supported_network import BridgeSupportedNetwork

# TODO update the JSON string below
json = "{}"
# create an instance of BridgeSupportedNetwork from a JSON string
bridge_supported_network_instance = BridgeSupportedNetwork.from_json(json)
# print the JSON string representation of the object
print(BridgeSupportedNetwork.to_json())

# convert the object into a dict
bridge_supported_network_dict = bridge_supported_network_instance.to_dict()
# create an instance of BridgeSupportedNetwork from a dict
bridge_supported_network_from_dict = BridgeSupportedNetwork.from_dict(bridge_supported_network_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


