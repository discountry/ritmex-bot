# Interest & funding payments

## Rate limits

* 480 requests/min or 80 requests/10secs per IP address. (**weight = 5**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Interest and funding" %}
Query subaccount historical interest and funding payments.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "interest_and_funding": {
    "subaccount": "0xD028878bF5c96218E53DA859e587cb8398B17b3f64656661756c740000000000",
    "product_ids": [1, 2],
    "limit": 10,
    "max_idx": 1315836
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="140" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccount</td><td align="center">string</td><td align="center">Yes</td><td>A bytes32 sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>Ids of products to historical interest/funding payments for.</td></tr><tr><td align="center">max_idx</td><td align="center">string/number</td><td align="center">No</td><td>When provided, only return records with <mark style="color:red;"><code>idx</code></mark> &#x3C;= <mark style="color:red;"><code>max_idx</code></mark>.</td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">Yes</td><td>Max number of records to return. Max possible of <mark style="color:red;"><code>100</code></mark>.</td></tr></tbody></table>

## Response

```json
{
    "interest_payments": [
        {
            "product_id": 4,
            "idx": "5968022",
            "timestamp": "1701698400",
            "amount": "-12273223338657163",
            "balance_amount": "1000000000000000000",
            "rate_x18": "47928279191008320",
            "oracle_price_x18": "2243215034242228224820"
        },
        ...
    ],
    "funding_payments": [
        {
            "product_id": 2,
            "idx": "5968022",
            "timestamp": "1701698400",
            "amount": "-12273223338657163",
            "balance_amount": "1000000000000000000",
            "rate_x18": "47928279191008320",
            "oracle_price_x18": "2243215034242228224820"
        },
        ...
    ],
    "next_idx": "1314805"
}
```

## Response Fields

| Field name                            | Description                                                                                                                                                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| interest\_payments.product\_id        | Id of spot product the interest payment is associated to.                                                                                                                                                             |
| interest\_payments.idx                | Id of transaction that triggered the interest payment.                                                                                                                                                                |
| interest\_payments.timestamp          | Timestamp of the transaction that triggered the interest payment.                                                                                                                                                     |
| interest\_payments.amount             | Amount of interest paid multiplied by 10\*\*18.                                                                                                                                                                       |
| interest\_payments.balance\_amount    | Previous spot balance at the moment of payment (exclusive of payment amount)                                                                                                                                          |
| interest\_payments.rate\_x18          | Spot interest rate at the moment of payment, multiplied by 10\*\*18.                                                                                                                                                  |
| interest\_payments.oracle\_price\_x18 | Oracle price for the spot product at the moment of payment, multiplied by 10\*\*18.                                                                                                                                   |
| funding\_payments.product\_id         | Id of perp product the funding payment is associated to.                                                                                                                                                              |
| funding\_payments.idx                 | Id of transaction that triggered the funding payment.                                                                                                                                                                 |
| funding\_payments.timestamp           | Timestamp of the transaction that triggered the funding payment.                                                                                                                                                      |
| funding\_payments.amount              | Amount of funding paid multiplied by 10\*\*18.                                                                                                                                                                        |
| funding\_payments.balance\_amount     | Previous perp balance at the moment of payment +amount of perps locked in LPs (exclusive of payment amount).                                                                                                          |
| funding\_payments.rate\_x18           | Perp funding rate at the moment of payment, multiplied by 10\*\*18.                                                                                                                                                   |
| funding\_payments.oracle\_price\_x18  | Oracle price for the perp product at the moment of payment, multiplied by 10\*\*18.                                                                                                                                   |
| next\_idx                             | Id of the next payment snapshot. Use this as <mark style="color:red;">`max_idx`</mark> on a subsequent call to get the next page. This will be <mark style="color:red;">`null`</mark> when there are no more records. |
