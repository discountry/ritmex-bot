# Events

## Rate limits

* IP weight = <mark style="color:red;">`2 + (limit * subaccounts.length / 10)`</mark> where <mark style="color:red;">`limit`</mark> defaults to 100 (max 500) and <mark style="color:red;">`subaccounts.length`</mark> defaults to 1
  * E.g: With <mark style="color:red;">`limit=100`</mark> and 1 subaccount, weight = 12, allowing up to 200 requests per min or 33 requests / 10 secs.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Available Events

Each event corresponds to a transaction type in Nado. See below available events and their <mark style="color:red;">`event_type`</mark> mapping:

|                       Event Name                      |    Event Type Value   |
| :---------------------------------------------------: | :-------------------: |
| <mark style="color:red;">`LiquidateSubaccount`</mark> | liquidate\_subaccount |
|  <mark style="color:red;">`DepositCollateral`</mark>  |  deposit\_collateral  |
|  <mark style="color:red;">`WithdrawCollateral`</mark> |  withdraw\_collateral |
|      <mark style="color:red;">`SettlePnl`</mark>      |      settle\_pnl      |
|     <mark style="color:red;">`MatchOrders`</mark>     |     match\_orders     |
|        <mark style="color:red;">`MintLp`</mark>       |        mint\_lp       |
|        <mark style="color:red;">`BurnLp`</mark>       |        burn\_lp       |

## Event Limits

You can specify 2 types of <mark style="color:red;">`limit`</mark> on the query:

* <mark style="color:red;">`raw`</mark>: the max number of events to return.
* <mark style="color:red;">`txs`</mark>: the max number of transactions to return. **note**: one transaction can emit multiple events, by specifying this limit, you will get all the events associated to the transactions in the response.

## Request

{% tabs %}
{% tab title="Events by subaccount" %}
Query events corresponding to specific subaccounts, ordered by <mark style="color:red;">`submission index`</mark> desc. E.g: all <mark style="color:red;">`MatchOrder`</mark> events for subaccounts <mark style="color:red;">`xxx`</mark> specific to spot wBTC.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "events": {
    "product_ids": [
      1
    ],
    "subaccounts": [
      "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000"
    ],
    "event_types": ["match_orders"],
    "max_time": 1679728762,
    "limit": {
       "raw": 1
    },
    "isolated": false
  }
}
```

{% endtab %}

{% tab title="Events by product" %}
Query events corresponding to specific products, ordered by <mark style="color:red;">`submission index`</mark> desc. Uses <mark style="color:red;">`txs`</mark> limit, will only return a single <mark style="color:red;">`tx`</mark> and one or more events associated with the <mark style="color:red;">`tx`</mark>.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "events": {
    "product_ids": [
      1,
      2
    ],
    "max_time": "1679728762",
    "limit": {
      "txs": 1
    }
  }
}
```

{% endtab %}

{% tab title="Events by type" %}
Query events corresponding to specific types, ordered by <mark style="color:red;">`submission index`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "events": {
    "event_types": ["deposit_collateral", "withdraw_collateral"],
    "max_time": "1679728762",
    "limit": {
      "raw": 1
    }
  }
}
```

{% endtab %}

{% tab title="All events" %}
Query all events ordered by <mark style="color:red;">`submission index`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "events": {
    "max_time": "1679728762",
    "limit": {
      "raw": 1
    }
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="162" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccounts</td><td align="center">string[]</td><td align="center">No</td><td>Array of <mark style="color:red;"><code>bytes32</code></mark> sent as hex strings; each includes the address and the subaccount identifier. When provided, only return events for the specified subaccounts.</td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">No</td><td>when provided, only return events for the specified product ids; return events for all products otherwise.</td></tr><tr><td align="center">event_types</td><td align="center">string[]</td><td align="center">No</td><td>when provided, only return events for the specified event types; return all events otherwise.</td></tr><tr><td align="center">idx</td><td align="center">number / string</td><td align="center">No</td><td>when provided, only return events with <mark style="color:red;"><code>submission_idx</code></mark> &#x3C;= <mark style="color:red;"><code>idx</code></mark></td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>when <mark style="color:red;"><code>idx</code></mark> is not provided, <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds) can be used to only return events created &#x3C;= <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">limit</td><td align="center"><p>object<br>{"raw": number } or</p><p>{"txs": number }</p></td><td align="center">No</td><td><ul><li>specifying <mark style="color:red;"><code>raw</code></mark> limit: max number of events to return. defaults to <mark style="color:red;"><code>100</code></mark>. max possible of <mark style="color:red;"><code>500</code></mark>.</li><li>specifying <mark style="color:red;"><code>txs</code></mark> limit: max number of txs to return.</li></ul></td></tr><tr><td align="center">isolated</td><td align="center">bool</td><td align="center">No</td><td>When provided --<br>- <mark style="color:red;"><code>true</code></mark>: only returns evens associated to isolated positions.<br>- <mark style="color:red;"><code>false</code></mark>: only return events associated to the cross-subaccount.<br>defaults to <mark style="color:red;"><code>null</code></mark>. In which case it returns everything.<br><br>See <a href="https://github.com/nadohq/nado-docs/blob/main/docs/basics/isolated-margin.md">Isolated Margin</a> to learn more.</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note:**

* the response includes a <mark style="color:red;">`txs`</mark> field which contains the relevant transactions to the events. There are <mark style="color:red;">`>=1 events`</mark> per transaction.
* both <mark style="color:red;">`events`</mark> and <mark style="color:red;">`txs`</mark> are in descending order by <mark style="color:red;">`submission_idx`</mark>`.`
* use the <mark style="color:red;">`submission_idx`</mark> to associate an <mark style="color:red;">`event`</mark> to it's corresponding transaction.
  {% endhint %}

```json
{
  "events": [
    {
      "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
      "product_id": 1,
      "submission_idx": "563011",
      "event_type": "match_orders",
      "isolated": false,
      "isolated_product_id": null,
      "pre_balance": {
        "spot": {
          "product_id": 1,
          "balance": {
            "amount": "26766781157882079846319"
          }
        }
      },
      "post_balance": {
        "spot": {
          "product_id": 1,
          "balance": {
            "amount": "26767505157882079846318",
            "last_cumulative_multiplier_x18": "1001292804799204317"
          }
        }
      },
      "product": {
        "product_id": 1,
        "oracle_price_x18": "115575316424148798147115",
        "risk": {
          "long_weight_initial_x18": "900000000000000000",
          "short_weight_initial_x18": "1100000000000000000",
          "long_weight_maintenance_x18": "950000000000000000",
          "short_weight_maintenance_x18": "1050000000000000000",
          "price_x18": "115575316424148798147115"
        },
        "config": {
          "token": "0xc57c1c64561a37ac9e8f9039cb6deab7539d99fc",
          "interest_inflection_util_x18": "800000000000000000",
          "interest_floor_x18": "10000000000000000",
          "interest_small_cap_x18": "40000000000000000",
          "interest_large_cap_x18": "1000000000000000000",
          "withdraw_fee_x18": "40000000000000",
          "min_deposit_rate_x18": "0"
        },
        "state": {
          "cumulative_deposits_multiplier_x18": "1000000000000318713",
          "cumulative_borrows_multiplier_x18": "1000347390679880473",
          "total_deposits_normalized": "9000399823280682696107190850",
          "total_borrows_normalized": "9580268570661550719"
        },
        "book_info": {
          "size_increment": "1000000000000000",
          "price_increment_x18": "1000000000000000000",
          "min_size": "4000000000000000",
          "collected_fees": "0"
        }
      },
      "net_interest_unrealized": "49040544804593257",
      "net_interest_cumulative": "51596254598679857",
      "net_funding_unrealized": "0",
      "net_funding_cumulative": "0",
      "net_entry_unrealized": "748947727410369682388339518",
      "net_entry_cumulative": "749148081870171307027129958",
      "quote_volume_cumulative": "1234567890123456789"
    }
  ],
  "txs": [
    {
      "tx": {
        "match_orders": {
          "product_id": 1,
          "amm": true,
          "taker": {
            "order": {
              "sender": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
              "price_x18": "27540000000000000000000",
              "amount": "2000000000000000000",
              "appendix": "1537",
              "expiration": 4611686020107120000,
              "nonce": 1761322602510418000
            },
            "signature": "0x826c68f1a3f76d9ffbe8041f8d45e969d31f1ab6f2ae2f6379d1493e479e56436091d6cf4c72e212dd2f1d2fa17c627c4c21bd6d281c77172b8af030488478b71c"
          },
          "maker": {
            "order": {
              "sender": "0xf8d240d9514c9a4715d66268d7af3b53d619642564656661756c740000000000",
              "price_x18": "27540000000000000000000",
              "amount": "-724000000000000000",
              "appendix": "1537",
              "expiration": 1679731656,
              "nonce": 1761322565506171000
            },
            "signature": "0xd8b6505b8d9b8c3cbfe793080976388035682c02a27893fb26b48a5b2bfe943f4162dea3a42e24e0dff5e2f74fbf77e33d83619140a2a581117c55e6cc236bdb1c"
          }
        }
      },
      "submission_idx": "563011",
      "timestamp": "1679728127"
    }
  ]
}
```

## Response Fields

### Events

{% hint style="info" %}

* **Net cumulative**: the net difference in that quantity since the beginning of time. For example, if I want to compute total amount paid out in funding between two events, you can subtract the `net_funding_cumulative` of the larger event by the `net_funding_cumulative` of the smaller event.
* **Net unrealized**: similar to `net_cumulative`, but for `net_unrealized`, we have the caveat that when the magnitude of your position decreases, the magnitude of net\_unrealized `decreases` by the same amount.
  {% endhint %}

<table><thead><tr><th width="307">Field name</th><th>Description</th></tr></thead><tbody><tr><td>submission_idx</td><td>Used to uniquely identify the blockchain transaction that generated the event; you can use it to grab the relevant transaction in the <code>txs</code> section.</td></tr><tr><td>product_id</td><td>The id of of the product the event is associated with.</td></tr><tr><td>event_type</td><td>Name of the transaction type this event corresponds to.</td></tr><tr><td>subaccount</td><td>The subaccount associated to the event.</td></tr><tr><td>pre_balance</td><td>The state of your balance before the event happened.</td></tr><tr><td>post_balance</td><td>The state of your balance after the event happened.</td></tr><tr><td>product</td><td>The state of the product throughout the event.</td></tr></tbody></table>

### Txs

| Field name      | Description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| submission\_idx | Unique identifier of the transaction.                                                   |
| product\_id     | Product associated to the transaction.                                                  |
| tx              | Raw data of the corresponding transaction e.g: `match_orders` with all associated data. |
| timestamp       | The unix epoch in seconds of when the transaction took place.                           |
