# Announcements


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**announcements** | [**List[Announcement]**](Announcement.md) |  | 

## Example

```python
from lighter.models.announcements import Announcements

# TODO update the JSON string below
json = "{}"
# create an instance of Announcements from a JSON string
announcements_instance = Announcements.from_json(json)
# print the JSON string representation of the object
print(Announcements.to_json())

# convert the object into a dict
announcements_dict = announcements_instance.to_dict()
# create an instance of Announcements from a dict
announcements_from_dict = Announcements.from_dict(announcements_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


