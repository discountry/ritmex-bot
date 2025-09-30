# ReqGetAccountLimits


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account_index** | **int** |  | 
**auth** | **str** |  made optional to support header auth clients | [optional] 

## Example

```python
from lighter.models.req_get_account_limits import ReqGetAccountLimits

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountLimits from a JSON string
req_get_account_limits_instance = ReqGetAccountLimits.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountLimits.to_json())

# convert the object into a dict
req_get_account_limits_dict = req_get_account_limits_instance.to_dict()
# create an instance of ReqGetAccountLimits from a dict
req_get_account_limits_from_dict = ReqGetAccountLimits.from_dict(req_get_account_limits_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


