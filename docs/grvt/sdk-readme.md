# GRVT

Node.js & JavaScript client for GRVT REST APIs & WebSockets

## Installing

Using npm:

```bash
npm install @grvt/client
```

Using yarn:

```bash
yarn add @grvt/client
```

Using pnpm:

```bash
pnpm add @grvt/client
```

Once the package is installed, you can import the library using `import` or `require` approach:

```js
import GRVT from '@grvt/client'
```

You can also use the default export, since the named export is just a re-export from the GRVT factory:

```js
import GRVT from '@grvt/client'
console.log(
  new GRVT.MDG({
    host: 'https://market-data.dev.gravitymarkets.io',
    version: 'v1'
  })
)
```

If you use `require` for importing:

```js
const GRVT =  require('@grvt/client')
console.log(
  new GRVT.MDG({
    host: 'https://market-data.dev.gravitymarkets.io',
    version: 'v1'
  })
)
```

## To use WebSocket (available only in browsers/platforms that support WebSocket)

[Browsers supported](https://caniuse.com/websockets)

```js
import { EStreamEndpoints, WS } from '@grvt/client/ws'
console.log(new WS('wss://market-data.dev.gravitymarkets.io/ws'))
```