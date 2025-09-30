import json
from typing import Optional


class Withdraw:
    def __init__(self):
        self.from_account_index: Optional[int] = None
        self.collateral_amount: Optional[int] = None
        self.expired_at: Optional[int] = None
        self.nonce: Optional[int] = None
        self.sig: Optional[str] = None

    @classmethod
    def from_json(cls, json_str: str) -> 'Withdraw':
        params = json.loads(json_str)
        instance = cls()
        instance.from_account_index = params.get('FromAccountIndex')
        instance.collateral_amount = params.get('CollateralAmount')
        instance.expired_at = params.get('ExpiredAt')
        instance.nonce = params.get('Nonce')
        instance.sig = params.get('Sig')
        return instance

    def to_json(self) -> str:
        return json.dumps(self.__dict__, default=str)
