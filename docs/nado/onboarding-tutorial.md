# Onboarding Tutorial

This comprehensive guide walks you through the essential steps to set up your wallet, bridge assets to the Ink L2 network, and begin trading on Nado. Whether you're new to decentralized trading or transitioning from another platform, follow these instructions sequentially for a seamless experience.

> Nado operates on the Ink L2 network, a high-performance EVM-compatible layer two network optimized for DeFi applications and powered by the Optimism Superchain.

By the end of this tutorial, you'll have a funded wallet connected to Ink and ready to execute your first trade on Nado. Let's dive in.

***

### Step 1. Choose Your Wallet

Nado and the Ink network support a variety of popular wallets, ensuring compatibility with both desktop and mobile users. Select the one that best aligns with your needs for security, usability, and features:

* **MetaMask** (Browser + Mobile): The most widely used wallet for EVM-compatible chains, ideal for beginners with its intuitive interface.
* **Rabby Wallet** (Browser): Tailored for active traders, offering automatic network switching, enhanced transaction simulations, and improved security previews.
* **WalletConnect** (All Compatible Wallets): Connect mobile-first options such as:
  * Trust Wallet
  * OKX Wallet
  * Rainbow Wallet
  * Crypto.com DeFi Wallet
  * Ledger Live (via WalletConnect for hardware security)

{% hint style="info" %}
If you're handling significant balances, prioritize hardware-integrated options like Ledger for added protection.
{% endhint %}

***

### Step 2. Add the INK Network to Your Wallet

To interact with Nado on the Ink network, configure your wallet to recognize Ink as a custom chain. Use one of the following methods:

#### **Method 1**: One-Click Addition

1. Visit [ChainList](https://chainlist.org/).
2. Search for "Ink."
3. Select the Ink network and click “Add to MetaMask” (or your chosen wallet). This automatically populates the required details.

#### **Method 2**: Manual Configuration

If the one-click method isn't available, add the network manually in your wallet settings:

* **Network Name**: INK
* **RPC URL**:[ https://rpc-gel.inkonchain.com](https://rpc-gel.inkonchain.com)
* **Chain ID**: 57073
* **Currency Symbol**: ETH
* **Block Explorer URL**:[ https://explorer.inkonchain.com](https://explorer.inkonchain.com)

{% hint style="info" %}
Once added, switch your wallet to the Ink network via the network drop-down menu. Confirm the connection by checking your wallet balance (it should display ETH as the native token).
{% endhint %}

***

### Step 3. Acquire ETH on INK for Gas Fees

All transactions on the Ink network require a small amount of ETH to cover gas fees. Even minimal trades or deposits will incur these costs, so start with at least 0.01 – 0.05 ETH to cover initial activities both on the Ink L2 network and when interacting with Nado.

#### Option A: Receive ETH Directly on Ink

* Withdraw ETH from a centralized exchange (CEX), bridge protocol, different wallet you control, or a transfer from a fiat → crypto onboarding platform you prefer.
* Use your Ink wallet address as the recipient. Ensure the sending address specifies the Ink network during withdrawal to avoid sending to the wrong chain.

{% hint style="info" %}
**Pro Tip**: Kraken offers zero-fee withdrawals to the Ink network, making it a cost-effective choice.
{% endhint %}

#### Option B: Bridge ETH from Another Chain

If you don't have ETH on Ink, bridge it from a supported source chain (e.g., Ethereum, Arbitrum, Polygon, etc.) using a supported bridge:

1. Visit an official bridge supported by Nado such as the [Superbridge](https://superbridge.app/), [Bungee](https://bungee.exchange/), or [Relay](https://relay.link/).
2. Select your source chain (e.g., Base) and set Ink as the destination.
3. Choose ETH as the asset to bridge (or swap other assets like USDT0 into ETH during the process).
4. Enter the amount, review fees, and sign the transaction in your wallet.
5. Wait for confirmation – bridging typically takes 5 – 15 minutes on average with some variance depending on network congestion. Track progress on the bridge's dashboard or the Ink block explorer.

{% hint style="info" %}
Once bridged, your ETH will appear in your Ink wallet balance.
{% endhint %}

***

### Step 4. Add Additional Assets to Your Ink Wallet

With ETH secured for gas, fund your wallet with trading collateral such as stablecoins (e.g., USDT0 or other supported tokens. This prepares you for deposits into Nado.

* Follow the same receipt or bridging process as in Step 3: Withdraw from a wallet or CEX into your Ink address or bridge from another chain.
* Supported assets for deposits on Nado include wETH, USDT0, kBTC, wBTC, and USDC.

{% hint style="info" %}
**Important**: Wallets do not always auto-detect custom tokens.
{% endhint %}

If an asset doesn't appear in your wallet:

1. Open your wallet and navigate to Import Token or Add Custom Token.
2. Paste the token's contract address (ensure it's the Ink-specific address, not from Ethereum or another chain – verify via the[ Ink Explorer](https://explorer.inkonchain.com)).
3. Confirm the import. The token should now display with its balance.

***

### Step 5. Connect Your Wallet & Start Trading on Nado

With your Ink wallet funded, you're ready to engage with the Nado app:

1. Visit the[ Nado app](https://app.nado.xyz) (bookmark this URL for security).
2. Click Connect Wallet in the top-right corner.
3. Select your wallet provider (e.g., MetaMask) and ensure it's switched to the Ink network.
4. Approve the connection request in your wallet – this grants Nado read-only access to your balances without custody.
5. Navigate to the Deposit section on the Portfolio page.
6. Select an asset (e.g., USDT0), enter the amount, and confirm the transaction. Deposits are near-instant on Nado, making your collateral available for trading immediately.

To open your first position:

* Browse the available markets in the trading terminal (e.g., ETH-PERP, BTC-PERP).
* Use the order form to place a limit or market order, leveraging Nado's unified margin system.
* Monitor your positions via the Portfolio tab.

***

### Troubleshooting Common Issues

Encountering hurdles? Use this section to resolve them quickly. If issues persist, submit a support ticket for team assistance.

* **Wallet Not Switching to INK Network?** In MetaMask or Rabby, open the network dropdown menu and manually select Ink. If unavailable, re-add the network per Step 2 above.
* **"Insufficient Gas Fee" Error?** Your wallet lacks ETH for transaction costs. To resolve the issue, bridge a small amount of ETH (as low as 0.001) from another chain or wallet to your Ink address.
* **Tokens Not Showing in Wallet?** Manually import the token using the associated contract address (Step 4). Double-check it's the Ink version via the block explorer.
* **Bridge Transaction Stuck?** Monitor the status both on the[ Ink Explorer](https://explorer.inkonchain.com) and the bridge you're using using your transaction hash. If pending beyond 30 minutes, it may be due to network congestion – retry with a smaller amount or contact bridge support.

{% hint style="info" %}
For Nado-specific issues, submit a support ticket for team assistance.
{% endhint %}

***

### Security Best Practices

Security is paramount in DeFi. Adhere to these tips to help safeguard your assets:

* **Verify URLs**: Always access Nado via bookmarked links or official sources. Beware of phishing sites mimicking the Nado domain.
* **Protect Your Seed Phrase**: Never share it with anyone, including support teams. Store it offline in a secure manner.
* **Use Hardware Wallets**: For larger wallet balances, integrate Ledger or Trezor via WalletConnect to keep private keys offline.
* **Enable Protections**: Activate MetaMask's phishing detection and transaction simulation features. Rabby Wallet excels here by previewing full transaction impacts.
* **Additional Habits**: Avoid clicking unsolicited links in emails / DMs, use two-factor authentication on linked exchanges, and regularly review connected dApps in your wallet settings.

By following this tutorial, you're equipped to trade confidently on Nado.

***
