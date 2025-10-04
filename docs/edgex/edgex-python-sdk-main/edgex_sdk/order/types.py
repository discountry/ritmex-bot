from dataclasses import dataclass
from enum import Enum
from typing import List, Optional, Dict, Any


class TimeInForce(str, Enum):
    """Time in force options for orders."""
    UNKNOWN_TIME_IN_FORCE = "UNKNOWN_TIME_IN_FORCE"
    GOOD_TIL_CANCEL = "GOOD_TIL_CANCEL"
    FILL_OR_KILL = "FILL_OR_KILL"
    IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL"
    POST_ONLY = "POST_ONLY"


class OrderSide(str, Enum):
    """Order side options."""
    BUY = "BUY"
    SELL = "SELL"


class ResponseCode(str, Enum):
    """API response codes."""
    SUCCESS = "SUCCESS"


class OrderType(str, Enum):
    """Order type options."""
    UNKNOWN = "UNKNOWN_ORDER_TYPE"
    LIMIT = "LIMIT"
    MARKET = "MARKET"
    STOP_LIMIT = "STOP_LIMIT"
    STOP_MARKET = "STOP_MARKET"
    TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT"
    TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET"


@dataclass
class OrderFilterParams:
    """Common filter types used across different order APIs."""
    filter_coin_id_list: List[str] = None  # Filter by coin IDs, empty means all coins
    filter_contract_id_list: List[str] = None  # Filter by contract IDs, empty means all contracts
    filter_type_list: List[str] = None  # Filter by order types
    filter_status_list: List[str] = None  # Filter by order statuses
    filter_is_liquidate: Optional[bool] = None  # Filter by liquidation status
    filter_is_deleverage: Optional[bool] = None  # Filter by deleverage status
    filter_is_position_tpsl: Optional[bool] = None  # Filter by position take-profit/stop-loss status
    
    def __post_init__(self):
        """Initialize empty lists."""
        if self.filter_coin_id_list is None:
            self.filter_coin_id_list = []
        if self.filter_contract_id_list is None:
            self.filter_contract_id_list = []
        if self.filter_type_list is None:
            self.filter_type_list = []
        if self.filter_status_list is None:
            self.filter_status_list = []


@dataclass
class PaginationParams:
    """Common pagination parameters."""
    size: str = ""  # Size of the page, must be greater than 0 and less than or equal to 100/200
    offset_data: str = ""  # Offset data for pagination. Empty string gets the first page


@dataclass
class OrderFillTransactionParams(PaginationParams, OrderFilterParams):
    """Parameters for getting order fill transactions."""
    filter_order_id_list: List[str] = None  # Filter by order IDs, empty means all orders
    filter_start_created_time_inclusive: int = 0  # Filter start time (inclusive), 0 means from earliest
    filter_end_created_time_exclusive: int = 0  # Filter end time (exclusive), 0 means until latest
    
    def __post_init__(self):
        """Initialize empty lists."""
        super().__post_init__()
        if self.filter_order_id_list is None:
            self.filter_order_id_list = []


@dataclass
class GetActiveOrderParams(PaginationParams, OrderFilterParams):
    """Parameters for getting active orders."""
    filter_start_created_time_inclusive: int = 0  # Filter start time (inclusive), 0 means from earliest
    filter_end_created_time_exclusive: int = 0  # Filter end time (exclusive), 0 means until latest


@dataclass
class GetHistoryOrderParams(PaginationParams, OrderFilterParams):
    """Parameters for getting historical orders."""
    filter_start_created_time_inclusive: int = 0  # Filter start time (inclusive), 0 means from earliest
    filter_end_created_time_exclusive: int = 0  # Filter end time (exclusive), 0 means until latest


@dataclass
class CreateOrderParams:
    """Parameters for creating an order."""
    contract_id: str
    price: str
    size: str
    type: OrderType
    side: str
    client_order_id: Optional[str] = None
    l2_expire_time: Optional[int] = None
    time_in_force: Optional[str] = None
    reduce_only: bool = False


@dataclass
class CancelOrderParams:
    """Parameters for canceling orders."""
    order_id: str = ""  # Order ID to cancel
    client_id: str = ""  # Client order ID to cancel
    contract_id: str = ""  # Contract ID for canceling all orders


class OrderResponse:
    """Response from creating an order."""
    code: str
    data: Dict[str, Any]
    error_param: Optional[Dict[str, Any]]
    request_time: str
    response_time: str
    trace_id: str
    
    def __init__(self, response_data: Dict[str, Any]):
        """Initialize from response data."""
        self.code = response_data.get("code", "")
        self.data = response_data.get("data", {})
        self.error_param = response_data.get("errorParam")
        self.request_time = response_data.get("requestTime", "")
        self.response_time = response_data.get("responseTime", "")
        self.trace_id = response_data.get("traceId", "")


class MaxOrderSizeResponse(OrderResponse):
    """Response from getting max order size."""
    pass


class OrderListResponse(OrderResponse):
    """Response from getting a list of orders."""
    pass


class OrderPageResponse(OrderResponse):
    """Response from getting paginated orders."""
    pass


class OrderFillTransactionResponse(OrderResponse):
    """Response from getting order fill transactions."""
    pass


@dataclass
class OrderFillFilterParams(OrderFilterParams):
    """Parameters for filtering order fill transactions."""
    filter_order_id_list: List[str] = None  # Filter by order IDs, empty means all orders
    
    def __post_init__(self):
        """Initialize empty lists."""
        super().__post_init__()
        if self.filter_order_id_list is None:
            self.filter_order_id_list = []
