# NLP Locked Balances

## Rate limits

* 120 requests/min or 20 requests every 10 seconds per IP address. (**weight = 20**)

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
  "type": "nlp_locked_balances",
  "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=nlp_locked_balances&subaccount={subaccount}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "nlp_locked_balances",
  "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="154" align="center">Parameter</th><th width="97" align="center">Type</th><th width="87" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccount</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "balance_locked": {
      "product_id": 0,
      "balance": {
        "amount": "1000000000000000000000",
        "last_cumulative_funding_x18": "0"
      }
    },
    "balance_unlocked": {
      "product_id": 0,
      "balance": {
        "amount": "500000000000000000000",
        "last_cumulative_funding_x18": "0"
      }
    },
    "locked_balances": [
      {
        "balance": {
          "product_id": 0,
          "balance": {
            "amount": "250000000000000000000",
            "last_cumulative_funding_x18": "0"
          }
        },
        "unlocked_at": "1735689600"
      },
      {
        "balance": {
          "product_id": 0,
          "balance": {
            "amount": "750000000000000000000",
            "last_cumulative_funding_x18": "0"
          }
        },
        "unlocked_at": "1736035200"
      }
    ]
  },
  "request_type": "query_nlp_locked_balances"
}
```

## Response Fields

### NLP Locked Balances Response

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>balance_locked</td><td>Total balance that is currently locked (SpotBalance object)</td></tr><tr><td>balance_unlocked</td><td>Total balance that is currently unlocked and available (SpotBalance object)</td></tr><tr><td>locked_balances</td><td>Array of individual locked balance entries with their unlock times</td></tr></tbody></table>

### Locked Balance Entry

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>balance</td><td>SpotBalance object containing the locked amount</td></tr><tr><td>unlocked_at</td><td>Unix epoch timestamp (in seconds) when this balance will unlock</td></tr></tbody></table>

### SpotBalance Object

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>The product ID (typically 0 for USDT0/quote asset)</td></tr><tr><td>balance</td><td>Balance details object</td></tr><tr><td>balance.amount</td><td>The balance amount in x18 format (string)</td></tr><tr><td>balance.last_cumulative_funding_x18</td><td>Last cumulative funding value in x18 format (string)</td></tr></tbody></table>

## Notes

* NLP positions have a 4-day lock period after minting before they can be burned (withdrawn)
* The `locked_balances` array shows individual lock entries, each with their own unlock timestamp
* `balance_locked` is the sum of all locked balances
* `balance_unlocked` represents balances that have passed their lock period and can be withdrawn
