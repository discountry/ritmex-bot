import json
from typing import Optional


class CreateOrder:
    def __init__(self):
        self.account_index: Optional[int] = None
        self.order_book_index: Optional[int] = None
        self.base_amount: Optional[int] = None
        self.price: Optional[int] = None
        self.is_ask: Optional[int] = None
        self.order_type: Optional[int] = None
        self.expired_at: Optional[int] = None
        self.nonce: Optional[int] = None
        self.sig: Optional[str] = None

    @classmethod
    def from_json(cls, json_str: str) -> 'CreateOrder':
        params = json.loads(json_str)
        self = cls()
        self.account_index = params.get('AccountIndex')
        self.order_book_index = params.get('OrderBookIndex')
        self.base_amount = params.get('BaseAmount')
        self.price = params.get('Price')
        self.is_ask = params.get('IsAsk')
        self.order_type = params.get('OrderType')
        self.expired_at = params.get('ExpiredAt')
        self.nonce = params.get('Nonce')
        self.sig = params.get('Sig')
        return self

    def to_json(self) -> str:
        return json.dumps(self.__dict__, default=str)
