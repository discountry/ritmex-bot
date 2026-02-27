# ReqGetOrderBooks


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | [optional] 
**filter** | **str** |  | [optional] [default to 'all']

## Example

```python
from lighter.models.req_get_order_books import ReqGetOrderBooks

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetOrderBooks from a JSON string
req_get_order_books_instance = ReqGetOrderBooks.from_json(json)
# print the JSON string representation of the object
print(ReqGetOrderBooks.to_json())

# convert the object into a dict
req_get_order_books_dict = req_get_order_books_instance.to_dict()
# create an instance of ReqGetOrderBooks from a dict
req_get_order_books_from_dict = ReqGetOrderBooks.from_dict(req_get_order_books_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


