# EdgeX Python SDK Examples

This directory contains examples demonstrating how to use the EdgeX Python SDK.

## Prerequisites

Before running the examples, make sure you have installed the EdgeX Python SDK:

```bash
pip install edgex-python-sdk
```

Or, if you're working with the source code:

```bash
cd edgex-python-sdk
pip install -e .
```

## Environment Variables

The examples use the following environment variables:

- `EDGEX_BASE_URL`: Base URL for HTTP API endpoints (e.g., "https://pro.edgex.exchange" for production, "https://testnet.edgex.exchange" for testnet)
- `EDGEX_WS_URL`: Base URL for WebSocket endpoints (e.g., "wss://quote.edgex.exchange" for production, "wss://quote-testnet.edgex.exchange" for testnet)
- `EDGEX_ACCOUNT_ID`: Your account ID
- `EDGEX_STARK_PRIVATE_KEY`: Your stark private key

You can set these variables in your environment or create a `.env` file in the examples directory:

```
EDGEX_BASE_URL=https://pro.edgex.exchange  # Use https://testnet.edgex.exchange for testnet
EDGEX_WS_URL=wss://quote.edgex.exchange    # Use wss://quote-testnet.edgex.exchange for testnet
EDGEX_ACCOUNT_ID=12345
EDGEX_STARK_PRIVATE_KEY=your-stark-private-key
```

## Examples

### Basic Usage

The `basic_usage.py` example demonstrates the basic functionality of the SDK:

- Creating a client
- Getting server time and metadata
- Getting account assets and positions
- Getting market data (K-lines, order book depth)
- Creating orders (commented out to avoid actual order creation)
- Using WebSockets for real-time data

To run the example:

```bash
python basic_usage.py
```

### Advanced Usage

The `advanced_usage.py` example demonstrates more advanced features of the SDK:

- Order management (creating and canceling orders)
- WebSocket integration with proper handlers
- Error handling
- Pagination
- Using a trader class to encapsulate functionality

To run the example:

```bash
python advanced_usage.py
```

## Contract IDs

EdgeX uses numeric contract IDs instead of symbol-based identifiers. Here are some common contract mappings:

| Contract ID | Symbol        | Tick Size |
|-------------|---------------|-----------|
| 10000001    | BTCUSDT       | 0.1       |
| 10000002    | ETHUSDT       | 0.01      |
| 10000003    | SOLUSDT       | 0.01      |
| 10000004    | BNBUSDT       | 0.01      |

To get the complete list of available contracts:

```python
metadata = await client.get_metadata()
contracts = metadata.get("data", {}).get("contractList", [])
for contract in contracts:
    print(f"ID: {contract['contractId']} - {contract['contractName']}")
```

## Notes

- The examples include order creation code that is commented out to avoid creating actual orders. Uncomment this code if you want to create real orders.
- The WebSocket examples will run for a short time and then disconnect. Adjust the sleep time if you want to receive more updates.
- The examples use asyncio for asynchronous operations. Make sure you're using Python 3.7 or later.
- All examples use numeric contract IDs (e.g., "10000001" for BTCUSDT) as required by the EdgeX API.
- For order book depth queries, valid limit values are 15 or 200.

## Customization

Feel free to modify the examples to suit your needs. Some ideas:

- Implement a trading strategy
- Add more error handling
- Implement a command-line interface
- Create a web interface using a framework like Flask or FastAPI
- Add logging to a file
- Add more sophisticated order management

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are set correctly
2. Verify that you have the latest version of the SDK
3. Check the EdgeX API documentation for any changes
4. Look for error messages in the console output
5. Try with a smaller subset of functionality to isolate the issue
