# PublicPoolShare


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**public_pool_index** | **int** |  | 
**shares_amount** | **int** |  | 
**entry_usdc** | **str** |  | 

## Example

```python
from lighter.models.public_pool_share import PublicPoolShare

# TODO update the JSON string below
json = "{}"
# create an instance of PublicPoolShare from a JSON string
public_pool_share_instance = PublicPoolShare.from_json(json)
# print the JSON string representation of the object
print(PublicPoolShare.to_json())

# convert the object into a dict
public_pool_share_dict = public_pool_share_instance.to_dict()
# create an instance of PublicPoolShare from a dict
public_pool_share_from_dict = PublicPoolShare.from_dict(public_pool_share_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


