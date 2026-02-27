# RespUpdateReferralCode


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**success** | **bool** |  | 

## Example

```python
from lighter.models.resp_update_referral_code import RespUpdateReferralCode

# TODO update the JSON string below
json = "{}"
# create an instance of RespUpdateReferralCode from a JSON string
resp_update_referral_code_instance = RespUpdateReferralCode.from_json(json)
# print the JSON string representation of the object
print(RespUpdateReferralCode.to_json())

# convert the object into a dict
resp_update_referral_code_dict = resp_update_referral_code_instance.to_dict()
# create an instance of RespUpdateReferralCode from a dict
resp_update_referral_code_from_dict = RespUpdateReferralCode.from_dict(resp_update_referral_code_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


