# Nado Configuration Guide

中文版：[Nado 配置教程](nado.md)

## Scope

This guide configures the Nado perpetual adapter. Nado uses the Ink network, subaccounts, and linked signers. ritmex-bot requires the private key of an authorized linked signer, the subaccount owner address, and the subaccount name.

## 1. Prepare the Nado account

1. Connect an EVM wallet on [Nado](https://app.nado.xyz?join=LKbIUs5).
2. Fund the Ink network with ETH for gas and a supported collateral asset.
3. Deposit collateral and create the target subaccount.
4. Record the subaccount owner's EVM address and subaccount name. The common default name is `default`.

## 2. Obtain the linked-signer private key

The official Nado SDK provides `createStandardLinkedSigner` and `createDeterministicLinkedSignerPrivateKey` for creating and authorizing a subaccount linked signer.

The current Nado Web UI stores authorized signer information in browser local storage under the official domain. After creating the signer through the Web UI, inspect `Application` → `Local Storage` → `nado.userSettings` in browser developer tools and read the `privateKey` field. This value is a trading private key. Close developer tools and remove temporary records after retrieval.

`NADO_SIGNER_PRIVATE_KEY` must contain `0x` followed by 64 hexadecimal characters. It must be the linked-signer key. Do not place a wallet seed phrase or primary wallet private key in this variable.

## 3. Minimal mainnet configuration

```dotenv
EXCHANGE=nado
NADO_ENV=inkMainnet
NADO_SIGNER_PRIVATE_KEY=<0x_linked_signer_private_key>
NADO_SUBACCOUNT_OWNER=<0x_owner_address>
NADO_SUBACCOUNT_NAME=default
NADO_SYMBOL=BTC-PERP
```

`NADO_EVM_ADDRESS` is a compatible alias for `NADO_SUBACCOUNT_OWNER`.

## 4. Testnet configuration

```dotenv
NADO_ENV=inkTestnet
NADO_SIGNER_PRIVATE_KEY=<0x_testnet_linked_signer_private_key>
NADO_SUBACCOUNT_OWNER=<0x_testnet_owner_address>
NADO_SUBACCOUNT_NAME=default
NADO_SYMBOL=BTC-PERP
```

Linked-signer authorization is environment-specific. A mainnet signer cannot authorize a testnet subaccount.

## 5. Symbol format

Nado perpetual markets use product symbols such as `BTC-PERP` and `ETH-PERP`. The adapter also accepts:

- `BTCPERP` → `BTC-PERP`
- `BTCUSDT0` → `BTC-PERP`
- `BTC/PERP` → `BTC-PERP`

Prefer the native `*-PERP` symbol returned by the Nado API.

## 6. Optional settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `NADO_GATEWAY_WS_URL` | Selected by environment | Trading gateway WebSocket |
| `NADO_SUBSCRIPTIONS_WS_URL` | Selected by environment | Market subscription WebSocket |
| `NADO_ARCHIVE_URL` | Production/test archive | History and indexer endpoint |
| `NADO_TRIGGER_URL` | Production/test trigger | Stop-loss and take-profit service |
| `NADO_MARKET_SLIPPAGE_PCT` | `0.01` | Market/trigger protection range; `0.01` means 1% |
| `NADO_STOP_TRIGGER_SOURCE` | `oracle` | `oracle`, `last`, or `mid` |
| `NADO_MIN_SIZE_POLICY` | `adjust` | `adjust` raises to minimum size; `reject` rejects the order |
| `NADO_DEBUG` | `false` | Detailed error logging |

## 7. Verify the configuration

```bash
bun run index.ts doctor --exchange nado --symbol BTC-PERP --json
bun run index.ts market ticker --exchange nado --symbol BTC-PERP --json
```

The ticker check validates the network, linked signer, subaccount, and product metadata. It creates no orders.

## Troubleshooting

- `Missing NADO_SIGNER_PRIVATE_KEY`: provide the 32-byte key of an authorized linked signer.
- Invalid private-key errors: confirm the value contains `0x` and 64 hexadecimal characters.
- `Missing NADO_SUBACCOUNT_OWNER`: provide the subaccount owner's 20-byte EVM address.
- Signature or permission errors: confirm that the signer is linked to the same owner, subaccount name, and network.
- Product lookup failures: use a native Nado symbol such as `BTC-PERP`.

## Security

- A linked signer can execute trades. Use a dedicated signer and rotate it regularly.
- Keep the primary wallet private key and seed phrase outside ritmex-bot configuration.
- Revoke authorization and create a new signer immediately after exposure.

## References

- [Nado Onboarding](../nado/onboarding-tutorial.md)
- [Nado TypeScript SDK](https://docs.nado.xyz/developer-resources/typescript-sdk)
- [Create a Nado Client](../nado/developer-resources/typescript-sdk/how-to/create-a-nado-client.md)

