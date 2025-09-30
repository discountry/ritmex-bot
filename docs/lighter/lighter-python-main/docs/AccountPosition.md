# AccountPosition


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**symbol** | **str** |  | 
**initial_margin_fraction** | **str** |  | 
**open_order_count** | **int** |  | 
**pending_order_count** | **int** |  | 
**position_tied_order_count** | **int** |  | 
**sign** | **int** |  | 
**position** | **str** |  | 
**avg_entry_price** | **str** |  | 
**position_value** | **str** |  | 
**unrealized_pnl** | **str** |  | 
**realized_pnl** | **str** |  | 
**liquidation_price** | **str** |  | 
**total_funding_paid_out** | **str** |  | [optional] 
**margin_mode** | **int** |  | 
**allocated_margin** | **str** |  | 

## Example

```python
from lighter.models.account_position import AccountPosition

# TODO update the JSON string below
json = "{}"
# create an instance of AccountPosition from a JSON string
account_position_instance = AccountPosition.from_json(json)
# print the JSON string representation of the object
print(AccountPosition.to_json())

# convert the object into a dict
account_position_dict = account_position_instance.to_dict()
# create an instance of AccountPosition from a dict
account_position_from_dict = AccountPosition.from_dict(account_position_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


