# Product Snapshots

## Rate limits

* 240 requests/min or 40 requests/10secs per IP address. (**weight = 10**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Single Product

### Request

{% tabs %}
{% tab title="Product snapshots" %}
Query snapshots for a given product ordered by <mark style="color:red;">`submission index`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
    "products": {
        "product_id": 2,
        "max_time": 1679728762,
        "limit": 1
    }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>id of product to fetch snapshots for.</td></tr><tr><td align="center">idx</td><td align="center">number / string</td><td align="center">No</td><td>when provided, only return product snapshots with <mark style="color:red;"><code>submission_idx</code></mark> &#x3C;= <mark style="color:red;"><code>idx</code></mark></td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>when <mark style="color:red;"><code>idx</code></mark> is not provided, <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds) can be used to only return snapshots created &#x3C;= <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>max number of snapshots to return. defaults to <mark style="color:red;"><code>100</code></mark>. max possible of <mark style="color:red;"><code>500</code></mark>.</td></tr></tbody></table>

### Response

{% hint style="info" %}
**Note**:

* the response includes a <mark style="color:red;">`txs`</mark> field which contains the relevant transactions to the product snapshots. There are <mark style="color:red;">`>=1 product snapshots`</mark> per transaction.
* both <mark style="color:red;">`products`</mark> and <mark style="color:red;">`txs`</mark> are in descending order by <mark style="color:red;">`submission_idx`</mark>.
* use the <mark style="color:red;">`submission_idx`</mark> to associate a <mark style="color:red;">`product snapshot`</mark> to it's corresponding transaction.
  {% endhint %}

```json
{
  "products": [
    {
      "product_id": 1,
      "submission_idx": "563014",
      "product": {
        "spot": {
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
        }
    }
  ],
  "txs": [
    {
      "tx": {
        "update_price": {
          "product_id": 3,
          "price_x18": "1750710375000000000000"
        }
      },
      "submission_idx": "563014",
      "timestamp": "1679728271"
    }
  ]
}
```

### Response Fields

#### Products

<table><thead><tr><th width="307">Field name</th><th>Description</th></tr></thead><tbody><tr><td>submission_idx</td><td>Used to uniquely identify the blockchain transaction that generated the product snapshot; you can use it to grab the relevant transaction in the <code>txs</code> section.</td></tr><tr><td>product_id</td><td>The id of of the product the event is associated with.</td></tr><tr><td>product</td><td>The state of the product at the time of the transaction.</td></tr></tbody></table>

#### Txs

| Field name      | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| submission\_idx | Unique identifier of the transaction.                         |
| tx              | Raw data of the corresponding transaction                     |
| timestamp       | The unix epoch in seconds of when the transaction took place. |

## Multiple Products

### Request

{% tabs %}
{% tab title="Multiple Products snapshots" %}
Query the latest snapshot for the provided products.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
    "product_snapshots": {
        "product_ids": [1, 2],
        "max_time": 1679728762
    }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>Ids of products to fetch snapshots for.</td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>When provided, returns the last snapshot created &#x3C;= <mark style="color:red;"><code>max_time</code></mark> for each product. Otherwise, the latest snapshot is returned.</td></tr></tbody></table>

### Response

{% hint style="info" %}
**Note**: the response is a map of <mark style="color:red;">`product_id -> snapshot`</mark> for each requested product.
{% endhint %}

```json
{
  "1": {
    "product_id": 1,
    "submission_idx": "459743",
    "product": {
      "spot": {
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
      }
    }
  },
  "2": {
    "product_id": 2,
    "submission_idx": "459842",
    "product": {
      "perp": {
          "product_id": 2,
          "oracle_price_x18": "115432187703236794231754",
          "risk": {
              "long_weight_initial_x18": "950000000000000000",
              "short_weight_initial_x18": "1050000000000000000",
              "long_weight_maintenance_x18": "970000000000000000",
              "short_weight_maintenance_x18": "1030000000000000000",
              "price_x18": "115432187703236794231754"
          },
          "state": {
              "cumulative_funding_long_x18": "-394223711772447555304",
              "cumulative_funding_short_x18": "-394223711772447555304",
              "available_settle": "20092193239667417956947",
              "open_interest": "113605000000000000000"
          },
          "book_info": {
              "size_increment": "1000000000000000",
              "price_increment_x18": "1000000000000000000",
              "min_size": "4000000000000000",
              "collected_fees": "0"
          }
      }
    }
  }
}
```

### Response Fields

<table><thead><tr><th width="307">Field name</th><th>Description</th></tr></thead><tbody><tr><td>submission_idx</td><td>Used to uniquely identify the blockchain transaction that generated the product snapshot.</td></tr><tr><td>product_id</td><td>The id of of the product the event is associated with.</td></tr><tr><td>product</td><td>The state of the product at the time of the transaction.</td></tr></tbody></table>
