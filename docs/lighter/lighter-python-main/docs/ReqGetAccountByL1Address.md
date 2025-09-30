# ReqGetAccountByL1Address


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**l1_address** | **str** |  | 

## Example

```python
from lighter.models.req_get_account_by_l1_address import ReqGetAccountByL1Address

# TODO update the JSON string below
json = "{}"
# create an instance of ReqGetAccountByL1Address from a JSON string
req_get_account_by_l1_address_instance = ReqGetAccountByL1Address.from_json(json)
# print the JSON string representation of the object
print(ReqGetAccountByL1Address.to_json())

# convert the object into a dict
req_get_account_by_l1_address_dict = req_get_account_by_l1_address_instance.to_dict()
# create an instance of ReqGetAccountByL1Address from a dict
req_get_account_by_l1_address_from_dict = ReqGetAccountByL1Address.from_dict(req_get_account_by_l1_address_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


