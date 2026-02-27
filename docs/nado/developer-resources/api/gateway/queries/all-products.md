# All Products

## Rate limits

* 480 requests/min or 8 requests/sec per IP address. (**weight = 5**)

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
 "type": "all_products"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=all_products`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
 "type": "all_products"
}
```

{% endtab %}
{% endtabs %}

## Response

{% hint style="info" %}
**Note**:

* A product is some asset / position an account can take on.
* A market is a venue for a product against USDT0.
* All products have a market quoted against USDT0, except for product 0.
* Product 0 is the USDT0 asset itself.
* You can retrieve product symbols via [symbols](https://docs.nado.xyz/developer-resources/api/symbols "mention") query.Body
  {% endhint %}

```json
{
    "status": "success",
    "data": {
        "spot_products": [
            {
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
            {
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
        ],
        "perp_products": [
            {
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
        ]
    },
    "request_type": "query_all_products"
}
```
