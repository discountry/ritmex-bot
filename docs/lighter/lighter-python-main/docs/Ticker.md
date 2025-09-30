# Ticker


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**s** | **str** |  | 
**a** | [**PriceLevel**](PriceLevel.md) |  | 
**b** | [**PriceLevel**](PriceLevel.md) |  | 

## Example

```python
from lighter.models.ticker import Ticker

# TODO update the JSON string below
json = "{}"
# create an instance of Ticker from a JSON string
ticker_instance = Ticker.from_json(json)
# print the JSON string representation of the object
print(Ticker.to_json())

# convert the object into a dict
ticker_dict = ticker_instance.to_dict()
# create an instance of Ticker from a dict
ticker_from_dict = Ticker.from_dict(ticker_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


