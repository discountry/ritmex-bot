# ReqGetLiquidationInfos


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  made optional to support header auth clients | [optional] 
**account_index** | **int** |  | 
**market_id** | **int** |  | [optional] 
**cursor** | **str** |  | [optional] 
**limit** | **int** |  | 

## Example

```python
from lighter.models.req_get_liquidation_infos import ReqGetLiquidationInfos

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetLiquidationInfos from a JSON string
req_get_liquidation_infos_instance = ReqGetLiquidationInfos.from_json(json)
# print the JSON string representation of the object
print(ReqGetLiquidationInfos.to_json())

# convert the object into a dict
req_get_liquidation_infos_dict = req_get_liquidation_infos_instance.to_dict()
# create an instance of ReqGetLiquidationInfos from a dict
req_get_liquidation_infos_from_dict = ReqGetLiquidationInfos.from_dict(req_get_liquidation_infos_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


