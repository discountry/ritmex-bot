# DetailedCandlestick


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
**trade_count** | **int** |  | 

## Example

```python
from lighter.models.detailed_candlestick import DetailedCandlestick

# TODO update the JSON string below
json = "{}"
# create an instance of DetailedCandlestick from a JSON string
detailed_candlestick_instance = DetailedCandlestick.from_json(json)
# print the JSON string representation of the object
print(DetailedCandlestick.to_json())

# convert the object into a dict
detailed_candlestick_dict = detailed_candlestick_instance.to_dict()
# create an instance of DetailedCandlestick from a dict
detailed_candlestick_from_dict = DetailedCandlestick.from_dict(detailed_candlestick_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


