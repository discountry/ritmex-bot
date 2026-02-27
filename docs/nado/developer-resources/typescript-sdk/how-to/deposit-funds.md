# Deposit Funds

## Import the functions <a href="#import-the-functions" id="import-the-functions"></a>

We'll use a few of the [common functions](https://docs.nado.xyz/developer-resources/typescript-sdk/how-to/useful-common-functions), assuming that they are in a `common.ts` file. The withdraw step requires a nonce as the transaction is executed against the off-chain engine.

```typescript
import { toFixedPoint } from '@nado-protocol/shared';
// Change the import source as needed
import { getNadoClient, prettyPrintJson } from './common';
```

## Mint a mock ERC20 token for testing <a href="#mint-a-mock-erc20-token-for-testing" id="mint-a-mock-erc20-token-for-testing"></a>

Grab a client object and mint mock tokens for the relevant product. This is *only* available on testnets for obvious reasons.

Minting is on-chain, so we wait for the transaction confirmation for chain state to propagate.

```typescript
const nadoClient = await getNadoClient();
const { walletClient, publicClient } = nadoClient.context

// If you have access to `walletClient`, you can call `walletClient.account.address`
// directly instead of reaching into `nadoClient.context`
const address = walletClient!.account.address;
const subaccountName = 'default';
// 10 USDT0 (6 decimals)
const depositAmount = toFixedPoint(10, 6);

const mintTxHash = await nadoClient.spot._mintMockERC20({
  amount: depositAmount,
  productId: 0,
});

await publicClient.waitForTransactionReceipt({
  hash: mintTxHash,
});

```

## Make a deposit <a href="#make-a-deposit" id="make-a-deposit"></a>

First, call `approveAllowance` to approve the deposit amount.

This is also an on-chain transaction with a confirmation hash.

```typescript
const approveTxHash = await nadoClient.spot.approveAllowance({
  amount: depositAmount,
  productId: 0,
});

await publicClient.waitForTransactionReceipt({
  hash: approveTxHash,
});
```

Now we can deposit the tokens. This transaction is on-chain.

```typescript
const depositTxHash = await nadoClient.spot.deposit({
  // Your choice of name for the subaccount, this subaccount will be credited with the deposit balance
  subaccountName: 'default',
  amount: depositAmount,
  productId: 0,
});

await publicClient.waitForTransactionReceipt({
  hash: depositTxHash,
});
```

{% hint style="info" %}
**Subaccounts**

* A subaccount is an *independent* trading account within Nado, allowing traders to manage risk across independent subaccounts
* Subaccounts are associated by a string `name` (max 12 char.) and the owner wallet address
  {% endhint %}

After this, we inject a short delay while the offchain sequencer picks up the transaction and credits the account.

```typescript
await new Promise((resolve) => setTimeout(resolve, 10000));
```

## Query Subaccount balance <a href="#query-subaccount-balance" id="query-subaccount-balance"></a>

Now, call the `getSubaccountEngineSummary` function to retrieve an overview of your subaccount, including balances.

```typescript
const subaccountData =
  await nadoClient.subaccount.getSubaccountSummary({
    subaccountOwner: address,
    subaccountName,
  });
prettyPrintJson('Subaccount Data After Deposit', subaccountData);
```

You should see that your balance associated with `productId` of `0` now reflects your deposit amount.

## Full example

```typescript
import { toFixedPoint } from '@nado-protocol/shared';
import { getNadoClient, prettyPrintJson } from './common';

async function main() {
  const nadoClient = getNadoClient();
  const { walletClient, publicClient } = nadoClient.context;

  // If you have access to `walletClient`, you can call `walletClient.account.address`
  // directly instead of reaching into `nadoClient.context`
  const address = walletClient!.account.address;
  const subaccountName = 'default';
  // 10 USDT0 (6 decimals)
  const depositAmount = toFixedPoint(10, 6);

  // TESTNET ONLY - Mint yourself some tokens
  const mintTxHash = await nadoClient.spot._mintMockERC20({
    amount: depositAmount,
    productId: 0,
  });
  // Mint goes on-chain, so wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: mintTxHash,
  });

  // Deposits require approval on the ERC20 token, this is on-chain as well
  const approveTxHash = await nadoClient.spot.approveAllowance({
    amount: depositAmount,
    productId: 0,
  });

  await publicClient.waitForTransactionReceipt({
    hash: approveTxHash,
  });

  // Now execute the deposit, which goes on-chain
  const depositTxHash = await nadoClient.spot.deposit({
    // Your choice of name for the subaccount, this subaccount will be credited with the deposit balance
    subaccountName: 'default',
    amount: depositAmount,
    productId: 0,
  });

  await publicClient.waitForTransactionReceipt({
    hash: depositTxHash,
  });
  
  await new Promise((resolve) => setTimeout(resolve, 10000));

  const subaccountData =
    await nadoClient.subaccount.getSubaccountSummary({
      subaccountOwner: address,
      subaccountName,
    });
  prettyPrintJson('Subaccount Data After Deposit', subaccountData);
}

main();
```
