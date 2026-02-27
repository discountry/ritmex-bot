# FAQs

Welcome to the Nado Frequently Asked Questions (FAQs). This section provides detailed, practical answers for newcomers to Nado. Whether you're new to perpetual trading or refining your strategy, these responses aim to clarify key concepts and processes.

If you're depositing into Nado or withdrawing for the first time, we recommend reviewing the relevant responses and associated tutorial sections for a smooth onboarding experience.

Trade smarter, move faster.

***

### Deposits

#### Why can't I deposit my ETH? <a href="#docs-internal-guid-74e16907-7fff-e6eb-422c-5068858b9966" id="docs-internal-guid-74e16907-7fff-e6eb-422c-5068858b9966"></a>

Nado exclusively accepts ERC-20 tokens as deposits to ensure seamless integration with our smart contract infrastructure on the INK network.

Native ETH is not directly supported for deposits into trading positions, as it serves primarily as the gas token for transactions on INK. To use ETH-based value for trading, first bridge or wrap it into a compatible ERC-20 asset (e.g., Wrapped ETH or stablecoins like USDT0) on the Ink network. This process can be initiated through trusted bridges accessible via the Nado interface or external tools, allowing you to convert and deposit in an efficient workflow.

Users can also send ETH to Nado via the direct-deposit flow available on the app, simplifying the deposit process.

***

#### How do I deposit from other chains onto Ink and deposit on Nado? <a href="#docs-internal-guid-7c5cef88-7fff-72fb-60d9-a04e8a701937" id="docs-internal-guid-7c5cef88-7fff-72fb-60d9-a04e8a701937"></a>

Nado operates on the high-performance Ink L2 network, so deposits from other chains require first bridging assets to Ink before depositing them into Nado. This two-step process ensures compatibility and leverages Ink’s low-cost, EVM-compatible environment.

1. **Bridge Assets to INK**: Use a reliable cross-chain bridge to transfer supported assets (e.g., ETH, USDT0, USDC) from your source chain (such as Ethereum, Arbitrum, Polygon, etc) to your Ink wallet address.
   1. Recommended Bridges: [USDT0 Native Bridge](https://usdt0.to/transfer), [Superbridge](https://superbridge.app/), [Bungee](https://bungee.exchange/), or[ Relay](https://relay.link/).
   2. Steps:
      1. Connect your wallet and select the source chain.
      2. Choose Ink as the destination network.
      3. Select the asset and amount, then sign the bridging transaction.
      4. Wait for confirmation (typically 5 - 15 minutes); track via the[ Ink Explorer](https://explorer.inkonchain.com).

{% hint style="info" %}
Ensure your wallet is configured for INK.
{% endhint %}

2. **Deposit into Nado**: Once assets are on Ink and visible in your wallet:
   1. Visit the[ Nado app](https://app.nado.xyz).
   2. Connect your Ink-configured wallet.
   3. Navigate to the Deposit section on the Portfolio page.
   4. Select the asset, enter the amount, and confirm the on-chain transaction – deposits settle near-instantly on Nado, making collateral available for trading almost immediately.

{% hint style="info" %}
This method supports assets like ETH (for gas), USDT0, USDC, wETH, and wBTC. Always verify token contract addresses on the Ink Explorer to avoid errors.
{% endhint %}

***

#### How do I deposit funds from a CEX wallet? <a href="#docs-internal-guid-b52b8589-7fff-a4bf-acb3-3fc6f5238920" id="docs-internal-guid-b52b8589-7fff-a4bf-acb3-3fc6f5238920"></a>

Depositing from a centralized exchange (CEX) to Nado involves withdrawing assets to your Ink-configured wallet first, then depositing into Nado This ensures funds land on the correct network for seamless trading.

**1. Withdraw from CEX to Ink Wallet**:

* Log in to your CEX account (e.g., Kraken) and initiate a withdrawal of supported assets (e.g., ETH, USDT0, etc).
* Enter your Ink wallet address as the recipient – double-check it's on the Ink network to prevent loss of funds. You can also use the 'Direct Deposit' feature on Nado to simplify this process.
* Specify the Ink network in the withdrawal options (Kraken supports zero-fee Ink withdrawals for ETH).
* Confirm and complete the withdrawal; funds typically arrive in 10–30 minutes.

**2. Import and Verify Assets in Wallet:**

* If the token doesn't auto-appear, manually import it using the INK-specific contract address (e.g., via MetaMask's "Import Token" feature—verify addresses on the Ink Explorer).

**3. Deposit into Nado:**

* Connect your wallet to the[ Nado app](https://app.nado.xyz) on the Ink network.
* Go to the Deposit section in the Portfolio.
* Select the asset, input the amount, and approve the transaction – your collateral will be available almost immediately for trading.

{% hint style="info" %}
**Pro Tip**: Start with a small test withdrawal to confirm the process. For gas fees on Ink, ensure you have at least 0.01 ETH in your wallet.
{% endhint %}

***

### Withdrawals

Withdrawals from Nado are designed for simplicity and efficiency, operating without the need for any bridging mechanisms. This means your funds move directly from the protocol to your connected wallet in a straightforward, on-chain process, preserving the integrity and speed of your assets' transfer.

To enhance your withdrawal flexibility, you have the option to enable the borrowing toggle. This feature allows you to borrow additional assets against your existing margin, providing greater liquidity while you initiate the withdrawal.

> Once your withdrawal request is submitted, it joins a batch of other pending withdrawals for optimized processing. You can easily monitor the real-time status of your withdrawal – including confirmation, pending settlement, and completion – directly in the **Withdrawals History** tab, accessible via the Portfolio page in the Nado interface.

Nado employs a gas-optimization strategy to minimize user fees, batching and submitting withdrawal transactions to the Ink L2 network only when gas prices are at their lowest.

While all user actions within Nado execute instantaneously, the actual on-chain settlement of withdrawals may take up to 30 minutes during periods of elevated network congestion. This 30-minute window serves as the targeted maximum pending time: Nado's automated system will proactively submit the transaction to Nado after this interval, even in high-gas environments, to ensure timely resolution.

In rare cases where processing exceeds this timeframe, it is typically attributable to sustained spikes in network gas costs beyond Nado's control. Rest assured, if your withdrawal appears as "pending" in the Nado app, it has been successfully queued and validated internally. Settlement will occur automatically once gas fees decrease or fall below the predefined optimization threshold at the time of submission.

{% hint style="info" %}
Please be aware that exact withdrawal times can vary due to real-time fluctuations in network conditions and gas pricing. For comprehensive tracking, we also recommend reviewing the Account History section within the Portfolio page, which provides a detailed log of all deposit and withdrawal activities.
{% endhint %}

***

### General FAQs

#### Why do I need to deposit? <a href="#docs-internal-guid-56ae964e-7fff-a91c-39fe-abe36f4cfdea" id="docs-internal-guid-56ae964e-7fff-a91c-39fe-abe36f4cfdea"></a>

Depositing collateral into Nado's smart contracts is essential for enabling leveraged trading on the exchange. These contracts operate in a non-custodial manner, meaning your funds remain under your control and are stored on-chain. You can withdraw your available balance whenever you choose, providing full flexibility while powering your positions.

***

#### Do I control my assets?

Yes, you maintain complete control over your assets in Nado. Only you can initiate trades, access funds, or execute withdrawals. The protocol's non-custodial smart contracts ensure that no third party holds custody, giving you sovereign authority over your portfolio.

***

#### What is unified margin trading and how is it unique? <a href="#docs-internal-guid-984a5cb3-7fff-9b62-f23a-3cbfc96d6c31" id="docs-internal-guid-984a5cb3-7fff-9b62-f23a-3cbfc96d6c31"></a>

Unified margin consolidates all your account balances and open positions into one margin pool, enabling real-time margin offsets that reduce overall margin requirements and enhance capital efficiency.

**How it Works**

* **Shared Collateral Pool**: Every asset in your Nado account (e.g., USDT0 deposits, kBTC holdings, etc) and all open positions contribute to a unified health score, calculated by Nado's on-chain risk engine. This score reflects your total available collateral and maintenance margin levels before hitting margin limits and liquidation thresholds.
* **Automatic Netting & Rebalancing**: Positive PnL from one position can offset losses in another, dynamically adjusting margin needs. Maintenance margin (the buffer against liquidation) and initial margin (required to open positions) are computed holistically, often resulting in lower margin requirements than isolated margin trades.
* **Risk Tiers for Visibility**: Monitor your portfolio through intuitive risk levels, updated in real-time for proactive management.

> The core advantage of unified margin is maximizing capital efficiency.

Your portfolio operates as an interconnected system, where balanced exposures minimize tied-up funds and amplify buying power. It's suited for strategies like basis trades or multi-asset hedges, eliminating the need for constant rebalancing.

***

#### How do I earn interest on deposits? <a href="#docs-internal-guid-35648b50-7fff-ab28-82bf-a4380d347a39" id="docs-internal-guid-35648b50-7fff-ab28-82bf-a4380d347a39"></a>

Interest is earned automatically on all asset deposits into Nado, as they are integrated into the protocol's underlying money markets. These markets facilitate leveraged spot trading and borrowing opportunities, with your deposits participating passively to generate yield.

The on-chain smart contracts ensure that borrowers always meet margin requirements, maintaining system stability and security for all participants.

***

#### What are the fees? <a href="#docs-internal-guid-de8c331c-7fff-2d4e-e024-8d60e8467424" id="docs-internal-guid-de8c331c-7fff-2d4e-e024-8d60e8467424"></a>

The fee model follows a classic maker-taker structure across spot and perpetuals markets:

* **Makers** (limit orders adding liquidity): Earn rebates at higher tiers.
* **Takers** (market orders removing liquidity): Pay a modest fee.

All fees are calculated in basis points (bps, or 0.01%) of the trade's notional value and settled instantly in USDT0 from your collateral.

Setting Nado apart from fixed-rate models, the volume-based scaling tiers update monthly to encourage deeper orderbooks and sustained activity. As your 30-day trading volume (maker + taker) climbs, taker fees decrease and maker rebates increase, creating a virtuous cycle of growing efficiency and participation.

> For complete fee details including minimum fees for small taker orders, see the [Fees & Rebates](https://docs.nado.xyz/fees-and-rebates) page.

***

#### Are there take-profit and stop-loss orders? <a href="#docs-internal-guid-835e9c81-7fff-ba3f-7ae8-b731658cabc7" id="docs-internal-guid-835e9c81-7fff-ba3f-7ae8-b731658cabc7"></a>

Yes, Nado supports take-profit (TP) and stop-loss (SL) orders for open perpetual positions. These conditional order types allow you to automatically exit positions at predefined price levels, helping manage risk and secure profits in volatile markets.

Nado also offers traders more advanced order types, including TWAP orders and scale orders (coming soon).

***

#### Why do I have less funds available than what I deposited? (“I deposited $50, why does it say I only have $40 to trade with?”) <a href="#docs-internal-guid-43bed2b7-7fff-19e8-0b41-24e7150c96d2" id="docs-internal-guid-43bed2b7-7fff-19e8-0b41-24e7150c96d2"></a>

In Nado's unified margin engine, the Available Margin metric represents the value of your deposited collateral, adjusted by the initial margin weights of each asset. This weighting accounts for varying levels of volatility across collateral types, applying a discount to more volatile assets to ensure prudent risk management. As a result, not all collateral contributes at full face value to your trading capacity.

> For example, stable assets like USDT0 are weighted 1:1 with their nominal value, providing direct usability. This system allows you to leverage diverse collateral types while maintaining overall account stability.

***

#### Is there a minimum amount to trade? <a href="#docs-internal-guid-019df0ae-7fff-e576-2166-88c32ed6339d" id="docs-internal-guid-019df0ae-7fff-e576-2166-88c32ed6339d"></a>

Nado imposes a $5 equivalent initial deposit minimum for a user's trading account. After the initial deposit, there is no universal minimum trade amount.

> However, certain order types enforce a minimum order size based on each product's parameters. Additionally, all taker orders are subject to a minimum fee calculated based on the product's minimum size, even for order types that allow smaller sizes. See the [Fees & Rebates](https://docs.nado.xyz/fees-and-rebates) page for complete details on minimum fees and order requirements.

***

#### Why is there a negative sign in front of my asset balance? <a href="#docs-internal-guid-6b0dcd08-7fff-9cd9-4113-5c24d388856f" id="docs-internal-guid-6b0dcd08-7fff-9cd9-4113-5c24d388856f"></a>

A negative balance indicator for an asset signifies that you are currently borrowing that asset within the protocol. This can occur as part of position management, such as when leveraging borrows to enter or maintain trades.

***

#### I didn’t borrow USDT0. Why is my balance negative? <a href="#docs-internal-guid-9f5fed7e-7fff-138a-a395-c4f1c576b1a0" id="docs-internal-guid-9f5fed7e-7fff-138a-a395-c4f1c576b1a0"></a>

A negative USDT0 balance can arise automatically in scenarios involving perpetual positions with unrealized negative PnL, especially when using collateral assets that are not USDT0.

Throughout the duration of holding such positions, the protocol settles PnL in USDT0 between winning and losing trades. If sufficient USDT0 is unavailable in your account, Nado will borrow it on your behalf to cover the settlement, resulting in a temporary negative balance.

***

#### How do I repay borrows? <a href="#docs-internal-guid-9bd9d842-7fff-91a7-07d5-488baa479efa" id="docs-internal-guid-9bd9d842-7fff-91a7-07d5-488baa479efa"></a>

To repay any outstanding borrows in Nado, locate and select the Repay button through one of the following access points:

* **Balances Table**: Click the drop-down menu on the right-most side of the relevant row.

You have two primary options for repayment:

1. **Direct Deposit**: Deposit the exact amount of the borrowed asset to settle the balance in full.
2. **Asset Conversion**: Sell or convert another held asset (e.g., swap wETH for USDT0) to generate the necessary funds for repayment.

This process restores your balance to positive and frees up additional margin for trading.

***

#### Why was my position liquidated if the chart shows that the price didn’t hit my Liq. price? <a href="#docs-internal-guid-d4ac2354-7fff-bb1c-70e8-0369494bfeb1" id="docs-internal-guid-d4ac2354-7fff-bb1c-70e8-0369494bfeb1"></a>

The Liq. Price displayed in the Perp Positions table is an estimated value calculated based on your current account state and the specific position's health. In a multi-position portfolio, fluctuations in other open positions can indirectly affect this estimate, causing it to shift without direct price movement in the charted asset.

> **Note**: The trading terminal chart on the app uses the traded price on Nado, but liquidations use the oracle price.

Liquidations are triggered solely by the market's Oracle Price, sourced from the Chaos Labs Oracle and submitted to the on-chain smart contracts at regular time intervals or in response to significant price changes.

{% hint style="info" %}
If the Oracle Price causes your account to fall below maintenance margin requirements, liquidation occurs regardless of the displayed estimate. This ensures objective, real-time risk management aligned with on-chain data.
{% endhint %}

***

#### How do liquidations work? <a href="#docs-internal-guid-9a99de40-7fff-da25-6762-ea179391a119" id="docs-internal-guid-9a99de40-7fff-da25-6762-ea179391a119"></a>

When a subaccount's maintenance health falls below zero, Nado initiates liquidation to restore solvency, closing elements in a structured sequence that minimizes market impact. Any user can act as a liquidator by submitting a transaction to purchase discounted assets or cover marked-up liabilities, earning a profit while aiding recovery.

> The process pauses if initial health rises above zero at any step, giving positions a chance to rebound.

Liquidators specify a product and amount to target, with the system rounding down to the optimal size that brings maintenance health back to non-negative, whilst making sure the initial health is non-positive. – balancing efficiency with user protection.

The sequence of liquidation operations is as follows:

1. **Cancel Open Orders**: All pending orders in the subaccount are voided to free up resources.
2. **Liquidate Assets**: Spot balances, long spreads, and positive-PnL perpetuals are sold at a discount.
3. **Liquidate Liabilities**: Borrows and short spreads are repaid at a markup.

***

#### What is Maintenance Margin Usage?

Maintenance Margin Usage is an indicator of when liquidation begins if you hit 100%. It indicates the percentage of your maintenance margin that is consumed by open positions. It provides a real-time gauge of how close your account is to liquidation thresholds.

* **Low Risk**: 0 – 40%
* **Medium Risk**: 40 – 70%
* **High Risk**: 70 – 90%
* **Extreme Risk**: 90 – 100%

> If Maintenance Margin Usage reaches 100%, your account is immediately eligible for liquidation. At this point, you will be unable to open new positions until some margin is freed up, either through position closures, additional deposits, or positive PnL realizations.

{% hint style="info" %}
Monitoring this metric helps prevent overexposure and ensures you retain capacity for opportunistic trades.
{% endhint %}

***

#### What is Available Margin?

Available Margin quantifies the amount of tradable funds or collateral in your account, calculated as the initial weighted margin that remains unused. This represents your immediate buying power for initiating new positions.

{% hint style="info" %}
Should Available Margin reach $0, new position openings will be restricted. It is also commonly referred to as Free Collateral, serving as a key indicator of your account's liquidity for trading.
{% endhint %}

***

#### What is Maintenance Margin?

Maintenance Margin represents the buffer of funds or collateral in your account before it reaches liquidation eligibility. If this value drops to $0, your account enters a high-risk state and may be subject to automated liquidation.

Maintaining a positive Maintenance Margin is crucial for position sustainability — regularly review this alongside market conditions to adjust leverage proactively.

{% hint style="info" %}
You must maintain a Maintenance Margin value above $0 to avoid liquidation.
{% endhint %}

***

#### What are Initial and Maintenance weights? <a href="#docs-internal-guid-02e0b55d-7fff-62c0-e97f-b69b67279302" id="docs-internal-guid-02e0b55d-7fff-62c0-e97f-b69b67279302"></a>

In exchanges limited to dollar-pegged collateral (e.g., stablecoins), assets are typically weighted at full face value for simplicity. However, Nado's cross-margin system accepts multiple collateral types and applies dual weights to account for volatility, ensuring robust risk controls:

1. **Initial Weight**: Determines the collateral value available for opening new positions (i.e., trading capacity).
2. **Maintenance Weight**: Sets the threshold for sustaining positions without triggering liquidation.

These weights provide traders with clear visibility into both offensive (trading) and defensive (risk) aspects of their portfolio.

***

#### Initial vs. Maintenance Margin <a href="#docs-internal-guid-a8d50980-7fff-fdd6-0b1f-a378fd0a431c" id="docs-internal-guid-a8d50980-7fff-fdd6-0b1f-a378fd0a431c"></a>

Initial and maintenance weighted margins offer traders dual insights into account health: your capacity to enter trades and proximity to liquidation risks.

* **Initial Margin**: The total funds available for trading, computed as initial weighted collateral minus initial weighted margin requirements.
* **Maintenance Margin**: The minimum funds required to avoid liquidation, calculated as maintenance weighted collateral minus maintenance weighted margin requirements.

***

#### Are there deposit caps on the NLP during the Private Alpha? <a href="#docs-internal-guid-127b3b79-7fff-a0f3-efa4-2198bea93e41" id="docs-internal-guid-127b3b79-7fff-a0f3-efa4-2198bea93e41"></a>

Yes, during Private Alpha, **the NLP&#x20;*****deposit amount*****&#x20;is capped at 20,000 USDT0 per Nado trading account**. This means users cannot *add* more than 20,000 USDT0 into the vault.

However, **the position value itself can grow beyond 20,000 USDT0 through yield**. For example, if a user deposits 19,000 USDT0 and their position appreciates to 20,000 USDT0, that’s allowed, they simply can’t deposit additional funds once they’ve hit the deposit limit.

Any updates to the deposit cap will be communicated in advance and reflected in the Nado app during Private Alpha or later.

***

#### What is the deposit APY for the NLP? <a href="#docs-internal-guid-595443c6-7fff-53d6-7025-f7e899edb90c" id="docs-internal-guid-595443c6-7fff-53d6-7025-f7e899edb90c"></a>

Yields for LPs in the NLP vault are variable and subject to change based on the prevailing market conditions and other factors including but not limited to the vault strategy’s PnL and the total LP capital (USDT0) deposited into the vault.

***

{% hint style="info" %}
For any other questions or feedback, please refer to the Nado community and support channels for assistance.
{% endhint %}
