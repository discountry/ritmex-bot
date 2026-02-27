# Liquidate Subaccount

## Rate limits

* 30 liquidations/min or 5 liquidations every 10 seconds per wallet. (**weight=20**)

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
  "liquidate_subaccount": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "liquidatee": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productId": 1,
      "isEncodedSpread": false,
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
  "liquidate_subaccount": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "liquidatee": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "mode": 0,
      "healthGroup": 1,
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

<table><thead><tr><th width="220" align="center">Parameter</th><th width="92" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>Liquidate subaccount transaction object. See <a href="#signing">Signing</a> section for details on the transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.liquidatee</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the subaccount being liquidated.</td></tr><tr><td align="center">tx.productId</td><td align="center">number</td><td align="center">Yes</td><td><p>Perp Liquidation:</p><ul><li>A valid perp product Id.</li></ul><p>Spot Liquidation:</p><ul><li>A valid spot product Id.</li></ul><p>Spread Liquidation:</p><ul><li>An encoded perp / spot product Ids, where the lower 16 bits represent the spot product and the higher 16 bits represent the perp product. <mark style="color:red;"><code>isEncodedSpread</code></mark> must be set to <mark style="color:red;"><code>true</code></mark> for spread liquidation. See <a href="#signing">Signing</a> section for more details.</li></ul></td></tr><tr><td align="center">tx.isEncodedSpread</td><td align="center">bool</td><td align="center">Yes</td><td>When set to <mark style="color:red;"><code>true</code></mark>, the <mark style="color:red;"><code>productId</code></mark> is expected to encode a perp and spot product Ids as follows: <mark style="color:red;"><code>(perp_id &#x3C;&#x3C; 16) | spot_id</code></mark></td></tr><tr><td align="center">tx.amount</td><td align="center">string</td><td align="center">Yes</td><td>The amount to liquidate multiplied by 1e18, sent as a string.</td></tr><tr><td align="center">tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>This is an incrementing nonce, can be obtained using the <a href="../queries/nonces">Nonces</a> query.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Signed transaction. See <a href="#signing">Signing</a> section for more details.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

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

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier.

<mark style="color:red;">`liquidatee`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier.

<mark style="color:red;">`productId`</mark>: The product to liquidate as well as the liquidation mode.

* *Perp liquidation* ⇒ A valid <mark style="color:red;">`perp`</mark> product id is provided and <mark style="color:red;">`isEncodedSpread`</mark> is set to <mark style="color:red;">`false`</mark>.
* *Spot liquidation* ⇒ A valid <mark style="color:red;">`spot`</mark> product id is provided and <mark style="color:red;">`isEncodedSpread`</mark> is set to <mark style="color:red;">`false`</mark>
* *Spread Liquidation* => If there are perp and spot positions in different directions, liquidate both at the same time. Must be set to a 32 bits integer where the lower 16 bits represent the <mark style="color:red;">`spot`</mark> product and the higher 16 bits represent the <mark style="color:red;">`perp`</mark> product. <mark style="color:red;">`isEncodedSpread`</mark> must be set to <mark style="color:red;">`true`</mark>.

***Computing\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*&#x20;**<mark style="color:red;">**productId**</mark>**&#x20;\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*for Spread Liquidation***

```python
btc_spot = 1
btc_perp = 2

spread_product_id = (btc_perp << 16) | btc_spot
```

<mark style="color:red;">`isEncodedSpread`</mark>: indicates whether <mark style="color:red;">`productId`</mark> encodes both a <mark style="color:red;">`spot`</mark> and a <mark style="color:red;">`perp`</mark> product Id for spread liquidation.

<mark style="color:red;">`amount`</mark>: the amount to liquidate multiplied by 1e18, sent as a string. Can be positive or negative, depending on if the user’s balance is positive or negative.

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
  "request_type": "execute_liquidate_subaccount"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_liquidate_subaccount"
}
```
