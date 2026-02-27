# API Changelog

This document tracks all changes to the Nado API.

***

<details>

<summary><strong>December 11, 2025</strong></summary>

**Risk System Updates**

**Spread Weight Caps**

* Introduced upper bounds for spread weights to manage risk at extreme leverage levels:
  * <mark style="color:red;">`initial_spread_weight`</mark>: Maximum **0.99**
  * <mark style="color:red;">`maintenance_spread_weight`</mark>: Maximum **0.994**
* **Impact**:
  * Existing markets (≤20x leverage): No change in behavior
  * Future high-leverage markets (30x+): Spread positions will have capped health benefits
  * Prevents extreme leverage abuse via spread positions
* **Technical Details**:
  * Base spread weight calculated as: `spread_weight = 1 - (1 - product_weight) / 5`
  * Final spread weight: `min(spread_weight, cap)`
  * Cap applies during health calculations for spread positions

**Minimum Liquidation Penalties**

* Introduced minimum distance requirements between oracle price and liquidation price:
  * <mark style="color:red;">**Non-spread liquidations**</mark>: Minimum **0.5%** from oracle price
  * <mark style="color:red;">**Spread liquidations**</mark>: Minimum **0.25%** from oracle price
* **Impact**:
  * Ensures liquidators always have sufficient incentive to execute liquidations
  * Prevents unprofitable liquidation scenarios for low-volatility assets
  * Particularly important for high-leverage positions where natural penalties may be very small
* **Technical Details**:
  * **Non-spread longs**: `oracle_price × (1 - max((1 - maint_asset_weight) / 5, 0.005))`
  * **Non-spread shorts**: `oracle_price × (1 + max((maint_liability_weight - 1) / 5, 0.005))`
  * **Spread selling**: `spot_price × (1 - max((1 - perp_maint_asset_weight) / 10, 0.0025))`
  * **Spread buying**: `spot_price × (1 + max((spot_maint_liability_weight - 1) / 10, 0.0025))`

**API Response Changes**

* No breaking changes to API response structure
* Health calculations and liquidation prices automatically reflect new risk parameters

**Documentation Updates**

* See [Subaccounts & Health](https://docs.nado.xyz/subaccounts-and-health#spreads) for spread weight cap details
* See [Liquidations](https://docs.nado.xyz/liquidations#liquidation-price) for minimum liquidation penalty details

</details>

***

<details>

<summary><strong>December 1, 2025</strong></summary>

**Query Enhancements**

**Pre-State Simulation for SubaccountInfo Query**

* Added <mark style="color:red;">`pre_state`</mark> parameter to <mark style="color:red;">`SubaccountInfo`</mark> query
  * Type: <mark style="color:red;">`string`</mark> (accepts <mark style="color:red;">`"true"`</mark> or <mark style="color:red;">`"false"`</mark>)
  * When set to <mark style="color:red;">`"true"`</mark> along with <mark style="color:red;">`txns`</mark>, returns a <mark style="color:red;">`pre_state`</mark> object in the response
  * <mark style="color:red;">`pre_state`</mark> contains the subaccount state **before** the simulated transactions were applied
  * Useful for comparing before/after states when simulating trades
  * <mark style="color:red;">`pre_state`</mark> includes:
    * <mark style="color:red;">`healths`</mark>: Health information before transactions
    * <mark style="color:red;">`health_contributions`</mark>: Per-product health contributions before transactions
    * <mark style="color:red;">`spot_balances`</mark>: Spot balances before transactions
    * <mark style="color:red;">`perp_balances`</mark>: Perpetual balances before transactions

**Use Cases:**

* Position simulation and preview
* Risk analysis for potential trades
* UI/UX for showing before/after comparisons
* Testing transaction impacts without on-chain execution

**Documentation:** See [Subaccount Info Query](https://docs.nado.xyz/developer-resources/gateway/queries/subaccount-info#example-with-pre_state) for detailed examples.

</details>

***

<details>

<summary><strong>November 20, 2025 - Initial Launch</strong></summary>

#### Core Changes

**1. Removal of LP Functionality**

* <mark style="color:red;">`SubaccountInfo`</mark> no longer has:
  * <mark style="color:red;">`lp_balance`</mark> in <mark style="color:red;">`spot_balances`</mark> and <mark style="color:red;">`perp_balances`</mark>
  * <mark style="color:red;">`lp_state`</mark> in <mark style="color:red;">`spot_products`</mark> and <mark style="color:red;">`perp_products`</mark>
  * <mark style="color:red;">`lp_spread_x18`</mark> in <mark style="color:red;">`book_info`</mark> of both <mark style="color:red;">`spot_products`</mark> and <mark style="color:red;">`perp_products`</mark>
* Historical <mark style="color:red;">`events`</mark> no longer include:
  * <mark style="color:red;">`net_entry_lp_unrealized`</mark>
  * <mark style="color:red;">`net_entry_lp_cumulative`</mark>

**2. Removal of Redundant Fields**

* <mark style="color:red;">`SubaccountInfo`</mark> no longer has:
  * <mark style="color:red;">`last_cumulative_multiplier_x18`</mark> in <mark style="color:red;">`balance`</mark> of <mark style="color:red;">`spot_balances`</mark>

**3. Products Config Model Updates**

* Added: <mark style="color:red;">`withdraw_fee_x18`</mark> and <mark style="color:red;">`min_deposit_rate_x18`</mark> to <mark style="color:red;">`spot_products.config`</mark>

**4. Products Risk Model Updates**

* Added: <mark style="color:red;">`price_x18`</mark> to both <mark style="color:red;">`spot_products.risk`</mark> and <mark style="color:red;">`perp_products.risk`</mark>
* Removed: <mark style="color:red;">`large_position_penalty_x18`</mark>

**5. Deposit Rate Query**

* Removed: <mark style="color:red;">`min_deposit_rates`</mark> query
* Use <mark style="color:red;">`min_deposit_rate_x18`</mark> in <mark style="color:red;">`spot_products.config`</mark> instead

#### Market Structure Changes

**6. Removal of Virtual Books**

* <mark style="color:red;">`Contracts`</mark> query no longer returns <mark style="color:red;">`book_addrs`</mark>
* <mark style="color:red;">`PlaceOrder`</mark> verify contract is now <mark style="color:red;">`address(product_id)`</mark>\
  \&#xNAN;*Example: product <mark style="color:red;">18</mark> → <mark style="color:red;">`0x0000000000000000000000000000000000000012`</mark>*

**7. Minimum Size denomination**

* <mark style="color:red;">`min_size`</mark> is now **USDT0 denominated** (not base denominated)
  * <mark style="color:red;">`min_size = 10`</mark> → minimum order size = 10 USDT0 (<mark style="color:red;">`order_price * order_amount`</mark>)
* <mark style="color:red;">`size_increment`</mark> remains **base denominated**
  * Example: BTC with <mark style="color:red;">`size_increment = 0.0001`</mark> and <mark style="color:red;">`min_size = 20`</mark>:
    * ✅ Valid: 100,000 \* 0.0002 = 20 USDT0
    * ❌ Invalid: 100,000 \* 0.0001 = 10 USDT0
    * ❌ Invalid: 100,000 \* 0.00025 (not multiple of 0.0001)

#### Orders & Signing

**8. Place Orders Execute**

* Added: <mark style="color:red;">`place_orders`</mark> execute - place multiple orders in a single request
  * Accepts array of orders with same structure as <mark style="color:red;">`place_order`</mark>
  * Optional <mark style="color:red;">`stop_on_failure`</mark> parameter to stop processing remaining orders on first failure
  * Returns array of results with <mark style="color:red;">`digest`</mark> (if successful) or <mark style="color:red;">`error`</mark> (if failed) for each order
  * Rate limit weight calculated per order

See [Place Orders](https://docs.nado.xyz/developer-resources/api/gateway/executes/place-orders) for details.

**9. EIP712 `Order` Struct Update**

```solidity
struct Order {
    bytes32 sender;
    int128 priceX18;
    int128 amount;
    uint64 expiration;
    uint64 nonce;
    uint128 appendix;
}
```

* New field: <mark style="color:red;">`appendix`</mark>
* All order flags (IOC, post only, reduce-only, triggers) moved into <mark style="color:red;">`appendix`</mark>
* <mark style="color:red;">`expiration`</mark> is now strictly a timestamp
* <mark style="color:red;">`appendix`</mark> bitfield:

```json
| value   | reserved | trigger | reduce only | order type | isolated | version |
| 64 bits | 50 bits  | 2 bits  | 1 bit       | 2 bits     | 1 bit    | 8 bits  |
```

* Special encodings:
  * <mark style="color:red;">`trigger`</mark> = 2 or 3 → <mark style="color:red;">`value`</mark> encodes TWAP settings (<mark style="color:red;">`times`</mark>, <mark style="color:red;">`slippage_x6`</mark>)
  * <mark style="color:red;">`isolated = 1`</mark> → <mark style="color:red;">`value`</mark> encodes isolated margin
* Constraints:
  * Isolated orders cannot be TWAP
  * TWAP orders must use IOC execution type

See [Order Appendix Docs](https://docs.nado.xyz/developer-resources/api/order-appendix).

**10. TWAP Order Execution**

* Added <mark style="color:red;">`list_twap_executions`</mark> query to trigger service
* TWAP orders track individual execution status (pending, executed, failed, cancelled)
* TWAP execution statuses include execution time and engine response data

**11. Trigger Service Rate Limits**

* Updated trigger order limits from 100 pending orders per subaccount to <mark style="color:red;">`25 pending orders per product per subaccount`</mark>

**12. EIP712 Domain Change**

* Signing domain updated from **`Vertex` → `Nado`**\
  See [Signing Docs](https://docs.nado.xyz/developer-resources/api/gateway/signing).

#### Query Updates

**13.&#x20;**<mark style="color:red;">**`max_order_size`**</mark>

* Added: <mark style="color:red;">`isolated`</mark> parameter - when set to `true`, calculates max order size for an isolated margin position. Defaults to `false`.

**14.&#x20;**<mark style="color:red;">**`orders`**</mark>**&#x20;Query**

* Added: <mark style="color:red;">`trigger_types`</mark> parameter - filter orders by trigger type(s)

**15. Historical Events**

* Added: <mark style="color:red;">`quote_volume_cumulative`</mark> - tracks cumulative trading volume for the subaccount in quote units
  * Available in: `events` and `subaccount_snapshots` queries

**16.&#x20;**<mark style="color:red;">**`subaccount_snapshots`**</mark>**&#x20;Query**

* Added: <mark style="color:red;">`active`</mark> parameter - filter snapshots by position status
  * <mark style="color:red;">`true`</mark>: returns only products with **non-zero balance** at the timestamp
  * <mark style="color:red;">`false`</mark>: returns products with **event history** before the timestamp (default)

**17. Trigger Orders**

* Added: <mark style="color:red;">`place_at`</mark> field - timestamp when trigger order should be placed

**18. Removal of&#x20;**<mark style="color:red;">**`summary`**</mark>**&#x20;Query**

* Removed: <mark style="color:red;">`summary`</mark> query from indexer API
* Use <mark style="color:red;">`subaccount_snapshots`</mark> query instead for historical subaccount data

**19. Query Renaming**

* Renamed: <mark style="color:red;">`usdc_price`</mark> → <mark style="color:red;">`quote_price`</mark> query
  * See [Quote Price](https://docs.nado.xyz/developer-resources/api/archive-indexer/quote-price)

**20. Multi-Subaccount `events`, `matches`, `orders`**

* The indexer <mark style="color:red;">`events`</mark>, <mark style="color:red;">`matches`</mark>, and <mark style="color:red;">`orders`</mark> queries now accept a <mark style="color:red;">`subaccounts`</mark> array so you can fetch history for multiple subaccounts in a single request instead of fanning out per subaccount. Please note that the old single-subaccount version is **no longer supported**.

#### Streams

{% hint style="info" %}
See [Subscriptions > Streams](https://docs.nado.xyz/developer-resources/api/subscriptions/streams) for more details
{% endhint %}

**21.&#x20;**<mark style="color:red;">**`OrderUpdate`**</mark>

* Can now subscribe across all products by setting <mark style="color:red;">`product_id = null`</mark>
* <mark style="color:red;">`product_id`</mark> type changed from `u32` → `Option<u32>`

**22.&#x20;**<mark style="color:red;">**`Fill`**</mark>

* Added: <mark style="color:red;">`fee`</mark>, <mark style="color:red;">`submission_idx`</mark>, and <mark style="color:red;">`appendix`</mark>
* Can now subscribe across all products by setting <mark style="color:red;">`product_id = null`</mark>

**23.&#x20;**<mark style="color:red;">**`PositionChange`**</mark>

* Can now subscribe across all products by setting <mark style="color:red;">`product_id = null`</mark>
* <mark style="color:red;">`product_id`</mark> type changed from `u32` → `Option<u32>`
* Added: <mark style="color:red;">`isolated`</mark> - indicates whether the position change is for an isolated margin position

**24.&#x20;**<mark style="color:red;">**`FundingPayment`**</mark>

* New stream: <mark style="color:red;">`FundingPayment`</mark>
* Param: <mark style="color:red;">`product_id: u32`</mark>
* Emits hourly funding payment events

**Request**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "funding_payment",
    "product_id": 1
  },
  "id": 123
}
```

**Response**

```json
{
  "type": "funding_payment",
  "timestamp": 1234567890000,
  "product_id": 1,
  "payment_amount": "1000000000000000000",
  "open_interest": "50000000000000000000",
  "cumulative_funding_long_x18": "100000000000000000",
  "cumulative_funding_short_x18": "-100000000000000000",
  "dt": 3600000
}
```

**25.&#x20;**<mark style="color:red;">**`Liquidation`**</mark>

* New stream: <mark style="color:red;">`Liquidation`</mark>
* Param: <mark style="color:red;">`product_id`</mark> or <mark style="color:red;">`null`</mark> (all products)
* Emits liquidation info (liquidator, liquidatee, amount, price)

**Request**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "liquidation",
    "product_id": 1
  },
  "id": 123
}
```

**Response**

```json
{
  "type": "liquidation",
  "timestamp": "1234567890000",
  "product_ids": [1],
  "liquidator": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
  "liquidatee": "0x8b6fd3859f7065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
  "amount": "1000000000000000000",
  "price": "50000000000000000000"
}
```

**26.&#x20;**<mark style="color:red;">**`LatestCandlestick`**</mark>

* New stream: <mark style="color:red;">`LatestCandlestick`</mark>
* Params: <mark style="color:red;">`product_id`</mark>, <mark style="color:red;">`granularity`</mark> (seconds)
* Emits candlestick updates on every trade

**Request**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "latest_candlestick",
    "product_id": 1,
    "granularity": 60
  },
  "id": 123
}
```

**Response**

```json
{
  "type": "latest_candlestick",
  "timestamp": 1234567890000,
  "product_id": 1,
  "granularity": 60,
  "open_x18": "50000000000000000000",
  "high_x18": "51000000000000000000",
  "low_x18": "49000000000000000000",
  "close_x18": "50500000000000000000",
  "volume": "1000000000000000000"
}
```

**27.&#x20;**<mark style="color:red;">**`FundingRate`**</mark>

* New stream: <mark style="color:red;">`FundingRate`</mark>
* Param: <mark style="color:red;">`product_id`</mark> or <mark style="color:red;">`null`</mark> (all products)
* Emits funding rate updates every 20 seconds
* <mark style="color:red;">`funding_rate_x18`</mark> and <mark style="color:red;">`update_time`</mark> values are identical to those from the [Funding Rate](https://docs.nado.xyz/developer-resources/api/archive-indexer/funding-rate) indexer endpoint

**Request**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "funding_rate",
    "product_id": 1
  },
  "id": 123
}
```

**Subscribe to all products:**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "funding_rate",
    "product_id": null
  },
  "id": 123
}
```

**Response**

```json
{
  "type": "funding_rate",
  "timestamp": "1234567890123456789",
  "product_id": 1,
  "funding_rate_x18": "50000000000000000",
  "update_time": "1234567890"
}
```

</details>
