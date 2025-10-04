import asyncio
import binascii
import json
import logging
import threading
import time
from typing import Dict, Any, List, Optional, Callable, Union

import websocket
from Crypto.Hash import keccak

from ..internal.signing_adapter import SigningAdapter

from ..internal.client import Client as InternalClient


class Client:
    """WebSocket client for real-time data."""

    def __init__(self, url: str, is_private: bool, account_id: int, stark_pri_key: str, signing_adapter: Optional[SigningAdapter] = None):
        """
        Initialize the WebSocket client.

        Args:
            url: WebSocket URL
            is_private: Whether this is a private WebSocket connection
            account_id: Account ID for authentication
            stark_pri_key: Stark private key for signing
        """
        self.url = url
        self.is_private = is_private
        self.account_id = account_id
        self.stark_pri_key = stark_pri_key

        # Use the provided signing adapter (required)
        if signing_adapter is None:
            raise ValueError("signing_adapter is required")
        self.signing_adapter = signing_adapter

        self.conn = None
        self.handlers = {}
        self.done = threading.Event()
        self.ping_thread = None
        self.subscriptions = set()
        self.on_connect_hooks = []
        self.on_message_hooks = []
        self.on_disconnect_hooks = []

        self.logger = logging.getLogger(__name__)

    def connect(self):
        """
        Establish a WebSocket connection.

        Raises:
            ValueError: If the connection fails
        """
        headers = {}
        url = self.url

        # Add timestamp parameter for both public and private connections
        timestamp = int(time.time() * 1000)

        if self.is_private:
            # Add timestamp header
            headers["X-edgeX-Api-Timestamp"] = str(timestamp)

            # Generate signature content (no ? separator, matching Go SDK)
            path = f"/api/v1/private/wsaccountId={self.account_id}"
            sign_content = f"{timestamp}GET{path}"

            # Hash the content
            keccak_hash = keccak.new(digest_bits=256)
            keccak_hash.update(sign_content.encode())
            message_hash = keccak_hash.digest()

            # Sign the message using the signing adapter
            try:
                r, s = self.signing_adapter.sign(message_hash, self.stark_pri_key)
            except Exception as e:
                raise ValueError(f"failed to sign message: {str(e)}")

            # Set signature header
            headers["X-edgeX-Api-Signature"] = f"{r}{s}"
        else:
            # For public connections, add timestamp as URL parameter
            separator = "&" if "?" in url else "?"
            url = f"{url}{separator}timestamp={timestamp}"

        # Create WebSocket connection
        try:
            self.conn = websocket.create_connection(url, header=headers)
        except Exception as e:
            raise ValueError(f"failed to connect to WebSocket: {str(e)}")

        # Start ping thread
        self.done.clear()
        self.ping_thread = threading.Thread(target=self._ping_loop)
        self.ping_thread.daemon = True
        self.ping_thread.start()

        # Start message handling thread
        self.message_thread = threading.Thread(target=self._handle_messages)
        self.message_thread.daemon = True
        self.message_thread.start()

        # Call connect hooks
        for hook in self.on_connect_hooks:
            hook()

    def close(self):
        """Close the WebSocket connection."""
        self.done.set()

        if self.conn:
            self.conn.close()
            self.conn = None

    def _ping_loop(self):
        """Send periodic ping messages."""
        while not self.done.is_set():
            if self.conn:
                ping_msg = {
                    "type": "ping",
                    "time": str(int(time.time() * 1000))
                }

                try:
                    self.conn.send(json.dumps(ping_msg))
                except Exception as e:
                    self.logger.error(f"Failed to send ping: {str(e)}")
                    break

            # Wait for 30 seconds or until done
            self.done.wait(30)

    def _handle_messages(self):
        """Process incoming WebSocket messages."""
        while not self.done.is_set():
            if not self.conn:
                break

            try:
                message = self.conn.recv()

                # Call message hooks
                for hook in self.on_message_hooks:
                    hook(message)

                # Parse message
                try:
                    msg = json.loads(message)
                except json.JSONDecodeError:
                    continue

                # Handle ping messages
                if msg.get("type") == "ping":
                    self._handle_pong(msg.get("time", ""))
                    continue

                # Handle quote events
                if msg.get("type") == "quote-event":
                    channel = msg.get("channel", "")
                    channel_type = channel.split(".")[0] if "." in channel else channel

                    if channel_type in self.handlers:
                        self.handlers[channel_type](message)
                    continue

                # Call registered handlers for other message types
                msg_type = msg.get("type", "")
                if msg_type in self.handlers:
                    self.handlers[msg_type](message)

            except Exception as e:
                self.logger.error(f"Error handling message: {str(e)}")

                # Call disconnect hooks
                for hook in self.on_disconnect_hooks:
                    hook(e)

                break

    def _handle_pong(self, timestamp: str):
        """
        Send pong response to server ping.

        Args:
            timestamp: The timestamp from the ping message
        """
        pong_msg = {
            "type": "pong",
            "time": timestamp
        }

        try:
            self.conn.send(json.dumps(pong_msg))
        except Exception as e:
            self.logger.error(f"Failed to send pong: {str(e)}")

    def subscribe(self, topic: str, params: Dict[str, Any] = None) -> bool:
        """
        Subscribe to a topic (for public WebSocket).

        Args:
            topic: The topic to subscribe to
            params: Optional parameters for the subscription

        Returns:
            bool: Whether the subscription was successful

        Raises:
            ValueError: If the subscription fails
        """
        if self.is_private:
            raise ValueError("cannot subscribe on private WebSocket connection")

        if not self.conn:
            raise ValueError("WebSocket connection is not established")

        sub_msg = {
            "type": "subscribe",
            "channel": topic
        }

        if params:
            sub_msg.update(params)

        try:
            self.conn.send(json.dumps(sub_msg))
            self.subscriptions.add(topic)
            return True
        except Exception as e:
            raise ValueError(f"failed to subscribe: {str(e)}")

    def unsubscribe(self, topic: str) -> bool:
        """
        Unsubscribe from a topic (for public WebSocket).

        Args:
            topic: The topic to unsubscribe from

        Returns:
            bool: Whether the unsubscription was successful

        Raises:
            ValueError: If the unsubscription fails
        """
        if self.is_private:
            raise ValueError("cannot unsubscribe on private WebSocket connection")

        if not self.conn:
            raise ValueError("WebSocket connection is not established")

        unsub_msg = {
            "type": "unsubscribe",
            "channel": topic
        }

        try:
            self.conn.send(json.dumps(unsub_msg))
            self.subscriptions.discard(topic)
            return True
        except Exception as e:
            raise ValueError(f"failed to unsubscribe: {str(e)}")

    def on_message(self, msg_type: str, handler: Callable[[str], None]):
        """
        Register a handler for a specific message type.

        Args:
            msg_type: The message type to handle
            handler: The handler function
        """
        self.handlers[msg_type] = handler

    def on_message_hook(self, hook: Callable[[str], None]):
        """
        Register a hook that will be called for all messages.

        Args:
            hook: The hook function
        """
        self.on_message_hooks.append(hook)

    def on_connect(self, hook: Callable[[], None]):
        """
        Register a hook that will be called when connection is established.

        Args:
            hook: The hook function
        """
        self.on_connect_hooks.append(hook)

    def on_disconnect(self, hook: Callable[[Exception], None]):
        """
        Register a hook that will be called when connection is closed.

        Args:
            hook: The hook function
        """
        self.on_disconnect_hooks.append(hook)
