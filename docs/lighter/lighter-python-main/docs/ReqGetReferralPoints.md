# ReqGetReferralPoints


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  made optional to support header auth clients | [optional] 
**account_index** | **int** |  | 

## Example

```python
from lighter.models.req_get_referral_points import ReqGetReferralPoints

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetReferralPoints from a JSON string
req_get_referral_points_instance = ReqGetReferralPoints.from_json(json)
# print the JSON string representation of the object
print(ReqGetReferralPoints.to_json())

# convert the object into a dict
req_get_referral_points_dict = req_get_referral_points_instance.to_dict()
# create an instance of ReqGetReferralPoints from a dict
req_get_referral_points_from_dict = ReqGetReferralPoints.from_dict(req_get_referral_points_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


