# Fast Withdrawal Signature

## Rate limits

* 240 requests/min or 40 requests/10secs per IP address. (**weight = 10**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Fast Withdrawal Signature" %}
Query the signature required for a fast withdrawal at a specific submission index.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "fast_withdrawal_signature": {
    "idx": "12345"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="150" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">idx</td><td align="center">number / string</td><td align="center">Yes</td><td>Submission index to fetch the fast withdrawal signature for.</td></tr></tbody></table>

## Response

```json
{
  "signature": "0x1234567890abcdef...",
  "submission_idx": "12345",
  "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000",
  "product_id": 0,
  "amount": "1000000000000000000",
  "nonce": "1"
}
```

## Response Fields

### Fast Withdrawal Signature

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>signature</td><td>Hex string of the signature for fast withdrawal</td></tr><tr><td>submission_idx</td><td>Transaction submission index</td></tr><tr><td>subaccount</td><td>Hex string of the subaccount</td></tr><tr><td>product_id</td><td>Product ID (0 for quote asset)</td></tr><tr><td>amount</td><td>Withdrawal amount (x18 format)</td></tr><tr><td>nonce</td><td>Nonce for the withdrawal transaction</td></tr></tbody></table>
