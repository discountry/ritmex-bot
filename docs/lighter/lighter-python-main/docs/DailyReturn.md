# DailyReturn


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **int** |  | 
**daily_return** | **float** |  | 

## Example

```python
from lighter.models.daily_return import DailyReturn

# TODO update the JSON string below
json = "{}"
# create an instance of DailyReturn from a JSON string
daily_return_instance = DailyReturn.from_json(json)
# print the JSON string representation of the object
print(DailyReturn.to_json())

# convert the object into a dict
daily_return_dict = daily_return_instance.to_dict()
# create an instance of DailyReturn from a dict
daily_return_from_dict = DailyReturn.from_dict(daily_return_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


