# Changelog

## Version [0.2.1] - 2025-07-24

### Changes in 0.2.1

- New methods in ccxt-compatible code for Strategy (Vault) managers to view investment history and current redemption queue of a Vault.
  - Classes `GrvtCcxt` and `GrvtCcxtPro`
  - Methods `fetch_vault_manager_investor_history` and `fetch_vault_redemption_queue`

## Version [0.2.0] - 2025-07-16

### Changes in 0.2.0

- additional fixes for removal of explicit enums in `grvt_raw_types.py`
- Note: this update would `break existing integrations` for `non-create-order flows` (e.g., transfer/withdrawal history, transfer, get open orders, get-instrument filters) to handle currency strings directly instead of enums.
- users will be losing the currency enum when they upgrade, so they would need to call the currencies endpoin (<https://api-docs.grvt.io/market_data_api/#get-currency> ), for which the support has been added in PySDK (`get_currency_v1()` in grvt_raw_async.py and grvt_raw_sync.py), for the metadata attached to the currency strings.

## Version [0.1.32] - 2025-07-15

### Changes in 0.1.32

- removed explicit enums in `grvt_raw_types.py` (no need to update SDK for when new coins are listed)
- added vault-related functionality

## Version [0.1.31] - 2025-07-08

### Changes in 0.1.31

- added AVAX in the raw code (testing purposes)

## Version [0.1.30] - 2025-07-08

### Changes in 0.1.30

- added `H` in the **raw** code

## Version [0.1.29] - 2025-06-30

### Changes in 0.1.29

- Added new currencies: `HYPE, UNI, MOODENG, LAUNCHCOIN` in the **raw** code
- Improvements and type fixes in `fetch_funding_rate_history()` methods of GrvtCcxt and GrvtCcxtPro.

## Version [0.1.28] - 2025-06-02

### Changes in 0.1.28

- Renamed currency name `AI_16_Z` into `AI16Z` in the **raw** code to match the exchange currency name.

## Version [0.1.27] - 2025-05-19

### Changes in 0.1.27

- `GrvtCcxt` and `GrvtCcxtPro` classes:
  
  - renamed method `fetch_balances()` to `fetch_balance()` as defined in ccxt.

## Version [0.1.26] - 2025-05-15

### Added in 0.1.26

- `GrvtCcxt` and `GrvtCcxtPro` classes:
  
  - new method `describe()` - returns a list of public method names
  - new method `fetch_balances()` - returns dict with balances in ccxt format.
  - constructor parameter `order_book_ccxt_format: bool = False` . If = True then order book snapshots from `fetch_order_book()` are in ccxt format.

### Fixed in 0.1.26

- Issues with typing and lynting errors

## Version [0.1.25] - 2025-04-25

### Fixed in 0.1.25

- Issues with typing and lynting errors
- Fixed bug in test_grvt_ccxt.py
