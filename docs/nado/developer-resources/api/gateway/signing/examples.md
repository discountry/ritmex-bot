# Examples

The following are full examples of EIP12 typed data for each of Nado's executes. Each execute includes a <mark style="color:red;">`sender`</mark> field which is a solidity <mark style="color:red;">`bytes32`</mark> . There are two components to this field:

* an <mark style="color:red;">`address`</mark> that is a <mark style="color:red;">`bytes20`</mark>
* a subaccount identifier that is a <mark style="color:red;">`bytes12`</mark>

For example, if your address was <mark style="color:red;">`0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43`</mark>, and you wanted to use the default subaccount identifier (i.e: an empty identifier `""`) you can set <mark style="color:red;">`sender`</mark> to <mark style="color:red;">`0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000`</mark> , which sets all bytes of the subaccount identifier to <mark style="color:red;">`0`</mark>.

{% hint style="info" %}
**Note**: a <mark style="color:red;">`bytes32`</mark> representation of the sender must used when signing the request.
{% endhint %}

See below a sample util to convert a hex to a **bytes32**:

{% tabs %}
{% tab title="Python" %}

```python
def hex_to_bytes32(hex_string):
    if hex_string.startswith("0x"):
        hex_string = hex_string[2:]
    data_bytes = bytes.fromhex(hex_string)
    padded_data = data_bytes + b"\x00" * (32 - len(data_bytes))
    return padded_data

sender = hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000')
```

{% endtab %}

{% tab title="Typescript" %}

```typescript
import { arrayify } from 'ethers/lib/utils';

export function hexToBytes32(subaccount: string) {
  const subaccountBytes = arrayify(subaccount);
  const bytes32 = new Uint8Array(32);
  for (let i = 0; i < Math.min(subaccountBytes.length, 32); i++) {
    bytes32[i] = subaccountBytes[i];
  }
  return bytes32;
}

const sender = hexToBytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000')
```

{% endtab %}
{% endtabs %}

## EIP712 Typed data examples

{% tabs %}
{% tab title="Place Order" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'Order': [
            {'name': 'sender', 'type': 'bytes32'},
            {'name': 'priceX18', 'type': 'int128'},
            {'name': 'amount', 'type': 'int128'},
            {'name': 'expiration', 'type': 'uint64'},
            {'name': 'nonce', 'type': 'uint64'},
            {'name': 'appendix', 'type': 'uint128'},
        ],
    },
    'primaryType': 'Order',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0x0000000000000000000000000000000000000001'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'priceX18': 28898000000000000000000,
        'amount': -10000000000000000,
        'expiration': 4611687701117784255,
        'appendix': 1537,  # Version 1, POST_ONLY order
        'nonce': 1764428860167815857,
    },
}
```

{% endtab %}

{% tab title="Cancel Orders" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'Cancellation': [
            { 'name': 'sender', 'type': 'bytes32' },
            { 'name': 'productIds', 'type': 'uint32[]'},
            { 'name': 'digests', 'type': 'bytes32[]'},
            { 'name': 'nonce', 'type': 'uint64'},
        ],
    },
    'primaryType': 'Cancellation',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'productIds': [4],
        'digests': [hex_to_bytes32('0x51ba8762bc5f77957a4e896dba34e17b553b872c618ffb83dba54878796f2821')],
        'nonce': 1,
    },
}
```

{% endtab %}

{% tab title="Cancel Product orders" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'CancellationProducts': [
            {'name': 'sender', 'type': 'bytes32'},
            {'name': 'productIds', 'type': 'uint32[]'},
            {'name': 'nonce', 'type': 'uint64'},
        ],
    },
    'primaryType': 'CancellationProducts',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'productIds': [1, 2],
        'nonce': 1,
    },
}
```

{% endtab %}

{% tab title="Link Signer" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'LinkSigner': [
            {'name': 'sender', 'type': 'bytes32'},
            {'name': 'signer', 'type': 'bytes32'},
            {'name': 'nonce', 'type': 'uint64'},
        ],
    },
    'primaryType': 'LinkSigner',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'signer': hex_to_bytes32('0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000'),
        'nonce': 1,
    },
}
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Withdraw Collateral" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'WithdrawCollateral': [
            {'name': 'sender', 'type': 'bytes32'},
            {'name': 'productId', 'type': 'uint32'},
            {'name': 'amount', 'type': 'uint128'},
            {'name': 'nonce', 'type': 'uint64'},
        ],
    },
    'primaryType': 'WithdrawCollateral',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'productId': 2,
        'amount': 10000000000000000,
        'nonce': 1
    },
}
```

{% endtab %}

{% tab title="Liquidate Subaccount" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'LiquidateSubaccount': [
            {'name': 'sender', 'type': 'bytes32'},
            {'name': 'liquidatee', 'type': 'bytes32'},
            {'name': 'productId', 'type': 'uint32'},
            {'name': 'isEncodedSpread', 'type': 'bool'},
            {'name': 'amount', 'type': 'int128'},
            {'name': 'nonce', 'type': 'uint64'},
        ],
    },
    'primaryType': 'LiquidateSubaccount',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'liquidatee': hex_to_bytes32('0x12a0b4888021576eb10a67616dd3dd3d9ce206b664656661756c740000000000'),
        'productId': 1,
        'isEncodedSpread': false,
        'amount': 10000000000000000,
        'nonce': 1,
    },
}
```

{% endtab %}

{% tab title="Mint NLP" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'MintLp': [
            {'name': 'sender', 'type': 'bytes32' },
            {'name': 'quoteAmount', 'type': 'uint128'},
            {'name': 'nonce', 'type': 'uint64' },
        ],
    },
    'primaryType': 'MintNlp',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'quoteAmount': 20000000000000000000000,
        'nonce': 1,
    },
}
```

{% endtab %}

{% tab title="Burn NLP" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'BurnLp': [
            {'name': 'sender', 'type': 'bytes32'},
            {'name': 'nlpAmount', 'type': 'uint128'},
            {'name': 'nonce', 'type': 'uint64'},
        ],
    },
    'primaryType': 'BurnNlp',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'nlpAmount': 1000000000000000000,
        'nonce': 1,
    },
}
```

{% endtab %}

{% tab title="List Trigger Orders" %}

```python
{
    'types': {
        'EIP712Domain': [
            {'name': 'name', 'type': 'string'},
            {'name': 'version', 'type': 'string'},
            {'name': 'chainId', 'type': 'uint256'},
            {'name': 'verifyingContract', 'type': 'address'}
        ],
        'ListTriggerOrders': [
            {'name': 'sender', 'type': 'bytes32' },
            {'name': 'recvTime', 'type': 'uint64' }
        ],
    },
    'primaryType': 'WithdrawCollateral',
    'domain': {
        'name': 'Nado',
        'version': '0.0.1',
        'chainId': 763373,  
        'verifyingContract': '0xbf16e41fb4ac9922545bfc1500f67064dc2dcc3b'
    },
    'message': {
        'sender': hex_to_bytes32('0x841fe4876763357975d60da128d8a54bb045d76a64656661756c740000000000'),
        'recvTime': 1688939576000
    },
}
```

{% endtab %}
{% endtabs %}
