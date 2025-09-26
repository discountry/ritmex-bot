# GRVT TypeScript SDK

This SDK provides a TypeScript interface to interact with the GRVT API. It supports both REST API and WebSocket connections.

## Installation

```bash
npm install @grvt/sdk
```

## Usage

### REST API Client

```typescript
import {
  ECurrency,
  ETransferType,
  ITransferMetadata,
  ETransferProvider,
  ETransferDirection,
  EGrvtEnvironment,
  EChain,
  ISigningOption
} from '@grvt/sdk';

// Initialize the client
const client = new GrvtClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  env: EGrvtEnvironment.DEV,
});

// Get funding account summary
const accountSummary = await client.getFundingAccountSummary();

// Get sub account summary
const subAccountSummary = await client.getSubAccountSummary({
  sub_account_id: 'your-sub-account-id',
});

// Transfer examples
// Note: the signature field is optional. If not provided, the SDK will automatically compute it using the apiSecret and provided signing options

// Standard transfer
const transfer1 = await client.transfer({
  from_account_id: 'from-account-id',
  from_sub_account_id: 'from-sub-account-id',
  to_account_id: 'to-account-id',
  to_sub_account_id: 'to-sub-account-id',
  currency: ECurrency.USDT,
  num_tokens: '100',
  transfer_type: ETransferType.STANDARD,
});


// Metadata for transfer, you can pass it as the second argument for the transfer API
const metadata: ITransferMetadata = {
  provider: ETransferProvider.RHINO;
  direction: ETransferDirection.DEPOSIT; // Use ETransferDirection.WITHDRAWAL for withdraw flow
  chainid: Echain.TRON,
  endpoint,
  provider_tx_id: tx_hash,
  provider_ref_id: commit_id,
};

// Signing options for generating the signature as the third argument for the transfer API
// Note: nonce must be non-negative and expiration must be within 30 days
const signingOptions: ISigningOption = {
  nonce: 12345,
  expiration: '1746093221289693252'
};

const transfer2 = await client.transfer(
  {
    from_account_id: 'from-account-id',
    to_account_id: 'to-account-id',
    currency: ECurrency.USDT,
    num_tokens: '100',
    transfer_type: ETransferType.NON_NATIVE_BRIDGE_DEPOSIT, // Use NON_NATIVE_BRIDGE_WITHDRAW for withdraw flow
  },
  metadata,
  signingOptions
);

// Request deposit approval
// This API is used to get signature for a deposit before executing it
const depositApproval = await client.requestDepositApproval({
  l1Sender: 'your-l1-address', // L1 address of the sending wallet
  l2Receiver: 'your-l2-address', // Your L2 address to receive the funds
  l1Token: 'token-contract-address', // L1 token contract address
  amount: '100' // Amount to deposit
});


// Withdraw funds from your account
// Note: the signature field is optional. If not provided, the SDK will automatically compute it using the apiSecret and provided signing options
const withdrawResult = await client.withdraw({
  from_account_id: 'your-account-id',
  to_eth_address: 'destination-eth-address',
  currency: ECurrency.USDT,
  num_tokens: '100'
});

// Query transfer history
const transferHistory = await client.getTransferHistory({
  start_time: '1745600642000785050' // timestamp in nanosecond, use this to filter transfers with event time >= start_time
  end_time: '17588917787741000000' // timestamp in nanoseconds, use this to filter transfers with event time <= end_time
});
// You can filter more & do pagination with this query if needed, please take a look at the request interface to get more details

// Query deposit history
const depositHistory = await client.getDepositHistory({
  start_time: '1745600642000785050' // timestamp in nanosecond, use this to filter deposits with event time >= start_time
  end_time: '17588917787741000000' // timestamp in nanoseconds, use this to filter deposits with event time <= end_time
});
// You can filter more & do pagination with this query if needed, please take a look at the request interface to get more details


// Get current server time, in milliseconds since epoch
const currentTime = await client.getCurrentTime()
// Example result: 1747397398409

// Convert Rhino chain to Gravity Echain
// Result will depend on the environment, specifically
// - DEV, STAGING - Rhino DEV
// - TESTNET - Rhino STG
// - PRODUCTIOn - Rhino PROD
// This will return null if the chain ID is not found or not supported
import { SupportedChains } from "@rhino.fi/sdk"

const chainID = await client.getGravityChainIDFromRhinoChain(SupportedChains.BNB_SMART_CHAIN)
// Result:
// - On DEV/STAGING/TESTNET: 97
// - On PRODUCTION: 56

```

### WebSocket Client

The WebSocket client supports real-time data streaming and follows the same authentication mehanism as the REST API client.

```typescript
import { GrvtWsClient, EGrvtEnvironment } from '@grvt/sdk';

// Initialize the WebSocket client
const client = new GrvtWsClient({
  apiKey: 'your-api-key',
  env: EGrvtEnvironment.DEV,
});

// Connect to WebSocket
await client.connect();

// Subscribe to transfer history
client.subscribeTransferHistory(
  'main-account-id',
  (data) => {
    console.log('Received transfer:', data);
  },
  'sub-account-id' // optional
);

// Disconnect when done
client.disconnect();
```

#### WebSocket Features

1. **Authentication**:

   - Uses the same cookie-based authentication as the REST API
   - Automatically refreshes cookies when needed

2. **Connection Management**:

   - Automatic reconnection with exponential backoff
   - Connection monitoring with 5-second timeout
   - Reconnects if no messages are received within the timeout period

3. **Subscription Handling**:

   - Unique subscription IDs for each subscription
   - Subscriptions are not automatically restored after reconnection
   - Users need to manually resubscribe after reconnection

4. **Error Handling**:
   - Automatic error logging
   - Graceful disconnection handling
   - Reconnection attempts with configurable maximum retries

## Development

### Building

```bash
npm run build
```

### Formatting

```bash
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run SDK tests
npm run test:sdk

# Run WebSocket tests
npm run test:ws
```

### Linting and Formating

```bash
npm run lint
```

```bash
npm run format
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.