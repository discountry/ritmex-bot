# Burn NLP

## Rate limits

* 60 burns/min or 10 burns every 10 seconds per wallet. (**weight = 10**)

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
  "burn_nlp": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "nlpAmount": "10001000000000000000000"
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
  "burn_lp": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productId": 1,
      "amount": "10001000000000000000000"
      "nonce": "1"
    },
    "signature": "0x"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="190" align="center">Parameter</th><th width="114" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>Burn NLP transaction object. See <a href="#signing">Signing</a> section for details on the transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.nlpAmount</td><td align="center">string</td><td align="center">Yes</td><td>Amount of NLP tokens to burn multiplied by 1e18, sent as a string.</td></tr><tr><td align="center">tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>This is an incrementing nonce, can be obtained using the <a href="../queries/nonces">Nonces</a> query.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Signed transaction. See <a href="#signing">Signing</a> section for more details.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct BurnNlp {
    bytes32 sender;
    uint128 nlpAmount;
    uint64 nonce;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier.

<mark style="color:red;">`nlpAmount`</mark>: amount of NLP tokens to burn, sent as a string. This must be positive and must be specified with 18 decimals.

<mark style="color:red;">`nonce`</mark>: the <mark style="color:red;">`tx_nonce`</mark>. This is an incrementing nonce, can be obtained using the [Nonces](https://docs.nado.xyz/developer-resources/api/gateway/queries/nonces) query.

{% hint style="warning" %}
**Note**: for signing you should always use the data type specified in the solidity struct which might be different from the type sent in the request e.g: <mark style="color:red;">`nonce`</mark> should be an <mark style="color:red;">`uint64`</mark> for **Signing** but should be sent as a <mark style="color:red;">`string`</mark> in the final payload.
{% endhint %}

## Response

```json
{
  "status": "success",

}
```

#### Success

```json
{
  "status": "success",
  "signature": {signature},
  "request_type": "execute_burn_nlp"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_burn_nlp"
}
```
