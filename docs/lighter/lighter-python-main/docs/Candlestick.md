# Candlestick


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **int** |  | 
**open** | **float** |  | 
**high** | **float** |  | 
**low** | **float** |  | 
**close** | **float** |  | 
**open_raw** | **float** |  | 
**high_raw** | **float** |  | 
**low_raw** | **float** |  | 
**close_raw** | **float** |  | 
**volume0** | **float** |  | 
**volume1** | **float** |  | 
**last_trade_id** | **int** |  | 

## Example

```python
from lighter.models.candlestick import Candlestick

# TODO update the JSON string below
json = "{}"
# create an instance of Candlestick from a JSON string
candlestick_instance = Candlestick.from_json(json)
# print the JSON string representation of the object
print(Candlestick.to_json())

# convert the object into a dict
candlestick_dict = candlestick_instance.to_dict()
# create an instance of Candlestick from a dict
candlestick_from_dict = Candlestick.from_dict(candlestick_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


