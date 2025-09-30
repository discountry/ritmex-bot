# OrderBooks


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**order_books** | [**List[OrderBook]**](OrderBook.md) |  | 

## Example

```python
from lighter.models.order_books import OrderBooks

# TODO update the JSON string below
json = "{}"
# create an instance of OrderBooks from a JSON string
order_books_instance = OrderBooks.from_json(json)
# print the JSON string representation of the object
print(OrderBooks.to_json())

# convert the object into a dict
order_books_dict = order_books_instance.to_dict()
# create an instance of OrderBooks from a dict
order_books_from_dict = OrderBooks.from_dict(order_books_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


