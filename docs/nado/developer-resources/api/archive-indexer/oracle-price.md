# Oracle Price

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Oracle Price" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "oracle_price": {
    "product_ids": [1, 2, 3, 4]
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>Ids of products to fetch oracles price for.</td></tr></tbody></table>

## Response

```json
{
  "prices": [
    {
      "product_id": 1,
      "oracle_price_x18": "29464023750000000000000",
      "update_time": "1683315718"
    },
    {
      "product_id": 2,
      "oracle_price_x18": "29430225194712740000000",
      "update_time": "1683315721"
    },
    {
      "product_id": 3,
      "oracle_price_x18": "1983367400000000000000",
      "update_time": "1683315720"
    },
    {
      "product_id": 4,
      "oracle_price_x18": "1981528989642697000000",
      "update_time": "1683315721"
    }
  ]
}
```

## Response Fields

### Prices

| Field name         | Description                                            |
| ------------------ | ------------------------------------------------------ |
| product\_id        | Id of product oracle price corresponds to.             |
| oracle\_price\_x18 | Latest oracle price multiplied by 10^18.               |
| update\_time       | Epoch in seconds the oracle price was last updated at. |
