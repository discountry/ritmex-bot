# Bridge


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**version** | **int** |  | 
**source** | **str** |  | 
**source_chain_id** | **str** |  | 
**fast_bridge_tx_hash** | **str** |  | 
**batch_claim_tx_hash** | **str** |  | 
**cctp_burn_tx_hash** | **str** |  | 
**amount** | **str** |  | 
**intent_address** | **str** |  | 
**status** | **str** |  | 
**step** | **str** |  | 
**description** | **str** |  | 
**created_at** | **int** |  | 
**updated_at** | **int** |  | 
**is_external_deposit** | **bool** |  | 

## Example

```python
from lighter.models.bridge import Bridge

# TODO update the JSON string below
json = "{}"
# create an instance of Bridge from a JSON string
bridge_instance = Bridge.from_json(json)
# print the JSON string representation of the object
print(Bridge.to_json())

# convert the object into a dict
bridge_dict = bridge_instance.to_dict()
# create an instance of Bridge from a dict
bridge_from_dict = Bridge.from_dict(bridge_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


