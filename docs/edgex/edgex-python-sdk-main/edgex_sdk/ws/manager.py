import logging
from typing import Dict, Any, List, Optional, Callable

from ..internal.signing_adapter import SigningAdapter
from ..internal.starkex_signing_adapter import StarkExSigningAdapter
from .client import Client


class Manager:
    """Manager for WebSocket connections."""

    def __init__(self, base_url: str, account_id: int, stark_pri_key: str, signing_adapter: Optional[SigningAdapter] = None):
        """
        Initialize the WebSocket manager.

        Args:
            base_url: Base WebSocket URL
            account_id: Account ID for authentication
            stark_pri_key: Stark private key for signing
            signing_adapter: Optional signing adapter (defaults to StarkExSigningAdapter)
        """
        self.base_url = base_url
        self.account_id = account_id
        self.stark_pri_key = stark_pri_key

        # Use StarkExSigningAdapter as default if none provided
        if signing_adapter is None:
            signing_adapter = StarkExSigningAdapter()
        self.signing_adapter = signing_adapter

        self.public_client = None
        self.private_client = None

        self.logger = logging.getLogger(__name__)

    def get_public_client(self) -> Client:
        """
        Get the public WebSocket client.

        Returns:
            Client: The public WebSocket client
        """
        if not self.public_client:
            self.public_client = Client(
                url=f"{self.base_url}/api/v1/public/ws",
                is_private=False,
                account_id=self.account_id,
                stark_pri_key=self.stark_pri_key,
                signing_adapter=self.signing_adapter
            )

        return self.public_client

    def get_private_client(self) -> Client:
        """
        Get the private WebSocket client.

        Returns:
            Client: The private WebSocket client
        """
        if not self.private_client:
            self.private_client = Client(
                url=f"{self.base_url}/api/v1/private/ws?accountId={self.account_id}",
                is_private=True,
                account_id=self.account_id,
                stark_pri_key=self.stark_pri_key,
                signing_adapter=self.signing_adapter
            )

        return self.private_client

    def connect_public(self):
        """
        Connect to the public WebSocket.

        Raises:
            ValueError: If the connection fails
        """
        client = self.get_public_client()
        client.connect()

    def connect_private(self):
        """
        Connect to the private WebSocket.

        Raises:
            ValueError: If the connection fails
        """
        client = self.get_private_client()
        client.connect()

    def disconnect_public(self):
        """Disconnect from the public WebSocket."""
        if self.public_client:
            self.public_client.close()

    def disconnect_private(self):
        """Disconnect from the private WebSocket."""
        if self.private_client:
            self.private_client.close()

    def disconnect_all(self):
        """Disconnect from all WebSockets."""
        self.disconnect_public()
        self.disconnect_private()

    def subscribe_ticker(self, contract_id: str, handler: Callable[[str], None]):
        """
        Subscribe to ticker updates for a contract.

        Args:
            contract_id: The contract ID
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_public_client()

        # Register handler
        client.on_message("ticker", handler)

        # Subscribe to ticker channel
        channel = f"ticker.{contract_id}"
        client.subscribe(channel)

    def subscribe_kline(self, contract_id: str, interval: str, handler: Callable[[str], None]):
        """
        Subscribe to K-line updates for a contract.

        Args:
            contract_id: The contract ID
            interval: The K-line interval
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_public_client()

        # Register handler
        client.on_message("kline", handler)

        # Subscribe to kline channel
        channel = f"kline.{contract_id}.{interval}"
        client.subscribe(channel)

    def subscribe_depth(self, contract_id: str, handler: Callable[[str], None]):
        """
        Subscribe to depth updates for a contract.

        Args:
            contract_id: The contract ID
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_public_client()

        # Register handler
        client.on_message("depth", handler)

        # Subscribe to depth channel
        channel = f"depth.{contract_id}"
        client.subscribe(channel)

    def subscribe_trade(self, contract_id: str, handler: Callable[[str], None]):
        """
        Subscribe to trade updates for a contract.

        Args:
            contract_id: The contract ID
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_public_client()

        # Register handler
        client.on_message("trade", handler)

        # Subscribe to trade channel
        channel = f"trade.{contract_id}"
        client.subscribe(channel)

    def subscribe_account_update(self, handler: Callable[[str], None]):
        """
        Subscribe to account updates.

        Args:
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_private_client()

        # Register handler
        client.on_message("account", handler)

    def subscribe_order_update(self, handler: Callable[[str], None]):
        """
        Subscribe to order updates.

        Args:
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_private_client()

        # Register handler
        client.on_message("order", handler)

    def subscribe_position_update(self, handler: Callable[[str], None]):
        """
        Subscribe to position updates.

        Args:
            handler: The handler function

        Raises:
            ValueError: If the subscription fails
        """
        client = self.get_private_client()

        # Register handler
        client.on_message("position", handler)
