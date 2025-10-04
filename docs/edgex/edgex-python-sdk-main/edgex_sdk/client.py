import json
import time
from typing import Dict, Any, Optional, List, Union
from decimal import Decimal

from .internal.async_client import AsyncClient
from .internal.signing_adapter import SigningAdapter
from .internal.starkex_signing_adapter import StarkExSigningAdapter
from .account.client import Client as AccountClient
from .asset.client import Client as AssetClient
from .funding.client import Client as FundingClient
from .metadata.client import Client as MetadataClient
from .order.client import Client as OrderClient
from .quote.client import Client as QuoteClient
from .transfer.client import Client as TransferClient
from .order.types import CreateOrderParams, CancelOrderParams, GetActiveOrderParams, OrderFillTransactionParams


class Client:
    """Main EdgeX SDK client."""

    def __init__(self, base_url: str, account_id: int, stark_private_key: str,
                 signing_adapter: Optional[SigningAdapter] = None, timeout: float = 30.0):
        """
        Initialize the EdgeX SDK client.

        Args:
            base_url: Base URL for API endpoints
            account_id: Account ID for authentication
            stark_private_key: Stark private key for signing
            signing_adapter: Optional signing adapter (defaults to StarkExSigningAdapter)
            timeout: Request timeout in seconds
        """
        # Use StarkExSigningAdapter as default if none provided
        if signing_adapter is None:
            signing_adapter = StarkExSigningAdapter()

        # Create async client
        self.async_client = AsyncClient(
            base_url=base_url,
            account_id=account_id,
            stark_pri_key=stark_private_key,
            signing_adapter=signing_adapter,
            timeout=timeout
        )

        # Initialize API clients
        self.metadata = MetadataClient(self.async_client)
        self.account = AccountClient(self.async_client)
        self.order = OrderClient(self.async_client)
        self.quote = QuoteClient(self.async_client)
        self.funding = FundingClient(self.async_client)
        self.transfer = TransferClient(self.async_client)
        self.asset = AssetClient(self.async_client)

    async def __aenter__(self):
        """Async context manager entry."""
        await self.async_client._ensure_session()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()

    async def close(self):
        """Close the client and cleanup resources."""
        await self.async_client.close()

    @property
    def internal_client(self):
        """Backward compatibility property for accessing internal client."""
        return self.async_client

    async def get_metadata(self) -> Dict[str, Any]:
        """Get the exchange metadata."""
        return await self.metadata.get_metadata()

    async def get_server_time(self) -> Dict[str, Any]:
        """Get the current server time."""
        return await self.metadata.get_server_time()

    async def create_order(self, params: CreateOrderParams) -> Dict[str, Any]:
        """
        Create a new order with the given parameters.

        Args:
            params: Order parameters

        Returns:
            Dict[str, Any]: The created order
        """
        # Get metadata first
        metadata = await self.get_metadata()
        if not metadata:
            raise ValueError("failed to get metadata")

        return await self.order.create_order(params, metadata.get("data", {}))

    async def get_max_order_size(self, contract_id: str, price: Decimal) -> Dict[str, Any]:
        """
        Get the maximum order size for a given contract and price.

        Args:
            contract_id: The contract ID
            price: The price

        Returns:
            Dict[str, Any]: The maximum order size information
        """
        return await self.order.get_max_order_size(contract_id, float(price))

    async def cancel_order(self, params: CancelOrderParams) -> Dict[str, Any]:
        """
        Cancel a specific order.

        Args:
            params: Cancel order parameters

        Returns:
            Dict[str, Any]: The cancellation result
        """
        return await self.order.cancel_order(params)

    async def get_active_orders(self, params: GetActiveOrderParams) -> Dict[str, Any]:
        """
        Get active orders with pagination and filters.

        Args:
            params: Active order query parameters

        Returns:
            Dict[str, Any]: The active orders
        """
        return await self.order.get_active_orders(params)

    async def get_order_fill_transactions(self, params: OrderFillTransactionParams) -> Dict[str, Any]:
        """
        Get order fill transactions with pagination and filters.

        Args:
            params: Order fill transaction query parameters

        Returns:
            Dict[str, Any]: The order fill transactions
        """
        return await self.order.get_order_fill_transactions(params)

    async def get_account_asset(self) -> Dict[str, Any]:
        """Get the account asset information."""
        return await self.account.get_account_asset()

    async def get_account_positions(self) -> Dict[str, Any]:
        """Get the account positions."""
        return await self.account.get_account_positions()

    async def create_limit_order(
        self,
        contract_id: str,
        size: str,
        price: str,
        side: str,
        client_order_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new limit order with the given parameters.

        Args:
            contract_id: The contract ID
            size: The order size
            price: The order price
            side: The order side (BUY or SELL)
            client_order_id: Optional client order ID

        Returns:
            Dict[str, Any]: The created order
        """
        from .order.types import OrderType

        params = CreateOrderParams(
            contract_id=contract_id,
            size=size,
            price=price,
            side=side,
            type=OrderType.LIMIT,
            client_order_id=client_order_id
        )

        return await self.create_order(params)

    async def create_market_order(
        self,
        contract_id: str,
        size: str,
        side: str,
        client_order_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new market order with the given parameters.

        Args:
            contract_id: The contract ID
            size: The order size
            side: The order side (BUY or SELL)
            client_order_id: Optional client order ID

        Returns:
            Dict[str, Any]: The created order
        """
        # Get metadata for contract info
        metadata = await self.get_metadata()
        if not metadata:
            raise ValueError("failed to get metadata")

        # Find the contract
        contract = None
        contract_list = metadata.get("data", {}).get("contractList", [])
        for c in contract_list:
            if c.get("contractId") == contract_id:
                contract = c
                break

        if not contract:
            raise ValueError(f"contract not found: {contract_id}")

        # Calculate price based on side
        from .order.types import OrderSide, OrderType

        if side == OrderSide.BUY:
            # For buy orders: oracle_price * 10, rounded to price precision
            quote = await self.get_24_hour_quote(contract_id)
            if not quote:
                raise ValueError("failed to get 24-hour quotes")

            oracle_price = Decimal(quote.get("data", [])[0].get("oraclePrice", "0"))
            multiplier = Decimal("10")
            tick_size = Decimal(contract.get("tickSize", "0"))
            precision = abs(tick_size.as_tuple().exponent)
            price = str(round(oracle_price * multiplier, precision))
        else:
            # For sell orders: use tick size
            price = contract.get("tickSize", "0")

        params = CreateOrderParams(
            contract_id=contract_id,
            size=size,
            price=price,
            side=side,
            type=OrderType.MARKET,
            client_order_id=client_order_id
        )

        return await self.create_order(params)

    async def get_24_hour_quote(self, contract_id: str) -> Dict[str, Any]:
        """
        Get the 24-hour quotes for a given contract.

        Args:
            contract_id: The contract ID

        Returns:
            Dict[str, Any]: The 24-hour quotes
        """
        return await self.quote.get_24_hour_quote(contract_id)
