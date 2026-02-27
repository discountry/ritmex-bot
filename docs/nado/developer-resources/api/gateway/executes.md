# Executes

## Overview

All executes go through the following endpoint; the exact details of the execution are specified by the JSON payload.

* **Websocket**: <mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>
* **REST**: <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark>

### **Signing**

All executes are signed using [EIP712](https://eips.ethereum.org/EIPS/eip-712). Each execute request contains:

1. A piece of structured data that includes the sender address
2. A signature of the hash of that structured data, signed by the sender

You can check the SDK for some examples of how to generate these signatures.

{% hint style="info" %}
See more info in the [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

### **Sender Field Structure**

The sender field is a solidity <mark style="color:red;">`bytes32`</mark> . There are two components:

* an <mark style="color:red;">`address`</mark> that is a <mark style="color:red;">`bytes20`</mark>
* a subaccount identifier that is a <mark style="color:red;">`bytes12`</mark>

For example, if your address was <mark style="color:red;">`0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43`</mark>, and you wanted to use the default subaccount identifier (i.e: the word <mark style="color:red;">`default`</mark>) you can set <mark style="color:red;">`sender`</mark> to <mark style="color:red;">`0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c4364656661756c740000000000`</mark> , which sets the subaccount identifier to <mark style="color:red;">`64656661756c740000000000`</mark>.

### **Amounts**

For <mark style="color:red;">`DepositCollateral`</mark> and <mark style="color:red;">`WithdrawCollateral`</mark>, the amount specifies the physical token amount that you want to receive. `i.e.` if USDT0 has 6 decimals, and you want to deposit or withdraw 1 USDT0, you specify <mark style="color:red;">`amount = 1e6`</mark>.

For all other transactions, amount is normalized to 18 decimals, so <mark style="color:red;">`1e18`</mark> == one unit of the underlying asset. For example, if you want to buy 1 wETH, regardless of the amount of decimals the wETH contract has on chain, you specify <mark style="color:red;">`1e18`</mark> in the amount field of the order.

## API Response

All `Execute` messages return the following information:

#### Success

```json
{
  "status": "success",
  "signature": "{signature}",
  "data"?: {data_obj},
  "request_type": "{request_type}"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": "{signature}",
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "{request_type}"
}
```
