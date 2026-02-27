# Matches

## Rate limits

* IP weight = <mark style="color:red;">`2 + (limit * subaccounts.length / 10)`</mark> where <mark style="color:red;">`limit`</mark> defaults to 100 (max 500) and <mark style="color:red;">`subaccounts.length`</mark> defaults to 1
  * E.g: With <mark style="color:red;">`limit=100`</mark> and 1 subaccount, weight = 12, allowing up to 200 requests per min or 33 requests / 10 secs.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Matches by subaccount" %}
Query subaccounts matches ordered by <mark style="color:red;">`submission index`</mark> desc. Response includes order fill and fee information.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "matches": {
    "product_ids": [
      1,
      2
    ],
    "subaccounts": [
      "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000"
    ],
    "max_time": 1679728762,
    "limit": 5,
    "isolated": false
  }
}
```

{% endtab %}

{% tab title="Matches by product" %}
Query matches for provided products ordered by <mark style="color:red;">`submission index`</mark> desc. Response includes order fill and fee information.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "matches": {
    "product_ids": [
      1,
      2
    ],
    "max_time": "1679728762",
    "limit": 5
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccounts</td><td align="center">string[]</td><td align="center">No</td><td>Array of <mark style="color:red;"><code>bytes32</code></mark> sent as hex strings; each includes the address and the subaccount identifier. When provided, only return matches for the specified subaccounts.</td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">No</td><td>When provided, only return matches for the specified product ids; return matches for all products otherwise.</td></tr><tr><td align="center">idx</td><td align="center">number / string</td><td align="center">No</td><td>When provided, only return matches with <mark style="color:red;"><code>submission_idx</code></mark> &#x3C;= <mark style="color:red;"><code>idx</code></mark></td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>When <mark style="color:red;"><code>idx</code></mark> is not provided, <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds) can be used to only return matches created &#x3C;= <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>Max number of matches to return. defaults to <mark style="color:red;"><code>100</code></mark>. max possible of <mark style="color:red;"><code>500</code></mark>.</td></tr><tr><td align="center">isolated</td><td align="center">boolean</td><td align="center">No</td><td>When provided --<br>- <mark style="color:red;"><code>true</code></mark>: only returns matches associated to isolated positions.<br>- <mark style="color:red;"><code>false</code></mark>: only return matches associated to the cross-subaccount.<br>defaults to <mark style="color:red;"><code>null</code></mark>. In which case it returns everything.<br><br>See <a href="https://github.com/nadohq/nado-docs/blob/main/docs/basics/isolated-margin.md">Isolated Margin</a> to learn more.</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note:**

* the response includes a <mark style="color:red;">`txs`</mark> field which contains the relevant transactions for the returned matches. There are <mark style="color:red;">`>=1 match events`</mark> per transaction.
* both <mark style="color:red;">`matches`</mark> and <mark style="color:red;">`txs`</mark> are in descending order by <mark style="color:red;">`submission_idx`</mark>`.`
* use the <mark style="color:red;">`submission_idx`</mark> to associate a match to it's corresponding transaction.
* the <mark style="color:red;">`fee`</mark> provided in the response includes taker / maker fees + sequencer fees. See [fees](https://github.com/nadohq/nado-docs/blob/main/docs/basics/fees.md) for more details.
  {% endhint %}

```json
{
  "matches": [
    {
      "digest": "0x80ce789702b670b7d33f2aa67e12c85f124395c3f9acdb422dde3b4973ccd50c",
      "order": {
        "sender": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
        "priceX18": "27544000000000000000000",
        "amount": "2000000000000000000",
        "expiration": "4611686020107119633",
        "nonce": "1761322608857448448"
      },
      "base_filled": "736000000000000000",
      "quote_filled": "-20276464287857571514302",
      "fee": "4055287857571514302",
      "sequencer_fee": "0",
      "cumulative_fee": "4055287857571514302",
      "cumulative_base_filled": "736000000000000000",
      "cumulative_quote_filled": "-20276464287857571514302",
      "submission_idx": "563012",
      "isolated": false,
      "is_taker": true,
      "pre_balance": {
        "base": {
          "perp": {
            "product_id": 2,
            "balance": {
              "amount": "2686684000000000000000",
              "v_quote_balance": "-76348662407149297671587247",
              "last_cumulative_funding_x18": "134999841911604906604576"
            }
          }
        },
        "quote": null
      },
      "post_balance": {
        "base": {
          "perp": {
            "product_id": 2,
            "balance": {
              "amount": "2686013000000000000000",
              "v_quote_balance": "-76328351274188497671587247",
              "last_cumulative_funding_x18": "134999841911604906604576"
            }
          }
        },
        "quote": null
      }
    },
    {
      "digest": "0x0f6e5a0434e36d8e6d4fed950d3624b0d8c91a8a84efd156bb25c1382561c0c2",
      "order": {
        "sender": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
        "priceX18": "27540000000000000000000",
        "amount": "2000000000000000000",
        "appendix": "1537",
        "expiration": "4611686020107119623",
        "nonce": "1761322602510417920"
      },
      "base_filled": "723999999999999999",
      "quote_filled": "-19944943483044913474043",
      "fee": "5983483044913474042",
      "sequencer_fee": "0",
      "cumulative_fee": "11958484645393618085",
      "cumulative_base_filled": "1446999999999999998",
      "cumulative_quote_filled": "-39861640484645393618087",
      "submission_idx": "563011",
      "isolated": false,
      "is_taker": true,
      "pre_balance": {
        "base": {
          "perp": {
            "product_id": 2,
            "balance": {
              "amount": "2686684000000000000000",
              "v_quote_balance": "-76348662407149297671587247",
              "last_cumulative_funding_x18": "134999841911604906604576"
            }
          }
        },
        "quote": null
      },
      "post_balance": {
        "base": {
          "perp": {
            "product_id": 2,
            "balance": {
              "amount": "2686013000000000000000",
              "v_quote_balance": "-76328351274188497671587247",
              "last_cumulative_funding_x18": "134999841911604906604576"
            }
          }
        },
        "quote": null
      }
    }
  ],
  "txs": [
    {
      "tx": {
        "match_orders": {
          "product_id": 2,
          "amm": true,
          "taker": {
            "order": {
              "sender": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
              "price_x18": "27544000000000000000000",
              "amount": "2000000000000000000",
              "expiration": 4611686020107120000,
              "appendix": "1537",
              "nonce": 1761322608857448400
            },
            "signature": "0xe8fa7151bde348afa3b46dc52798046b7c8318f1b0a7f689710debbc094658cc1bf5a7e478ccc8278b625da0b9402c86b580d2e31e13831337dfd6153f4b37811b"
          },
          "maker": {
            "order": {
              "sender": "0xebdbbcdbd2646c5f23a1e0806027eee5f71b074664656661756c740000000000",
              "price_x18": "27544000000000000000000",
              "amount": "-736000000000000000",
              "expiration": 1679731669,
              "appendix": "1537",
              "nonce": 1761322585591644200
            },
            "signature": "0x47f9d47f0777f3ca0b13f07b7682dbeea098c0e377b87dcb025754fe34c900e336b8c7744e021fb9c46a4f8c6a1478bafa28bf0d023ae496aa3efa4d8e81df181c"
          }
        }
      },
      "submission_idx": "563012",
      "timestamp": "1679728133"
    },
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

### Matches

| Field name                | Description                                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| submission\_idx           | Wsed to uniquely identify the blockchain transaction that generated the match; you can use it to grab the relevant transaction in the `txs` section. |
| isolated                  | Whether the match is associated with an isolated position. `true` for isolated positions, `false` for cross-subaccount positions.                    |
| is\_taker                 | Whether the order in this match was the taker. `true` if the order was the taker, `false` if the order was the maker.                                |
| digest                    | The unique hash of the order.                                                                                                                        |
| order.sender              | The sender that placed the order.                                                                                                                    |
| order.priceX18            | The original order price.                                                                                                                            |
| order.amount              | The original order amount.                                                                                                                           |
| order.expiration          | The original order expiration.                                                                                                                       |
| order.nonce               | The original order nonce.                                                                                                                            |
| order.appendix            | The original order appendix.                                                                                                                         |
| pre\_balance              | The state of your balance before the match happened.                                                                                                 |
| post\_balance             | The state of your balance after the match happened.                                                                                                  |
| base\_filled              | The amount of base (e.g: BTC) filled on this match.                                                                                                  |
| quote\_filled             | The amount of quote (e.g: USDT0) filled on this match.                                                                                               |
| fee                       | The amount of trading fees + sequencer fees paid on this match.                                                                                      |
| sequencer\_fee            | The amount of sequencer fees paid on this match.                                                                                                     |
| cumulative\_base\_filled  | The total amount of base (e.g: BTC) filled on this order up this match.                                                                              |
| cumulative\_quote\_filled | The total amount of quote (e.g: USDT0) filled up to this match.                                                                                      |
| cumulative\_fee           | The total amount of fee paid up to this match.                                                                                                       |

### Txs

| Field name      | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| submission\_idx | Unique identifier of the transaction.                         |
| product\_id     | Product associated to the transaction.                        |
| taker           | The taker order.                                              |
| maker           | The maker order.                                              |
| timestamp       | The unix epoch in seconds of when the transaction took place. |
