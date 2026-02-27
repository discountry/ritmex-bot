# Subscriptions

## Overview

To interact with the subscription API, send websocket messages to <mark style="color:red;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>.

Subscription connections must set the `Sec-WebSocket-Extensions` header to include `permessage-deflate`.

## Endpoints

### Testnet:

* <mark style="color:red;">`wss://gateway.test.nado.xyz/v1/subscribe`</mark>

{% hint style="info" %}
**Note**: You must send ping frames every 30 seconds to keep the websocket connection alive.
{% endhint %}

{% content-ref url="subscriptions/authentication" %}
[authentication](https://docs.nado.xyz/developer-resources/api/subscriptions/authentication)
{% endcontent-ref %}

{% content-ref url="subscriptions/streams" %}
[streams](https://docs.nado.xyz/developer-resources/api/subscriptions/streams)
{% endcontent-ref %}

{% content-ref url="subscriptions/events" %}
[events](https://docs.nado.xyz/developer-resources/api/subscriptions/events)
{% endcontent-ref %}

{% content-ref url="subscriptions/rate-limits" %}
[rate-limits](https://docs.nado.xyz/developer-resources/api/subscriptions/rate-limits)
{% endcontent-ref %}
