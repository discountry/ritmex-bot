# Market Snapshots

## Rate limits

* IP weight = <mark style="color:red;">`max((snapshot_count * product_ids.length / 100), 2)`</mark> where <mark style="color:red;">`snapshot_count = interval.count.min(500)`</mark>. If no <mark style="color:red;">`product_ids`</mark> are specified, <mark style="color:red;">`product_ids.length = 100`</mark>.
  * E.g: With <mark style="color:red;">`product_ids=[1, 2, 3, 4]`</mark> and <mark style="color:red;">`interval.count=60`</mark>, weight = max((60 \* 4 / 100), 2) = 2, allowing up to 1200 requests per min or 200 requests/10 secs.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

### Request

{% tabs %}
{% tab title="Market snapshots" %}
Query market snapshots ordered by <mark style="color:red;">`timestamp`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
    "market_snapshots": {
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

### Response

{% hint style="info" %}
**Note**: Please note that this endpoint is currently in beta stage. This feature might be subject to changes without prior notice.
{% endhint %}

```json
{
  "snapshots": [
    {
      "timestamp": 1689965194,
      "cumulative_users": 2774,
      "daily_active_users": 251,
      "cumulative_trades": {
        "1": 54287,
        "2": 172435
      },
      "cumulative_volumes": {
        "1": "259549132367035103631071564",
        "2": "1134008547778337985156988339"
      },
      "cumulative_trade_sizes": {
        "1": "9209508999999999995173",
        "2": "40246259000000000000000"
      },
      "cumulative_taker_fees": {
        "1": "88916428908427788322799",
        "2": "259205794197801680292645"
      },
      "cumulative_sequencer_fees": {
        "1": "11038200000000000000000",
        "2": "32353000000000000000000"
      },
      "cumulative_maker_fees": {
        "1": "-12421730086012739050725",
        "2": "-36124007075181485948604"
      },
      "cumulative_liquidation_amounts": {
        "1": "848311398835000694508",
        "2": "1013231566414935056343898"
      },
      "open_interests": {
        "2": "2907581091676822842104781"
      },
      "total_deposits": {
        "1": "37722308770940799414"
      },
      "total_borrows": {
        "1": "1441397740941092000"
      },
      "funding_rates": {
        "2": "3611102723387"
      },
      "deposit_rates": {
        "1": "1001376785714"
      },
      "borrow_rates": {
        "1": "32059880416879"
      },
      "cumulative_inflows": {
        "1": "238791614019999999853",
        "2": "0"
      },
      "cumulative_outflows": {
        "1": "-202514202990000000306",
        "2": "0"
      },
      "tvl": "7560079507311601381352742"
    },
    ...
  ]
}
```

### Response Fields

#### Snapshots

{% hint style="info" %}
**Note**: For product specific fields (i.e. cumulative\_volume, open\_interests), the value is an object which maps product\_ids to their corresponding values.
{% endhint %}

<table><thead><tr><th width="260">Field name</th><th>Description</th></tr></thead><tbody><tr><td>timestamp</td><td>Timestamp of the snapshot. This may not be perfectly rounded to the granularity since it uses the nearest transaction timestamp less than or equal to <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td>cumulative_users</td><td>The cumulative number of subaccounts on Nado. It is updated daily at 9AM ET for historical counts. For current day counts, it is updated every hour.</td></tr><tr><td>daily_active_users</td><td>Daily active users count, updated daily at 9AM ET for historical counts. For current day counts, it is updated every hour.</td></tr><tr><td>cumulative_trades</td><td>A map of product_id -> the cumulative number of trades for the given product_id.</td></tr><tr><td>cumulative_volumes</td><td>A map of product_id -> cumulative volumes in USDT0 units.</td></tr><tr><td>cumulative_trade_sizes</td><td>A map of product_id -> cumulative trade sizes in base token</td></tr><tr><td>cumulative_taker_fees</td><td>A map of product_id -> cumulative taker fees. Taker fees include sequencer fees.</td></tr><tr><td>cumulative_sequencer_fees</td><td>A map of product_id -> cumulative sequencer fees.</td></tr><tr><td>cumulative_maker_fees</td><td>A map of product_id -> cumulative maker rebates.</td></tr><tr><td>cumulative_liquidation_amounts</td><td>A map of product_id -> cumulative liquidation amounts in USDT0 units.</td></tr><tr><td>open_interests</td><td>A map of product_id -> open interests in USDT0 units.</td></tr><tr><td>total_deposits</td><td>A map of product_id -> total deposits held by Nado for a given product at the given time in the base token units.</td></tr><tr><td>total_borrows</td><td>A map of product_id -> total borrows lent by Nado for a given product at the given time in the base token units.</td></tr><tr><td>funding_rates</td><td>A map of product_id -> <strong>hourly</strong> historical funding rates, value returned as <strong>decimal rates</strong> (% = rate * 100), derived from funding payment amounts. Requires a minimum granularity of 3600 to see non-zero funding rates. Use a granularity where granularity % 3600 = 0 for best results.</td></tr><tr><td>deposit_rates</td><td>A map of product_id -> <strong>daily</strong> deposit rates, values returned as <strong>decimal rates</strong> (% = rate * 100).</td></tr><tr><td>borrow_rates</td><td>A map of product_id -> <strong>daily</strong> borrow rates, values returned as <strong>decimal rates</strong> (% = rate * 100).</td></tr><tr><td>cumulative_inflows</td><td>A map of product_id -> cumulative inflows a.k.a deposits in base token units.</td></tr><tr><td>cumulative_outflows</td><td>A map of product_id -> cumulative outflows a.k.a withdraws in base token units.</td></tr><tr><td>tvl</td><td>The total value locked in USD.</td></tr></tbody></table>
