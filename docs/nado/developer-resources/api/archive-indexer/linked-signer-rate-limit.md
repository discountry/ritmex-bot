# Linked Signer Rate Limit

A subaccount can perform a max of 50 [LinkSigner](https://docs.nado.xyz/developer-resources/api/gateway/executes/link-signer) requests in 7 days. Use this query to check current usage and wait time.

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Link Signer Rate Limit" %}
Queries a subaccount's linked signer rate limits.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "linked_signer_rate_limit": {
    "subaccount": "0x9b9989a4E0b260B84a5f367d636298a8bfFb7a9b42544353504f540000000000"
  }
}
```

{% endtab %}
{% endtabs %}

## Response

```json
{
  "remaining_tx": "50",
  "wait_time": 0,
  "signer": "0x0000000000000000000000000000000000000000",
  "total_tx_limit": "50"
}
```

{% hint style="info" %}
**Notes**:

* <mark style="color:red;">`remaining_tx`</mark>: keeps track of the remaining <mark style="color:red;">`LinkSigner`</mark> executes that can be performed.
* <mark style="color:red;">`total_tx_limit`</mark>: that max weekly tx limit.
* <mark style="color:red;">`wait_time`</mark>: the total seconds you need to wait before performing another <mark style="color:red;">`LinkSigner`</mark> execute. Can only perform another request when <mark style="color:red;">`wait_time`</mark> is `0`.
* <mark style="color:red;">`signer`</mark>: the current linked signer address (20 bytes) associated to the provided `subaccount`. It returns the zero address when no signer is linked.
  {% endhint %}
