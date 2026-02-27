# Withdraw Funds

This section assumes you have followed the instructions and run the code in the [deposit funds example](https://docs.nado.xyz/developer-resources/typescript-sdk/how-to/deposit-funds).

### Call the `withdraw` function <a href="#call-the-withdraw-function" id="call-the-withdraw-function"></a>

Note that there is a fee for withdrawals, in our case, it should be 1 USDT0. The `amount` sent to the `withdraw` function is exclusive of fee, hence depositAmount - toFixedPoint(1, 6)

```typescript
const withdrawTx = await nadoClient.spot.withdraw({
  amount: depositAmount - toFixedPoint(1, 6),
  productId: 0,
  subaccountName: 'default',
});

prettyPrintJson('Withdraw Tx', withdrawTx);
```

## Check balances <a href="#check-balance" id="check-balance"></a>

Retrieve and log the subaccount balances using `getSubaccountSummary`. You should see that your balance for USDT0 (product ID of 0) is now 0.

## Full example - deposit and withdraw <a href="#full-example-deposit-and-withdraw" id="full-example-deposit-and-withdraw"></a>

```typescript
import { toFixedPoint } from '@nado-protocol/utils';
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

  // Now withdraw your funds, this goes to the off-chain engine
  // We're withdrawing less than 10 as there are withdrawal fees of 1 USDT0
  const withdrawTx = await nadoClient.spot.withdraw({
    amount: depositAmount - toFixedPoint(1, 6),
    productId: 0,
    subaccountName,
  });
  prettyPrintJson('Withdraw Tx', withdrawTx);

  // Your new subaccount summary should have zero balances
  const subaccountDataAfterWithdraw =
    await nadoClient.subaccount.getSubaccountSummary({
      subaccountOwner: address,
      subaccountName,
    });
  prettyPrintJson(
    'Subaccount Data After Withdrawal',
    subaccountDataAfterWithdraw,
  );
}

main();
```
