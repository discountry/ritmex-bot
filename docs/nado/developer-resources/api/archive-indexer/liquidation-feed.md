# Liquidation Feed

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Liquidation feed" %}
Queries liquidatable accounts.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "liquidation_feed": {}
}
```

{% endtab %}
{% endtabs %}

## Response

```json
[
  {
    "subaccount": "0xf2b7cec33cac30582b94979bf03a3cbc73954b2c64656661756c740000000000",
    "update_time": 1680118943
  },
  {
    "subaccount": "0xcb6f1e2ece124a150dcc681c180df2a890432d6a64656661756c740000000000",
    "update_time": 1680118943
  },
  {
    "subaccount": "0x9e6e13be7ea2866c2c7c6e4a118a6c05eee6b44e64656661756c740000000000",
    "update_time": 1680118943
  },
  {
    "subaccount": "0x75008754ffae2889c055961c1b0c5c3ab743c59664656661756c740000000000",
    "update_time": 1680118943
  }
]
```

## Response Fields

| Field name   | Description                          |
| ------------ | ------------------------------------ |
| subaccount   | Subaccount eligible for liquidation. |
| update\_time | Last time feed was updated.          |
