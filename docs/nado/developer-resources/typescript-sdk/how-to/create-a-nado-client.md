# Create a Nado client

## The `NadoClient` Object

To start using the SDK, you need an initialized `NadoClient` from the `client` package. The `NadoClient` is the main entrypoint to common APIs.

## Create a `NadoClient` object <a href="#create-a-nadoclient-object" id="create-a-nadoclient-object"></a>

The `NadoClient` class is rarely instantiated directly. Instead, call the `createNadoClient` function from the `client` package and provide the relevant parameters.

### Import the dependencies <a href="#import-the-dependencies" id="import-the-dependencies"></a>

```typescript
import { createNadoClient } from '@nado-protocol/client';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { inkSepolia } from 'viem/chains';
```

### Create a `WalletClient` and `PublicClient` <a href="#create-an-ethers-wallet-object" id="create-an-ethers-wallet-object"></a>

The `WalletClient` is optional and required only for write operations

```typescript
const walletClient = createWalletClient({
  account: privateKeyToAccount('0x...'),
  chain: inkSepolia,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: inkSepolia,
  transport: http(),
});

```

### Call `createNadoClient` <a href="#call-createnadoclient" id="call-createnadoclient"></a>

The first argument is the `ChainEnv`associated with the client. Each client can talk to one chain that Nado is deployed on. For example, use `inkTestnet`to connect to Nado's instance on Ink Sepolia.

```typescript
const nadoClient = createNadoClient('inkTestnet', {
  walletClient,
  publicClient,
});
```

## Full example

```typescript
import { createNadoClient } from '@nado-protocol/client';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { inkSepolia } from 'viem/chains';

function main() {
  const walletClient = createWalletClient({
    account: privateKeyToAccount('0x...'),
    chain: inkSepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: inkSepolia,
    transport: http(),
  });

  const nadoClient = createNadoClient('inkTestnet', {
    walletClient,
    publicClient,
  });
}

main();
```

Run the script, this example uses `ts-node`:

```sh
ts-node test.ts 
```

If no errors are thrown, you're good to go!
