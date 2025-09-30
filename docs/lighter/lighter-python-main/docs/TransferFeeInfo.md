# TransferFeeInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**transfer_fee_usdc** | **int** |  | 

## Example

```python
from lighter.models.transfer_fee_info import TransferFeeInfo

# TODO update the JSON string below
json = "{}"
# create an instance of TransferFeeInfo from a JSON string
transfer_fee_info_instance = TransferFeeInfo.from_json(json)
# print the JSON string representation of the object
print(TransferFeeInfo.to_json())

# convert the object into a dict
transfer_fee_info_dict = transfer_fee_info_instance.to_dict()
# create an instance of TransferFeeInfo from a dict
transfer_fee_info_from_dict = TransferFeeInfo.from_dict(transfer_fee_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


