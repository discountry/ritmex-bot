# NLP Funding Payments

## Rate limits

* 480 requests/min or 80 requests/10secs per IP address. (**weight = 5**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="NLP Funding Payments" %}
Query historical NLP funding payments.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "nlp_funding_payments": {
    "max_idx": "1315836",
    "max_time": "1683315718",
    "limit": 100
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="150" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">max_idx</td><td align="center">number / string</td><td align="center">No</td><td>When provided, only return payments with <mark style="color:red;"><code>idx</code></mark> &#x3C;= <mark style="color:red;"><code>max_idx</code></mark>.</td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>When provided, only return payments with <mark style="color:red;"><code>timestamp</code></mark> &#x3C;= <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds).</td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>Max number of payments to return. Defaults to <mark style="color:red;"><code>100</code></mark>. Max of <mark style="color:red;"><code>500</code></mark>.</td></tr></tbody></table>

## Response

```json
{
  "funding_payments": [
    {
      "product_id": 2,
      "idx": "5968022",
      "timestamp": "1701698400",
      "total_payment": "12273223338657163",
      "rate_x18": "47928279191008320",
      "oracle_price_x18": "2243215034242228224820"
    }
  ],
  "next_idx": "5968021"
}
```

## Response Fields

### Funding Payments

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>Id of the perp product</td></tr><tr><td>idx</td><td>Submission index of the transaction that triggered the payment</td></tr><tr><td>timestamp</td><td>Unix epoch time in seconds when the payment occurred</td></tr><tr><td>total_payment</td><td>Total funding payment amount (x18 format)</td></tr><tr><td>rate_x18</td><td>Funding rate used for calculation (x18 format)</td></tr><tr><td>oracle_price_x18</td><td>Oracle price at the time of payment (x18 format)</td></tr></tbody></table>
