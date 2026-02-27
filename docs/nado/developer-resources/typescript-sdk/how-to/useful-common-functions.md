# Useful Common Functions

These are some utility functions used throughout the guide. You may want to include them in your project.

* A `getNadoClient` function that returns a ready-made client object connected to Ink Sepolia.
* A `prettyPrintJson` function that logs readable JSON.

{% hint style="info" %}
**Note**

* Make sure your account has funds for gas on the relevant network.
* Make sure to replace your private key of choice in the function `getNadoClient` below
  {% endhint %}

```typescript
import { createNadoClient } from '@nado-protocol/client';
import { toPrintableObject } from '@nado-protocol/shared';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { inkSepolia } from 'viem/chains';

/**
 * Creates a Nado client for example scripts
 */
export function getNadoClient() {
  const walletClient = createWalletClient({
    account: privateKeyToAccount('0x...'),
    chain: inkSepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: inkSepolia,
    transport: http(),
  });

  return createNadoClient('inkTestnet', {
    walletClient,
    publicClient,
  });
}

/**
 * Util for pretty printing JSON
 */
export function prettyPrintJson(label: string, json: unknown) {
  console.log(label);
  console.log(JSON.stringify(toPrintableObject(json), null, 2));
}
```
