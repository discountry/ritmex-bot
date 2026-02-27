# Subaccount Info

## Rate limits

The rate limit weight varies based on the request parameters:

* **Basic query** (no `txns`): **weight = 2**
  * 1200 requests/min or 200 requests every 10 seconds per IP address
* **With simulation** (`txns` provided): **weight = 10**
  * 240 requests/min or 40 requests every 10 seconds per IP address
* **With simulation + pre\_state** (`txns` and `pre_state="true"`): **weight = 15**
  * 160 requests/min or \~26 requests every 10 seconds per IP address

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
    "type": "subaccount_info",
    "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000",
    "txns": "[{\"apply_delta\":{\"product_id\":4,\"subaccount\":\"0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000\",\"amount_delta\":\"10790000000000000000\",\"v_quote_delta\":\"-35380410000000000000000\"}}]"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=subaccount_info&subaccount={subaccount}&txns=[{"apply_delta":{"product_id":2,"subaccount":"0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000","amount_delta":"100000000000000000","v_quote_delta":"3033500000000000000000"}}]`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
    "type": "subaccount_info",
    "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000",
    "txns": "[{\"apply_delta\":{\"product_id\":4,\"subaccount\":\"0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000\",\"amount_delta\":\"10790000000000000000\",\"v_quote_delta\":\"-35380410000000000000000\"}}]"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="100" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccount</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier. See <a href="../../executes#sender-field-structure">sender field structure</a> for details.</td></tr><tr><td align="center">txns</td><td align="center">string</td><td align="center">no</td><td>A list of transactions to get an estimated/simulated view. see more info below.</td></tr><tr><td align="center">pre_state</td><td align="center">string</td><td align="center">no</td><td>When <mark style="color:red;"><code>"true"</code></mark> and <mark style="color:red;"><code>txns</code></mark> are provided, returns the subaccount state before the transactions were applied in the <mark style="color:red;"><code>pre_state</code></mark> field. Defaults to <mark style="color:red;"><code>"false"</code></mark>.</td></tr></tbody></table>

### Supported txs for an estimated subaccount info

The following are the supported <mark style="color:red;">`txns`</mark> you can provide to get an estimated view of your subaccount.

{% hint style="info" %}
**Note**: these <mark style="color:red;">`txns`</mark> are only used to simulate what your subaccount would look like if they were executed.
{% endhint %}

#### ApplyDelta

Updates internal balances for the <mark style="color:red;">`product_id`</mark> and amount deltas provided.

```json
{
  "apply_delta": {
    "product_id": 2,
    "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000",
    "amount_delta": "100000000000000000",
    "v_quote_delta": "3033500000000000000000"
  }
}
```

## Response

{% hint style="info" %}
**Note**:

* <mark style="color:red;">`healths`</mark>:
  * <mark style="color:red;">`healths[0]`</mark>: info about your initial health, which is weighted by `long_weight_initial_x18` and `short_weight_initial_x18.`
  * <mark style="color:red;">`healths[1]`</mark>: info about your maintenance health, which is weighted by `long_weight_maintenance_x18` and `short_weight_maintenance_x18.`
  * <mark style="color:red;">`healths[2]`</mark>: info about your unweighted health.
* <mark style="color:red;">`health_contributions`</mark> is indexed by <mark style="color:red;">product\_id</mark> and represents the contribution of the corresponding product to the final health.
  * <mark style="color:red;">`health_contributions[product_id][0]`</mark>`: contribution to healths[0]`
  * <mark style="color:red;">`health_contributions[product_id][1]`</mark>`: contribution to healths[1]`
  * <mark style="color:red;">`health_contributions[product_id][2]`</mark>`: contribution to healths[2]`
* <mark style="color:red;">`pre_state`</mark>: (Optional) When <mark style="color:red;">`pre_state="true"`</mark> is provided with <mark style="color:red;">`txns`</mark>, this field contains the subaccount state **before** the simulated transactions were applied. This allows you to compare the before/after states when simulating transactions.
  * <mark style="color:red;">`pre_state.healths`</mark>: Same structure as the main `healths` field, but reflecting the state before transactions
  * <mark style="color:red;">`pre_state.health_contributions`</mark>: Health contributions before transactions
  * <mark style="color:red;">`pre_state.spot_balances`</mark>: Spot balances before transactions
  * <mark style="color:red;">`pre_state.perp_balances`</mark>: Perpetual balances before transactions
    {% endhint %}

```json
{
    "status": "success",
    "data": {
        "subaccount": "0x8d7d64d6cf1d4f018dd101482ac71ad49e30c56064656661756c740000000000",
        "exists": true,
        "healths": [
            {
                "assets": "456895621098158389211471",
                "liabilities": "76286259844766495292488",
                "health": "380609361253391893918983"
            },
            {
                "assets": "456895621098158389211471",
                "liabilities": "72818702579095290924243",
                "health": "384076918519063098287228"
            },
            {
                "assets": "456895621098158389211471",
                "liabilities": "69351145313424086671554",
                "health": "387544475784734302539917"
            }
        ],
        "health_contributions": [
            [
                "456895621098158389211471",
                "456895621098158389211471",
                "456895621098158389211471"
            ],
            [
                "-76286259844766495292488",
                "-72818702579095290924243",
                "-69351145313424086671554"
            ],
            [
                "0",
                "0",
                "0"
            ]
        ],
        "spot_count": 2,
        "perp_count": 1,
        "spot_balances": [
            {
                "product_id": 0,
                "balance": {
                    "amount": "456895621098158389211471"
                }
            },
            {
                "product_id": 1,
                "balance": {
                    "amount": "-600152323366021154"
                }
            }
        ],
        "perp_balances": [
            {
                "product_id": 2,
                "balance": {
                    "amount": "0",
                    "v_quote_balance": "0",
                    "last_cumulative_funding_x18": "-394223711772447555304"
                }
            }
        ],
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
                "oracle_price_x18": "115555905748161505821744",
                "risk": {
                    "long_weight_initial_x18": "900000000000000000",
                    "short_weight_initial_x18": "1100000000000000000",
                    "long_weight_maintenance_x18": "950000000000000000",
                    "short_weight_maintenance_x18": "1050000000000000000",
                    "price_x18": "115555905748161505821744"
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
            }
        ]
    },
    "request_type": "query_subaccount_info"
}
```

### Example with `pre_state`

When you want to simulate transactions and compare the before/after states, you can use the `pre_state` parameter:

#### Request

{% tabs %}
{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=subaccount_info&subaccount={subaccount}&txns=[{"apply_delta":{"product_id":2,"subaccount":"0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000","amount_delta":"100000000000000000","v_quote_delta":"3033500000000000000000"}}]&pre_state="true"`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

```json
{
    "type": "subaccount_info",
    "subaccount": "0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000",
    "txns": "[{\"apply_delta\":{\"product_id\":2,\"subaccount\":\"0xeae27ae6412147ed6d5692fd91709dad6dbfc34264656661756c740000000000\",\"amount_delta\":\"100000000000000000\",\"v_quote_delta\":\"3033500000000000000000\"}}]",
    "pre_state": "true"
}
```

{% endtab %}
{% endtabs %}

#### Response

The response will now include a `pre_state` field showing the state before the simulated transactions:

```json
{
    "status": "success",
    "data": {
        "subaccount": "0x8d7d64d6cf1d4f018dd101482ac71ad49e30c56064656661756c740000000000",
        "exists": true,
        "healths": [
            {
                "assets": "460000000000000000000000",
                "liabilities": "80000000000000000000000",
                "health": "380000000000000000000000"
            }
        ],
        "health_contributions": [...],
        "spot_balances": [...],
        "perp_balances": [
            {
                "product_id": 2,
                "balance": {
                    "amount": "100000000000000000",
                    "v_quote_balance": "3033500000000000000000",
                    "last_cumulative_funding_x18": "-394223711772447555304"
                }
            }
        ],
        "spot_products": [...],
        "perp_products": [...],
        "pre_state": {
            "healths": [
                {
                    "assets": "456895621098158389211471",
                    "liabilities": "76286259844766495292488",
                    "health": "380609361253391893918983"
                }
            ],
            "health_contributions": [...],
            "spot_balances": [...],
            "perp_balances": [
                {
                    "product_id": 2,
                    "balance": {
                        "amount": "0",
                        "v_quote_balance": "0",
                        "last_cumulative_funding_x18": "-394223711772447555304"
                    }
                }
            ]
        }
    },
    "request_type": "query_subaccount_info"
}
```

{% hint style="success" %}
**Use Case**: The `pre_state` feature is particularly useful for:

* **Position Simulation**: Preview how a potential trade would affect your health and balances
* **Risk Analysis**: Compare health metrics before and after simulated transactions
* **UI/UX**: Display "before → after" views to users when they're about to execute trades
* **Testing**: Validate transaction impacts without executing them on-chain
  {% endhint %}
