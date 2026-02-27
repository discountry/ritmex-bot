# Perp Prices

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Single Product

### Request

{% tabs %}
{% tab title="Perp Prices" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "price": {
    "product_id": 2
  }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of perp product to fetch prices for.</td></tr></tbody></table>

### Response

```json
{
  "product_id": 2,
  "index_price_x18": "28180063400000000000000",
  "mark_price_x18": "28492853627394637978665",
  "update_time": "1680734493"
}
```

## Multiple Products

### Request

{% tabs %}
{% tab title="Perp Prices" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "perp_prices": {
    "product_ids": [2]
  }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>Ids of perp products to fetch prices for.</td></tr></tbody></table>

### Response

{% hint style="info" %}
**Note**: the response is a map of <mark style="color:red;">`product_id -> perp_prices`</mark> for each requested product.
{% endhint %}

```json
{
  "2": {
    "product_id": 2,
    "index_price_x18": "31483202055051853950444",
    "mark_price_x18": "31514830401018841708801",
    "update_time": "1689281222"
  }
}
```

## Response Fields

| Field name        | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| product\_id       | Id of the perp product.                                      |
| index\_price\_x18 | Latest index price of the perp product, multiplied by 10^18. |
| mark\_price\_x18  | Latest mark price of the perp product, multiplied by 10^18.  |
| update\_time      | Epoch time in seconds the perp prices were last updated at.  |
