# Authentication

### Rate limits

A **single wallet address** can be authenticated by up to 5 websocket connections, regardless of the originating IP address. Connections exceeding these limits will be automatically disconnected.

{% hint style="info" %}
See [rate limits](https://docs.nado.xyz/developer-resources/api/subscriptions/rate-limits) for more details.
{% endhint %}

### Request

To access streams that require authentication, submit a request with the <mark style="color:red;">`method`</mark> field set to <mark style="color:red;">`authenticate`</mark>.

{% tabs %}
{% tab title="Authenticate" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "authenticate",
  "id": 0,
  "tx": {
    "sender": "0x...",
    "expiration": "1..."
  },
  "signature": "0x..."
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="198" align="center">Parameter</th><th width="142" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">method</td><td align="center">string</td><td align="center">Yes</td><td><mark style="color:red;"><code>authenticate</code></mark></td></tr><tr><td align="center">id</td><td align="center">number</td><td align="center">Yes</td><td>Can be set to any positive integer. Can be used to identify the websocket request / response.</td></tr><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td><mark style="color:red;"><code>StreamAuthentication</code></mark> object that needs to be signed. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>A hex string representing a <mark style="color:red;"><code>bytes32</code></mark> of a specific subaccount.</td></tr><tr><td align="center">tx.expiration</td><td align="center">string</td><td align="center">Yes</td><td>Represents the expiration time in milliseconds since the Unix epoch.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> <mark style="color:red;"><code>StreamAuthentication</code></mark> object.See <a href="#signing">Signing</a> section for more details.</td></tr></tbody></table>

{% hint style="info" %}
**Notes**:

* Although <mark style="color:red;">sender</mark> specifies a specific subaccount, authentication applies to the entire wallet address, enabling access to authenticated streams for different subaccounts under that address.
* Once authenticated, the authentication status of that websocket connection cannot be changed and stays for the duration of the connection.
  {% endhint %}

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The typed data struct that needs to be signed is:

```solidity
struct StreamAuthentication {
    bytes32 sender;
    uint64 expiration;
}
```

<mark style="color:red;">`sender`</mark>: A hex string representing a <mark style="color:red;">`bytes32`</mark> of a specific subaccount. The signature must be signed by the wallet address specified by sender.

<mark style="color:red;">`expiration`</mark>: Represents the expiration time in milliseconds since the Unix epoch. Requests will be denied if the expiration is either smaller than the current time or more than 100 seconds ahead of it.

{% hint style="info" %}
**Notes**:

* Should use the endpoint address as <mark style="color:red;">`verifyingContract`</mark>.
* For signing, you should always use the data type specified in the typed data struct which might be different from the type sent in the request e.g: <mark style="color:red;">`expiration`</mark> should be an <mark style="color:red;">`uint64`</mark> for **Signing** but should be sent as a <mark style="color:red;">`string`</mark> in the final payload.
  {% endhint %}

### **Response**

```json
{
  "result": null,
  "id": 10
}
```
