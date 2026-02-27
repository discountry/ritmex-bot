# AssetDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**asset_details** | [**List[Asset]**](Asset.md) |  | 

## Example

```python
from lighter.models.asset_details import AssetDetails

# TODO update the JSON string below
json = "{}"
# create an instance of AssetDetails from a JSON string
asset_details_instance = AssetDetails.from_json(json)
# print the JSON string representation of the object
print(AssetDetails.to_json())

# convert the object into a dict
asset_details_dict = asset_details_instance.to_dict()
# create an instance of AssetDetails from a dict
asset_details_from_dict = AssetDetails.from_dict(asset_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


