# Signatures

## Rate limits

* Dynamic based on <mark style="color:red;">`digests`</mark> param provided (**weight = 2 + len(digests) / 10**)
  * E.g: With <mark style="color:red;">`digests=100`</mark>, you can make up to 200 requests per min or 33 requests / 10 secs.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Get order signatures by digests" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "signatures": {
    "digests": [
      "0xf4f7a8767faf0c7f72251a1f9e5da590f708fd9842bf8fcdeacbaa0237958fff",
      "0x0495a88fb3b1c9bed9b643b8e264a391d04cdd48890d81cd7c4006473f28e361"
    ]
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="113" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">digests</td><td align="center">string[]</td><td align="center">Yes</td><td>A list of order digests to retrieve signatures for.</td></tr></tbody></table>

## Response

```json
{
    "signatures": [
        {
          "digest": "0xf4f7a8767faf0c7f72251a1f9e5da590f708fd9842bf8fcdeacbaa0237958fff",
          "signature": "0xe8fa7151bde348afa3b46dc52798046b7c8318f1b0a7f689710debbc094658cc1bf5a7e478ccc8278b625da0b9402c86b580d2e31e13831337dfd6153f4b37811b",
          "signer": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
          "is_linked": false
        },
        {
          "digest": "0x0495a88fb3b1c9bed9b643b8e264a391d04cdd48890d81cd7c4006473f28e361",
          "signature": "0x826c68f1a3f76d9ffbe8041f8d45e969d31f1ab6f2ae2f6379d1493e479e56436091d6cf4c72e212dd2f1d2fa17c627c4c21bd6d281c77172b8af030488478b71c",
          "signer": "0x44b525f7bf3441464e406a094bc5e791f13dd79f64656661756c740000000000",
          "is_linked": true
        },
    ]
}
```

## Response Fields

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>digest</td><td>The order's generated digest.</td></tr><tr><td>signature</td><td>The order's generated signature.</td></tr><tr><td>signer</td><td>The address that signed the order / generated the signature.</td></tr><tr><td>is_linked</td><td>Indicates whether this is a signature from a linked signer or the original sender.</td></tr></tbody></table>
