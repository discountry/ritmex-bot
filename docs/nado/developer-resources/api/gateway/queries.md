# Queries

All queries go through the following endpoint; the exact details of the query are specified by query params or `Websocket` messages.

* **Websocket**: <mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>
* **REST**: <mark style="color:green;">`GET [GATEWAY_REST_ENDPOINT]/query`</mark> or <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

## Overview

### **Amounts and Prices**

In general, amounts come back normalized to 18 decimal places. Meaning that for a balance of 1 USDT0, regardless of the number of decimals USDT0 has on-chain, a value of 1e18 will be returned.

Prices are in <mark style="color:red;">`x18`</mark>, so if the price of one wBTC is $20,000, regardless of the number of decimals wBTC has on-chain, the price will be returned as <mark style="color:red;">`20,000 * 1e18`</mark>.

## API Response

All `queries` return in the format:

```json
{
  "status": "success" | "failure",
  "data"?: {data},
  "error"?: "{error_msg}",
  "error_code"?: {error_code},
  "request_type": "{request_type}"
}
```
