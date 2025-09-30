# ReqGetCandlesticks


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | 
**resolution** | **str** |  | 
**start_timestamp** | **int** |  | 
**end_timestamp** | **int** |  | 
**count_back** | **int** |  | 
**set_timestamp_to_end** | **bool** |  | [optional] [default to False]

## Example

```python
from lighter.models.req_get_candlesticks import ReqGetCandlesticks

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetCandlesticks from a JSON string
req_get_candlesticks_instance = ReqGetCandlesticks.from_json(json)
# print the JSON string representation of the object
print(ReqGetCandlesticks.to_json())

# convert the object into a dict
req_get_candlesticks_dict = req_get_candlesticks_instance.to_dict()
# create an instance of ReqGetCandlesticks from a dict
req_get_candlesticks_from_dict = ReqGetCandlesticks.from_dict(req_get_candlesticks_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


