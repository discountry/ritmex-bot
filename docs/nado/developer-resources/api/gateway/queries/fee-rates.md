# Fee Rates

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
  "type": "fee_rates",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=fee_rates&sender={sender}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
  "type": "fee_rates",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">sender</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "taker_fee_rates_x18": [
      "0",
      "300000000000000",
      "200000000000000",
      "300000000000000",
      "200000000000000"
    ],
    "maker_fee_rates_x18": [
      "0",
      "0",
      "0",
      "0",
      "0"
    ],
    "liquidation_sequencer_fee": "250000000000000000",
    "health_check_sequencer_fee": "100000000000000000",
    "taker_sequencer_fee": "25000000000000000",
    "withdraw_sequencer_fees": [
      "10000000000000000",
      "40000000000000",
      "0",
      "600000000000000",
      "0"
    ]
  },
  "request_type": "query_fee_rates",
}
```

{% hint style="info" %}

* <mark style="color:red;">`taker_fee_rates_x18`</mark>: taker fee associated with a given product indexed by `product_id`. **Note**: this fee represents the basis point (BPS) on a taker order in <mark style="color:red;">`x18`</mark>.
* <mark style="color:red;">`maker_fee_rates_x18`</mark>: maker fee associated with a given produced indexed by <mark style="color:red;">`product_id`</mark>`.`
* <mark style="color:red;">`withdraw_sequencer_fees`</mark>: withdraw fees associated with a given product indexed by <mark style="color:red;">`product_id`</mark>. **Note**: this fee represents a fixed amount of product to be deducted as fee in <mark style="color:red;">`x18`</mark>.
  {% endhint %}

See our [fees](https://github.com/nadohq/nado-docs/blob/main/docs/basics/fees.md) page for details about current fee rates.
