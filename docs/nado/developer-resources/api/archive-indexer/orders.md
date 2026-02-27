# Orders

## Rate limits

* IP weight = <mark style="color:red;">`2 + (limit * subaccounts.length / 20)`</mark> where <mark style="color:red;">`limit`</mark> defaults to 100 (max 500) and <mark style="color:red;">`subaccounts.length`</mark> defaults to 1

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Subaccount orders" %}
Query subaccounts <mark style="color:red;">`matched`</mark> orders, ordered by <mark style="color:red;">`submission index`</mark> desc.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "orders": {
    "product_ids": [
      1,
      2
    ],
    "subaccounts": [
      "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000"
    ],
    "max_time": 1679728762,
    "trigger_types": [
      "price_trigger",
      "time_trigger"
    ],
    "isolated": false,
    "limit": 5
  }
}
```

{% endtab %}

{% tab title="Orders by digests" %}
Query orders by digests.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

<pre class="language-json"><code class="lang-json"><strong>{
</strong>  "orders": {
    "digests": [
      "0xf4f7a8767faf0c7f72251a1f9e5da590f708fd9842bf8fcdeacbaa0237958fff",
      "0x0495a88fb3b1c9bed9b643b8e264a391d04cdd48890d81cd7c4006473f28e361"
    ]
  }
}
</code></pre>

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">subaccounts</td><td align="center">string[]</td><td align="center">conditional</td><td>Array of <mark style="color:red;"><code>bytes32</code></mark> sent as hex strings; each includes the address and the subaccount identifier. Must be provided when querying by <mark style="color:red;"><code>subaccounts</code></mark><strong>.</strong></td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">No</td><td>When provided, only return orders for the specified product ids; return orders for all products otherwise.</td></tr><tr><td align="center">idx</td><td align="center">number / string</td><td align="center">No</td><td>When provided, only return orders with <mark style="color:red;"><code>submission_idx</code></mark> &#x3C;= <mark style="color:red;"><code>idx</code></mark></td></tr><tr><td align="center">max_time</td><td align="center">number / string</td><td align="center">No</td><td>When <mark style="color:red;"><code>idx</code></mark> is not provided, <mark style="color:red;"><code>max_time</code></mark> (unix epoch in seconds) can be used to only return orders created &#x3C;= <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">digests</td><td align="center">string[]</td><td align="center">conditional</td><td>Must be provided when querying by <mark style="color:red;"><code>digests</code></mark>. only return orders matching the specified digests. <strong>note</strong>: cannot specify digests alongside with <mark style="color:red;"><code>subaccounts</code></mark> , <mark style="color:red;"><code>product_ids</code></mark> or <mark style="color:red;"><code>max_time</code></mark></td></tr><tr><td align="center">trigger_types</td><td align="center">string[]</td><td align="center">No</td><td>When provided, only return orders matching the specified trigger types. Possible values: <mark style="color:red;"><code>price_trigger</code></mark>, <mark style="color:red;"><code>time_trigger</code></mark>, <mark style="color:red;"><code>none</code></mark>. If not provided, returns orders of all trigger types.</td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>Max number of orders to return. defaults to <mark style="color:red;"><code>100</code></mark>. max possible of <mark style="color:red;"><code>500</code></mark>. <strong>note</strong>: when querying by <mark style="color:red;"><code>digests</code></mark> limit must be &#x3C;= total digests provided</td></tr><tr><td align="center">isolated</td><td align="center">bool</td><td align="center">No</td><td><p>When provided --</p><ul><li><mark style="color:red;"><code>true</code></mark>: only returns orders associated to isolated positions.</li><li><mark style="color:red;"><code>false</code></mark>: only return matches associated to the cross-subaccount.</li></ul><p>defaults to <mark style="color:red;"><code>null</code></mark>. In which case it returns everything.</p><p>See <a href="https://github.com/nadohq/nado-docs/blob/main/docs/basics/isolated-margin.md">Isolated Margin</a> to learn more.</p></td></tr></tbody></table>

## Response

```json
{
    "orders": [
        {
            "digest": "0xf4f7a8767faf0c7f72251a1f9e5da590f708fd9842bf8fcdeacbaa0237958fff",
            "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
            "product_id": 1,
            "submission_idx": "563024",
            "last_fill_submission_idx": "563024",
            "amount": "20000000000000000000",
            "price_x18": "1751900000000000000000",
            "base_filled": "2320000000000000000",
            "quote_filled": "-4064898974794958991797",
            "fee": "812974794958991797",
            "expiration": "4611686020107120163",
            "appendix": "1537",
            "nonce": "1761323164913106944",
            "isolated": false
        },
        {
            "digest": "0x0495a88fb3b1c9bed9b643b8e264a391d04cdd48890d81cd7c4006473f28e361",
            "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
            "product_id": 2,
            "submission_idx": "563019",
            "last_fill_submission_idx": "563019",
            "amount": "-20000000000000000000",
            "price_x18": "1750800000000000000000",
            "base_filled": "-1159999999999999999",
            "quote_filled": "2030293721599999999999",
            "fee": "609278400000000000",
            "expiration": "4611686020107119905",
            "appendix": "1537",
            "nonce": "1761322893628669952",
            "isolated": false
        },
        {
            "digest": "0x29078702ad95615f0040eafdccc85cbf92569bf9656be928f9f17c5ccbb52041",
            "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
            "product_id": 2,
            "submission_idx": "563018",
            "last_fill_submission_idx": "563018",
            "amount": "-20000000000000000000",
            "price_x18": "1750700000000000000000",
            "base_filled": "-1160000000000000000",
            "quote_filled": "2030380837600000000000",
            "fee": "406162400000000000",
            "expiration": "4611686020107119880",
            "appendix": "1537",
            "nonce": "1761322865074896896",
            "isolated": false
        },
    ]
}
```

## Response Fields

<table><thead><tr><th width="307">Field name</th><th>Description</th></tr></thead><tbody><tr><td>digest</td><td>The unique hash of the order.</td></tr><tr><td>subaccount</td><td>The subaccount that placed the order.</td></tr><tr><td>product_id</td><td>The id of of the product the order was executed for.</td></tr><tr><td>submission_idx</td><td>Used to uniquely identify the blockchain transaction that generated the order. For multi-fills orders, this is the submission_idx of the first fill.</td></tr><tr><td>last_fill_submission_idx</td><td>For multi-fills orders, this is the submission_idx of the last fill. For single fill orders, it has the same value as <code>submission_idx</code>.</td></tr><tr><td>amount</td><td>The original amount of base to buy or sell.</td></tr><tr><td>price_x18</td><td>The original order price.</td></tr><tr><td>base_filled</td><td>The total amount of base (e.g: BTC) filled on this order.</td></tr><tr><td>quote_filled</td><td>The total amount of quote (e.g: USDT0) filled on this order.</td></tr><tr><td>fee</td><td>The total amount of fee paid on this order.</td></tr><tr><td>expiration</td><td>The original order expiration.</td></tr><tr><td>nonce</td><td>The original order nonce.</td></tr><tr><td>appendix</td><td>The original order appendix.</td></tr></tbody></table>
