from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from lighter.models.account_asset import AccountAsset
from pydantic import BaseModel, ConfigDict, StrictInt, StrictStr, Field
from typing import Any, ClassVar, Dict, List
from typing import Optional, Set

class WSAccountAssets(BaseModel):
    type: StrictStr
    channel: StrictStr
    assets: Dict[StrictStr, AccountAsset]
    account_id: StrictInt

    additional_properties: Dict[str, Any] = Field(default_factory=dict)
    __properties: ClassVar[List[str]] = ["type", "channel", "assets"]

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        protected_namespaces=(),
    )

    def to_str(self) -> str:
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Optional["WSAccountAssets"]:
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        excluded_fields: Set[str] = {"additional_properties"}

        # dump base fields
        _dict = self.model_dump(
            by_alias=True,
            exclude=excluded_fields,
            exclude_none=True,
        )

        # add extra fields
        if self.additional_properties is not None:
            for _key, _value in self.additional_properties.items():
                _dict[_key] = _value

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional["WSAccountAssets"]:
        if obj["type"] != "subscribed/account_all_assets" and obj["type"] != "update/account_all_assets":
            raise ValueError(f"invalid type {obj['type']} for WSAccountAssets")

        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        # parse inner assets dict into AccountAsset objects
        raw_assets = obj.get("assets") or {}
        parsed_assets: Dict[str, AccountAsset] = {
            k: AccountAsset.from_dict(v) for k, v in raw_assets.items()
        }

        account_id = int(obj.get("channel").split(":")[1])

        _obj = cls.model_validate(
            {
                "type": obj.get("type"),
                "channel": obj.get("channel"),
                "assets": parsed_assets,
                "account_id": account_id
            }
        )

        # store additional fields
        for _key in obj.keys():
            if _key not in cls.__properties:
                _obj.additional_properties[_key] = obj.get(_key)

        return _obj