# Announcement


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **str** |  | 
**content** | **str** |  | 
**created_at** | **int** |  | 
**expired_at** | **int** |  | 

## Example

```python
from lighter.models.announcement import Announcement

# TODO update the JSON string below
json = "{}"
# create an instance of Announcement from a JSON string
announcement_instance = Announcement.from_json(json)
# print the JSON string representation of the object
print(Announcement.to_json())

# convert the object into a dict
announcement_dict = announcement_instance.to_dict()
# create an instance of Announcement from a dict
announcement_from_dict = Announcement.from_dict(announcement_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


