# Link Signer

Each subaccount can have at most one linked signer at a time. A linked signer can perform any execute on behalf of the subaccount it is linked to. Use the [Linked Signer](https://docs.nado.xyz/developer-resources/api/gateway/queries/linked-signer) query to view your current linked signer.

{% hint style="warning" %}
**Please note**:

* To enable a linked signer, your subaccount must have a minimum of **5 USDT0** worth in account value.
  {% endhint %}

## Rate limits

* A max of 50 link signer requests every 7 days per subaccount. (**weight=30**). Use the [Linked Signer Rate Limit](https://docs.nado.xyz/developer-resources/api/archive-indexer/linked-signer-rate-limit) query to check a subaccount's linked signer usage and remaining wait time.

{% hint style="info" %}
See more general details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits).
{% endhint %}

## Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
  "link_signer": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "signer": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000",
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
  "link_signer": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "signer": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000",
      "nonce": "1"
    },
    "signature": "0x"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="148" align="center">Parameter</th><th width="90" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>A link signer transaction object. See <a href="#signing">Signing</a> section for details on the transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.signer</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address (first 20 bytes) that'll be used as the <mark style="color:red;"><code>sender's</code></mark> signer. the last 12 bytes can be set to anything.</td></tr><tr><td align="center">tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>This is an incrementing nonce, can be obtained using the <a href="../queries/nonces">Nonces</a> query.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Signed transaction. See <a href="#signing">Signing</a> section for more details.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct LinkSigner {
    bytes32 sender;
    bytes32 signer;
    uint64 nonce;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier of the primary subaccount to add a signer to.

<mark style="color:red;">`signer`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address (first 20 bytes) that'll be used as the <mark style="color:red;">`sender's`</mark> signer.

{% hint style="info" %}
**Notes**:

* the last 12 bytes of the <mark style="color:red;">`signer`</mark> field do not matter and can be set to anything.
* set <mark style="color:red;">`signer`</mark> to the zero address to revoke current signer on the provided <mark style="color:red;">`sender`</mark>.
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
  "request_type": "execute_link_signer"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_link_signer"
}
```
