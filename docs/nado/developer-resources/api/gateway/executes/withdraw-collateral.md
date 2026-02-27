# Withdraw Collateral

{% hint style="info" %}
**Note**: use the [max withdrawable](https://docs.nado.xyz/developer-resources/api/gateway/queries/max-withdrawable) query to determine the max amount you can withdraw for a given spot product.
{% endhint %}

## Rate limits

* With spot leverage: 60 withdrawals/min or 10 withdrawals every 10 seconds per wallet. (**weight = 10**)
* Without spot leverage: 30 withdrawals/min or 5 withdrawals every 10 seconds per wallet. (**weight=20**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits).
{% endhint %}

## Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json

{
  "withdraw_collateral": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productId": 1,
      "amount": "1000000000000000000",
      "nonce": "1"
    },
    "signature": "0x"
  }
}
```

{% endtab %}

{% tab title="REST" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark>

**Body**

```json

{
  "withdraw_collateral": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productId": 1,
      "amount": "1000000000000000000",
      "nonce": "1"
    },
    "signature": "0x"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="154" align="center">Parameter</th><th width="94" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>Withdraw collateral transaction object. See <a href="#signing">Signing</a> section for details on the transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.productId</td><td align="center">number</td><td align="center">Yes</td><td>A spot product ID to withdraw from.</td></tr><tr><td align="center">tx.amount</td><td align="center">string</td><td align="center">Yes</td><td>The amount of the asset to withdraw, denominated in the base ERC20 token of the specified product e.g: USDT0 (product=0) has 6 decimals whereas wETH (product=3) has 18. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>This is an incrementing nonce, can be obtained using the <a href="../queries/nonces">Nonces</a> query.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> transaction. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">spot_leverage</td><td align="center">boolean</td><td align="center">No</td><td>Indicates whether leverage should be used; when set to <mark style="color:red;"><code>false</code></mark> , the withdrawal fails if the transaction causes a borrow on the subaccount. Defaults to <mark style="color:red;"><code>true</code></mark>.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct WithdrawCollateral {
    bytes32 sender;
    uint32 productId;
    uint128 amount;
    uint64 nonce;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier.

<mark style="color:red;">`productId`</mark>: a <mark style="color:red;">`uint32`</mark> that specifies the product you’d like to withdraw collateral from; must be for a spot product.

<mark style="color:red;">`amount`</mark>: the amount of asset to withdraw, sent as a string. Note that this is different from the amounts provided in transactions that aren’t <mark style="color:red;">`depositCollateral`</mark>. This is the raw amount of the ERC20 token you want to receive, i.e. if USDT0 has 6 decimals and you want to withdraw 1 USDT0, specify 1e6; if wETH has 18 decimals and you want to withdraw 1 wETH, specify 1e18. Use [all products](https://docs.nado.xyz/developer-resources/api/gateway/queries/all-products) query to view the token address of the corresponding product which can be used to determine the correct decimals to use.

<mark style="color:red;">`nonce`</mark>: the <mark style="color:red;">`tx_nonce`</mark>. This is an incrementing nonce, can be obtained using the [Nonces](https://docs.nado.xyz/developer-resources/api/gateway/queries/nonces) query.

{% hint style="warning" %}
**Note**: for signing you should always use the data type specified in the solidity struct which might be different from the type sent in the request e.g: <mark style="color:red;">`nonce`</mark> should be an <mark style="color:red;">`uint64`</mark> for **Signing** but should be sent as a <mark style="color:red;">`string`</mark> in the final payload.
{% endhint %}

## Response

#### Success

```json
{
  "status": "success",
  "signature": {signature},
  "request_type": "execute_withdraw_collateral"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_withdraw_collateral"
}
```
