# Asset


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**asset_id** | **int** |  | 
**symbol** | **str** |  | 
**l1_decimals** | **int** |  | 
**decimals** | **int** |  | 
**min_transfer_amount** | **str** |  | 
**min_withdrawal_amount** | **str** |  | 
**margin_mode** | **str** |  | 
**index_price** | **str** |  | 
**l1_address** | **str** |  | 

## Example

```python
from lighter.models.asset import Asset

# TODO update the JSON string below
json = "{}"
# create an instance of Asset from a JSON string
asset_instance = Asset.from_json(json)
# print the JSON string representation of the object
print(Asset.to_json())

# convert the object into a dict
asset_dict = asset_instance.to_dict()
# create an instance of Asset from a dict
asset_from_dict = Asset.from_dict(asset_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


