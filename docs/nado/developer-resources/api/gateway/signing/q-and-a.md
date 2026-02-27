# Q\&A

### Q: **What is Nado's EIP712 domain?**

```json
{
    name: 'Nado',
    version: '0.0.1',
    chainId: chainId,
    verifyingContract: contractAddress
}
```

{% hint style="info" %}
See [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing/..#domain) for more details.
{% endhint %}

### Q: How can i retrieve the verifying contracts to use?

* Via the [contracts](https://docs.nado.xyz/developer-resources/api/gateway/queries/contracts) query for all executes except place orders.

### Q: Which contract should I use for each execute?

* For place orders: must be computed as <mark style="color:red;">`address(productId)`</mark>. For example, the verify contract of product <mark style="color:red;">`18`</mark> is <mark style="color:red;">`0x0000000000000000000000000000000000000012`</mark>.
* For everything else: use the endpoint contract from the contracts query.

{% hint style="info" %}
See the [contracts](https://docs.nado.xyz/developer-resources/api/queries/contracts#response) query for more details.
{% endhint %}

### Q: I am running into signature errors, how to fix?

Signature errors can arise for several reasons:

* **An invalid struct**: confirm you are signing the correct struct. See the [Signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page to verify the struct of each execute request.
* **An invalid chain id**: confirm you have the correct chain id for the network you are on.
* **An invalid verifying contract**: confirm you have the correct verifying contract address for the network and execute you are signing. i.e: confirm you are using the correct orderbook address for place orders and endpoint address for everything else.

### Q: Is any other signing standard supported?

No, only [EIP712](https://eips.ethereum.org/EIPS/eip-712).

### Q: Are there any examples you can provide?

See [examples](https://docs.nado.xyz/developer-resources/api/gateway/signing/examples).

### Q: What is the PrimaryType of execute X?

All primary types are listed in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
