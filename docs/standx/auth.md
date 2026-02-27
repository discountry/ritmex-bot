## StandX Perps Authentication

官网创建的 API 提供了

API Token 以及 Ed25519 Private Key，用于签名交易。

⚠️ This document is under construction.

This document explains how to obtain JWT access tokens for the StandX Perps API through wallet signatures.

## Prerequisites

- Valid wallet address and corresponding private key
- Development environment with `ed25519` algorithm support

## Authentication Flow

### 1\. Prepare Wallet and Temporary ed25519 Key Pair

1. **Prepare Wallet**: Ensure you have a blockchain wallet with its address and private key.
2. **Generate Temporary ed25519 Key Pair and `requestId`**

### 2\. Get Signature Data

Request signature data from the server:

> **Note**: Code examples provided below are for reference purposes only and demonstrate the general implementation approach. Adapt them to your specific production environment.

#### Using curl

```
curl 'https://api.standx.com/v1/offchain/prepare-signin?chain=<chain>' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "address": "<your_wallet_address>",
    "requestId": "<base58_encoded_public_key>"
  }'
```

#### TypeScript/ES6 Implementation Reference

#### Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chain | string | Yes | Blockchain network: `bsc` or `solana` |
| address | string | Yes | Wallet address |
| requestId | string | Yes | Base58-encoded ed25519 public key from step 1 |

#### Success Response

```
{
  "success": true,
  "signedData": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3\. Parse and Verify Signature Data

`signedData` is a JWT string that must be verified using StandX’s public key.

#### Get Verification Public Key

```
# Using curl
curl 'https://api.standx.com/v1/offchain/certs'
```

#### Example signedData Payload

### 4\. Sign the Message

Sign `payload.message` with your wallet private key to generate the `signature`.

#### BSC (EVM) Implementation Reference

```
import { ethers } from "ethers";
 
const provider = new ethers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);
const privateKey = "<your_wallet_private_key>"; // Keep secure; use environment variables
const wallet = new ethers.Wallet(privateKey, provider);
 
// Sign using the message from the parsed payload
const signature = await wallet.signMessage(payload.message);
```

#### Solana Implementation Reference

```
import bs58 from "bs58";
import { ed25519 } from "@noble/curves/ed25519";
import { Keypair } from "@solana/web3.js";
 
const privateKey = "<your_base58_encoded_private_key>"; // Keep secure; use environment variables
const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
 
// Sign using the message from the parsed payload
const messageBytes = new TextEncoder().encode(payload.message);
const signatureBytes = ed25519.sign(
  messageBytes,
  walletKeypair.secretKey.slice(0, 32) // First 32 bytes are the private key
);
 
// Solana requires a specific signature format
const signature = Buffer.from(
  JSON.stringify({
    input: payload,
    output: {
      signedMessage: Array.from(messageBytes),
      signature: Array.from(signatureBytes),
      account: {
        publicKey: Array.from(walletKeypair.publicKey.toBytes()),
      },
    },
  })
).toString("base64");
```

### 5\. Get Access Token

Submit the `signature` and original `signedData` to the login endpoint.

**Optional Parameter:**

- `expiresSeconds` (number): Token expiration time in seconds. Defaults to `604800` (7 days) if not specified. This controls how long the JWT access token remains valid before requiring re-authentication.

> **Security Note**: For security best practices, avoid setting excessively long expiration times. Shorter token lifetimes reduce the risk of unauthorized access if a token is compromised. Consider your security requirements when configuring this value.

#### Using curl

#### TypeScript/ES6 Implementation Reference

#### Success Response

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "address": "0x...",
  "alias": "user123",
  "chain": "bsc",
  "perpsAlpha": true
}
```

### 6\. Use Access Token

Use the obtained `token` for subsequent API requests by adding `Authorization: Bearer <token>` to the request headers.

## Body Signature Flow

### Basic Flow

1. Prepare a key pair
2. Build message: `{version},{id},{timestamp},{payload}`
3. Sign with private key
4. Base64 encode signature
5. Attach signature to request headers

```
{
    ...
    "authorization": "Bearer <token>",
    "x-request-sign-version": "v1",
    "x-request-id": "uuid",
    "x-request-timestamp": "timestamp",
    "x-request-signature": "signature",
    ...
}
```

### Code example (only for reference):

```
import { ed25519 } from "@noble/curves/ed25519";
import { base58 } from "@scure/base";
import { v4 as uuidv4 } from "uuid";
 
/**
 * Sign request and return Base64-encoded signature.
 */
function encodeRequestSignature(
  xRequestVersion: string,
  xRequestId: string,
  xRequestTimestamp: number,
  payload: string,
  signingKey: Uint8Array
): string {
  // Build message to sign: "{version},{id},{timestamp},{payload}"
  const signMsg = \`${xRequestVersion},${xRequestId},${xRequestTimestamp},${payload}\`;
 
  // Sign message with Ed25519 private key
  const messageBytes = Buffer.from(signMsg, "utf-8");
  const signature = ed25519.sign(messageBytes, signingKey);
 
  // Base64 encode the signature
  return Buffer.from(signature).toString("base64");
}
 
// --- Example Usage ---
 
// Generate Ed25519 key pair
const privateKey = ed25519.utils.randomSecretKey();
const publicKey = ed25519.getPublicKey(privateKey);
 
// Generate requestId (base58-encoded public key)
const requestId = base58.encode(publicKey);
 
// Prepare request parameters
const xRequestVersion = "v1";
const xRequestId = uuidv4();
const xRequestTimestamp = Date.now();
 
const payloadDict = {
  user_id: 12345,
  data: "some important information",
};
const payloadStr = JSON.stringify(payloadDict);
 
// Generate signature
const signature = encodeRequestSignature(
  xRequestVersion,
  xRequestId,
  xRequestTimestamp,
  payloadStr,
  privateKey
);
 
// Verify signature (optional)
try {
  const verifyMsg = \`v1,${xRequestId},${xRequestTimestamp},${payloadStr}\`;
  const signatureBytes = Buffer.from(signature, "base64");
  const messageBytes = Buffer.from(verifyMsg, "utf-8");
 
  const isValid = ed25519.verify(signatureBytes, messageBytes, publicKey);
  if (!isValid) throw new Error("Verification failed");
} catch (error) {
  console.error("Signature verification error:", error.message);
}
 
// Send Request with Body Signature
fetch("/api/request_need_body_signature", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    authorization: \`Bearer ${token}\`,
    "x-request-sign-version": "v1",
    "x-request-id": xRequestId,
    "x-request-timestamp": xRequestTimestamp.toString(),
    "x-request-signature": signature,
  },
  body: payloadStr,
});
```

### Complete Authentication Examples

For complete, runnable implementations, see the chain-specific examples:

- [EVM (BSC) Example](https://docs.standx.com/standx-api/perps-auth-evm-example) - Authentication using ethers.js for BSC and other EVM-compatible chains
- [Solana (SVM) Example](https://docs.standx.com/standx-api/perps-auth-svm-example) - Authentication using @solana/web3.js for Solana

Last updated on

[About StandX API](https://docs.standx.com/standx-api/standx-api "About StandX API") [Perps Auth EVM Example](https://docs.standx.com/standx-api/perps-auth-evm-example "Perps Auth EVM Example")

## StandX Perps Authentication - EVM Example

This example demonstrates how to authenticate with the StandX Perps API using an EVM-compatible wallet (e.g., BSC).

## Prerequisites

- Node.js environment with TypeScript support
- EVM wallet with private key
- Required packages:
	```
	npm install @noble/curves @scure/base ethers
	```

## Complete Implementation

```
import { ed25519 } from "@noble/curves/ed25519";
import { base58 } from "@scure/base";
import { ethers } from "ethers";
 
// Types
export type Chain = "bsc" | "solana";
 
export interface SignedData {
  domain: string;
  uri: string;
  statement: string;
  version: string;
  chainId: number;
  nonce: string;
  address: string;
  requestId: string;
  issuedAt: string;
  message: string;
  exp: number;
  iat: number;
}
 
export interface LoginResponse {
  token: string;
  address: string;
  alias: string;
  chain: string;
  perpsAlpha: boolean;
}
 
export interface RequestSignatureHeaders {
  "x-request-sign-version": string;
  "x-request-id": string;
  "x-request-timestamp": string;
  "x-request-signature": string;
}
 
// Authentication Class
export class StandXAuth {
  private ed25519PrivateKey: Uint8Array;
  private ed25519PublicKey: Uint8Array;
  private requestId: string;
  private baseUrl = "https://api.standx.com";
 
  constructor() {
    const privateKey = ed25519.utils.randomSecretKey();
    this.ed25519PrivateKey = privateKey;
    this.ed25519PublicKey = ed25519.getPublicKey(privateKey);
    this.requestId = base58.encode(this.ed25519PublicKey);
  }
 
  async authenticate(
    chain: Chain,
    walletAddress: string,
    signMessage: (msg: string) => Promise<string>
  ): Promise<LoginResponse> {
    const signedDataJwt = await this.prepareSignIn(chain, walletAddress);
    const payload = this.parseJwt<SignedData>(signedDataJwt);
    const signature = await signMessage(payload.message);
    return this.login(chain, signature, signedDataJwt);
  }
 
  private async prepareSignIn(chain: Chain, address: string): Promise<string> {
    const res = await fetch(
      \`${this.baseUrl}/v1/offchain/prepare-signin?chain=${chain}\`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, requestId: this.requestId }),
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error("Failed to prepare sign-in");
    return data.signedData;
  }
 
  private async login(
    chain: Chain,
    signature: string,
    signedData: string,
    expiresSeconds: number = 604800 // default: 7 days
  ): Promise<LoginResponse> {
    const res = await fetch(
      \`${this.baseUrl}/v1/offchain/login?chain=${chain}\`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, signedData, expiresSeconds }),
      }
    );
    return res.json();
  }
 
  signRequest(
    payload: string,
    requestId: string,
    timestamp: number
  ): RequestSignatureHeaders {
    const version = "v1";
    const message = \`${version},${requestId},${timestamp},${payload}\`;
    const signature = ed25519.sign(
      Buffer.from(message, "utf-8"),
      this.ed25519PrivateKey
    );
 
    return {
      "x-request-sign-version": version,
      "x-request-id": requestId,
      "x-request-timestamp": timestamp.toString(),
      "x-request-signature": Buffer.from(signature).toString("base64"),
    };
  }
 
  private parseJwt<T>(token: string): T {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  }
}
 
// Usage Example
async function main() {
  // Initialize auth
  const auth = new StandXAuth();
 
  // Setup wallet
  const provider = new ethers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
  );
  const privateKey = process.env.WALLET_PRIVATE_KEY!;
  const wallet = new ethers.Wallet(privateKey, provider);
 
  // Authenticate
  const loginResponse = await auth.authenticate(
    "bsc",
    wallet.address,
    async (message) => wallet.signMessage(message)
  );
 
  console.log("Access Token:", loginResponse.token);
 
  // Sign a request
  const payload = JSON.stringify({
    symbol: "BTC-USD",
    side: "buy",
    order_type: "limit",
    qty: "0.1",
    price: "50000",
    time_in_force: "gtc",
    reduce_only: false,
  });
 
  const headers = auth.signRequest(payload, crypto.randomUUID(), Date.now());
 
  // Make authenticated request
  await fetch("https://perps.standx.com/api/new_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer ${loginResponse.token}\`,
      ...headers,
    },
    body: payload,
  });
}
 
main().catch(console.error);
```

## Key Points

1. **Wallet Setup**: Uses `ethers.js` to create a wallet from a private key
2. **Message Signing**: EVM wallets sign the message directly using `wallet.signMessage()`
3. **Signature Format**: The signature is returned as-is from the wallet (hex string)

## Environment Variables

Create a `.env` file with:

```
WALLET_PRIVATE_KEY=your_private_key_here
```

> **Security Note**: Never commit private keys to version control. Use environment variables or secure key management solutions.

[Perps Auth](https://docs.standx.com/standx-api/perps-auth "Perps Auth") [Perps Auth SVM Example](https://docs.standx.com/standx-api/perps-auth-svm-example "Perps Auth SVM Example")

## StandX Perps Authentication - Solana (SVM) Example

This example demonstrates how to authenticate with the StandX Perps API using a Solana wallet.

## Prerequisites

- Node.js environment with TypeScript support
- Solana wallet with private key (base58-encoded)
- Required packages:
	```
	npm install @noble/curves @scure/base @solana/web3.js bs58
	```

## Complete Implementation

```
import { ed25519 } from "@noble/curves/ed25519";
import { base58 } from "@scure/base";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
 
// Types
export type Chain = "bsc" | "solana";
 
export interface SignedData {
  domain: string;
  uri: string;
  statement: string;
  version: string;
  chainId: number;
  nonce: string;
  address: string;
  requestId: string;
  issuedAt: string;
  message: string;
  exp: number;
  iat: number;
}
 
export interface LoginResponse {
  token: string;
  address: string;
  alias: string;
  chain: string;
  perpsAlpha: boolean;
}
 
export interface RequestSignatureHeaders {
  "x-request-sign-version": string;
  "x-request-id": string;
  "x-request-timestamp": string;
  "x-request-signature": string;
}
 
// Authentication Class
export class StandXAuth {
  private ed25519PrivateKey: Uint8Array;
  private ed25519PublicKey: Uint8Array;
  private requestId: string;
  private baseUrl = "https://api.standx.com";
 
  constructor() {
    const privateKey = ed25519.utils.randomSecretKey();
    this.ed25519PrivateKey = privateKey;
    this.ed25519PublicKey = ed25519.getPublicKey(privateKey);
    this.requestId = base58.encode(this.ed25519PublicKey);
  }
 
  async authenticate(
    chain: Chain,
    walletAddress: string,
    signMessage: (msg: string, payload: SignedData) => Promise<string>
  ): Promise<LoginResponse> {
    const signedDataJwt = await this.prepareSignIn(chain, walletAddress);
    const payload = this.parseJwt<SignedData>(signedDataJwt);
    const signature = await signMessage(payload.message, payload);
    return this.login(chain, signature, signedDataJwt);
  }
 
  private async prepareSignIn(chain: Chain, address: string): Promise<string> {
    const res = await fetch(
      \`${this.baseUrl}/v1/offchain/prepare-signin?chain=${chain}\`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, requestId: this.requestId }),
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error("Failed to prepare sign-in");
    return data.signedData;
  }
 
  private async login(
    chain: Chain,
    signature: string,
    signedData: string,
    expiresSeconds: number = 604800 // default: 7 days
  ): Promise<LoginResponse> {
    const res = await fetch(
      \`${this.baseUrl}/v1/offchain/login?chain=${chain}\`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, signedData, expiresSeconds }),
      }
    );
    return res.json();
  }
 
  signRequest(
    payload: string,
    requestId: string,
    timestamp: number
  ): RequestSignatureHeaders {
    const version = "v1";
    const message = \`${version},${requestId},${timestamp},${payload}\`;
    const signature = ed25519.sign(
      Buffer.from(message, "utf-8"),
      this.ed25519PrivateKey
    );
 
    return {
      "x-request-sign-version": version,
      "x-request-id": requestId,
      "x-request-timestamp": timestamp.toString(),
      "x-request-signature": Buffer.from(signature).toString("base64"),
    };
  }
 
  private parseJwt<T>(token: string): T {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  }
}
 
// Usage Example
async function main() {
  // Initialize auth
  const auth = new StandXAuth();
 
  // Setup wallet from base58-encoded private key
  const privateKey = process.env.SOLANA_PRIVATE_KEY!;
  const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
  const walletAddress = walletKeypair.publicKey.toBase58();
 
  // Authenticate
  const loginResponse = await auth.authenticate(
    "solana",
    walletAddress,
    async (message, payload) => {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = ed25519.sign(
        messageBytes,
        walletKeypair.secretKey.slice(0, 32) // First 32 bytes are the private key
      );
 
      // Solana requires a specific signature format
      return Buffer.from(
        JSON.stringify({
          input: payload,
          output: {
            signedMessage: Array.from(messageBytes),
            signature: Array.from(signatureBytes),
            account: {
              publicKey: Array.from(walletKeypair.publicKey.toBytes()),
            },
          },
        })
      ).toString("base64");
    }
  );
 
  console.log("Access Token:", loginResponse.token);
 
  // Sign a request
  const payload = JSON.stringify({
    symbol: "BTC-USD",
    side: "buy",
    order_type: "limit",
    qty: "0.1",
    price: "50000",
    time_in_force: "gtc",
    reduce_only: false,
  });
 
  const headers = auth.signRequest(payload, crypto.randomUUID(), Date.now());
 
  // Make authenticated request
  await fetch("https://perps.standx.com/api/new_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer ${loginResponse.token}\`,
      ...headers,
    },
    body: payload,
  });
}
 
main().catch(console.error);
```

## Key Points

1. **Wallet Setup**: Uses `@solana/web3.js` Keypair with a base58-encoded private key
2. **Message Signing**: Uses `@noble/curves/ed25519` for Ed25519 signing with `walletKeypair.secretKey.slice(0, 32)` (first 32 bytes are the private key)
3. **Signature Format**: Solana requires a specific JSON structure containing:
	- `input`: The original payload from the server
	- `output.signedMessage`: The message bytes as an array
	- `output.signature`: The signature bytes as an array
	- `output.account.publicKey`: The wallet’s public key bytes as an array
	This JSON is then base64-encoded before being sent to the server.

## Signature Format Explanation

Unlike EVM wallets that return a simple hex signature, Solana authentication requires a structured response:

```
{
  input: payload,           // Original SignedData from server
  output: {
    signedMessage: [...],   // Message bytes as number array
    signature: [...],       // Ed25519 signature bytes as number array
    account: {
      publicKey: [...]      // Wallet public key bytes as number array
    }
  }
}
```

This format allows the server to verify both the signature and the signing account.

## Environment Variables

Create a `.env` file with:

```
SOLANA_PRIVATE_KEY=your_base58_encoded_private_key_here
```

> **Security Note**: Never commit private keys to version control. Use environment variables or secure key management solutions.

[Perps Auth EVM Example](https://docs.standx.com/standx-api/perps-auth-evm-example "Perps Auth EVM Example") [Perps HTTP API](https://docs.standx.com/standx-api/perps-http "Perps HTTP API")