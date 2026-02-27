# NLP Snapshots

## Rate limits

* Dynamic based on snapshot count (**weight = (limit.min(500) / 100)**)
  * E.g: With <mark style="color:red;">`limit=100`</mark>, weight = 1
  * E.g: With <mark style="color:red;">`limit=500`</mark>, weight = 5

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="By interval" %}
Query NLP snapshots at specific time intervals.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "nlp_snapshots": {
    "interval": {
      "count": 10,
      "max_time": "1683315718",
      "granularity": 3600
    }
  }
}
```

{% endtab %}

{% tab title="By pagination" %}
Query NLP snapshots with pagination.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "nlp_snapshots": {
    "idx": "12345",
    "max_time": "1683315718",
    "limit": 100
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="150" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">interval</td><td align="center">object</td><td align="center">No</td><td>Object specifying time interval parameters: <mark style="color:red;"><code>count</code></mark>, <mark style="color:red;"><code>max_time</code></mark>, <mark style="color:red;"><code>granularity</code></mark></td></tr><tr><td align="center">idx</td><td align="center">number / string</td><td align="center">No</td><td>Submission index for pagination.</td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>Unix epoch time in seconds. Only return snapshots with timestamp &#x3C;= <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>Max number of snapshots to return. Defaults to <mark style="color:red;"><code>100</code></mark>. Max of <mark style="color:red;"><code>500</code></mark>.</td></tr></tbody></table>

## Response

```json
{
  "snapshots": [
    {
      "submission_idx": "12345",
      "timestamp": "1683315718",
      "total_deposits": "1000000000000000000000",
      "total_borrows": "500000000000000000000",
      "base_interest_rate": "50000000000000000",
      "quote_interest_rate": "30000000000000000"
    }
  ]
}
```

## Response Fields

### NLP Snapshots

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>submission_idx</td><td>Transaction submission index</td></tr><tr><td>timestamp</td><td>Unix epoch time in seconds when snapshot was taken</td></tr><tr><td>total_deposits</td><td>Total deposits in the NLP pool (x18 format)</td></tr><tr><td>total_borrows</td><td>Total borrows from the NLP pool (x18 format)</td></tr><tr><td>base_interest_rate</td><td>Interest rate for base assets (x18 format)</td></tr><tr><td>quote_interest_rate</td><td>Interest rate for quote assets (x18 format)</td></tr></tbody></table>
