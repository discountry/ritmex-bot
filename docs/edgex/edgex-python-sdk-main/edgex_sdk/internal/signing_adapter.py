"""
Signing adapter interface for the EdgeX Python SDK.

This module defines the interface for signing adapters that can be used with the SDK.
Different implementations can be provided for different environments (development, testing, production).
"""

from abc import ABC, abstractmethod
from typing import Tuple, List


class SigningAdapter(ABC):
    """Interface for signing adapters."""

    @abstractmethod
    def sign(self, message_hash: bytes, private_key: str) -> Tuple[str, str]:
        """
        Sign a message hash using a private key.

        Args:
            message_hash: The hash of the message to sign
            private_key: The private key as a hex string

        Returns:
            Tuple[str, str]: The signature as (r, s) hex strings

        Raises:
            ValueError: If the private key is invalid or the signing fails
        """
        pass

    @abstractmethod
    def get_public_key(self, private_key: str) -> str:
        """
        Get the public key from a private key.

        Args:
            private_key: The private key as a hex string

        Returns:
            str: The public key as a hex string

        Raises:
            ValueError: If the private key is invalid
        """
        pass

    @abstractmethod
    def verify(self, message_hash: bytes, signature: Tuple[str, str], public_key: str) -> bool:
        """
        Verify a signature using a public key.

        Args:
            message_hash: The hash of the message
            signature: The signature as (r, s) hex strings
            public_key: The public key as a hex string

        Returns:
            bool: Whether the signature is valid
        """
        pass

    @abstractmethod
    def pedersen_hash(self, elements: List[int]) -> bytes:
        """
        Calculate the Pedersen hash of a list of integers.

        Args:
            elements: List of integers to hash

        Returns:
            bytes: The hash result

        Raises:
            ValueError: If the calculation fails
        """
        pass
