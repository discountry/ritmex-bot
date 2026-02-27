# Gateway

There are two types of actions. An <mark style="color:red;">`Execute`</mark> involves a modification to state, and a <mark style="color:red;">`Query`</mark> merely fetches information from state.

All actions can be sent over websocket as json payloads at <mark style="color:red;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

Additionally, you can send executes and queries over <mark style="color:red;">HTTP</mark>, at <mark style="color:red;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark> and <mark style="color:red;">`GET/POST [GATEWAY_REST_ENDPOINT]/query`</mark> respectively. For executes, the request should be sent with a json payload, while for queries, the payload should be encoded into url query strings.

<mark style="color:red;">`HTTP`</mark> requests must set the `Accept-Encoding` to include `gzip`, `br` or `deflate`

## Endpoints

### **Testnet**:

* Websocket: <mark style="color:red;">`wss://gateway.test.nado.xyz/v1/ws`</mark>
* REST: <mark style="color:red;">`https://gateway.test.nado.xyz/v1`</mark>

## Websocket

{% hint style="info" %}
**Notes on&#x20;*****keeping websocket connections alive*****:**

* When interacting with our API via websocket, you must send ping frames every 30 seconds to keep the websocket connection alive.
* Ping / Pong frames are built into the websocket protocol and should be supported natively by your websocket library. See [Ping/Pong frames](https://datatracker.ietf.org/doc/html/rfc6455#section-5.5.2) for more info.
  {% endhint %}

{% content-ref url="gateway/executes" %}
[executes](https://docs.nado.xyz/developer-resources/api/gateway/executes)
{% endcontent-ref %}

{% content-ref url="gateway/queries" %}
[queries](https://docs.nado.xyz/developer-resources/api/gateway/queries)
{% endcontent-ref %}
