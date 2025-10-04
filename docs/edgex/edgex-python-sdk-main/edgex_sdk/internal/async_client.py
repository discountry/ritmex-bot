import asyncio
import binascii
import hashlib
import time
import uuid
from typing import Dict, Any, Optional, Tuple, List, Union
import json

import aiohttp
from Crypto.Hash import keccak

from .signing_adapter import SigningAdapter

# Import field prime for modular arithmetic
try:
    from ..crypto.constants import FIELD_PRIME
except ImportError:
    # Fallback if crypto module is not available
    FIELD_PRIME = 0x800000000000011000000000000000000000000000000000000000000000001

# Constants
LIMIT_ORDER_WITH_FEE_TYPE = 3


class L2Signature:
    """Represents a signature for L2 operations."""

    def __init__(self, r: str, s: str, v: str = ""):
        self.r = r
        self.s = s
        self.v = v


class AsyncClient:
    """Async base client with common functionality."""

    def __init__(self, base_url: str, account_id: int, stark_pri_key: str, 
                 signing_adapter: Optional[SigningAdapter] = None,
                 timeout: float = 30.0, connector_limit: int = 100):
        """
        Initialize the async internal client.

        Args:
            base_url: Base URL for API endpoints
            account_id: Account ID for authentication
            stark_pri_key: Stark private key for signing
            signing_adapter: Optional signing adapter to use for cryptographic operations
            timeout: Request timeout in seconds
            connector_limit: Maximum number of connections in the pool
        """
        self.base_url = base_url
        self.account_id = account_id
        self.stark_pri_key = stark_pri_key
        
        # Use the provided signing adapter (required)
        if signing_adapter is None:
            raise ValueError("signing_adapter is required")
        self.signing_adapter = signing_adapter
        
        # Store configuration for later session creation
        self._session = None
        self._timeout = timeout
        self._connector_limit = connector_limit
        self._closed = False

    async def __aenter__(self):
        """Async context manager entry."""
        await self._ensure_session()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()

    async def _ensure_session(self):
        """Ensure the aiohttp session is created."""
        if self._session is None or self._session.closed:
            # Create connector and session when needed (inside event loop)
            timeout_config = aiohttp.ClientTimeout(total=self._timeout)
            connector = aiohttp.TCPConnector(
                limit=self._connector_limit,
                limit_per_host=30,
                keepalive_timeout=30,
                enable_cleanup_closed=True
            )

            self._session = aiohttp.ClientSession(
                timeout=timeout_config,
                connector=connector,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            )

    async def close(self):
        """Close the HTTP session and cleanup resources."""
        if self._session and not self._session.closed:
            await self._session.close()
        self._closed = True

    @property
    def session(self) -> aiohttp.ClientSession:
        """Get the HTTP session, ensuring it's created."""
        if self._session is None or self._session.closed:
            raise RuntimeError("Session not initialized. Use 'async with client:' or call '_ensure_session()'")
        return self._session

    def get_account_id(self) -> int:
        """Get the account ID."""
        return self.account_id

    def get_stark_pri_key(self) -> str:
        """Get the stark private key."""
        return self.stark_pri_key

    def sign(self, message_hash: bytes) -> L2Signature:
        """
        Sign a message hash using the client's Stark private key.

        Args:
            message_hash: The hash of the message to sign

        Returns:
            L2Signature: The signature components

        Raises:
            ValueError: If the stark private key is not set or invalid
        """
        private_key = self.get_stark_pri_key()
        if not private_key:
            raise ValueError("stark private key not set")

        # Sign the message using the signing adapter
        try:
            r, s = self.signing_adapter.sign(message_hash, private_key)
            return L2Signature(r=r, s=s, v="")
        except Exception as e:
            raise ValueError(f"failed to sign message: {str(e)}")

    def generate_uuid(self) -> str:
        """Generate a UUID for client order IDs."""
        return str(uuid.uuid4())

    def calc_nonce(self, client_order_id: str) -> int:
        """
        Calculate a nonce from a client order ID.

        Args:
            client_order_id: The client order ID

        Returns:
            int: The calculated nonce
        """
        # Use SHA256 like the Go SDK (not Keccak256)
        h = hashlib.sha256()
        h.update(client_order_id.encode())
        hash_hex = h.hexdigest()
        return int(hash_hex[:8], 16)

    async def make_authenticated_request(
        self, 
        method: str, 
        path: str, 
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make an authenticated HTTP request.

        Args:
            method: HTTP method (GET, POST, etc.)
            path: API path (e.g., '/api/v1/private/order/createOrder')
            data: JSON data for POST requests
            params: Query parameters for GET requests

        Returns:
            Dict[str, Any]: Response JSON data

        Raises:
            ValueError: If the request fails
        """
        await self._ensure_session()
        
        # Generate timestamp
        timestamp = int(time.time() * 1000)
        
        # Build full URL
        url = f"{self.base_url}{path}"
        
        # Generate signature content
        sign_content = self._build_signature_content(timestamp, method, path, data, params)
        
        # Sign the content
        keccak_hash = keccak.new(digest_bits=256)
        keccak_hash.update(sign_content.encode())
        content_hash = keccak_hash.digest()
        
        sig = self.sign(content_hash)
        
        # Prepare headers
        headers = {
            "X-edgeX-Api-Timestamp": str(timestamp),
            "X-edgeX-Api-Signature": f"{sig.r}{sig.s}"
        }
        
        # Make the request
        try:
            async with self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                headers=headers
            ) as response:
                if response.status != 200:
                    try:
                        error_detail = await response.json()
                        raise ValueError(f"request failed with status code: {response.status}, response: {error_detail}")
                    except (aiohttp.ContentTypeError, json.JSONDecodeError):
                        text = await response.text()
                        raise ValueError(f"request failed with status code: {response.status}, response: {text}")
                
                resp_data = await response.json()
                
                # Check response code
                if resp_data.get("code") != "SUCCESS":
                    error_param = resp_data.get("errorParam")
                    if error_param:
                        raise ValueError(f"request failed with error params: {error_param}")
                    raise ValueError(f"request failed with code: {resp_data.get('code')}")
                
                return resp_data
                
        except aiohttp.ClientError as e:
            raise ValueError(f"HTTP request failed: {str(e)}")

    def _build_signature_content(
        self, 
        timestamp: int, 
        method: str, 
        path: str, 
        data: Optional[Dict[str, Any]], 
        params: Optional[Dict[str, Any]]
    ) -> str:
        """Build the content string for signature generation."""
        if data:
            # Convert body to sorted string format
            body_str = self.get_value(data)
            sign_content = f"{timestamp}{method}{path}{body_str}"
        else:
            # For requests without body, use query parameters if present
            if params:
                # Sort query parameters as strings (matching Go SDK exactly)
                param_pairs = []
                for key, value in sorted(params.items()):
                    param_pairs.append(f"{key}={value}")
                query_string = "&".join(param_pairs)
                sign_content = f"{timestamp}{method}{path}{query_string}"
            else:
                sign_content = f"{timestamp}{method}{path}"
        
        return sign_content

    def get_value(self, data: Union[Dict[str, Any], List[Any], str, int, float, None]) -> str:
        """
        Convert a value to a string representation for signing.
        This function recursively processes dictionaries, lists, and primitive types.

        Args:
            data: The value to convert

        Returns:
            str: The string representation
        """
        if data is None:
            return ""

        if isinstance(data, str):
            return data

        if isinstance(data, bool):
            # Convert boolean to lowercase string to match Go SDK
            return str(data).lower()

        if isinstance(data, (int, float)):
            return str(data)

        if isinstance(data, list):
            if len(data) == 0:
                return ""
            values = [self.get_value(item) for item in data]
            return "&".join(values)

        if isinstance(data, dict):
            # Convert all values to strings and sort by keys
            sorted_map = {}
            for key, val in data.items():
                sorted_map[key] = self.get_value(val)

            # Get sorted keys
            keys = sorted(sorted_map.keys())

            # Build key=value pairs
            pairs = [f"{key}={sorted_map[key]}" for key in keys]
            return "&".join(pairs)

        # Handle other types by converting to string
        return str(data)

    def calc_limit_order_hash(
        self,
        synthetic_asset_id: str,
        collateral_asset_id: str,
        fee_asset_id: str,
        is_buy: bool,
        amount_synthetic: int,
        amount_collateral: int,
        amount_fee: int,
        nonce: int,
        account_id: int,
        expire_time: int
    ) -> bytes:
        """
        Calculate the hash for a limit order using StarkEx protocol.

        Args:
            synthetic_asset_id: The synthetic asset ID (hex string)
            collateral_asset_id: The collateral asset ID (hex string)
            fee_asset_id: The fee asset ID (hex string)
            is_buy: Whether the order is a buy order
            amount_synthetic: The synthetic amount
            amount_collateral: The collateral amount
            amount_fee: The fee amount
            nonce: The nonce
            account_id: The account ID (position ID)
            expire_time: The expiration time

        Returns:
            bytes: The calculated hash
        """
        # Remove 0x prefix if present
        if synthetic_asset_id.startswith('0x'):
            synthetic_asset_id = synthetic_asset_id[2:]
        if collateral_asset_id.startswith('0x'):
            collateral_asset_id = collateral_asset_id[2:]
        if fee_asset_id.startswith('0x'):
            fee_asset_id = fee_asset_id[2:]

        # Convert hex strings to integers and ensure they're within the field
        asset_id_synthetic = int(synthetic_asset_id, 16) % FIELD_PRIME
        asset_id_collateral = int(collateral_asset_id, 16) % FIELD_PRIME
        asset_id_fee = int(fee_asset_id, 16) % FIELD_PRIME

        # Determine buy/sell assets based on order direction
        if is_buy:
            asset_id_sell = asset_id_collateral
            asset_id_buy = asset_id_synthetic
            amount_sell = amount_collateral
            amount_buy = amount_synthetic
        else:
            asset_id_sell = asset_id_synthetic
            asset_id_buy = asset_id_collateral
            amount_sell = amount_synthetic
            amount_buy = amount_collateral

        # Use the signing adapter to calculate the Pedersen hash
        # First hash: hash(asset_id_sell, asset_id_buy)
        msg = self.signing_adapter.pedersen_hash([asset_id_sell, asset_id_buy])
        msg_int = int.from_bytes(msg, byteorder='big')

        # Second hash: hash(msg, asset_id_fee)
        msg = self.signing_adapter.pedersen_hash([msg_int, asset_id_fee])
        msg_int = int.from_bytes(msg, byteorder='big')

        # Pack message 0
        # packed_message0 = amount_sell * 2^64 + amount_buy * 2^64 + max_amount_fee * 2^32 + nonce
        packed_message0 = amount_sell
        packed_message0 = (packed_message0 << 64) + amount_buy
        packed_message0 = (packed_message0 << 64) + amount_fee
        packed_message0 = (packed_message0 << 32) + nonce
        packed_message0 = packed_message0 % FIELD_PRIME  # Ensure within field

        # Third hash: hash(msg, packed_message0)
        msg = self.signing_adapter.pedersen_hash([msg_int, packed_message0])
        msg_int = int.from_bytes(msg, byteorder='big')

        # Pack message 1
        # packed_message1 = LIMIT_ORDER_WITH_FEES * 2^64 + position_id * 2^64 + position_id * 2^64 + position_id * 2^32 + expiration_timestamp * 2^17
        packed_message1 = LIMIT_ORDER_WITH_FEE_TYPE
        packed_message1 = (packed_message1 << 64) + account_id
        packed_message1 = (packed_message1 << 64) + account_id
        packed_message1 = (packed_message1 << 64) + account_id
        packed_message1 = (packed_message1 << 32) + expire_time
        packed_message1 = packed_message1 << 17  # Padding
        packed_message1 = packed_message1 % FIELD_PRIME  # Ensure within field

        # Final hash: hash(msg, packed_message1)
        msg = self.signing_adapter.pedersen_hash([msg_int, packed_message1])

        return msg

    def calc_transfer_hash(
        self,
        asset_id: int,
        asset_id_fee: int,
        receiver_public_key: int,
        sender_position_id: int,
        receiver_position_id: int,
        fee_position_id: int,
        nonce: int,
        amount: int,
        max_amount_fee: int,
        expiration_timestamp: int
    ) -> bytes:
        """
        Calculate the hash for a transfer using StarkEx protocol.

        Args:
            asset_id: The asset ID
            asset_id_fee: The fee asset ID
            receiver_public_key: The receiver's public key
            sender_position_id: The sender's position ID
            receiver_position_id: The receiver's position ID
            fee_position_id: The fee position ID
            nonce: The nonce
            amount: The transfer amount
            max_amount_fee: The maximum fee amount
            expiration_timestamp: The expiration timestamp

        Returns:
            bytes: The calculated hash
        """
        # First hash: hash(asset_id, asset_id_fee)
        msg = self.signing_adapter.pedersen_hash([asset_id, asset_id_fee])
        msg_int = int.from_bytes(msg, byteorder='big')

        # Second hash: hash(msg, receiver_public_key)
        msg = self.signing_adapter.pedersen_hash([msg_int, receiver_public_key])
        msg_int = int.from_bytes(msg, byteorder='big')

        # Pack message 0
        # packed_msg0 = sender_position_id * 2^64 + receiver_position_id * 2^64 + fee_position_id * 2^32 + nonce
        packed_msg0 = sender_position_id
        packed_msg0 = (packed_msg0 << 64) + receiver_position_id
        packed_msg0 = (packed_msg0 << 64) + fee_position_id
        packed_msg0 = (packed_msg0 << 32) + nonce
        packed_msg0 = packed_msg0 % FIELD_PRIME  # Ensure within field

        # Third hash: hash(msg, packed_msg0)
        msg = self.signing_adapter.pedersen_hash([msg_int, packed_msg0])
        msg_int = int.from_bytes(msg, byteorder='big')

        # Pack message 1
        # packed_msg1 = 4 * 2^64 + amount * 2^64 + max_amount_fee * 2^32 + expiration_timestamp * 2^81
        packed_msg1 = 4  # Transfer type
        packed_msg1 = (packed_msg1 << 64) + amount
        packed_msg1 = (packed_msg1 << 64) + max_amount_fee
        packed_msg1 = (packed_msg1 << 32) + expiration_timestamp
        packed_msg1 = packed_msg1 << 81  # Padding
        packed_msg1 = packed_msg1 % FIELD_PRIME  # Ensure within field

        # Final hash: hash(msg, packed_msg1)
        msg = self.signing_adapter.pedersen_hash([msg_int, packed_msg1])

        return msg
