# Transfer Quote

## Fees

Transfers between subaccounts incur a network fee:

* **Standard transfers**: 1 USDT0
* **Isolated subaccount transfers**: 0.1 USDT0 (when either sender or recipient is an isolated subaccount)

The fee is automatically deducted from the sender's balance.

## Rate limits

* 60 transfer quotes/min or 10 every 10 seconds per wallet. (**weight=10**)
* A max of 5 transfer quotes to new recipients (subaccounts) every 24hrs.
  * **Note**: Transferring quote to a subaccount that doesn't exist, creates the subaccount.

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
  "transfer_quote": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "recipient": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743100000000000000",
      "amount": "10000000000000000000",
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
  "transfer_quote": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "recipient": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743100000000000000",
      "amount": "10000000000000000000",
      "nonce": "1"
    },
    "signature": "0x"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="154" align="center">Parameter</th><th width="94" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>Transfer Quote transaction object. See <a href="#signing">Signing</a> section for details on the transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.recipient</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the quote recipient.</td></tr><tr><td align="center">tx.amount</td><td align="center">string</td><td align="center">Yes</td><td>The amount of USDT0 to transfer, denominated in <code>x18</code>. Transfr amount must be <mark style="color:red;"><code>>= 5 USDT0</code></mark> . See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>This is an incrementing nonce, can be obtained using the <a href="../queries/nonces">Nonces</a> query.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> transaction. See <a href="#signing">Signing</a> section for more details.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct TransferQuote {
    bytes32 sender;
    bytes32 recipient;
    uint128 amount;
    uint64 nonce;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier.

<mark style="color:red;">`recipient`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier.

<mark style="color:red;">`amount`</mark>: the amount of quote to transfer, sent as an `x18` string.

{% hint style="warning" %}
**Notes:**

* If you are transferring <mark style="color:red;">`5 USDT0`</mark>, must specify <mark style="color:red;">`5000000000000000000`</mark> i.e 5 USDT0 \* 1e18.
* Transfer amount should be <mark style="color:red;">>= 5 USDT0.</mark>
  {% endhint %}

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
  "request_type": "execute_transfer_quote"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_transfer_quote"
}
```
