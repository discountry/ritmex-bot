# PublicPoolInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **int** |  | 
**operator_fee** | **str** |  | 
**min_operator_share_rate** | **str** |  | 
**total_shares** | **int** |  | 
**operator_shares** | **int** |  | 
**annual_percentage_yield** | **float** |  | 
**sharpe_ratio** | **float** |  | 
**daily_returns** | [**List[DailyReturn]**](DailyReturn.md) |  | 
**share_prices** | [**List[SharePrice]**](SharePrice.md) |  | 

## Example

```python
from lighter.models.public_pool_info import PublicPoolInfo

# TODO update the JSON string below
json = "{}"
# create an instance of PublicPoolInfo from a JSON string
public_pool_info_instance = PublicPoolInfo.from_json(json)
# print the JSON string representation of the object
print(PublicPoolInfo.to_json())

# convert the object into a dict
public_pool_info_dict = public_pool_info_instance.to_dict()
# create an instance of PublicPoolInfo from a dict
public_pool_info_from_dict = PublicPoolInfo.from_dict(public_pool_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


