import json
from typing import Optional

class CreateGroupedOrders:
    def __init__(self):
        self.account_index: Optional[int] = None
        self.order_book_index: Optional[int] = None
        self.grouping_type: Optional[int] = None
        self.orders: Optional[list] = None
        self.nonce: Optional[int] = None
        self.sig: Optional[str] = None

    @classmethod
    def from_json(cls, json_str: str) -> 'CreateGroupedOrders':
        params = json.loads(json_str)
        self = cls()
        self.account_index = params.get('AccountIndex')
        self.order_book_index = params.get('OrderBookIndex')
        self.grouping_type = params.get('GroupingType') 
        self.orders = params.get('Orders')
        self.nonce = params.get('Nonce')
        self.sig = params.get('Sig')
        return self

    def to_json(self) -> str:
        return json.dumps(self.__dict__, default=str)
