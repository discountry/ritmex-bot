# Order


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**order_index** | **int** |  | 
**client_order_index** | **int** |  | 
**order_id** | **str** |  | 
**client_order_id** | **str** |  | 
**market_index** | **int** |  | 
**owner_account_index** | **int** |  | 
**initial_base_amount** | **str** |  | 
**price** | **str** |  | 
**nonce** | **int** |  | 
**remaining_base_amount** | **str** |  | 
**is_ask** | **bool** |  | 
**base_size** | **int** |  | 
**base_price** | **int** |  | 
**filled_base_amount** | **str** |  | 
**filled_quote_amount** | **str** |  | 
**side** | **str** |  TODO: remove this | [default to 'buy']
**type** | **str** |  | 
**time_in_force** | **str** |  | [default to 'good-till-time']
**reduce_only** | **bool** |  | 
**trigger_price** | **str** |  | 
**order_expiry** | **int** |  | 
**status** | **str** |  | 
**trigger_status** | **str** |  | 
**trigger_time** | **int** |  | 
**parent_order_index** | **int** |  | 
**parent_order_id** | **str** |  | 
**to_trigger_order_id_0** | **str** |  | 
**to_trigger_order_id_1** | **str** |  | 
**to_cancel_order_id_0** | **str** |  | 
**block_height** | **int** |  | 
**timestamp** | **int** |  | 

## Example

```python
from lighter.models.order import Order

# TODO update the JSON string below
json = "{}"
# create an instance of Order from a JSON string
order_instance = Order.from_json(json)
# print the JSON string representation of the object
print(Order.to_json())

# convert the object into a dict
order_dict = order_instance.to_dict()
# create an instance of Order from a dict
order_from_dict = Order.from_dict(order_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


