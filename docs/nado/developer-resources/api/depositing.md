# Depositing

There are two ways to deposit funds into Nado:

1. **Direct Deposit** - Simple transfer to your unique deposit address (recommended for most users)
2. **On-Chain Contract Call** - Direct interaction with the Endpoint contract

***

## Method 1: Direct Deposit (Recommended)

Each subaccount has a unique deposit address. Simply send funds to this address and they will automatically be credited to your subaccount.

### Getting Your Deposit Address

Query your unique deposit address using the [Direct Deposit Address](https://docs.nado.xyz/developer-resources/api/archive-indexer/direct-deposit-address) endpoint:

**Request:**

```json
{
  "direct_deposit_address": {
    "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000"
  }
}
```

**Response:**

```json
{
  "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000",
  "deposit_address": "0x1234567890123456789012345678901234567890",
  "created_at": "1683315718"
}
```

### Depositing Funds

1. Get your deposit address using the API call above
2. Send the supported token to this address (e.g., USDT0, wETH, etc.)
3. Funds will be automatically credited to your subaccount within a few seconds

**Advantages:**

* No need to interact with smart contracts
* No need to approve allowances
* Works with any wallet (including CEX withdrawals)
* Simpler integration for users

**Notes:**

* Only send supported tokens to this address
* Find supported tokens via the [All Products](https://docs.nado.xyz/developer-resources/api/gateway/queries/all-products) query
* Deposits are processed automatically after blockchain confirmation

***

## Method 2: On-Chain Contract Call

Advanced users can deposit directly by calling the Endpoint contract.

### Contract Address

Find the Endpoint contract address at:

```
GET <nado-url>/query?type=contracts
```

### Function Interface

#### Basic Deposit

```solidity
function depositCollateral(
    bytes12 subaccountName,  // last 12 bytes of the subaccount bytes32
    uint32 productId,        // product ID for the token
    uint128 amount          // raw token amount (see decimals below)
) external
```

**Parameters:**

* `subaccountName`: The last 12 bytes of your subaccount identifier (e.g., `0x64656661756c740000000000` for "default")
* `productId`: The product ID for the token you're depositing
* `amount`: The raw amount in the token's smallest unit
  * For USDT0 (6 decimals): 1 USDT0 = `1e6` = `1000000`
  * For wETH (18 decimals): 1 wETH = `1e18`
  * For wBTC (8 decimals): 1 wBTC = `1e8`

#### Deposit with Referral Code

```solidity
function depositCollateralWithReferral(
    bytes32 subaccount,      // full 32-byte subaccount identifier
    uint32 productId,        // product ID for the token
    uint128 amount,         // raw token amount
    string memory referralCode  // referral code (optional)
) public
```

### Prerequisites

Before depositing via contract call, you must:

1. **Approve Token Allowance**

   ```solidity
   // Give the Endpoint contract permission to transfer your tokens
   IERC20(tokenAddress).approve(endpointAddress, amount);
   ```
2. **Get Product Information**
   * Use [All Products](https://docs.nado.xyz/developer-resources/api/gateway/queries/all-products) query to find:
     * Product ID for your token
     * Token contract address
     * Token decimals

### Example: Depositing 100 USDT0

Assuming USDT0 has product ID `0` and 6 decimals:

```typescript
// 1. Approve allowance (one-time or as needed)
await usdtContract.approve(endpointAddress, ethers.constants.MaxUint256);

// 2. Deposit 100 USDT0
const subaccountName = ethers.utils.formatBytes32String("default").slice(0, 26); // bytes12
const productId = 0;
const amount = 100 * 1e6; // 100 USDT0 with 6 decimals

await endpointContract.depositCollateral(subaccountName, productId, amount);
```

### Processing Time

Deposits may take a few seconds to process after transaction confirmation. You can monitor your balance via:

* [Subaccount Info](https://docs.nado.xyz/developer-resources/api/gateway/queries/subaccount-info) query
* WebSocket subscriptions for real-time updates

***

## Important Notes

* **Use Correct Product ID**: Each token has a specific product ID. Using the wrong ID will cause the transaction to fail.
* **Check Token Decimals**: Always multiply by the correct decimal factor (6 for USDT0, 18 for wETH, etc.)
* **Minimum Deposit**: Some products may have minimum deposit amounts
* **Only Supported Tokens**: Only deposit tokens that are listed via the All Products query

***

## Getting Token Information

Use the [All Products](https://docs.nado.xyz/developer-resources/api/gateway/queries/all-products) query to get:

```json
{
  "product_id": 0,
  "symbol": "USDT0",
  "token": "0x...",  // token contract address
  "decimals": 6
}
```

This information is essential for:

* Finding the correct `productId`
* Getting the token contract for approvals (Method 2 only)
* Calculating the correct `amount` with proper decimals
