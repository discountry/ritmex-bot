# EdgeX Python SDK

A Python SDK for interacting with the EdgeX Exchange API. This SDK provides a comprehensive interface to the EdgeX API, allowing you to easily integrate EdgeX functionality into your Python applications.

## Features

- **Complete API Coverage**: Access all EdgeX API endpoints
- **WebSocket Support**: Real-time data streaming
- **Async/Await**: Modern Python async interface
- **Type Hints**: Comprehensive type annotations for better IDE support
- **Error Handling**: Proper error handling and validation
- **Pagination**: Support for paginated API endpoints
- **Authentication**: Automatic request signing

## Installation

### From PyPI

```bash
pip install edgex-python-sdk
```

### From Source

```bash
git clone https://github.com/edgex-Tech/edgex-python-sdk.git
cd edgex-python-sdk
pip install -e .
```

### Using Requirements Files

For production use:
```bash
pip install -r requirements.txt
```

For development (includes testing and linting tools):
```bash
pip install -r requirements-dev.txt
```

### Virtual Environment (Recommended)

It's recommended to use a virtual environment:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Or install in development mode
pip install -e .
```

## Quick Start

```python
import asyncio
import os
from edgex_sdk import Client, OrderSide

async def main():
    # Create a new client
    client = Client(
        base_url="https://pro.edgex.exchange",  # Use https://testnet.edgex.exchange for testnet
        account_id=12345,  # Your account ID
        stark_private_key="your-stark-private-key"  # Your private key
    )

    # Get server time
    server_time = await client.get_server_time()
    print(f"Server Time: {server_time}")

    # Get exchange metadata
    metadata = await client.get_metadata()
    print(f"Available contracts: {len(metadata.get('data', {}).get('contractList', []))}")

    # Get account assets
    assets = await client.get_account_asset()
    print(f"Account Assets: {assets}")

    # Get account positions
    positions = await client.get_account_positions()
    print(f"Account Positions: {positions}")

    # Get 24-hour market data for BNB2USDT (contract ID: 10000004)
    quote = await client.get_24_hour_quote("10000004")
    print(f"BNB2USDT Price: {quote}")

    # Create a limit order (uncomment to place real order)
    # order = await client.create_limit_order(
    #     contract_id="10000004",  # BNB2USDT
    #     size="0.01",
    #     price="600.00",
    #     side=OrderSide.BUY
    # )
    # print(f"Order created: {order}")

# Run the async function
asyncio.run(main())
```

## Architecture

The SDK is organized into modules that correspond to the EdgeX API structure:

```
edgex_sdk/
├── __init__.py
├── client.py           # Main client
├── account/            # Account API
├── asset/              # Asset API
├── funding/            # Funding API
├── internal/           # Internal utilities
├── metadata/           # Metadata API
├── order/              # Order API
├── quote/              # Quote API
├── transfer/           # Transfer API
└── ws/                 # WebSocket API
```

## Available APIs

The SDK currently supports the following API modules:

- **Account API**: Manage account positions, retrieve position transactions, and handle collateral transactions
  - Get account positions
  - Get position by contract ID
  - Get position transaction history
  - Get collateral transaction details
  - Update leverage settings

- **Asset API**: Handle asset management and withdrawals
  - Get asset orders with pagination
  - Get coin rates
  - Manage withdrawals (normal, cross-chain, and fast)
  - Get withdrawal records and sign information
  - Check withdrawable amounts

- **Funding API**: Manage funding operations and account balance
  - Handle funding transactions
  - Manage funding accounts
  - Get funding transaction history

- **Metadata API**: Access exchange system information
  - Get server time
  - Get exchange metadata (trading pairs, contracts, etc.)

- **Order API**: Comprehensive order management
  - Create and cancel orders
  - Get active orders
  - Get order fill transactions
  - Calculate maximum order sizes
  - Manage order history

- **Quote API**: Access market data and pricing
  - Get multi-contract K-line data
  - Get order book depth
  - Access real-time market quotes
  - Get 24-hour ticker data

- **Transfer API**: Handle asset transfers
  - Create transfer out orders
  - Get transfer records (in/out)
  - Check available withdrawal amounts
  - Manage transfer history

- **WebSocket API**: Real-time data streaming
  - Market data (tickers, K-lines, order book, trades)
  - Account updates
  - Order updates
  - Position updates

## WebSocket Support

The SDK provides a WebSocket manager for handling real-time data:

```python
import asyncio
from edgex_sdk import WebSocketManager

async def main():
    # Create a WebSocket manager
    ws_manager = WebSocketManager(
        base_url="wss://quote.edgex.exchange",  # Use wss://quote-testnet.edgex.exchange for testnet
        account_id=12345,
        stark_pri_key="your-stark-private-key"
    )

    # Define message handlers
    def ticker_handler(message):
        print(f"Ticker Update: {message}")

    def kline_handler(message):
        print(f"K-line Update: {message}")

    # Connect to public WebSocket for market data
    ws_manager.connect_public()

    # Subscribe to real-time updates for BNB2USDT (contract ID: 10000004)
    ws_manager.subscribe_ticker("10000004", ticker_handler)
    ws_manager.subscribe_kline("10000004", "1m", kline_handler)

    # Connect to private WebSocket for account updates
    ws_manager.connect_private()

    # Wait for updates
    await asyncio.sleep(30)

    # Disconnect all connections
    ws_manager.disconnect_all()

asyncio.run(main())
```

## Signing Adapters

The SDK provides a flexible signing mechanism through signing adapters. **StarkExSigningAdapter is used by default**, so you don't need to explicitly create one:

```python
from edgex_sdk import Client

# Create a client (uses StarkExSigningAdapter by default)
client = Client(
    base_url="https://pro.edgex.exchange",  # Use https://testnet.edgex.exchange for testnet
    account_id=12345,
    stark_private_key="your-stark-private-key"
)
```

If you need to use a custom signing adapter, you can still provide one:

```python
from edgex_sdk import Client, StarkExSigningAdapter

# Create a custom signing adapter (optional)
signing_adapter = StarkExSigningAdapter()

# Create a client with a custom signing adapter
client = Client(
    base_url="https://pro.edgex.exchange",  # Use https://testnet.edgex.exchange for testnet
    account_id=12345,
    stark_private_key="your-stark-private-key",
    signing_adapter=signing_adapter
)
```

The SDK includes the following signing adapters:

- **StarkExSigningAdapter** (default): Full implementation using StarkWare cryptographic operations for production use

You can also create your own signing adapter by implementing the `SigningAdapter` interface if you need custom cryptographic operations.

## Error Handling

The SDK provides proper error handling for API requests:

```python
import asyncio
from edgex_sdk import Client, OrderSide

async def main():
    client = Client(
        base_url="https://pro.edgex.exchange",  # Use https://testnet.edgex.exchange for testnet
        account_id=12345,
        stark_private_key="your-stark-private-key"
    )

    try:
        # Create a limit order for BNB2USDT
        order = await client.create_limit_order(
            contract_id="10000004",  # BNB2USDT
            size="0.01",
            price="600.00",
            side=OrderSide.BUY
        )
        print(f"Order created: {order}")

        # Cancel the order
        from edgex_sdk import CancelOrderParams
        cancel_params = CancelOrderParams(
            order_id=order.get("data", {}).get("orderId")
        )
        cancel_result = await client.cancel_order(cancel_params)
        print(f"Order cancelled: {cancel_result}")

    except ValueError as e:
        print(f"Failed to create/cancel order: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

asyncio.run(main())
```

## Pagination

Many API endpoints support pagination:

```python
import asyncio
from edgex_sdk import Client, GetActiveOrderParams

async def main():
    client = Client(
        base_url="https://pro.edgex.exchange",  # Use https://testnet.edgex.exchange for testnet
        account_id=12345,
        stark_private_key="your-stark-private-key"
    )

    # Create pagination parameters
    params = GetActiveOrderParams(
        size="10",
        offset_data=""
    )

    # Get active orders
    orders = await client.get_active_orders(params)
    print(f"Active orders: {orders}")

    # Get next page if available
    if orders.get("data", {}).get("hasNext"):
        params.offset_data = orders.get("data", {}).get("offsetData")
        next_page = await client.get_active_orders(params)
        print(f"Next page: {next_page}")

asyncio.run(main())
```

## API Examples

### Market Data

```python
from edgex_sdk import Client, GetKLineParams, GetOrderBookDepthParams

# Get 24-hour market quotes for BNB2USDT (contract ID: 10000004)
quote = await client.get_24_hour_quote("10000004")
print(f"Current price: {quote}")

# Get K-line data for BTCUSDT (contract ID: 10000001)
kline_params = GetKLineParams(
    contract_id="10000001",  # BTCUSDT
    interval="1m",
    size="10"
)
klines = await client.quote.get_k_line(kline_params)
print(f"K-lines: {klines}")

# Get order book depth for ETHUSDT (contract ID: 10000002)
depth_params = GetOrderBookDepthParams(
    contract_id="10000002",  # ETHUSDT
    limit=10
)
depth = await client.quote.get_order_book_depth(depth_params)
print(f"Order book: {depth}")
```

### Account Management

```python
# Get account assets
assets = await client.get_account_asset()
print(f"Account assets: {assets}")

# Get account positions
positions = await client.get_account_positions()
print(f"Positions: {positions}")

# Get position transactions
from edgex_sdk import GetPositionTransactionPageParams
tx_params = GetPositionTransactionPageParams(
    size="10",
    offset_data=""
)
transactions = await client.account.get_position_transaction_page(tx_params)
print(f"Transactions: {transactions}")
```

### Order Management

```python
from edgex_sdk import OrderSide, CreateOrderParams, CancelOrderParams

# Create a limit order for BNBUSDT
order = await client.create_limit_order(
    contract_id="10000004",  # BNBUSDT
    size="0.01",
    price="600.00",
    side=OrderSide.BUY
)
print(f"Order created: {order}")

# Get maximum order size for BNBUSDT
max_size = await client.get_max_order_size("10000004", 600.00)
print(f"Max order size: {max_size}")

# Cancel an order
cancel_params = CancelOrderParams(
    order_id=order.get("data", {}).get("orderId")
)
cancel_result = await client.cancel_order(cancel_params)
print(f"Order cancelled: {cancel_result}")
```

### Contract IDs

EdgeX uses numeric contract IDs instead of symbol-based identifiers. Here are some common contract mappings:

| Contract ID | Symbol        | Tick Size |
|-------------|---------------|-----------|
| 10000001    | BTCUSDT       | 0.1       |
| 10000002    | ETHUSDT       | 0.01      |
| 10000003    | SOLUSDT       | 0.01      |

To get the complete list of available contracts:

```python
metadata = await client.get_metadata()
contracts = metadata.get("data", {}).get("contractList", [])
for contract in contracts:
    print(f"ID: {contract['contractId']} - {contract['contractName']}")
```

For more detailed examples, please refer to the [examples](examples) directory.

## Testing

The SDK includes comprehensive test coverage with multiple test suites:

### Unit Tests
```bash
# Run unit tests (no API credentials required)
python -m pytest tests/test_client.py tests/test_starkex_signing_adapter.py -v
```

### Public API Tests
```bash
# Run public endpoint tests (no authentication required)
python run_public_tests.py
```

### Mock Integration Tests
```bash
# Run mock tests (test structure without real API calls)
python run_mock_tests.py
```

### Full Integration Tests
```bash
# Run full integration tests (requires real API credentials)
python run_integration_tests.py
```

### All Tests
```bash
# Run all available tests
python run_tests.py
```

For more testing information, see [TESTING.md](TESTING.md).

## Environment Variables

For testing and development, you can set the following environment variables or create a `.env` file:

```bash
# API Configuration
EDGEX_BASE_URL=https://pro.edgex.exchange  # Use https://testnet.edgex.exchange for testnet
EDGEX_WS_URL=wss://quote.edgex.exchange    # Use wss://quote-testnet.edgex.exchange for testnet

# Account Credentials
EDGEX_ACCOUNT_ID=12345
EDGEX_STARK_PRIVATE_KEY=your-stark-private-key

# Signing Configuration
EDGEX_SIGNING_ADAPTER=starkex
```

Then load them in your code:

```python
import os
from dotenv import load_dotenv
from edgex_sdk import Client

# Load environment variables from .env file
load_dotenv()

client = Client(
    base_url=os.getenv("EDGEX_BASE_URL"),
    account_id=int(os.getenv("EDGEX_ACCOUNT_ID")),
    stark_private_key=os.getenv("EDGEX_STARK_PRIVATE_KEY")
)
```

## Documentation

For detailed API documentation, please refer to the [EdgeX API documentation](https://docs.edgex.exchange).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.