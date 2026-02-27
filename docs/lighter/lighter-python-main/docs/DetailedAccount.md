# DetailedAccount


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**account_type** | **int** |  | 
**index** | **int** |  | 
**l1_address** | **str** |  | 
**cancel_all_time** | **int** |  | 
**total_order_count** | **int** |  | 
**pending_order_count** | **int** |  | 
**available_balance** | **str** |  | 
**status** | **int** |  | 
**collateral** | **str** |  | 
**account_index** | **int** |  | 
**name** | **str** |  | 
**description** | **str** |  | 
**can_invite** | **bool** |  Remove After FE uses L1 meta endpoint | 
**referral_points_percentage** | **str** |  Remove After FE uses L1 meta endpoint | 
**positions** | [**List[AccountPosition]**](AccountPosition.md) |  | 
**assets** | [**List[AccountAsset]**](AccountAsset.md) |  | 
**total_asset_value** | **str** |  | 
**cross_asset_value** | **str** |  | 
**pool_info** | [**PublicPoolInfo**](PublicPoolInfo.md) |  | 
**shares** | [**List[PublicPoolShare]**](PublicPoolShare.md) |  | 

## Example

```python
from lighter.models.detailed_account import DetailedAccount

# TODO update the JSON string below
json = "{}"
# create an instance of DetailedAccount from a JSON string
detailed_account_instance = DetailedAccount.from_json(json)
# print the JSON string representation of the object
print(DetailedAccount.to_json())

# convert the object into a dict
detailed_account_dict = detailed_account_instance.to_dict()
# create an instance of DetailedAccount from a dict
detailed_account_from_dict = DetailedAccount.from_dict(detailed_account_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


