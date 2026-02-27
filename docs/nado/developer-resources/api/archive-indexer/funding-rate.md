# Funding Rate

## Rate limits

* 1200 requests/min or 20 requests/sec per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Single Product

### Request

{% tabs %}
{% tab title="Funding Rate" %}
Query perp product 24hr funding rate.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "funding_rate": {
    "product_id": 2
  }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of perp product to fetch funding rate for.</td></tr></tbody></table>

### Response

```json
{
  "product_id": 2,
  "funding_rate_x18": "2447900598160952",
  "update_time": "1680116326"
}
```

## Multiple Products

### Request

{% tabs %}
{% tab title="Perp Prices" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "funding_rates": {
    "product_ids": [2]
  }
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>Ids of perp products to fetch funding rate for.</td></tr></tbody></table>

### Response

{% hint style="info" %}
**Note**: the response is a map of <mark style="color:red;">`product_id -> funding_rate`</mark> for each requested product.
{% endhint %}

```json
{
  "2": {
    "product_id": 2,
    "funding_rate_x18": "-697407056090986",
    "update_time": "1692825387"
  }
}
```

## Response Fields

| Field name         | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| product\_id        | Id of the perp product this funding rate corresponds to.                |
| funding\_rate\_x18 | Latest 24hr funding rate for the specified product, multiplied by 10^18 |
| update\_time       | Epoch time in seconds this funding rate was last updated at             |
