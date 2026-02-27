# HTTP
The HTTP module is a simple implementation that aims to provide just 2 things:
- `GetNextNonce` so that users can send transactions w/out calling managing nonces on their side
- `GetApiKey` so that users can call `CheckClient` from other sources, which makes sure that the client was configured correctly.

Other usages, like sending trades, fetching open orders or any WebSocket operations should happen outside the core SDK.