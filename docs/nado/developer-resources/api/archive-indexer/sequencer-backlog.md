# Sequencer Backlog

## Rate limits

* 2400 requests/min or 400 requests/10secs per IP address. (**weight = 1**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Get sequencer backlog" %} <mark style="color:orange;">`POST [ARCHIVE_ENDPOINT]`</mark>

**Body**

```json
{
  "backlog": {}
}
```

{% endtab %}
{% endtabs %}

## Response

```json
{
    "total_txs": "45479039",
    "total_submissions": "45478914",
    "backlog_size": "125",
    "updated_at": "1750365790",
    "backlog_eta_in_seconds": "500",
    "txs_per_second": "0.25"
}
```

### Response Fields

| Field name                | Description                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| total\_txs                | Total number of transactions stored in the indexer DB.                                                                                                   |
| total\_submissions        | Total number of transactions submitted on-chain.                                                                                                         |
| backlog\_size             | Number of unprocessed transactions (<mark style="color:red;">`total_txs - total_submissions`</mark>).                                                    |
| backlog\_eta\_in\_seconds | Estimated time in seconds (<mark style="color:red;">`float`</mark>) to clear the entire backlog (<mark style="color:red;">`null`</mark> if unavailable). |
| txs\_per\_second          | Current submission rate in transactions per second (<mark style="color:red;">float</mark>) (<mark style="color:red;">`null`</mark> if unavailable).      |
| updated\_at               | UNIX timestamp (in seconds) of when the data was last updated.                                                                                           |
