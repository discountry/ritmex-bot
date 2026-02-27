# Signing

All executes are signed using [EIP712](https://eips.ethereum.org/EIPS/eip-712). Each execute request contains:

1. A piece of structured data that includes the sender address i.e: the <mark style="color:red;">`primaryType`</mark> that needs to be signed.
2. A signature of the hash of that structured data, signed by the sender.

## Domain

The following is the domain required as part of the EIP712 structure:

```json
{
    name: 'Nado',
    version: '0.0.1',
    chainId: chainId,
    verifyingContract: contractAddress
}
```

You can retrieve the corresponding chain id and verifying contract via the [contracts](https://docs.nado.xyz/developer-resources/api/gateway/queries/contracts) query.

{% hint style="warning" %}
**Note**: make sure to use the correct verifying contract for each execute:

* For place order: should use `address(producId)` i.e: the 20 bytes hex representation of the `productId` for the order. For example, the verify contract of product `18` is `0x0000000000000000000000000000000000000012` .
* For everything else: should use the endpoint address.

See more details in the [contracts](https://docs.nado.xyz/developer-resources/api/gateway/queries/contracts) query page.
{% endhint %}

```python
def gen_order_verifying_contract(product_id: int) -> str:
    """
    Generates the order verifying contract address based on the product ID.

    Args:
        product_id (int): The product ID for which to generate the verifying contract address.

    Returns:
        str: The generated order verifying contract address in hexadecimal format.
    """
    be_bytes = product_id.to_bytes(20, byteorder="big", signed=False)
    return "0x" + be_bytes.hex()
```

## EIP712 Types

See below the EIP712 type for each execute:

{% hint style="info" %}
See more details in the **Signing** section of each execute's page.
{% endhint %}

### [Place Order](https://docs.nado.xyz/developer-resources/api/gateway/executes/place-order)

**Primary Type**: <mark style="color:red;">`Order`</mark>

Solidity struct that needs to be signed:

```solidity
struct Order {
    bytes32 sender;
    int128 priceX18;
    int128 amount;
    uint64 expiration;
    uint64 nonce;
    uint128 appendix;
}
```

**JSON representation:**

```typescript
{
  Order: [
    { name: 'sender', type: 'bytes32' },
    { name: 'priceX18', type: 'int128' },
    { name: 'amount', type: 'int128' },
    { name: 'expiration', type: 'uint64' },
    { name: 'nonce', type: 'uint64' },
    { name: 'appendix', type: 'uint128' }
  ],
}
```

### [Cancel Orders](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-orders)

**Primary Type:** <mark style="color:red;">`Cancellation`</mark>

Solidity struct that needs to be signed:

```solidity
struct Cancellation {
    bytes32 sender;
    uint32[] productIds;
    bytes32[] digests;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  Cancellation: [
    { name: 'sender', type: 'bytes32' },
    { name: 'productIds', type: 'uint32[]' },
    { name: 'digests', type: 'bytes32[]' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

### [Cancel Product Orders](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-product-orders)

**Primary Type**: <mark style="color:red;">`CancellationProducts`</mark>

Solidity struct that needs to be signed:

```solidity
struct CancellationProducts {
    bytes32 sender;
    uint32[] productIds;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  CancellationProducts: [
    { name: 'sender', type: 'bytes32' },
    { name: 'productIds', type: 'uint32[]' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

### [Withdraw Collateral](https://docs.nado.xyz/developer-resources/api/gateway/executes/withdraw-collateral)

**Primary Type:** <mark style="color:red;">`WithdrawCollateral`</mark>

Solidity struct that needs to be signed:

```solidity
struct WithdrawCollateral {
    bytes32 sender;
    uint32 productId;
    uint128 amount;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  WithdrawCollateral: [
    { name: 'sender', type: 'bytes32' },
    { name: 'productId', type: 'uint32' },
    { name: 'amount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

### [Liquidate Subaccount](https://docs.nado.xyz/developer-resources/api/gateway/executes/liquidate-subaccount)

**Primary Type:** <mark style="color:red;">`LiquidateSubaccount`</mark>

Solidity struct that needs to be signed:

```solidity
struct LiquidateSubaccount {
    bytes32 sender;
    bytes32 liquidatee;
    uint32 productId;
    bool isEncodedSpread;
    int128 amount;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  LiquidateSubaccount: [
    { name: 'sender', type: 'bytes32' },
    { name: 'liquidatee', type: 'bytes32' },
    { name: 'productId', type: 'uint32' },
    { name: 'isEncodedSpread', type: 'bool' },
    { name: 'amount', type: 'int128' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

### [Mint NLP](https://docs.nado.xyz/developer-resources/api/gateway/executes/mint-nlp)

**Primary Type**: <mark style="color:red;">`MintNlp`</mark>

Solidity struct that needs to be signed:

```solidity
struct MintNlp {
    bytes32 sender;
    uint32 productId;
    uint128 quoteAmount;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  MintLp: [
    { name: 'sender', type: 'bytes32' },
    { name: 'quoteAmount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

## [Burn NLP](https://docs.nado.xyz/developer-resources/api/gateway/executes/burn-nlp)

**Primary Type:** <mark style="color:red;">`BurnNlp`</mark>

Solidity struct that needs to be signed:

```solidity
struct BurnLp {
    bytes32 sender;
    uint128 nlpAmount;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  BurnLp: [
    { name: 'sender', type: 'bytes32' },
    { name: 'nlpAmount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

## [Link Signer](https://docs.nado.xyz/developer-resources/api/gateway/executes/link-signer)

**Primary Type**: <mark style="color:red;">`LinkSigner`</mark>

Solidity struct that needs to be signed:

```solidity
struct LinkSigner {
    bytes32 sender;
    bytes32 signer;
    uint64 nonce;
}
```

**JSON representation:**

```typescript
{
  LinkSigner: [
    { name: 'sender', type: 'bytes32' },
    { name: 'signer', type: 'bytes32' },
    { name: 'nonce', type: 'uint64' },
  ],
}
```

## [List Trigger Orders](https://docs.nado.xyz/developer-resources/api/trigger/queries/list-trigger-orders)

**Primary Type**: <mark style="color:red;">`ListTriggerOrders`</mark>

Solidity struct that needs to be signed:

```solidity
struct ListTriggerOrders {
    bytes32 sender;
    uint64 recvTime;
}
```

**JSON representation:**

```typescript
{
  ListTriggerOrders: [
    { name: 'sender', type: 'bytes32' },
    { name: 'recvTime', type: 'uint64' },
  ],
}
```

## [Authenticate Subscription Streams](https://docs.nado.xyz/developer-resources/subscriptions#authentication)

**Primary Type**: <mark style="color:red;">`StreamAuthentication`</mark>

Struct that needs to be signed:

```solidity
struct StreamAuthentication {
    bytes32 sender;
    uint64 expiration;
}
```

**JSON representation:**

```typescript
{
  StreamAuthentication: [
    { name: 'sender', type: 'bytes32' },
    { name: 'expiration', type: 'uint64' },
  ],
}
```
