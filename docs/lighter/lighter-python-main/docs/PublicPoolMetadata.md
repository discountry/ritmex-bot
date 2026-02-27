# PublicPoolMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**account_index** | **int** |  | 
**created_at** | **int** |  | 
**master_account_index** | **int** |  | 
**account_type** | **int** |  | 
**name** | **str** |  | 
**l1_address** | **str** |  | 
**annual_percentage_yield** | **float** |  | 
**sharpe_ratio** | **float** |  | 
**status** | **int** |  | 
**operator_fee** | **str** |  | 
**total_asset_value** | **str** |  | 
**total_shares** | **int** |  | 
**account_share** | [**PublicPoolShare**](PublicPoolShare.md) |  | [optional] 

## Example

```python
from lighter.models.public_pool_metadata import PublicPoolMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of PublicPoolMetadata from a JSON string
public_pool_metadata_instance = PublicPoolMetadata.from_json(json)
# print the JSON string representation of the object
print(PublicPoolMetadata.to_json())

# convert the object into a dict
public_pool_metadata_dict = public_pool_metadata_instance.to_dict()
# create an instance of PublicPoolMetadata from a dict
public_pool_metadata_from_dict = PublicPoolMetadata.from_dict(public_pool_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


