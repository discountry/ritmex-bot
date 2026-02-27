# Symbols

## Rate limits

* 1200 requests/min or 20 requests/sec per IP address. (**weight = 2**)

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
  "type": "symbols",
  "product_ids": [1, 2]
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=symbols&product_type=spot`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
  "type": "symbols",
  "product_ids": [1, 2, 3, 4],
  "product_type": "spot"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="155" align="center">Parameter</th><th width="108" align="center">Type</th><th width="132.125" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">No</td><td>An array of product ids. Only available for POST and WS requests.</td></tr><tr><td align="center">product_type</td><td align="center">string</td><td align="center">No</td><td>Type of products to return, must be:<br>"spot" | "perp".</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note**:

* All products have are quoted against USDT0, except for product 0.
  {% endhint %}

```json
{
    "status": "success",
    "data": {
        "symbols": {
            "WBTC": {
                "type": "spot",
                "product_id": 1,
                "symbol": "WBTC",
                "price_increment_x18": "1000000000000000000",
                "size_increment": "1000000000000000",
                "min_size": "4000000000000000",
                "maker_fee_rate_x18": "0",
                "taker_fee_rate_x18": "200000000000000",
                "long_weight_initial_x18": "900000000000000000",
                "long_weight_maintenance_x18": "950000000000000000",
                "max_open_interest_x18": null
            },
            "BTC-PERP": {
                "type": "perp",
                "product_id": 2,
                "symbol": "BTC-PERP",
                "price_increment_x18": "1000000000000000000",
                "size_increment": "1000000000000000",
                "min_size": "4000000000000000",
                "maker_fee_rate_x18": "0",
                "taker_fee_rate_x18": "200000000000000",
                "long_weight_initial_x18": "950000000000000000",
                "long_weight_maintenance_x18": "970000000000000000",
                "max_open_interest_x18": null
            }
        }
    },
    "request_type": "query_symbols"
}
```

## Response fields

### Symbols

All numerical values are returned as strings and scaled by 1e18.

<table><thead><tr><th width="318">Field name</th><th>Description</th></tr></thead><tbody><tr><td>type</td><td>Product type, "spot" or "perp"</td></tr><tr><td>product_id</td><td>Product id</td></tr><tr><td>symbol</td><td>Product symbol</td></tr><tr><td>price_increment_x18</td><td>Price increment, a.k.a tick size</td></tr><tr><td>size_increment</td><td>Size increment, in base units</td></tr><tr><td>min_size</td><td>Minimum order size, in base units</td></tr><tr><td>maker_fee_rate_x18</td><td>Maker fee rate, given as decimal rate</td></tr><tr><td>taker_fee_rate_x18</td><td>Taker fee rate, given as decimal rate</td></tr><tr><td>long_weight_initial_x18</td><td>Long initial margin weight, given as decimal</td></tr><tr><td>long_weight_maintenance_x18</td><td>Long maintenance margin weight, given as decimal</td></tr><tr><td>max_open_interest_x18</td><td>Maximum open interest, null if no limit</td></tr></tbody></table>
