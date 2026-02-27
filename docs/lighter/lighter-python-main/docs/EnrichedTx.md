# EnrichedTx


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**hash** | **str** |  | 
**type** | **int** |  | 
**info** | **str** |  | 
**event_info** | **str** |  | 
**status** | **int** |  | 
**transaction_index** | **int** |  | 
**l1_address** | **str** |  | 
**account_index** | **int** |  | 
**nonce** | **int** |  | 
**expire_at** | **int** |  | 
**block_height** | **int** |  | 
**queued_at** | **int** |  | 
**executed_at** | **int** |  | 
**sequence_index** | **int** |  | 
**parent_hash** | **str** |  | 
**api_key_index** | **int** |  | 
**committed_at** | **int** |  | 
**verified_at** | **int** |  | 

## Example

```python
from lighter.models.enriched_tx import EnrichedTx

# TODO update the JSON string below
json = "{}"
# create an instance of EnrichedTx from a JSON string
enriched_tx_instance = EnrichedTx.from_json(json)
# print the JSON string representation of the object
print(EnrichedTx.to_json())

# convert the object into a dict
enriched_tx_dict = enriched_tx_instance.to_dict()
# create an instance of EnrichedTx from a dict
enriched_tx_from_dict = EnrichedTx.from_dict(enriched_tx_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


