# L1ProviderInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chain_id** | **int** |  | 
**network_id** | **int** |  | 
**latest_block_number** | **int** |  | 

## Example

```python
from lighter.models.l1_provider_info import L1ProviderInfo

# TODO update the JSON string below
json = "{}"
# create an instance of L1ProviderInfo from a JSON string
l1_provider_info_instance = L1ProviderInfo.from_json(json)
# print the JSON string representation of the object
print(L1ProviderInfo.to_json())

# convert the object into a dict
l1_provider_info_dict = l1_provider_info_instance.to_dict()
# create an instance of L1ProviderInfo from a dict
l1_provider_info_from_dict = L1ProviderInfo.from_dict(l1_provider_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


