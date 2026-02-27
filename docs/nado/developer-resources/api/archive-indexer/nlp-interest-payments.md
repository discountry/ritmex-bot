# NLP Interest Payments

## Rate limits

* 480 requests/min or 80 requests/10secs per IP address. (**weight = 5**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="NLP Interest Payments" %}
Query historical NLP interest payments.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "nlp_interest_payments": {
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
  "interest_payments": [
    {
      "product_id": 0,
      "idx": "5968022",
      "timestamp": "1701698400",
      "amount": "12273223338657163",
      "balance_amount": "45382847293847329847"
    }
  ],
  "next_idx": "5968021"
}
```

## Response Fields

### Interest Payments

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>Id of the spot product (typically quote/collateral products)</td></tr><tr><td>idx</td><td>Submission index of the transaction that triggered the payment</td></tr><tr><td>timestamp</td><td>Unix epoch time in seconds when the payment occurred</td></tr><tr><td>amount</td><td>Interest payment amount (x18 format)</td></tr><tr><td>balance_amount</td><td>Balance amount at the time of payment (x18 format)</td></tr></tbody></table>
