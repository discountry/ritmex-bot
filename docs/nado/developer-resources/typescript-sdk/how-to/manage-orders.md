# Manage Orders

This guide shows you how to:

* Create an order.
* Place an order.
* Cancel an order.
* Query orders by subaccount.

If you inspect the underlying types for these transactions, you'll notice that a `nonce` field is required. This is a unique integer in ascending order. Our off-chain engine has a `nonce` query to return the latest nonce for a given subaccount. All this is abstracted away within the SDK, so you do not need to manually use this query.

## Import the functions <a href="#import-the-functions" id="import-the-functions"></a>

```typescript
import { getNadoClient, prettyPrintJson } from "./common";
import { nowInSeconds, toFixedPoint, packOrderAppendix } from "@nado-protocol/shared";
```

## Scaffold Your Subaccount <a href="#scaffold-your-subaccount" id="scaffold-your-subaccount"></a>

To place orders, we need a subaccount with funds. We need to perform the [deposit funds](https://docs.nado.xyz/developer-resources/typescript-sdk/how-to/deposit-funds) step as before, this time with 1000 USDT0.

```typescript
const nadoClient = getNadoClient();
const { walletClient, publicClient } = nadoClient.context;

const address = walletClient!.account.address;
const subaccountName = 'default';
const depositAmount = toFixedPoint(1000, 6);

const mintTxHash = await nadoClient.spot._mintMockERC20({
  amount: depositAmount,
  productId: 0,
});
await publicClient.waitForTransactionReceipt({
  hash: mintTxHash,
});

const approveTxHash = await nadoClient.spot.approveAllowance({
  amount: depositAmount,
  productId: 0,
});
await publicClient.waitForTransactionReceipt({
  hash: approveTxHash,
});

const depositTxHash = await nadoClient.spot.deposit({
  subaccountName: 'default',
  amount: depositAmount,
  productId: 0,
});
await publicClient.waitForTransactionReceipt({
  hash: depositTxHash,
});

await new Promise((resolve) => setTimeout(resolve, 10000));
```

## Create an order <a href="#create-an-order" id="create-an-order"></a>

Placing an order requires a number of parameters, represented by the `PlaceOrderParams['order']` type.

In the example below:

* The order `appendix` indicates order execution type and other flags. Please refer to [Order Appendix](https://docs.nado.xyz/developer-resources/api/order-appendix) for more details.
* The order `expiration` time is given by calling the `nowInSeconds` function from the `utils` package and adding 60 seconds. This means the order will expire 60 seconds from now.
* The `price` field is set at `80000` - a low value (at the time of writing) to prevent execution. This enables us to cancel the order later on without it being instantly filled. Please adjust this price accordingly.
* The `amount` field is set at `10**16` - this is the amount to buy/sell. A positive value is to buy, negative is to sell.
  * Amount is normalized to 18 decimal places, which is what `toFixedPoint` does by default.
  * **NOTE**: Min limit order size for `BTC` is `10**16` and for `ETH` is `10**17`. Orders below these sizes will fail to be placed.

```typescript
const orderParams: PlaceOrderParams['order'] = {
  // When using the `placeOrder` call, the `subaccountOwner` defaults to the
  // address of the `walletClient`
  subaccountName: 'default',
  expiration: nowInSeconds() + 60,
  appendix: packOrderAppendix({
      orderExecutionType: 'ioc',
  }),
  price: 80000,
  // Setting order amount to 10**16
  amount: toFixedPoint(0.01, 18),
};
```

## Place the order <a href="#place-the-order" id="place-the-order"></a>

Use the order parameters to place the order with the `placeOrder` function.

```typescript
const placeOrderResult = await nadoClient.market.placeOrder({
  order: orderParams,
  productId: 2,
  // Used for spot orders to enable/disable borrowing
  spotLeverage: undefined,
});

prettyPrintJson("Place Order Result", placeOrderResult);
```

## Alternative order placement <a href="#create-an-order-tx" id="create-an-order-tx"></a>

Alternatively, you can manually use `payloadBuilder` to manually generate the place order payload. This may be useful in cases where you want to build the `tx` separately from sending the execute API call.

```typescript
// Use one of the following to generate a payload
nadoClient.context.engineClient.payloadBuilder.buildPlaceOrderPayload(...)
nadoClient.context.engineClient.payloadBuilder.buildPlaceOrderPayloadSync(...)

// Then execute 
nadoClient.context.engineClient.execute('place_order', placeOrderPayload.payload);
```

## Order digest <a href="#order-digest" id="order-digest"></a>

You can optionally generate the order digest, which can then be used to further manage the order e.g: cancelling the order. The order digest is also returned upon executing the `placeOrder` transaction.

```typescript
import { getOrderDigest } from "@nado-protocol/shared";

const productId = 2;
const orderParams: EIP712OrderParams = {
  subaccountOwner: address,
  subaccountName,
  expiration: nowInseconds() + 60,
  appendix: packOrderAppendix({
      orderExecutionType: 'post_only',
  }),
  price: 80000,
  // Setting order amount to 10**16
  amount: toFixedPoint(0.01, 18),
  nonce: getOrderNonce(),
};

// Optional: generate a digest ahead of time so that you can manage the order, alternatively, the digest
// will be returned via placeOrderResult.data.digest
const orderDigest = getOrderDigest({
  chainId: walletClient!.chain.id,
  order: orderParams,
  productId,
});
```

## Query orders on the subaccount <a href="#query-orders-on-the-subaccount" id="query-orders-on-the-subaccount"></a>

Now we can query the subaccount for open orders with the `getOpenSubaccountOrders` function.

```typescript
const openOrders = await nadoClient.market.getOpenSubaccountOrders({
    subaccountOwner: address,
    subaccountName,
    productId: 2,
  });

prettyPrintJson('Subaccount Open Orders', openOrders);
```

## Cancel order <a href="#cancel-order" id="cancel-order"></a>

Cancel the order using the digest of the placed order. You can cancel multiple orders at once.

```typescript
const cancelOrderResult = await nadoClient.market.cancelOrders({
  digests: [placeOrderResult.data.digest],
  productIds: [2],
  subaccountName: 'default',
});

prettyPrintJson('Cancel Order Result', cancelOrderResult);
```

### Query Orders to Verify Cancellation <a href="#query-orders-to-verify-cancellation" id="query-orders-to-verify-cancellation"></a>

Run [query orders on the subaccount](#query-orders-on-the-subaccount) again to make sure the cancellation was successful.

## Clean up

Finally, clean up by withdrawing the same amount as you have deposited, minus the 1 USDT0 withdrawal fee.

```typescript
await nadoClient.spot.withdraw({
  productId: 0,
  amount: depositAmount - toFixedPoint(1, 6),
  subaccountName,
});
```

## Full example <a href="#full-example" id="full-example"></a>

```typescript
import { PlaceOrderParams } from '@nado-protocol/client';
import { nowInSeconds, toFixedPoint, packOrderAppendix } from '@nado-protocol/shared';
import { getNadoClient, prettyPrintJson } from './common';

async function main() {
  const nadoClient = getNadoClient();
  const { walletClient, publicClient } = nadoClient.context;

  const address = walletClient!.account.address;
  const subaccountName = 'default';
  const depositAmount = toFixedPoint(1000, 6);

  const mintTxHash = await nadoClient.spot._mintMockERC20({
    amount: depositAmount,
    productId: 0,
  });
  await publicClient.waitForTransactionReceipt({
    hash: mintTxHash,
  });

  const approveTxHash = await nadoClient.spot.approveAllowance({
    amount: depositAmount,
    productId: 0,
  });
  await publicClient.waitForTransactionReceipt({
    hash: approveTxHash,
  });

  const depositTxHash = await nadoClient.spot.deposit({
    subaccountName: 'default',
    amount: depositAmount,
    productId: 0,
  });
  await publicClient.waitForTransactionReceipt({
    hash: depositTxHash,
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));

  const orderParams: PlaceOrderParams['order'] = {
    subaccountName,
    expiration: nowInSeconds() + 60,
    appendix: packOrderAppendix({
      orderExecutionType: 'post_only',
    }),
    price: 80000,
    // Setting order amount to 10**16
    amount: toFixedPoint(0.01, 18),
  };

  const placeOrderResult = await nadoClient.market.placeOrder({
    order: orderParams,
    productId: 2,
    // Used for spot orders to enable/disable borrowing
    spotLeverage: undefined,
  });

  prettyPrintJson('Place Order Result', placeOrderResult);

  const openOrders = await nadoClient.market.getOpenSubaccountOrders({
    subaccountOwner: address,
    subaccountName,
    productId: 2,
  });

  prettyPrintJson('Subaccount Open Orders', openOrders);

  const cancelOrderResult = await nadoClient.market.cancelOrders({
    digests: [placeOrderResult.data.digest],
    productIds: [2],
    subaccountName: 'default',
  });

  prettyPrintJson('Cancel Order Result', cancelOrderResult);

  await nadoClient.spot.withdraw({
    productId: 0,
    amount: depositAmount - toFixedPoint(1, 6),
    subaccountName,
  });
}

main();
```
