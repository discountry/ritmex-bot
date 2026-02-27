# RespSendTxBatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**tx_hash** | **List[str]** |  | 
**predicted_execution_time_ms** | **int** |  | 
**volume_quota_remaining** | **int** |  | 

## Example

```python
from lighter.models.resp_send_tx_batch import RespSendTxBatch

# TODO update the JSON string below
json = "{}"
# create an instance of RespSendTxBatch from a JSON string
resp_send_tx_batch_instance = RespSendTxBatch.from_json(json)
# print the JSON string representation of the object
print(RespSendTxBatch.to_json())

# convert the object into a dict
resp_send_tx_batch_dict = resp_send_tx_batch_instance.to_dict()
# create an instance of RespSendTxBatch from a dict
resp_send_tx_batch_from_dict = RespSendTxBatch.from_dict(resp_send_tx_batch_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


