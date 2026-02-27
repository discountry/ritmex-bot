# Subaccounts

## Rate limits

* 1200 requests/min or 200 requests/10secs per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="List subaccounts" %}
Query subaccounts ordered by <mark style="color:red;">`subaccount id`</mark> ASC.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "subaccounts": {
    "start": 100,
    "limit": 10,
  }
}
```

{% endtab %}

{% tab title="Find subaccounts by address" %}
Query all subaccounts associated to an address ordered by <mark style="color:red;">`subaccount id`</mark> ASC.

<mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "subaccounts": {
    "address": "0x79CC76364b5Fb263A25bD52930E3d9788fCfEEA8"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145" align="center">Parameter</th><th width="150" align="center">Type</th><th width="122" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">start</td><td align="center">string/number</td><td align="center">No</td><td>Subaccount id to start from (used for pagination). Defaults to 0.</td></tr><tr><td align="center">limit</td><td align="center">string/number</td><td align="center">No</td><td>Max number of subaccounts to return. Defaults to 100, max of 500.</td></tr><tr><td align="center">address</td><td align="center">string</td><td align="center">No</td><td>An optional wallet address to find all subaccounts associated to it.</td></tr></tbody></table>

## Response

```json
{
    "subaccounts": [
        {
            "id": "25",
            "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000",
            "address": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b6",
            "subaccount_name": "default",
            "created_at": "1699949771",
            "isolated": false
        },
        {
            "id": "948",
            "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c745f31000000",
            "address": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b6",
            "subaccount_name": "default_1",
            "created_at": "1738000782",
            "isolated": false
        },
        {
            "id": "1094",
            "subaccount": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b600000000000000020069736f",
            "address": "0x12a0b4888021576eb10a67616dd3dd3d9ce206b6",
            "subaccount_name": "0x00000000000000020069736f",
            "created_at": "1748982886",
            "isolated": true
        }
    ]
}
```

## Response Fields

### Subaccounts

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>id</td><td>Internal subaccount id</td></tr><tr><td>subaccount</td><td>Hex string of the subaccount (wallet + subaccount name)</td></tr><tr><td>address</td><td>Hex string of wallet address</td></tr><tr><td>subaccount_name</td><td>Subaccount identifier</td></tr><tr><td>created_at</td><td>When subaccount was created</td></tr><tr><td>isolated</td><td>Whether it's a subaccount for an isolated position</td></tr></tbody></table>
