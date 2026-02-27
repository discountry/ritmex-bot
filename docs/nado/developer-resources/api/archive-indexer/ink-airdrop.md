# Ink Airdrop

Query the Ink token airdrop allocation for a specific wallet address.

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Ink Airdrop" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "ink_airdrop": {
    "address": "0x1234567890123456789012345678901234567890"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="178" align="center">Parameter</th><th width="229" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">address</td><td align="center">string</td><td align="center">Yes</td><td>Wallet address (20-byte address) sent as a hex string.</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note**: The amount is returned as a string to preserve precision.
{% endhint %}

```json
{
  "amount": "1000000000000000000"
}
```

## Response Fields

| Field name | Description                                            |
| ---------- | ------------------------------------------------------ |
| amount     | The Ink token airdrop amount allocated to the address. |
