"""
EdgeX Python SDK - A Python SDK for interacting with the EdgeX Exchange API.
"""

from .client import Client
from .internal.signing_adapter import SigningAdapter
from .internal.starkex_signing_adapter import StarkExSigningAdapter
from .order.types import (
    OrderType,
    OrderSide,
    TimeInForce,
    CreateOrderParams,
    CancelOrderParams,
    GetActiveOrderParams,
    OrderFillTransactionParams
)
from .account.client import (
    GetPositionTransactionPageParams,
    GetCollateralTransactionPageParams,
    GetPositionTermPageParams,
    GetAccountAssetSnapshotPageParams
)
from .quote.client import (
    GetKLineParams,
    GetOrderBookDepthParams,
    GetMultiContractKLineParams
)
from .transfer.client import (
    GetTransferOutByIdParams,
    GetTransferInByIdParams,
    GetWithdrawAvailableAmountParams,
    CreateTransferOutParams,
    GetTransferOutPageParams,
    GetTransferInPageParams
)
from .asset.client import (
    GetAssetOrdersParams,
    CreateWithdrawalParams,
    GetWithdrawalRecordsParams
)
from .ws.manager import Manager as WebSocketManager

__version__ = "0.2.0"
__all__ = [
    "Client",
    "OrderType",
    "OrderSide",
    "TimeInForce",
    "CreateOrderParams",
    "CancelOrderParams",
    "GetActiveOrderParams",
    "OrderFillTransactionParams",
    "GetPositionTransactionPageParams",
    "GetCollateralTransactionPageParams",
    "GetPositionTermPageParams",
    "GetAccountAssetSnapshotPageParams",
    "GetKLineParams",
    "GetOrderBookDepthParams",
    "GetMultiContractKLineParams",
    "GetTransferOutByIdParams",
    "GetTransferInByIdParams",
    "GetWithdrawAvailableAmountParams",
    "CreateTransferOutParams",
    "GetTransferOutPageParams",
    "GetTransferInPageParams",
    "GetAssetOrdersParams",
    "CreateWithdrawalParams",
    "GetWithdrawalRecordsParams",
    "WebSocketManager",
    "SigningAdapter",
    "StarkExSigningAdapter"
]