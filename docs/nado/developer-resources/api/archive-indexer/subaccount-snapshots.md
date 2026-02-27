# Subaccount Snapshots

Use this query to get a summary of the latest actions per product on Nado for provided subaccounts. Tracked variables (ex. net interest) are extrapolated to the timestamp or set of timestamps provided.

## Rate limits

* 480 requests/min or 80 requests/10secs per IP address. (**weight = 5**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Subaccount snapshots" %}
Query latest subaccount events/actions ordered by <mark style="color:red;">`submission index`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
    "account_snapshots": {
        "subaccounts": [
            "0xec132d41e542c7129268d9d4431f105e0830a81164656661756c745f31000000"
        ],
        "timestamps": [
            1738703761
        ],
        "isolated": false,
        "active": true
    }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccounts</td><td align="center">array</td><td align="center">Yes</td><td>A list of <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">timestamp</td><td align="center">array</td><td align="center">Yes</td><td>A list of timestamps to retrieve multiple subaccount snapshots (one per timestamp).</td></tr><tr><td align="center">isolated</td><td align="center">boolean</td><td align="center">No</td><td><p>A filter to include only isolated or cross margin events.</p><ul><li>If <mark style="color:red;"><code>true</code></mark>: returns only <strong>isolated</strong> margin events.</li><li>If <mark style="color:red;"><code>false</code></mark>: returns only <strong>cross</strong> margin events.</li><li>If omitted: returns <strong>both</strong> isolated and cross events.</li></ul></td></tr><tr><td align="center">active</td><td align="center">boolean</td><td align="center">No</td><td><p>Filters which products to include in the snapshot:</p><ul><li><mark style="color:red;"><code>true</code></mark>: returns only products with <strong>non-zero balance</strong> at the timestamp (currently active positions)</li><li><mark style="color:red;"><code>false</code></mark>: returns products with <strong>event history</strong> before the timestamp (any historical activity)</li><li>If omitted: defaults to <mark style="color:red;"><code>false</code></mark></li></ul></td></tr></tbody></table>

## Response

{% tabs %}
{% tab title="Single timestamp" %}

```json
{
  "snapshots": {
    "0xec132d41e542c7129268d9d4431f105e0830a81164656661756c745f31000000": {
      "1738703761": [
        {
          "subaccount": "0xec132d41e542c7129268d9d4431f105e0830a81164656661756c745f31000000",
          "product_id": 0,
          "submission_idx": "17286676",
          "event_type": "liquidate_subaccount",
          "isolated": false,
          "isolated_product_id": null,
          "pre_balance": {
            "spot": {
              "product_id": 0,
              "balance": {
                "amount": "53278293456559329896"
              }
            }
          },
          "post_balance": {
            "spot": {
              "product_id": 0,
              "balance": {
                "amount": "0"
              }
            }
          },
          "product": {
            "spot": {
                "product_id": 0,
                "oracle_price_x18": "1000000000000000000",
                "risk": {
                    "long_weight_initial_x18": "1000000000000000000",
                    "short_weight_initial_x18": "1000000000000000000",
                    "long_weight_maintenance_x18": "1000000000000000000",
                    "short_weight_maintenance_x18": "1000000000000000000",
                    "price_x18": "1000000000000000000"
                },
                "config": {
                    "token": "0x5f65358d61a9a281ea3bb930d05889aca21e3f4f",
                    "interest_inflection_util_x18": "800000000000000000",
                    "interest_floor_x18": "10000000000000000",
                    "interest_small_cap_x18": "40000000000000000",
                    "interest_large_cap_x18": "1000000000000000000",
                    "withdraw_fee_x18": "1000000000000000000",
                    "min_deposit_rate_x18": "0"
                },
                "state": {
                    "cumulative_deposits_multiplier_x18": "1000000000025524653",
                    "cumulative_borrows_multiplier_x18": "1000347390837434279",
                    "total_deposits_normalized": "20001011744258817298755054194662",
                    "total_borrows_normalized": "1617724891363505323532211"
                },
                "book_info": {
                    "size_increment": "0",
                    "price_increment_x18": "0",
                    "min_size": "0",
                    "collected_fees": "0"
                }
            }
          },
          "net_interest_unrealized": "0",
          "net_interest_cumulative": "1443761232166478119",
          "net_funding_unrealized": "0",
          "net_funding_cumulative": "0",
          "net_entry_unrealized": "0",
          "net_entry_cumulative": "13458165999999999998",
          "quote_volume_cumulative": "1234567890123456789"
        }
      ]
    }
  }
}
```

{% endtab %}
{% endtabs %}

## Response Fields

### Events

{% hint style="info" %}

* **Net cumulative**: the net difference in that quantity since the beginning of time. For example, if I want to compute total amount paid out in funding between two events, you can subtract the `net_funding_cumulative` of the larger event by the `net_funding_cumulative` of the smaller event.
* **Net unrealized**: similar to `net_cumulative`, but for `net_unrealized`, we have the caveat that when the magnitude of your position decreases, the magnitude of net\_unrealized `decreases` by the same amount.
  {% endhint %}

<table><thead><tr><th width="307">Field name</th><th>Description</th></tr></thead><tbody><tr><td>submission_idx</td><td>Used to uniquely identify the blockchain transaction that generated the event; you can use it to grab the relevant transaction in the <code>txs</code> section.</td></tr><tr><td>product_id</td><td>The id of of the product the event is associated with.</td></tr><tr><td>event_type</td><td>Name of the transaction type this event corresponds to.</td></tr><tr><td>subaccount</td><td>The subaccount associated to the event.</td></tr><tr><td>pre_balance</td><td>The state of your balance before the event happened.</td></tr><tr><td>post_balance</td><td>The state of your balance after the event happened.</td></tr><tr><td>product</td><td>The state of the product throughout the event.</td></tr></tbody></table>
