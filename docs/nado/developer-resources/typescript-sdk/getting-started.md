# Getting Started

## Installation

### Prerequisites

* [Node](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable), if using the `yarn` dependency manager
* [Viem](https://viem.sh/)
* [Bignumber.js](https://github.com/MikeMcl/bignumber.js/)

{% hint style="info" %}
Version 1.x.x of the SDK now uses `viem` instead of `ethers` to represent wallets and RPC connections.
{% endhint %}

### Install the packages <a href="#install-the-packages" id="install-the-packages"></a>

The Nado SDK packages are hosted on NPM.

#### Run the following:

{% tabs %}
{% tab title="yarn" %}

```sh
yarn add @nadohq/client viem bignumber.js
```

{% endtab %}

{% tab title="npm" %}

```sh
npm install @nadohq/client viem bignumber.js
```

{% endtab %}
{% endtabs %}
