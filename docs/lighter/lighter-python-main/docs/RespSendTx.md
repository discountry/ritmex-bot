# RespSendTx


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**tx_hash** | **str** |  | 
**predicted_execution_time_ms** | **int** |  | 
**volume_quota_remaining** | **int** |  | 

## Example

```python
from lighter.models.resp_send_tx import RespSendTx

# TODO update the JSON string below
json = "{}"
# create an instance of RespSendTx from a JSON string
resp_send_tx_instance = RespSendTx.from_json(json)
# print the JSON string representation of the object
print(RespSendTx.to_json())

# convert the object into a dict
resp_send_tx_dict = resp_send_tx_instance.to_dict()
# create an instance of RespSendTx from a dict
resp_send_tx_from_dict = RespSendTx.from_dict(resp_send_tx_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


