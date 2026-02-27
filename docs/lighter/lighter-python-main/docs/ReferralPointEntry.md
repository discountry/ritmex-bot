# ReferralPointEntry


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**l1_address** | **str** |  | 
**total_points** | **float** |  | 
**week_points** | **float** |  | 
**total_reward_points** | **float** |  | 
**week_reward_points** | **float** |  | 
**reward_point_multiplier** | **str** |  | 

## Example

```python
from lighter.models.referral_point_entry import ReferralPointEntry

# TODO update the JSON string below
json = "{}"
# create an instance of ReferralPointEntry from a JSON string
referral_point_entry_instance = ReferralPointEntry.from_json(json)
# print the JSON string representation of the object
print(ReferralPointEntry.to_json())

# convert the object into a dict
referral_point_entry_dict = referral_point_entry_instance.to_dict()
# create an instance of ReferralPointEntry from a dict
referral_point_entry_from_dict = ReferralPointEntry.from_dict(referral_point_entry_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


