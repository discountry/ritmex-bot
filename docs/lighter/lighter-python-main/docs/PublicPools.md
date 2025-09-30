# PublicPools


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**total** | **int** |  | 
**public_pools** | [**List[PublicPool]**](PublicPool.md) |  | 

## Example

```python
from lighter.models.public_pools import PublicPools

# TODO update the JSON string below
json = "{}"
# create an instance of PublicPools from a JSON string
public_pools_instance = PublicPools.from_json(json)
# print the JSON string representation of the object
print(PublicPools.to_json())

# convert the object into a dict
public_pools_dict = public_pools_instance.to_dict()
# create an instance of PublicPools from a dict
public_pools_from_dict = PublicPools.from_dict(public_pools_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


