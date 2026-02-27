# Oracle Snapshots

## Rate limits

* IP weight = <mark style="color:red;">`max((snapshot_count * product_ids.length / 100), 2)`</mark> where <mark style="color:red;">`snapshot_count = interval.count.min(500)`</mark>. If no <mark style="color:red;">`product_ids`</mark> are specified, <mark style="color:red;">`product_ids.length = 100`</mark>.
  * E.g: With <mark style="color:red;">`product_ids=[1, 2, 3, 4]`</mark> and <mark style="color:red;">`interval.count=60`</mark>, weight = max((60 \* 4 / 100), 2) = 2, allowing up to 1200 requests per min or 200 requests/10 secs.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Oracle Price" %}
Query oracle snapshots ordered by <mark style="color:red;">`timestamp`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
    "oracle_snapshots": {
        "interval": {
          "count": 2,
          "granularity": 3600,
          "max_time": 1691083697,
        },
        "product_ids": [1, 2]
    }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="192" align="center">Parameter</th><th width="103" align="center">Type</th><th width="101" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">interval</td><td align="center">object</td><td align="center">Yes</td><td>Object to specify desired time period for data</td></tr><tr><td align="center">interval.count</td><td align="center">number</td><td align="center">Yes</td><td>Number of snapshots to return, limit 100. Also limited to <code>interval.count * # product_ids &#x3C; 2000</code></td></tr><tr><td align="center">interval.granularity</td><td align="center">number</td><td align="center">Yes</td><td>Granularity value in seconds</td></tr><tr><td align="center">interval.max_time</td><td align="center">number / string</td><td align="center">No</td><td>When providing <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds), only return snapshots with timestamp &#x3C;= <mark style="color:red;"><code>max_time</code></mark>. If no value is entered, <code>max_time</code> defaults to the current time.</td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">No</td><td>list of product ids to fetch snapshots for, defaults to all products</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note**: Returns a map of <mark style="color:red;">`product_id -> oracle_price`</mark>
{% endhint %}

```json
{
    "snapshots": [
        {
            "timestamp": 1750947789,
            "oracle_prices": {
                "1": "107070085854928675234384",
                "2": "107142264360834928244199"
            }
        },
        {
            "timestamp": 1750946389,
            "oracle_prices": {
                "1": "106963557680819440289916",
                "2": "106954360458642468300594"
            }
        }
    ]
}
```
