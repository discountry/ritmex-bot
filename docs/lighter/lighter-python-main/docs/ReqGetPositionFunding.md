# ReqGetPositionFunding


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth** | **str** |  | [optional] 
**account_index** | **int** |  | 
**market_id** | **int** |  | [optional] 
**cursor** | **str** |  | [optional] 
**limit** | **int** |  | 
**side** | **str** |  | [optional] [default to 'all']

## Example

```python
from lighter.models.req_get_position_funding import ReqGetPositionFunding

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetPositionFunding from a JSON string
req_get_position_funding_instance = ReqGetPositionFunding.from_json(json)
# print the JSON string representation of the object
print(ReqGetPositionFunding.to_json())

# convert the object into a dict
req_get_position_funding_dict = req_get_position_funding_instance.to_dict()
# create an instance of ReqGetPositionFunding from a dict
req_get_position_funding_from_dict = ReqGetPositionFunding.from_dict(req_get_position_funding_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


