# Isolated Subaccounts

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="List all isolated subaccounts" %}
Query all isolated subaccounts.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "isolated_subaccounts": {
    "start_idx": 0,
    "limit": 100
  }
}
```

{% endtab %}

{% tab title="List isolated subaccounts for a subaccount" %}
Query isolated subaccounts associated with a specific subaccount.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "isolated_subaccounts": {
    "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000",
    "limit": 100
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="150" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccount</td><td align="center">string</td><td align="center">No</td><td>Hex string of the parent subaccount to filter by.</td></tr><tr><td align="center">start_idx</td><td align="center">number / string</td><td align="center">No</td><td>Starting index for pagination. Defaults to 0.</td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>Max number of isolated subaccounts to return. Defaults to <mark style="color:red;"><code>100</code></mark>. Max of <mark style="color:red;"><code>500</code></mark>.</td></tr></tbody></table>

## Response

```json
{
  "isolated_subaccounts": [
    {
      "subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea864656661756c740000000000",
      "isolated_subaccount": "0x79cc76364b5fb263a25bd52930e3d9788fcfeea800000000000000010069736f",
      "product_id": 1,
      "created_at": "1683315718"
    }
  ]
}
```

## Response Fields

### Isolated Subaccounts

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>subaccount</td><td>Hex string of the parent subaccount</td></tr><tr><td>isolated_subaccount</td><td>Hex string of the isolated margin subaccount</td></tr><tr><td>product_id</td><td>Product ID for which this isolated subaccount was created</td></tr><tr><td>created_at</td><td>Unix epoch time in seconds when the isolated subaccount was created</td></tr></tbody></table>
