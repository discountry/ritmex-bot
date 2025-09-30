# Blocks


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** |  | 
**message** | **str** |  | [optional] 
**total** | **int** |  | 
**blocks** | [**List[Block]**](Block.md) |  | 

## Example

```python
from lighter.models.blocks import Blocks

# TODO update the JSON string below
json = "{}"
# create an instance of Blocks from a JSON string
blocks_instance = Blocks.from_json(json)
# print the JSON string representation of the object
print(Blocks.to_json())

# convert the object into a dict
blocks_dict = blocks_instance.to_dict()
# create an instance of Blocks from a dict
blocks_from_dict = Blocks.from_dict(blocks_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


