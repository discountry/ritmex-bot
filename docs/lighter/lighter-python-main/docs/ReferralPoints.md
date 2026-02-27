# ReferralPoints


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**referrals** | [**List[ReferralPointEntry]**](ReferralPointEntry.md) |  | 
**user_total_points** | **float** |  | 
**user_last_week_points** | **float** |  | 
**user_total_referral_reward_points** | **float** |  | 
**user_last_week_referral_reward_points** | **float** |  | 
**reward_point_multiplier** | **str** |  | 

## Example

```python
from lighter.models.referral_points import ReferralPoints

# TODO update the JSON string below
json = "{}"
# create an instance of ReferralPoints from a JSON string
referral_points_instance = ReferralPoints.from_json(json)
# print the JSON string representation of the object
print(ReferralPoints.to_json())

# convert the object into a dict
referral_points_dict = referral_points_instance.to_dict()
# create an instance of ReferralPoints from a dict
referral_points_from_dict = ReferralPoints.from_dict(referral_points_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


