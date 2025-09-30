# ReqGetTransferFeeInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  | [optional] 
**account_index** | **int** |  | 
**to_account_index** | **int** |  | [optional] [default to -1]

## Example

```python
from lighter.models.req_get_transfer_fee_info import ReqGetTransferFeeInfo

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetTransferFeeInfo from a JSON string
req_get_transfer_fee_info_instance = ReqGetTransferFeeInfo.from_json(json)
# print the JSON string representation of the object
print(ReqGetTransferFeeInfo.to_json())

# convert the object into a dict
req_get_transfer_fee_info_dict = req_get_transfer_fee_info_instance.to_dict()
# create an instance of ReqGetTransferFeeInfo from a dict
req_get_transfer_fee_info_from_dict = ReqGetTransferFeeInfo.from_dict(req_get_transfer_fee_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


