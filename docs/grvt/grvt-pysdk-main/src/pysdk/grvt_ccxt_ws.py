# ruff: noqa: D200
# ruff: noqa: D204
# ruff: noqa: D205
# ruff: noqa: D404
# ruff: noqa: W291
# ruff: noqa: D400
# ruff: noqa: E501

import asyncio
import json
import logging
import traceback
from asyncio.events import AbstractEventLoop
from collections.abc import Callable
from decimal import Decimal

import websockets

# import requests
# from env import ENDPOINTS
from .grvt_ccxt_env import (
    GRVT_WS_STREAMS,
    GrvtEnv,
    GrvtWSEndpointType,
    get_grvt_ws_endpoint,
    is_trading_ws_endpoint,
)
from .grvt_ccxt_pro import GrvtCcxtPro
from .grvt_ccxt_types import (
    GrvtInvalidOrder,
    GrvtOrderSide,
    GrvtOrderType,
    Num,
)
from .grvt_ccxt_utils import get_order_rpc_payload

WS_READ_TIMEOUT = 5


class GrvtCcxtWS(GrvtCcxtPro):
    """
    GrvtCcxtPro class to interact with Grvt Rest API and WebSockets in asynchronous mode.

    Args:
        env: GrvtCcxtPro (DEV, TESTNET, PROD)
        parameters: dict with trading_account_id, private_key, api_key etc

    Examples:
        >>> from grvt_api_pro import GrvtCcxtPro
        >>> from grvt_env import GrvtEnv
        >>> grvt = GrvtCcxtPro(env=GrvtEnv.TESTNET)
        >>> await grvt.fetch_markets()
    """

    def __init__(
        self,
        env: GrvtEnv,
        loop: AbstractEventLoop,
        logger: logging.Logger | None = None,
        parameters: dict = {},
    ):
        """Initialize the GrvtCcxt instance."""
        super().__init__(env, logger, parameters)
        self._loop = loop
        self._clsname: str = type(self).__name__
        self.api_ws_version = parameters.get("api_ws_version", "v1")
        self.force_reconnect_flag: bool = False
        self.ws: dict[GrvtWSEndpointType, websockets.WebSocketClientProtocol | None] = {}
        self.callbacks: dict[GrvtWSEndpointType, dict[str, dict[str, Callable]]] = {}
        self.subscribed_streams: dict[GrvtWSEndpointType, dict] = {}
        self.api_url: dict[GrvtWSEndpointType, str] = {}
        self._last_message: dict[str, dict] = {}
        self._request_id = 0
        self.endpoint_types = [
            GrvtWSEndpointType.MARKET_DATA,
            GrvtWSEndpointType.TRADE_DATA,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
        ]
        # Initialize dictionaries for each endpoint type
        for grvt_endpoint_type in self.endpoint_types:
            self.api_url[grvt_endpoint_type] = get_grvt_ws_endpoint(
                self.env.value, grvt_endpoint_type
            )
            self.callbacks[grvt_endpoint_type] = {}
            self.subscribed_streams[grvt_endpoint_type] = {}
            self.ws[grvt_endpoint_type] = None
            self._loop.create_task(self._read_messages(grvt_endpoint_type))
        self.logger.info(f"{self._clsname} initialized {self.api_url=}")
        self.logger.info(f"{self._clsname} initialized {self.ws=}")

    def __repr__(self) -> str:
        return f"{self._clsname} {self.env=} {self.api_ws_version=}"

    async def __aexit__(self):
        for grvt_endpoint_type in self.endpoint_types:
            await self._close_connection(grvt_endpoint_type)

    def force_reconnect(self) -> None:
        self.force_reconnect_flag = True

    async def initialize(self):
        """
        Prepares the GrvtCcxtPro instance and connects to WS server.
        """
        await self.load_markets()
        await self.refresh_cookie()
        self._loop.create_task(self.connect_all_channels())

    def is_connection_open(self, grvt_endpoint_type: GrvtWSEndpointType) -> bool:
        return (
            self.ws[grvt_endpoint_type] is not None and self.ws[grvt_endpoint_type].open
        )

    def is_endpoint_connected(self, grvt_endpoint_type: GrvtWSEndpointType) -> bool:
        """
        For  MARKET_DATA returns True if connection is open.
        for TRADE_DATA returns True if one of the following is true:
            1. No cookie - this means this is public connection and we can't connect to TRADE_DATA
            2. Connection to TRADE_DATA is open
        """
        if grvt_endpoint_type in [
            GrvtWSEndpointType.MARKET_DATA,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
        ]:
            return self.is_connection_open(grvt_endpoint_type)
        if grvt_endpoint_type in [
            GrvtWSEndpointType.TRADE_DATA,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
        ]:
            return bool(not self._cookie or self.is_connection_open(grvt_endpoint_type))
        raise ValueError(f"Unknown endpoint type {grvt_endpoint_type}")

    def are_endpoints_connected(
        self, grvt_endpoint_types: list[GrvtWSEndpointType]
    ) -> bool:
        return all(
            self.is_endpoint_connected(endpoint) for endpoint in grvt_endpoint_types
        )

    async def connect_all_channels(self) -> None:
        """
        Connects to all channels that are possible to connect.
        If cookie is NOT available, it will NOT connect to GrvtWSEndpointType.TRADE_DATA
        For trading connection: run this method after cookie is available.
        """
        FN = "connect_all_channels"
        while True:
            try:
                for end_point_type in self.endpoint_types:
                    if (
                        not self.is_endpoint_connected(end_point_type)
                        or self.force_reconnect_flag
                    ):
                        await self._reconnect(end_point_type)
                all_are_connected = self.are_endpoints_connected(self.endpoint_types)
                self.logger.info(
                    f"{FN} Connection status: {all_are_connected=} {self.force_reconnect_flag=}"
                )
                self.force_reconnect_flag = False
            except Exception as e:
                self.logger.exception(f"{FN} {e=}")
            finally:
                await asyncio.sleep(5)

    async def connect_channel(self, grvt_endpoint_type: GrvtWSEndpointType) -> bool:
        FN = f"{self._clsname} connect_channel {grvt_endpoint_type}"
        try:
            if self.is_endpoint_connected(grvt_endpoint_type):
                self.logger.info(f"{FN} Already connected")
                return True
            self.subscribed_streams[grvt_endpoint_type] = {}
            extra_headers = {}
            if self._cookie:
                extra_headers = {"Cookie": f"gravity={self._cookie['gravity']}"}
                if self._cookie["X-Grvt-Account-Id"]:
                    extra_headers.update(
                        {"X-Grvt-Account-Id": self._cookie["X-Grvt-Account-Id"]}
                    )
            if grvt_endpoint_type in [
                GrvtWSEndpointType.TRADE_DATA,
                GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
            ]:
                if self._cookie:
                    self.ws[grvt_endpoint_type] = await websockets.connect(
                        uri=self.api_url[grvt_endpoint_type],
                        extra_headers=extra_headers,
                        logger=self.logger,
                        open_timeout=5,
                    )
                    self.logger.info(
                        f"{FN} Connected to {self.api_url[grvt_endpoint_type]} {extra_headers=}"
                    )
                else:
                    self.logger.info(f"{FN} Waiting for cookie.")
            elif grvt_endpoint_type in [
                GrvtWSEndpointType.MARKET_DATA,
                GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            ]:
                self.ws[grvt_endpoint_type] = await websockets.connect(
                    uri=self.api_url[grvt_endpoint_type],
                    extra_headers=extra_headers,
                    logger=self.logger,
                    open_timeout=5,
                )
                self.logger.info(f"{FN} Connected to {self.api_url[grvt_endpoint_type]} {extra_headers=}")
        except (
            websockets.exceptions.ConnectionClosedOK,
            websockets.exceptions.ConnectionClosed,
        ) as e:
            self.logger.info(f"{FN} connection already closed:{e}")
            self.ws[grvt_endpoint_type] = None
        except Exception as e:
            self.logger.warning(f"{FN} error:{e} traceback:{traceback.format_exc()}")
            self.ws[grvt_endpoint_type] = None
        # return True  if connection successful
        return self.is_endpoint_connected(grvt_endpoint_type)

    async def _close_connection(self, grvt_endpoint_type: GrvtWSEndpointType):
        try:
            if self.ws[grvt_endpoint_type]:
                self.logger.info(f"{self._clsname} Closing connection...")
                await self.ws[grvt_endpoint_type].close()
                self.subscribed_streams[grvt_endpoint_type] = {}
                self.logger.info(f"{self._clsname} Connection closed")
            else:
                self.logger.info(f"{self._clsname} No connection to close")
        except Exception:
            self.logger.exception(
                f"{self._clsname} Error when closing connection {traceback.format_exc()}"
            )

    async def _reconnect(self, grvt_endpoint_type: GrvtWSEndpointType):
        FN = f"{self._clsname} _reconnect {grvt_endpoint_type=}"
        try:
            self.logger.info(f"{FN} STARTS")
            await self._close_connection(grvt_endpoint_type)
            success: bool = await self.connect_channel(grvt_endpoint_type)
            if success:
                await self._resubscribe(grvt_endpoint_type)
        except Exception:
            self.logger.exception(f"{FN} failed {traceback.format_exc()}")

    async def _resubscribe(self, grvt_endpoint_type: GrvtWSEndpointType):
        if self.is_connection_open(grvt_endpoint_type):
            for versioned_stream in self.callbacks[grvt_endpoint_type]:
                for selector in self.callbacks[grvt_endpoint_type][versioned_stream]:
                    self.logger.info(
                        f"{self._clsname} _resubscribe {grvt_endpoint_type=}"
                        f" {versioned_stream=}/{selector=}"
                    )
                    await self._subscribe_to_stream(
                        grvt_endpoint_type, versioned_stream, selector
                    )
        else:
            self.logger.warning(f"{self._clsname} _resubscribe - No connection.")

    # **************** PUBLIC API CALLS
    def is_stream_subscribed(
        self, grvt_endpoint_type: GrvtWSEndpointType, stream: str
    ) -> bool:
        versioned_stream = self.get_versioned_stream(stream)
        return self.subscribed_streams.get(grvt_endpoint_type, {}).get(
            versioned_stream, False
        )

    def _check_susbcribed_stream(
        self, grvt_endpoint_type: GrvtWSEndpointType, message: dict
    ) -> None:
        stream_subscribed: str = ""
        if "stream" in message:
            stream_subscribed = message["stream"]
        elif "result" in message and "stream" in message["result"]:
            stream_subscribed = message.get("result", {}).get("stream", "")
        if stream_subscribed:
            if not self.subscribed_streams[grvt_endpoint_type].get(stream_subscribed):
                self.logger.info(
                    f"{self._clsname} subscribed to stream:{stream_subscribed}"
                )
                self.subscribed_streams[grvt_endpoint_type][stream_subscribed] = True

    async def _read_messages(self, grvt_endpoint_type: GrvtWSEndpointType):
        FN = f"{self._clsname} _read_messages {grvt_endpoint_type.value}"
        while True:
            if self.is_connection_open(grvt_endpoint_type):
                try:
                    self.logger.debug(f"{FN} waiting for message")
                    response = await asyncio.wait_for(
                        self.ws[grvt_endpoint_type].recv(), timeout=WS_READ_TIMEOUT
                    )
                    message = json.loads(response)
                    self.logger.debug(f"{FN} received {message=}")
                    self._check_susbcribed_stream(grvt_endpoint_type, message)
                    if "feed" in message:
                        stream_subscribed: str | None = message.get("stream")
                        selector: str = message.get("selector")
                        if stream_subscribed is None:
                            self.logger.warning(f"{FN} missing stream in {message=}")
                        if selector is None:
                            self.logger.warning(f"{FN} missing selector in {message=}")
                        if stream_subscribed and selector:
                            callback = (
                                self.callbacks[grvt_endpoint_type]
                                .get(stream_subscribed, {})
                                .get(selector, None)
                            )
                            if callback:
                                await callback(message)
                                stream: str = self.get_non_versioned_stream(
                                    stream_subscribed
                                )
                                self._last_message[stream] = message
                            else:
                                self.logger.warning(
                                    f"{FN} No callback for {stream_subscribed=}/{selector=}"
                                )
                    elif "jsonrpc" in message:
                        """
                        {'jsonrpc': '', 'result': {'result': 
                        {'order_id': '0x00', 'sub_account_id': '8751933338735530', 
                        'is_market': False, 'time_in_force': 'GOOD_TILL_TIME', 'post_only': False, 
                        'reduce_only': False, 'legs': [{'instrument': 'BTC_USDT_Perp', 'size': '0.001',
                          'limit_price': '50000.0', 'is_buying_asset': True}], 
                          'signature': {'signer': '0x2989e3783e2ae05f9a1538dd411a22a4cd9554ad', 
                          'r': '0xa566702c1e5557ab96e8d5197b6871456765a80556bba46c9d4928bd573ca66c',
                           's': '0x6f6e0be6dca125643fce884ca28c0ae341b201efe49e10a9626859517b4a09af', 
                        'v': 28, 'expiration': '1729005262433997000', 'nonce': 3898454329}, 
                        'metadata': {'client_order_id': '123', 'create_time': '1728918862633971628'}, 
                        'state': {'status': 'OPEN', 'reject_reason': 'UNSPECIFIED', 
                        'book_size': ['0.001'], 'traded_size': ['0.0'], 'update_time': '1728918862633971628'}}}, 
                        'id': 2}
                    """
                        self.logger.debug(f"{FN} jsonrpc result:{message.get('result')}")
                    else:
                        self.logger.info(f"{FN} Non-actionable message:{message}")
                except (
                    websockets.exceptions.ConnectionClosedError,
                    websockets.exceptions.ConnectionClosedOK,
                ):
                    self.logger.exception(
                        f"{FN} connection closed {traceback.format_exc()}"
                    )
                    await self._reconnect(grvt_endpoint_type)
                except asyncio.TimeoutError:  # noqa: UP041
                    self.logger.debug(f"{FN} Timeout {WS_READ_TIMEOUT} secs")
                    pass
                except Exception:
                    self.logger.exception(
                        f"{FN} connection failed {traceback.format_exc()}"
                    )
                    await asyncio.sleep(1)
            else:
                self.logger.info(f"{FN} connection not open")
                await asyncio.sleep(2)

    async def _send(self, end_point_type: GrvtWSEndpointType, message: str):
        try:
            if self.ws[end_point_type] and self.ws[end_point_type].open:
                self.logger.info(
                    f"{self._clsname} _send() {end_point_type=}"
                    f" url:{self.api_url[end_point_type]} {message=}"
                )
                await self.ws[end_point_type].send(message)
        except websockets.exceptions.ConnectionClosedError as e:
            self.logger.info(f"{self._clsname} _send() Restarted connection {e}")
            await self._reconnect(end_point_type)
            if self.ws[end_point_type]:
                self.logger.info(
                    f"{self._clsname} _send() RESEND on RECONNECT {end_point_type=}"
                    f" url:{self.api_url[end_point_type]} {message=}"
                )
                await self.ws[end_point_type].send(message)
        except Exception:
            self.logger.exception(f"{self._clsname} send failed {traceback.format_exc()}")
            await self._reconnect(end_point_type)

    def _construct_selector(self, stream: str, params: dict) -> str:
        feed: str = ""
        # ******** Market Data ********
        if stream.endswith(("mini.s", "mini.d", "ticker.s", "ticker.d")):
            feed = f"{params.get('instrument', '')}@{params.get('rate', '500')}"
        if stream.endswith("book.s"):
            feed = (
                f"{params.get('instrument', '')}@{params.get('rate', '500')}-"
                f"{params.get('depth', '10')}"
            )
        if stream.endswith("book.d"):
            feed = f"{params.get('instrument', '')}@{params.get('rate', '500')}"
        if stream.endswith("trade"):
            feed = f"{params.get('instrument', '')}@{params.get('limit', '50')}"
        if stream.endswith("candle"):
            feed = (
                f"{params.get('instrument', '')}@{params.get('interval', 'CI_1_M')}-"
                f"{params.get('type', 'TRADE')}"
            )
        # ******** Trade Data ********
        if stream.endswith(("order", "state", "position", "fill")):
            if not params:
                feed = f"{self._trading_account_id}"
            elif params.get("instrument"):
                feed = f"{self._trading_account_id}-{params.get('instrument', '')}"
            else:
                feed = (
                    f"{self._trading_account_id}-{params.get('kind', '')}-"
                    f"{params.get('base', '')}-{params.get('quote', '')}"
                )
        # Deposit, Transfer, Withdrawal
        if stream.endswith(("deposit", "transfer", "withdrawal")):
            feed = ""
            # f"{params.get('sub_account_id', '')}-{params.get('main_account_id', '')}"

        return feed

    async def subscribe(
        self,
        stream: str,
        callback: Callable,
        ws_end_point_type: GrvtWSEndpointType | None = None,
        params: dict = {},
    ) -> None:
        """
        Subscribe to a stream with optional parameters.
        Call the callback function when a message is received.
        callback function should have the following signature:
        (dict) -> None.
        """
        FN = f"{self._clsname} subscribe {stream=}"
        if not ws_end_point_type:  # use default endpoint type
            ws_end_point_type = GRVT_WS_STREAMS.get(stream)
        if not ws_end_point_type:
            self.logger.error(f"{FN} unknown GrvtWSEndpointType for {stream=}")
            return
        is_trade_data = is_trading_ws_endpoint(ws_end_point_type)
        if is_trade_data and not self._trading_account_id:
            self.logger.error(
                f"{FN} {stream=} is a trading data connection. Requires trading_account_id."
            )
            return
        # create selector string and register callback
        selector: str = self._construct_selector(stream, params)
        versioned_stream: str = self.get_versioned_stream(stream)
        if versioned_stream not in self.callbacks[ws_end_point_type]:
            self.callbacks[ws_end_point_type][versioned_stream] = {}
        self.callbacks[ws_end_point_type][versioned_stream][selector] = callback
        self.logger.info(
            f"{FN} {params=} {ws_end_point_type=}/{versioned_stream=}/{selector=} callback:{callback}"
        )
        # check if connection is open and subscribe
        if self.is_connection_open(ws_end_point_type):
            await self._subscribe_to_stream(ws_end_point_type, versioned_stream, selector)
        else:
            self.logger.info(f"{FN} Connection not open. Will subscribe on connect.")

    async def re_subscribe_stream(
        self,
        stream: str,
        callback: Callable,
        ws_end_point_type: GrvtWSEndpointType | None = None,
        params: dict = {},
    ) -> None:
        """ This method should be called in a separate task - 
        otherwise it will block the event loop for 5 seconds.
        Unsubscribe from a specific stream and subscribe again with optional parameters.
        Call the callback function when a message is received.
        callback function should have the following signature:
        (dict) -> None.
        """
        FN = f"{self._clsname} re_subscribe {stream=}"
        if not ws_end_point_type:  # use default endpoint type
            ws_end_point_type = GRVT_WS_STREAMS.get(stream)
        if not ws_end_point_type:
            self.logger.error(f"{FN} unknown GrvtWSEndpointType for {stream=}")
            return
        if not self.is_connection_open(ws_end_point_type):
            self.logger.info(f"{FN} {ws_end_point_type=} not open. Try again after connect.")
            return
        is_trade_data = is_trading_ws_endpoint(ws_end_point_type)
        if is_trade_data and not self._trading_account_id:
            self.logger.error(
                f"{FN} {stream=} is a trading data connection. Requires trading_account_id."
            )
            return
        # create selector string and register callback
        selector: str = self._construct_selector(stream, params)
        versioned_stream: str = self.get_versioned_stream(stream)
        if versioned_stream not in self.callbacks[ws_end_point_type]:
            self.callbacks[ws_end_point_type][versioned_stream] = {}
        self.callbacks[ws_end_point_type][versioned_stream][selector] = callback
        # self.logger.info(
        #     f"{FN} {params=} {ws_end_point_type=}/{versioned_stream=}/{selector=} callback:{callback}"
        # )
        await self._unsubscribe_to_stream(ws_end_point_type, versioned_stream, selector)
        await asyncio.sleep(5)  # wait for unsubscribe to complete
        await self._subscribe_to_stream(ws_end_point_type, versioned_stream, selector)
        

    def get_versioned_stream(self, stream: str) -> str:
        return (
            stream if self.api_ws_version == "v0" else f"{self.api_ws_version}.{stream}"
        )

    def get_non_versioned_stream(self, versioned_stream: str) -> str:
        if self.api_ws_version == "v0":
            return versioned_stream
        return versioned_stream.split(".")[1]

    async def _subscribe_to_stream(
        self,
        ws_end_point_type: GrvtWSEndpointType,
        versioned_stream: str,
        selector: str,
    ) -> None:
        FN = (
            f"{self._clsname} _subscribe_to_stream {ws_end_point_type=}"
            f" {versioned_stream=} {selector=}"
        )
        self._request_id += 1
        if ws_end_point_type in [
            GrvtWSEndpointType.TRADE_DATA,
            GrvtWSEndpointType.MARKET_DATA,
        ]:  # Legacy subscription
            subscribe_json = json.dumps(
                {
                    "request_id": self._request_id,
                    "stream": versioned_stream,
                    "feed": [selector],
                    "method": "subscribe",
                    "is_full": True,
                }
            )
            self.logger.info(f"{FN} {versioned_stream=} {subscribe_json=}")
        else:  # RPC WS format
            self._request_id += 1
            subscribe_json = json.dumps(
                {
                    "jsonrpc": "2.0",
                    "method": "subscribe",
                    "params": {
                        "stream": versioned_stream,
                        "selectors": [selector],
                    },
                    "id": self._request_id,
                }
            )
            self.logger.info(f"{FN} {versioned_stream=} {subscribe_json=}")
        await self._send(ws_end_point_type, subscribe_json)
        stream: str = self.get_non_versioned_stream(versioned_stream)
        if stream not in self._last_message:
            self._last_message[stream] = {}
    
    async def _unsubscribe_to_stream(
        self,
        ws_end_point_type: GrvtWSEndpointType,
        versioned_stream: str,
        selector: str,
    ) -> None:
        FN = (
            f"{self._clsname} _unsubscribe_to_stream {ws_end_point_type=}"
            f" {versioned_stream=} {selector=}"
        )
        self._request_id += 1
        if ws_end_point_type in [
            GrvtWSEndpointType.TRADE_DATA,
            GrvtWSEndpointType.MARKET_DATA,
        ]:  # Legacy subscription
            subscribe_json = json.dumps(
                {
                    "request_id": self._request_id,
                    "stream": versioned_stream,
                    "feed": [selector],
                    "method": "unsubscribe",
                    "is_full": True,
                }
            )
            self.logger.info(f"{FN} {versioned_stream=} {subscribe_json=}")
        else:  # RPC WS format
            self._request_id += 1
            subscribe_json = json.dumps(
                {
                    "jsonrpc": "2.0",
                    "method": "unsubscribe",
                    "params": {
                        "stream": versioned_stream,
                        "selectors": [selector],
                    },
                    "id": self._request_id,
                }
            )
            self.logger.info(f"{FN} {versioned_stream=} {subscribe_json=}")
        await self._send(ws_end_point_type, subscribe_json)

    def jsonrpc_wrap_payload(
        self, payload: dict, method: str, version: str = "v1"
    ) -> dict:
        """
        Wrap the payload in JSON-RPC format.
        """
        self._request_id += 1
        return {
            "jsonrpc": "2.0",
            "method": f"{version}/{method}",
            "params": payload,
            "id": self._request_id,
        }

    async def send_rpc_message(
        self, end_point_type: GrvtWSEndpointType, message: dict
    ) -> None:
        """
        Send a message to the server.
        """
        await self._send(end_point_type, json.dumps(message))
        self.logger.info(f"{self._clsname} send_rpc_message {end_point_type=} {message=}")

    async def rpc_create_order(
        self,
        symbol: str,
        order_type: GrvtOrderType,
        side: GrvtOrderSide,
        amount: float | Decimal | str | int,
        price: Num = None,
        params={},
    ) -> dict:
        """
        Create an order.
        """
        FN = f"{self._clsname} rpc_create_order"
        if not self.is_endpoint_connected(GrvtWSEndpointType.TRADE_DATA_RPC_FULL):
            raise GrvtInvalidOrder("Trade data connection not available.")
        order = self._get_order_with_validations(
            symbol, order_type, side, amount, price, params
        )
        self.logger.info(f"{FN} {order=}")
        payload = get_order_rpc_payload(order, self._private_key, self.env, self.markets)
        self._request_id += 1
        payload["id"] = self._request_id
        self.logger.info(f"{FN} {payload=}")
        await self.send_rpc_message(GrvtWSEndpointType.TRADE_DATA_RPC_FULL, payload)
        return payload

    async def rpc_create_limit_order(
        self,
        symbol: str,
        side: GrvtOrderSide,
        amount: float | Decimal | str | int,
        price: Num,
        params={},
    ) -> dict:
        return await self.rpc_create_order(symbol, "limit", side, amount, price, params)

    async def rpc_cancel_all_orders(
        self,
        params: dict = {},
    ) -> dict:
        """
        Ccxt compliant signature BUT lacks symbol
        Cancel all orders for a sub-account.
        params: dictionary with parameters. Valid keys:<br>
                `kind` (str): instrument kind. Valid values: 'PERPETUAL'.<br>
                `base` (str): base currency. If missing/empty then fetch
                                    orders for all base currencies.<br>
                `quote` (str): quote currency. Defaults to all.<br>
        """
        self._check_account_auth()
        # FN = f"{self._clsname} rpc_cancel_all_orders"
        payload: dict = self._get_payload_cancel_all_orders(params)
        jsonrpc_payload: dict = self.jsonrpc_wrap_payload(payload, method="cancel_all_orders")
        await self.send_rpc_message(
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL, jsonrpc_payload
        )
        return jsonrpc_payload

    async def rpc_cancel_order(
        self,
        id: str | None = None,
        symbol: str | None = None,
        params: dict = {},
    ) -> dict:
        """
        Ccxt compliant signature
        Cancel specific order for the account by sending JsonRpc call on WebSocket.<br>
        Private call requires authorization.<br>
        See [Cancel order](https://api-docs.grvt.io/trading_api/#cancel-order)
        for details.<br>.

        Args:
            id (str): exchange assigned order ID<br>
            symbol (str): trading symbol<br>
            params: 
                * client_order_id (str): client assigned order ID<br>
                * time_to_live_ms (str): lifetime of cancel requiest in millisecs<br>
        Returns:
            payload used to cancel order.<br>
        """
        FN = f"{self._clsname} rpc_cancel_order"
        if not self.is_endpoint_connected(GrvtWSEndpointType.TRADE_DATA_RPC_FULL):
            raise GrvtInvalidOrder("Trade data connection not available.")
        self._check_account_auth()
        # Prepare payload
        payload: dict = {
            "sub_account_id": str(self._trading_account_id),
        }
        if id:
            payload["order_id"] = str(id)
        elif "client_order_id" in params:
            payload["client_order_id"] = str(params["client_order_id"])
        else:
            raise GrvtInvalidOrder(f"{FN} requires either order_id or client_order_id")
        if "time_to_live_ms" in params:
            payload["time_to_live_ms"] = str(params["time_to_live_ms"])
        # Send cancel requiest
        jsonrpc_payload = self.jsonrpc_wrap_payload(payload, method="cancel_order")
        await self.send_rpc_message(
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL, jsonrpc_payload
        )
        return jsonrpc_payload

    async def rpc_fetch_open_orders(
        self,
        params: dict = {},
    ) -> dict:
        """
        Fetch open orders for the account.<br>
        Private call requires authorization.<br>
        See [Open orders](https://api-docs.grvt.io/trading_api/#open-orders)
            for details.<br>.
        Fetches open orders for the account.<br>
        Sends JsonRpc call on WebSocket.<br>
        Args:
            params: dictionary with parameters. Valid keys:<br>
                `kind` (str): instrument kind. Valid values are 'PERPETUAL'.<br>
                `base` (str): base currency. If missing/empty then fetch orders
                                    for all base currencies.<br>
                `quote` (str): quote currency. Defaults to all.<br>
        Returns:
            payload used to fetch open orders.<br><br>
        """
        self._check_account_auth()
        # Prepare request payload
        payload: dict = self._get_payload_fetch_open_orders(symbol=None, params=params)
        jsonrpc_payload: dict = self.jsonrpc_wrap_payload(payload, method="open_orders")
        await self.send_rpc_message(
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL, jsonrpc_payload
        )
        return jsonrpc_payload

    async def rpc_fetch_order(
        self,
        id: str | None = None,
        symbol: str | None = None,
        params: dict = {},
    ) -> dict:
        """
        Ccxt compliant signature.<br>
        Private call requires authorization.<br>
        See [Get Order](https://api-docs.grvt.io/trading_api/#get-order)
            for details.<br>.
        Get Order status by either order_id or client_order_id.<br>
        Sends JsonRpc call on WebSocket.<br>
        Args:
            id: (str) order_id to fetch.<br>
            symbol: (str) NOT SUPPRTED.<br>
            params: dictionary with parameters. Valid keys:<br>
                `client_order_id` (int): client assigned order ID.<br>
        Returns:
            payload used to fetch order.<br>
        """
        FN = f"{self._clsname} rpc_fetch_order"
        self._check_account_auth()
        payload = {
            "sub_account_id": str(self._trading_account_id),
        }
        if id:
            payload["order_id"] = id
        elif "client_order_id" in params:
            payload["client_order_id"] = str(params["client_order_id"])
        else:
            raise GrvtInvalidOrder(
                f"{FN} requires either order_id or params['client_order_id']"
            )
        jsonrpc_payload = self.jsonrpc_wrap_payload(payload, method="order")
        await self.send_rpc_message(
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL, jsonrpc_payload
        )
        return jsonrpc_payload
