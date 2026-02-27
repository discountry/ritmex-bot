# Candlesticks

## Rate limits

* Dynamic based on <mark style="color:red;">`limit`</mark> param provided (**weight = 1 + limit / 20**)
  * E.g: With <mark style="color:red;">`limit=100`</mark>, you can make up to 400 requests per min or 66 requests / 10 secs.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Available Granularities

The following granularities / periods are supported (in seconds):

| Granularity name | Granularity value (in seconds) |
| :--------------: | :----------------------------: |
|     1 minute     |               60               |
|     5 minutes    |               300              |
|    15 minutes    |               900              |
|      1 hour      |              3600              |
|      2 hours     |              7200              |
|      4 hours     |              14400             |
|       1 day      |              86400             |
|      1 week      |             604800             |
|      4 weeks     |             2419200            |

## Request

{% tabs %}
{% tab title="Product candlesticks" %}
Query product candlesticks ordered by <mark style="color:red;">`timestamp`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "candlesticks": {
    "product_id": 1,
    "granularity": 60,
    "limit": 2
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of product to fetch candlesticks for.</td></tr><tr><td align="center">granularity</td><td align="center">number</td><td align="center">Yes</td><td>Granularity value in seconds.</td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>When providing <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds), only return candlesticks with timestamp &#x3C;= <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>Max number of candlesticks to return. defaults to <mark style="color:red;"><code>100</code></mark>. max possible of <mark style="color:red;"><code>500</code></mark>.</td></tr></tbody></table>

## Response

```json
{
  "candlesticks": [
    {
      "product_id": 1,
      "granularity": 60,
      "submission_idx": "627709",
      "timestamp": "1680118140",
      "open_x18": "27235000000000000000000",
      "high_x18": "27298000000000000000000",
      "low_x18": "27235000000000000000000",
      "close_x18": "27298000000000000000000",
      "volume": "1999999999999999998"
    },
    {
      "product_id": 1,
      "granularity": 60,
      "submission_idx": "627699",
      "timestamp": "1680118080",
      "open_x18": "27218000000000000000000",
      "high_x18": "27245000000000000000000",
      "low_x18": "27218000000000000000000",
      "close_x18": "27245000000000000000000",
      "volume": "11852999999999999995"
    }
  ]
}
```

## Response Fields

| Field name      | Description                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| submission\_idx | Id of the latest recorded transaction that contributes to the candle.                                                           |
| product\_id     | Id of product candle is associated to.                                                                                          |
| granularity     | Candle time interval, expressed in seconds, representing the aggregation period for trading volume and price data               |
| open\_x18       | The first fill price of the candle, multiplied by 10^18                                                                         |
| high\_x18       | The highest recorded fill price during the defined interval of the candle, multiplied by 10^18                                  |
| low\_x18        | The lowest recorded fill price during the defined interval of the candle, multiplied by 10^18                                   |
| close\_x18      | The last price of the candle, multiplied by 10^18                                                                               |
| volume          | Asset volume, which represents the absolute cumulative fill amounts during the time interval of the candle, multiplied by 10^18 |
