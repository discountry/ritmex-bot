# PnLEntry


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **int** |  | 
**trade_pnl** | **float** |  | 
**trade_spot_pnl** | **float** |  | 
**inflow** | **float** |  | 
**outflow** | **float** |  | 
**spot_outflow** | **float** |  | 
**spot_inflow** | **float** |  | 
**pool_pnl** | **float** |  | 
**pool_inflow** | **float** |  | 
**pool_outflow** | **float** |  | 
**pool_total_shares** | **float** |  | 

## Example

```python
from lighter.models.pn_l_entry import PnLEntry

# TODO update the JSON string below
json = "{}"
# create an instance of PnLEntry from a JSON string
pn_l_entry_instance = PnLEntry.from_json(json)
# print the JSON string representation of the object
print(PnLEntry.to_json())

# convert the object into a dict
pn_l_entry_dict = pn_l_entry_instance.to_dict()
# create an instance of PnLEntry from a dict
pn_l_entry_from_dict = PnLEntry.from_dict(pn_l_entry_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


