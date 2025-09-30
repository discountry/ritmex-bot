# RespChangeAccountTier


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 

## Example

```python
from lighter.models.resp_change_account_tier import RespChangeAccountTier

# TODO update the JSON string below
json = "{}"
# create an instance of RespChangeAccountTier from a JSON string
resp_change_account_tier_instance = RespChangeAccountTier.from_json(json)
# print the JSON string representation of the object
print(RespChangeAccountTier.to_json())

# convert the object into a dict
resp_change_account_tier_dict = resp_change_account_tier_instance.to_dict()
# create an instance of RespChangeAccountTier from a dict
resp_change_account_tier_from_dict = RespChangeAccountTier.from_dict(resp_change_account_tier_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


