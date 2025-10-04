"""
Advanced usage example for the EdgeX Python SDK.

This example demonstrates more advanced features of the SDK, including:
- Order management
- WebSocket integration
- Error handling
- Pagination
"""

import asyncio
import os
import logging
from decimal import Decimal
from typing import Dict, Any, List

from edgex_sdk import (
    Client,
    OrderSide,
    OrderType,
    TimeInForce,
    CreateOrderParams,
    CancelOrderParams,
    GetActiveOrderParams,
    OrderFillTransactionParams,
    GetKLineParams,
    GetOrderBookDepthParams,
    WebSocketManager
)


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class EdgeXTrader:
    """Example trader using the EdgeX Python SDK."""
    
    def __init__(self, base_url: str, ws_url: str, account_id: int, stark_private_key: str):
        """
        Initialize the trader.
        
        Args:
            base_url: Base URL for API endpoints
            ws_url: Base URL for WebSocket endpoints
            account_id: Account ID for authentication
            stark_private_key: Stark private key for signing
        """
        self.client = Client(
            base_url=base_url,
            account_id=account_id,
            stark_private_key=stark_private_key
        )
        
        self.ws_manager = WebSocketManager(
            base_url=ws_url,
            account_id=account_id,
            stark_pri_key=stark_private_key
        )
        
        self.metadata = None
        self.contracts = {}
        self.market_data = {}
        self.active_orders = {}
        self.positions = {}
        self.assets = {}
    
    async def initialize(self):
        """Initialize the trader by fetching metadata and account information."""
        logger.info("Initializing trader...")
        
        try:
            # Get metadata
            self.metadata = await self.client.get_metadata()
            logger.info("Metadata retrieved")
            
            # Extract contracts
            contract_list = self.metadata.get("data", {}).get("contractList", [])
            for contract in contract_list:
                contract_id = contract.get("contractId")
                if contract_id:
                    self.contracts[contract_id] = contract
            
            logger.info(f"Found {len(self.contracts)} contracts")
            
            # Get account assets
            assets_response = await self.client.get_account_asset()
            self.assets = assets_response.get("data", {})
            logger.info("Account assets retrieved")
            
            # Get account positions
            positions_response = await self.client.get_account_positions()
            positions_data = positions_response.get("data", {})
            position_list = positions_data.get("positionList", [])
            for position in position_list:
                contract_id = position.get("contractId")
                if contract_id:
                    self.positions[contract_id] = position
            
            logger.info(f"Found {len(self.positions)} positions")
            
            # Get active orders
            await self.update_active_orders()
            
            # Initialize WebSocket
            await self.initialize_websocket()
            
            logger.info("Trader initialized successfully")
            return True
        
        except Exception as e:
            logger.error(f"Failed to initialize trader: {str(e)}")
            return False
    
    async def update_active_orders(self):
        """Update the list of active orders."""
        try:
            params = GetActiveOrderParams()
            active_orders_response = await self.client.get_active_orders(params)
            
            order_list = active_orders_response.get("data", {}).get("list", [])
            self.active_orders = {}
            
            for order in order_list:
                order_id = order.get("orderId")
                if order_id:
                    self.active_orders[order_id] = order
            
            logger.info(f"Found {len(self.active_orders)} active orders")
            return True
        
        except Exception as e:
            logger.error(f"Failed to update active orders: {str(e)}")
            return False
    
    async def initialize_websocket(self):
        """Initialize WebSocket connections and subscriptions."""
        try:
            # Connect to public WebSocket
            self.ws_manager.connect_public()
            logger.info("Connected to public WebSocket")
            
            # Connect to private WebSocket
            self.ws_manager.connect_private()
            logger.info("Connected to private WebSocket")
            
            # Subscribe to account updates
            self.ws_manager.subscribe_account_update(self.handle_account_update)
            logger.info("Subscribed to account updates")
            
            # Subscribe to order updates
            self.ws_manager.subscribe_order_update(self.handle_order_update)
            logger.info("Subscribed to order updates")
            
            # Subscribe to position updates
            self.ws_manager.subscribe_position_update(self.handle_position_update)
            logger.info("Subscribed to position updates")

            # Subscribe to market data for BTCUSDT (contract ID: 10000001)
            self.ws_manager.subscribe_ticker("10000001", self.handle_ticker_update)
            self.ws_manager.subscribe_kline("10000001", "1m", self.handle_kline_update)
            self.ws_manager.subscribe_depth("10000001", self.handle_depth_update)
            logger.info("Subscribed to market data for BTCUSDT (10000001)")
            
            return True
        
        except Exception as e:
            logger.error(f"Failed to initialize WebSocket: {str(e)}")
            return False
    
    def handle_account_update(self, message: str):
        """
        Handle account update messages from WebSocket.
        
        Args:
            message: The WebSocket message
        """
        try:
            import json
            data = json.loads(message)
            logger.info(f"Account update: {data}")
            
            # Update assets
            account_data = data.get("content", {}).get("data", {})
            if account_data:
                self.assets = account_data
        
        except Exception as e:
            logger.error(f"Failed to handle account update: {str(e)}")
    
    def handle_order_update(self, message: str):
        """
        Handle order update messages from WebSocket.
        
        Args:
            message: The WebSocket message
        """
        try:
            import json
            data = json.loads(message)
            logger.info(f"Order update: {data}")
            
            # Update active orders
            asyncio.create_task(self.update_active_orders())
        
        except Exception as e:
            logger.error(f"Failed to handle order update: {str(e)}")
    
    def handle_position_update(self, message: str):
        """
        Handle position update messages from WebSocket.
        
        Args:
            message: The WebSocket message
        """
        try:
            import json
            data = json.loads(message)
            logger.info(f"Position update: {data}")
            
            # Update positions
            position_data = data.get("content", {}).get("data", {})
            contract_id = position_data.get("contractId")
            
            if contract_id:
                self.positions[contract_id] = position_data
        
        except Exception as e:
            logger.error(f"Failed to handle position update: {str(e)}")
    
    def handle_ticker_update(self, message: str):
        """
        Handle ticker update messages from WebSocket.
        
        Args:
            message: The WebSocket message
        """
        try:
            import json
            data = json.loads(message)
            
            # Extract ticker data
            content = data.get("content", {})
            ticker_data_list = content.get("data", [])

            # Handle both single ticker and list of tickers
            if isinstance(ticker_data_list, list) and ticker_data_list:
                ticker_data = ticker_data_list[0]  # Take the first ticker
            else:
                ticker_data = ticker_data_list

            contract_id = ticker_data.get("contractId") if isinstance(ticker_data, dict) else None
            
            if contract_id:
                if "ticker" not in self.market_data:
                    self.market_data["ticker"] = {}
                
                self.market_data["ticker"][contract_id] = ticker_data
                logger.info(f"Ticker update for {contract_id}: {ticker_data.get('lastPrice')}")
        
        except Exception as e:
            logger.error(f"Failed to handle ticker update: {str(e)}")
    
    def handle_kline_update(self, message: str):
        """
        Handle K-line update messages from WebSocket.
        
        Args:
            message: The WebSocket message
        """
        try:
            import json
            data = json.loads(message)
            
            # Extract K-line data
            kline_data = data.get("content", {}).get("data", {})
            contract_id = kline_data.get("contractId")
            interval = kline_data.get("interval")
            
            if contract_id and interval:
                if "kline" not in self.market_data:
                    self.market_data["kline"] = {}
                
                if contract_id not in self.market_data["kline"]:
                    self.market_data["kline"][contract_id] = {}
                
                self.market_data["kline"][contract_id][interval] = kline_data
                logger.info(f"K-line update for {contract_id} {interval}: {kline_data.get('close')}")
        
        except Exception as e:
            logger.error(f"Failed to handle K-line update: {str(e)}")
    
    def handle_depth_update(self, message: str):
        """
        Handle depth update messages from WebSocket.
        
        Args:
            message: The WebSocket message
        """
        try:
            import json
            data = json.loads(message)
            
            # Extract depth data
            depth_data = data.get("content", {}).get("data", {})
            contract_id = depth_data.get("contractId")
            
            if contract_id:
                if "depth" not in self.market_data:
                    self.market_data["depth"] = {}
                
                self.market_data["depth"][contract_id] = depth_data
                logger.info(f"Depth update for {contract_id}")
        
        except Exception as e:
            logger.error(f"Failed to handle depth update: {str(e)}")
    
    async def create_limit_order(
        self,
        contract_id: str,
        size: str,
        price: str,
        side: str,
        time_in_force: str = TimeInForce.GOOD_TIL_CANCEL,
        reduce_only: bool = False
    ) -> Dict[str, Any]:
        """
        Create a limit order.
        
        Args:
            contract_id: The contract ID
            size: The order size
            price: The order price
            side: The order side (BUY or SELL)
            time_in_force: The time in force
            reduce_only: Whether the order is reduce-only
            
        Returns:
            Dict[str, Any]: The created order
            
        Raises:
            ValueError: If the order creation fails
        """
        try:
            # Create order parameters
            params = CreateOrderParams(
                contract_id=contract_id,
                size=size,
                price=price,
                type=OrderType.LIMIT,
                side=side,
                time_in_force=time_in_force,
                reduce_only=reduce_only
            )
            
            # Create the order
            result = await self.client.create_order(params)
            
            # Check for success
            if result.get("code") != "SUCCESS":
                error_param = result.get("errorParam")
                if error_param:
                    raise ValueError(f"Failed to create order: {error_param}")
                raise ValueError(f"Failed to create order: {result.get('code')}")
            
            # Update active orders
            await self.update_active_orders()
            
            logger.info(f"Created limit order: {result.get('data', {}).get('orderId')}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to create limit order: {str(e)}")
            raise
    
    async def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """
        Cancel an order.
        
        Args:
            order_id: The order ID
            
        Returns:
            Dict[str, Any]: The cancellation result
            
        Raises:
            ValueError: If the order cancellation fails
        """
        try:
            # Create cancel order parameters
            params = CancelOrderParams(order_id=order_id)
            
            # Cancel the order
            result = await self.client.cancel_order(params)
            
            # Check for success
            if result.get("code") != "SUCCESS":
                error_param = result.get("errorParam")
                if error_param:
                    raise ValueError(f"Failed to cancel order: {error_param}")
                raise ValueError(f"Failed to cancel order: {result.get('code')}")
            
            # Update active orders
            await self.update_active_orders()
            
            logger.info(f"Cancelled order: {order_id}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to cancel order: {str(e)}")
            raise
    
    async def cancel_all_orders(self, contract_id: str = None) -> Dict[str, Any]:
        """
        Cancel all orders for a contract.
        
        Args:
            contract_id: The contract ID (optional)
            
        Returns:
            Dict[str, Any]: The cancellation result
            
        Raises:
            ValueError: If the order cancellation fails
        """
        try:
            # Create cancel order parameters
            params = CancelOrderParams(contract_id=contract_id or "")
            
            # Cancel the orders
            result = await self.client.cancel_order(params)
            
            # Check for success
            if result.get("code") != "SUCCESS":
                error_param = result.get("errorParam")
                if error_param:
                    raise ValueError(f"Failed to cancel orders: {error_param}")
                raise ValueError(f"Failed to cancel orders: {result.get('code')}")
            
            # Update active orders
            await self.update_active_orders()
            
            logger.info(f"Cancelled all orders for contract: {contract_id or 'all'}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to cancel all orders: {str(e)}")
            raise
    
    async def get_order_fill_transactions(
        self,
        contract_id: str = None,
        size: str = "10",
        offset_data: str = ""
    ) -> Dict[str, Any]:
        """
        Get order fill transactions.
        
        Args:
            contract_id: The contract ID (optional)
            size: The page size
            offset_data: The offset data for pagination
            
        Returns:
            Dict[str, Any]: The order fill transactions
            
        Raises:
            ValueError: If the request fails
        """
        try:
            # Create parameters
            params = OrderFillTransactionParams(
                size=size,
                offset_data=offset_data
            )
            
            if contract_id:
                params.filter_contract_id_list = [contract_id]
            
            # Get order fill transactions
            result = await self.client.get_order_fill_transactions(params)
            
            # Check for success
            if result.get("code") != "SUCCESS":
                error_param = result.get("errorParam")
                if error_param:
                    raise ValueError(f"Failed to get order fill transactions: {error_param}")
                raise ValueError(f"Failed to get order fill transactions: {result.get('code')}")
            
            logger.info(f"Got order fill transactions: {len(result.get('data', {}).get('list', []))}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to get order fill transactions: {str(e)}")
            raise
    
    async def get_k_line(
        self,
        contract_id: str,
        interval: str,
        size: str = "100",
        offset_data: str = ""
    ) -> Dict[str, Any]:
        """
        Get K-line data.
        
        Args:
            contract_id: The contract ID
            interval: The K-line interval
            size: The page size
            offset_data: The offset data for pagination
            
        Returns:
            Dict[str, Any]: The K-line data
            
        Raises:
            ValueError: If the request fails
        """
        try:
            # Create parameters
            params = GetKLineParams(
                contract_id=contract_id,
                interval=interval,
                size=size,
                offset_data=offset_data
            )
            
            # Get K-line data
            result = await self.client.quote.get_k_line(params)
            
            # Check for success
            if result.get("code") != "SUCCESS":
                error_param = result.get("errorParam")
                if error_param:
                    raise ValueError(f"Failed to get K-line data: {error_param}")
                raise ValueError(f"Failed to get K-line data: {result.get('code')}")
            
            logger.info(f"Got K-line data: {len(result.get('data', {}).get('list', []))}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to get K-line data: {str(e)}")
            raise
    
    async def get_order_book_depth(
        self,
        contract_id: str,
        limit: int = 15
    ) -> Dict[str, Any]:
        """
        Get order book depth.
        
        Args:
            contract_id: The contract ID
            limit: The depth limit (valid values are 15 or 200)
            
        Returns:
            Dict[str, Any]: The order book depth
            
        Raises:
            ValueError: If the request fails
        """
        try:
            # Create parameters
            params = GetOrderBookDepthParams(
                contract_id=contract_id,
                limit=limit
            )
            
            # Get order book depth
            result = await self.client.quote.get_order_book_depth(params)
            
            # Check for success
            if result.get("code") != "SUCCESS":
                error_param = result.get("errorParam")
                if error_param:
                    raise ValueError(f"Failed to get order book depth: {error_param}")
                raise ValueError(f"Failed to get order book depth: {result.get('code')}")
            
            logger.info(f"Got order book depth for {contract_id}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to get order book depth: {str(e)}")
            raise
    
    async def close(self):
        """Close all connections."""
        try:
            # Disconnect WebSocket
            self.ws_manager.disconnect_all()
            logger.info("Disconnected from WebSocket")
            
            return True
        
        except Exception as e:
            logger.error(f"Failed to close connections: {str(e)}")
            return False


async def main():
    """Main function."""
    # Load configuration from environment variables
    base_url = os.getenv("EDGEX_BASE_URL", "https://testnet.edgex.exchange")
    ws_url = os.getenv("EDGEX_WS_URL", "wss://quote-testnet.edgex.exchange")
    account_id = int(os.getenv("EDGEX_ACCOUNT_ID", "12345"))
    stark_private_key = os.getenv("EDGEX_STARK_PRIVATE_KEY", "your-stark-private-key")
    
    # Create trader
    trader = EdgeXTrader(
        base_url=base_url,
        ws_url=ws_url,
        account_id=account_id,
        stark_private_key=stark_private_key
    )
    
    # Initialize trader
    if not await trader.initialize():
        logger.error("Failed to initialize trader")
        return
    
    try:
        # Get K-line data for BTCUSDT (contract ID: 10000001)
        klines = await trader.get_k_line("10000001", "1m")
        logger.info(f"Retrieved K-line data: {len(klines.get('data', {}).get('list', []))} entries")

        # Get order book depth for BTCUSDT (contract ID: 10000001)
        await trader.get_order_book_depth("10000001")
        logger.info(f"Retrieved order book depth")

        # Create a limit order (commented out to avoid actual order creation)
        # order = await trader.create_limit_order(
        #     contract_id="10000001",  # BTCUSDT
        #     size="0.001",
        #     price="30000",
        #     side=OrderSide.BUY
        # )
        #
        # # Cancel the order
        # if order and order.get("data", {}).get("orderId"):
        #     await trader.cancel_order(order.get("data", {}).get("orderId"))
        
        # Wait for some WebSocket updates
        logger.info("Waiting for WebSocket updates...")
        await asyncio.sleep(60)
    
    finally:
        # Close connections
        await trader.close()


if __name__ == "__main__":
    asyncio.run(main())
