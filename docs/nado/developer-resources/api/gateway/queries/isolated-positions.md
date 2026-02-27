# Isolated Positions

## Rate limits

* 240 requests/min or 40 requests every 10 seconds per IP address. (**weight = 10**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
    "type": "isolated_positions",
    "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=isolated_positions&subaccount={subaccount}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
    "type": "isolated_positions",
    "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="100" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccount</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier. See <a href="../../executes#sender-field-structure">sender field structure</a> for details.</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note**:

* <mark style="color:red;">`isolated_positions[i].subaccount`</mark>: is the isolated subaccount for the base product.
* <mark style="color:red;">`healths`</mark>:
  * <mark style="color:red;">`healths[0]`</mark>: info about your initial health, which is weighted by `long_weight_initial_x18` and `short_weight_initial_x18.`
  * <mark style="color:red;">`healths[1]`</mark>: info about your maintenance health, which is weighted by `long_weight_maintenance_x18` and `short_weight_maintenance_x18.`
  * <mark style="color:red;">`healths[2]`</mark>: info about your unweighted health.
    {% endhint %}

```json
{
  "status": "success",
  "data": {
    "isolated_positions": [
      {
        "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34200000000000000280269736f",
        "quote_balance": {
          "product_id": 0,
          "balance": {
            "amount": "200044412311089295472"
          }
        },
        "base_balance": {
          "product_id": 40,
          "balance": {
            "amount": "1720000000000000000000",
            "v_quote_balance": "-800854578334374649165",
            "last_cumulative_funding_x18": "85496772388082947"
          }
        },
        "quote_product": {
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
        },
        "base_product": {
            "product_id": 2,
            "oracle_price_x18": "115596528090565357611177",
            "risk": {
                "long_weight_initial_x18": "950000000000000000",
                "short_weight_initial_x18": "1050000000000000000",
                "long_weight_maintenance_x18": "970000000000000000",
                "short_weight_maintenance_x18": "1030000000000000000",
                "price_x18": "115596528090565357611177"
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
        },
        "quote_healths": [
          "200044412311089295472",
          "200044412311089295472",
          "200044412311089295472"
        ],
        "base_healths": [
          "-109839746873700492625",
          "-71450034014774150595",
          "-33060321155847808565"
        ],
        "healths": [
          {
            "assets": "200044412311089295472",
            "liabilities": "109839746873700492625",
            "health": "90204665437388802847"
          },
          {
            "assets": "200044412311089295472",
            "liabilities": "71450034014774150595",
            "health": "128594378296315144877"
          },
          {
            "assets": "200044412311089295472",
            "liabilities": "33060321155847808565",
            "health": "166984091155241486907"
          }
        ]
      }
    ]
  },
  "request_type": "query_isolated_positions"
}
```
