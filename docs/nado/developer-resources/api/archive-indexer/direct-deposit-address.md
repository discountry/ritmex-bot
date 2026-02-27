# Direct Deposit Address

## Rate limits

* 240 requests/min or 40 requests/10secs per IP address. (**weight = 10**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Direct Deposit Address" %}
Query the unique direct deposit address for a subaccount.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "direct_deposit_address": {
    "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="150" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccount</td><td align="center">string</td><td align="center">Yes</td><td>Hex string of the subaccount to fetch the direct deposit address for.</td></tr></tbody></table>

## Response

```json
{
  "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000",
  "deposit_address": "0x1234567890123456789012345678901234567890",
  "created_at": "1683315718"
}
```

## Response Fields

### Direct Deposit Address

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>subaccount</td><td>Hex string of the subaccount</td></tr><tr><td>deposit_address</td><td>Unique deposit address for this subaccount</td></tr><tr><td>created_at</td><td>Unix epoch time in seconds when the deposit address was created</td></tr></tbody></table>

{% hint style="info" %}
Direct deposit addresses allow users to deposit funds directly to their subaccount without needing to interact with the smart contract. Funds sent to this address will automatically be credited to the associated subaccount.
{% endhint %}
