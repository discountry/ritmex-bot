# SharePrice


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **int** |  | 
**share_price** | **float** |  | 

## Example

```python
from lighter.models.share_price import SharePrice

# TODO update the JSON string below
json = "{}"
# create an instance of SharePrice from a JSON string
share_price_instance = SharePrice.from_json(json)
# print the JSON string representation of the object
print(SharePrice.to_json())

# convert the object into a dict
share_price_dict = share_price_instance.to_dict()
# create an instance of SharePrice from a dict
share_price_from_dict = SharePrice.from_dict(share_price_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


