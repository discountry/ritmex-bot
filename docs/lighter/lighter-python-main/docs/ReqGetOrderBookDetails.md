# ReqGetOrderBookDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**market_id** | **int** |  | [optional] 
**filter** | **str** |  | [optional] [default to 'all']

## Example

```python
from lighter.models.req_get_order_book_details import ReqGetOrderBookDetails

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetOrderBookDetails from a JSON string
req_get_order_book_details_instance = ReqGetOrderBookDetails.from_json(json)
# print the JSON string representation of the object
print(ReqGetOrderBookDetails.to_json())

# convert the object into a dict
req_get_order_book_details_dict = req_get_order_book_details_instance.to_dict()
# create an instance of ReqGetOrderBookDetails from a dict
req_get_order_book_details_from_dict = ReqGetOrderBookDetails.from_dict(req_get_order_book_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


