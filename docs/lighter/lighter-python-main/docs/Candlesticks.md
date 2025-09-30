# Candlesticks


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**resolution** | **str** |  | 
**candlesticks** | [**List[Candlestick]**](Candlestick.md) |  | 

## Example

```python
from lighter.models.candlesticks import Candlesticks

# TODO update the JSON string below
json = "{}"
# create an instance of Candlesticks from a JSON string
candlesticks_instance = Candlesticks.from_json(json)
# print the JSON string representation of the object
print(Candlesticks.to_json())

# convert the object into a dict
candlesticks_dict = candlesticks_instance.to_dict()
# create an instance of Candlesticks from a dict
candlesticks_from_dict = Candlesticks.from_dict(candlesticks_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


