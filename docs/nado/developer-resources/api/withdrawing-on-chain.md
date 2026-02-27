# Withdrawing (on-chain)

You can withdraw collateral from Nado directly on-chain, by submitting a slow-mode transaction via the <mark style="color:red;">`Endpoint`</mark> contract (see [Contracts](https://docs.nado.xyz/developer-resources/api/broken-reference) for addresses).

{% hint style="info" %}
**Note**:

* This is an alternative to withdrawing collateral via our off-chain sequencer. See [Withdraw Collateral](https://docs.nado.xyz/developer-resources/api/gateway/executes/withdraw-collateral) for more details.
* Slow mode transactions have a 1 USDT0 fee; as such, an approval of 1 USDT0 is required for the slow mode withdrawal to succeed.
  {% endhint %}

## Steps

1. Assemble the bytes needed for a withdraw collateral transaction by encoding the following struct alongside the transaction type `2`:

```solidity
struct WithdrawCollateral {
    bytes32 sender;
    uint32 productId;
    uint128 amount;
    uint64 nonce;
}
```

2. Submit the transaction via <mark style="color:red;">`submitSlowModeTransaction`</mark> on our <mark style="color:red;">`Endpoint`</mark> contract.

### Example

```solidity
function withdrawNadoCollateral(address nadoEndpoint, bytes32 sender, uint32 productId, uint128 amount) internal {
    WithdrawCollateral memory withdrawal = new WithdrawCollateral(sender, productId, amount, 0);
    bytes memory tx = abi.encodePacked(2, abi.encode(withdrawal));
    IEndpoint(nadoEndpoint).submitSlowModeTransaction(tx);
}
```

Once the transaction is confirmed, it may take a few seconds for it to make its way into the Nado offchain sequencer and for the withdrawal to be processed.
