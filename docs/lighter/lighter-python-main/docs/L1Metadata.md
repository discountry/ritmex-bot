# L1Metadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**l1_address** | **str** |  | 
**can_invite** | **bool** |  | 
**referral_points_percentage** | **str** |  | 

## Example

```python
from lighter.models.l1_metadata import L1Metadata

# TODO update the JSON string below
json = "{}"
# create an instance of L1Metadata from a JSON string
l1_metadata_instance = L1Metadata.from_json(json)
# print the JSON string representation of the object
print(L1Metadata.to_json())

# convert the object into a dict
l1_metadata_dict = l1_metadata_instance.to_dict()
# create an instance of L1Metadata from a dict
l1_metadata_from_dict = L1Metadata.from_dict(l1_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


