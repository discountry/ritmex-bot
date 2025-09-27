# ruff: noqa: D200
# ruff: noqa: D204
# ruff: noqa: D205
# ruff: noqa: D404
# ruff: noqa: W291
# ruff: noqa: D400
# ruff: noqa: E501
from dataclasses import dataclass
from enum import Enum
from typing import Any


class BrokerTag(Enum):
    UNSPECIFIED = "UNSPECIFIED"
    # CoinRoutes
    COIN_ROUTES = "COIN_ROUTES"
    # Alertatron
    ALERTATRON = "ALERTATRON"
    # Origami
    ORIGAMI = "ORIGAMI"


class CancelStatus(Enum):
    # Cancellation has expired because corresponding order had not arrived within the defined time-to-live window.
    EXPIRED = "EXPIRED"
    # This cancellation request was dropped because its TTL window overlaps with another cancellation request for the same order.
    DROPPED_DUPLICATE = "DROPPED_DUPLICATE"


class CandlestickInterval(Enum):
    # 1 minute
    CI_1_M = "CI_1_M"
    # 3 minutes
    CI_3_M = "CI_3_M"
    # 5 minutes
    CI_5_M = "CI_5_M"
    # 15 minutes
    CI_15_M = "CI_15_M"
    # 30 minutes
    CI_30_M = "CI_30_M"
    # 1 hour
    CI_1_H = "CI_1_H"
    # 2 hour
    CI_2_H = "CI_2_H"
    # 4 hour
    CI_4_H = "CI_4_H"
    # 6 hour
    CI_6_H = "CI_6_H"
    # 8 hour
    CI_8_H = "CI_8_H"
    # 12 hour
    CI_12_H = "CI_12_H"
    # 1 day
    CI_1_D = "CI_1_D"
    # 3 days
    CI_3_D = "CI_3_D"
    # 5 days
    CI_5_D = "CI_5_D"
    # 1 week
    CI_1_W = "CI_1_W"
    # 2 weeks
    CI_2_W = "CI_2_W"
    # 3 weeks
    CI_3_W = "CI_3_W"
    # 4 weeks
    CI_4_W = "CI_4_W"


class CandlestickType(Enum):
    # Tracks traded prices
    TRADE = "TRADE"
    # Tracks mark prices
    MARK = "MARK"
    # Tracks index prices
    INDEX = "INDEX"
    # Tracks book mid prices
    MID = "MID"


class InstrumentSettlementPeriod(Enum):
    # Instrument settles through perpetual funding cycles
    PERPETUAL = "PERPETUAL"
    # Instrument settles at an expiry date, marked as a daily instrument
    DAILY = "DAILY"
    # Instrument settles at an expiry date, marked as a weekly instrument
    WEEKLY = "WEEKLY"
    # Instrument settles at an expiry date, marked as a monthly instrument
    MONTHLY = "MONTHLY"
    # Instrument settles at an expiry date, marked as a quarterly instrument
    QUARTERLY = "QUARTERLY"


class Kind(Enum):
    # the perpetual asset kind
    PERPETUAL = "PERPETUAL"
    # the future asset kind
    FUTURE = "FUTURE"
    # the call option asset kind
    CALL = "CALL"
    # the put option asset kind
    PUT = "PUT"


class MarginType(Enum):
    # Simple Cross Margin Mode: all assets have a predictable margin impact, the whole subaccount shares a single margin
    SIMPLE_CROSS_MARGIN = "SIMPLE_CROSS_MARGIN"
    # Portfolio Cross Margin Mode: asset margin impact is analysed on portfolio level, the whole subaccount shares a single margin
    PORTFOLIO_CROSS_MARGIN = "PORTFOLIO_CROSS_MARGIN"


class OrderRejectReason(Enum):
    # order is not cancelled or rejected
    UNSPECIFIED = "UNSPECIFIED"
    # client called a Cancel API
    CLIENT_CANCEL = "CLIENT_CANCEL"
    # client called a Bulk Cancel API
    CLIENT_BULK_CANCEL = "CLIENT_BULK_CANCEL"
    # client called a Session Cancel API, or set the WebSocket connection to 'cancelOrdersOnTerminate'
    CLIENT_SESSION_END = "CLIENT_SESSION_END"
    # the market order was cancelled after no/partial fill. Lower precedence than other TimeInForce cancel reasons
    MARKET_CANCEL = "MARKET_CANCEL"
    # the IOC order was cancelled after no/partial fill
    IOC_CANCEL = "IOC_CANCEL"
    # the AON order was cancelled as it could not be fully matched
    AON_CANCEL = "AON_CANCEL"
    # the FOK order was cancelled as it could not be fully matched
    FOK_CANCEL = "FOK_CANCEL"
    # the order was cancelled as it has expired
    EXPIRED = "EXPIRED"
    # the post-only order could not be posted into the orderbook
    FAIL_POST_ONLY = "FAIL_POST_ONLY"
    # the reduce-only order would have caused position size to increase
    FAIL_REDUCE_ONLY = "FAIL_REDUCE_ONLY"
    # the order was cancelled due to market maker protection trigger
    MM_PROTECTION = "MM_PROTECTION"
    # the order was cancelled due to self-trade protection trigger
    SELF_TRADE_PROTECTION = "SELF_TRADE_PROTECTION"
    # the order matched with another order from the same sub account
    SELF_MATCHED_SUBACCOUNT = "SELF_MATCHED_SUBACCOUNT"
    # an active order on your sub account shares the same clientOrderId
    OVERLAPPING_CLIENT_ORDER_ID = "OVERLAPPING_CLIENT_ORDER_ID"
    # the order will bring the sub account below initial margin requirement
    BELOW_MARGIN = "BELOW_MARGIN"
    # the sub account is liquidated (and all open orders are cancelled by Gravity)
    LIQUIDATION = "LIQUIDATION"
    # instrument is invalid or not found on Gravity
    INSTRUMENT_INVALID = "INSTRUMENT_INVALID"
    # instrument is no longer tradable on Gravity. (typically due to a market halt, or instrument expiry)
    INSTRUMENT_DEACTIVATED = "INSTRUMENT_DEACTIVATED"
    # system failover resulting in loss of order state
    SYSTEM_FAILOVER = "SYSTEM_FAILOVER"
    # the credentials used (userSession/apiKeySession/walletSignature) is not authorised to perform the action
    UNAUTHORISED = "UNAUTHORISED"
    # the session key used to sign the order expired
    SESSION_KEY_EXPIRED = "SESSION_KEY_EXPIRED"
    # the subaccount does not exist
    SUB_ACCOUNT_NOT_FOUND = "SUB_ACCOUNT_NOT_FOUND"
    # the signature used to sign the order has no trade permission
    NO_TRADE_PERMISSION = "NO_TRADE_PERMISSION"
    # the order payload does not contain a supported TimeInForce value
    UNSUPPORTED_TIME_IN_FORCE = "UNSUPPORTED_TIME_IN_FORCE"
    # the order has multiple legs, but multiple legs are not supported by this venue
    MULTI_LEGGED_ORDER = "MULTI_LEGGED_ORDER"
    # the order would have caused the subaccount to exceed the max position size
    EXCEED_MAX_POSITION_SIZE = "EXCEED_MAX_POSITION_SIZE"
    # the signature supplied is more than 30 days in the future
    EXCEED_MAX_SIGNATURE_EXPIRATION = "EXCEED_MAX_SIGNATURE_EXPIRATION"
    # the market order has a limit price set
    MARKET_ORDER_WITH_LIMIT_PRICE = "MARKET_ORDER_WITH_LIMIT_PRICE"
    # client cancel on disconnect triggered
    CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED = "CLIENT_CANCEL_ON_DISCONNECT_TRIGGERED"
    # the OCO counter part order was triggered
    OCO_COUNTER_PART_TRIGGERED = "OCO_COUNTER_PART_TRIGGERED"
    # the remaining order size was cancelled because it exceeded current position size
    REDUCE_ONLY_LIMIT = "REDUCE_ONLY_LIMIT"
    # the order was replaced by a client replace request
    CLIENT_REPLACE = "CLIENT_REPLACE"
    # the derisk order must be an IOC order
    DERISK_MUST_BE_IOC = "DERISK_MUST_BE_IOC"
    # the derisk order must be a reduce-only order
    DERISK_MUST_BE_REDUCE_ONLY = "DERISK_MUST_BE_REDUCE_ONLY"
    # derisk is not supported
    DERISK_NOT_SUPPORTED = "DERISK_NOT_SUPPORTED"
    # the order type is invalid
    INVALID_ORDER_TYPE = "INVALID_ORDER_TYPE"
    # the currency is not defined
    CURRENCY_NOT_DEFINED = "CURRENCY_NOT_DEFINED"


class OrderStatus(Enum):
    # Order has been sent to the matching engine and is pending a transition to open/filled/rejected.
    PENDING = "PENDING"
    # Order is actively matching on the matching engine, could be unfilled or partially filled.
    OPEN = "OPEN"
    # Order is fully filled and hence closed. Taker Orders can transition directly from pending to filled, without going through open.
    FILLED = "FILLED"
    # Order is rejected by matching engine since if fails a particular check (See OrderRejectReason). Once an order is open, it cannot be rejected.
    REJECTED = "REJECTED"
    # Order is cancelled by the user using one of the supported APIs (See OrderRejectReason). Before an order is open, it cannot be cancelled.
    CANCELLED = "CANCELLED"


class TimeInForce(Enum):
    """
    |                       | Must Fill All | Can Fill Partial |
    | -                     | -             | -                |
    | Must Fill Immediately | FOK           | IOC              |
    | Can Fill Till Time    | AON           | GTC              |

    """

    # GTT - Remains open until it is cancelled, or expired
    GOOD_TILL_TIME = "GOOD_TILL_TIME"
    # AON - Either fill the whole order or none of it (Block Trades Only)
    ALL_OR_NONE = "ALL_OR_NONE"
    # IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it
    IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL"
    # FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it
    FILL_OR_KILL = "FILL_OR_KILL"
    # RPI - A GTT + PostOnly maker order, that can only be taken by non-algorithmic UI users.
    RETAIL_PRICE_IMPROVEMENT = "RETAIL_PRICE_IMPROVEMENT"


class TransferType(Enum):
    # Default transfer that has nothing to do with bridging
    UNSPECIFIED = "UNSPECIFIED"
    # Standard transfer that has nothing to do with bridging
    STANDARD = "STANDARD"
    # Fast Arb Deposit Metadata type
    FAST_ARB_DEPOSIT = "FAST_ARB_DEPOSIT"
    # Fast Arb Withdrawal Metadata type
    FAST_ARB_WITHDRAWAL = "FAST_ARB_WITHDRAWAL"
    # Transfer type for non native bridging deposit
    NON_NATIVE_BRIDGE_DEPOSIT = "NON_NATIVE_BRIDGE_DEPOSIT"
    # Transfer type for non native bridging withdrawal
    NON_NATIVE_BRIDGE_WITHDRAWAL = "NON_NATIVE_BRIDGE_WITHDRAWAL"


class TriggerBy(Enum):
    """
    Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order.

    Trigger orders are executed when the selected price type reaches the specified trigger price.Different price types ensure flexibility in executing strategies based on market conditions.


    """

    # no trigger condition
    UNSPECIFIED = "UNSPECIFIED"
    # INDEX - Order is activated when the index price reaches the trigger price
    INDEX = "INDEX"
    # LAST - Order is activated when the last trade price reaches the trigger price
    LAST = "LAST"
    # MID - Order is activated when the mid price reaches the trigger price
    MID = "MID"
    # MARK - Order is activated when the mark price reaches the trigger price
    MARK = "MARK"


class TriggerType(Enum):
    """
    Defines the type of trigger order used in trading, such as Take Profit or Stop Loss.

    Trigger orders allow execution based on pre-defined price conditions rather than immediate market conditions.


    """

    # Not a trigger order. The order executes normally without any trigger conditions.
    UNSPECIFIED = "UNSPECIFIED"
    # Take Profit Order - Executes when the price reaches a specified level to secure profits.
    TAKE_PROFIT = "TAKE_PROFIT"
    # Stop Loss Order - Executes when the price reaches a specified level to limit losses.
    STOP_LOSS = "STOP_LOSS"


class VaultInvestorAction(Enum):
    UNSPECIFIED = "UNSPECIFIED"
    VAULT_INVEST = "VAULT_INVEST"
    VAULT_BURN_LP_TOKEN = "VAULT_BURN_LP_TOKEN"
    VAULT_REDEEM = "VAULT_REDEEM"


class VaultRedemptionReqAgeCategory(Enum):
    """
    Denotes the age category of a given redemption request.


    """

    # This request is at least as old as the minimum redemption period, and is eligible for automated redemption.
    NORMAL = "NORMAL"
    # This request is nearing the maxmimum redemption period and will be factored into pre-order check margin requirements.
    URGENT = "URGENT"
    # This request has exceeded the maximum redemption period and will be considered for forced redemptions.
    OVERDUE = "OVERDUE"
    # This request has yet to exceed the minimum redemption period, and is not yet eligible for automated redemption.
    PRE_MIN = "PRE_MIN"


class Venue(Enum):
    # the trade is cleared on the orderbook venue
    ORDERBOOK = "ORDERBOOK"
    # the trade is cleared on the RFQ venue
    RFQ = "RFQ"


@dataclass
class ApiPositionsRequest:
    # The sub account ID to request for
    sub_account_id: str
    # The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned
    kind: list[Kind] | None = None
    # The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned
    base: list[str] | None = None
    # The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned
    quote: list[str] | None = None


@dataclass
class Positions:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The sub account ID that participated in the trade
    sub_account_id: str
    # The instrument being represented
    instrument: str
    # The size of the position, expressed in base asset decimal units. Negative for short positions
    size: str
    # The notional value of the position, negative for short assets, expressed in quote asset decimal units
    notional: str
    """
    The entry price of the position, expressed in `9` decimals
    Whenever increasing the size of a position, the entry price is updated to the new average entry price
    `new_entry_price = (old_entry_price * old_size + trade_price * trade_size) / (old_size + trade_size)`
    """
    entry_price: str
    """
    The exit price of the position, expressed in `9` decimals
    Whenever decreasing the size of a position, the exit price is updated to the new average exit price
    `new_exit_price = (old_exit_price * old_exit_trade_size + trade_price * trade_size) / (old_exit_trade_size + trade_size)`
    """
    exit_price: str
    # The mark price of the position, expressed in `9` decimals
    mark_price: str
    """
    The unrealized PnL of the position, expressed in quote asset decimal units
    `unrealized_pnl = (mark_price - entry_price) * size`
    """
    unrealized_pnl: str
    """
    The realized PnL of the position, expressed in quote asset decimal units
    `realized_pnl = (exit_price - entry_price) * exit_trade_size`
    """
    realized_pnl: str
    """
    The total PnL of the position, expressed in quote asset decimal units
    `total_pnl = realized_pnl + unrealized_pnl`
    """
    total_pnl: str
    """
    The ROI of the position, expressed as a percentage
    `roi = (total_pnl / (entry_price * abs(size))) * 100^`
    """
    roi: str
    # The index price of the quote currency. (reported in `USD`)
    quote_index_price: str
    # The estimated liquidation price
    est_liquidation_price: str
    # The current leverage value for this position
    leverage: str


@dataclass
class ApiPositionsResponse:
    # The positions matching the request filter
    result: list[Positions]


@dataclass
class ApiFillHistoryRequest:
    """
    Query for all historical fills made by a single account. A single order can be matched multiple times, hence there is no real way to uniquely identify a trade.

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The sub account ID to request for
    sub_account_id: str
    # The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned
    kind: list[Kind] | None = None
    # The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned
    base: list[str] | None = None
    # The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned
    quote: list[str] | None = None
    # The start time to apply in unix nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned
    start_time: str | None = None
    # The end time to apply in unix nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the query from
    cursor: str | None = None


@dataclass
class Fill:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The sub account ID that participated in the trade
    sub_account_id: str
    # The instrument being represented
    instrument: str
    # The side that the subaccount took on the trade
    is_buyer: bool
    # The role that the subaccount took on the trade
    is_taker: bool
    # The number of assets being traded, expressed in base asset decimal units
    size: str
    # The traded price, expressed in `9` decimals
    price: str
    # The mark price of the instrument at point of trade, expressed in `9` decimals
    mark_price: str
    # The index price of the instrument at point of trade, expressed in `9` decimals
    index_price: str
    # The interest rate of the underlying at point of trade, expressed in centibeeps (1/100th of a basis point)
    interest_rate: str
    # [Options] The forward price of the option at point of trade, expressed in `9` decimals
    forward_price: str
    # The realized PnL of the trade, expressed in quote asset decimal units (0 if increasing position size)
    realized_pnl: str
    # The fees paid on the trade, expressed in quote asset decimal unit (negative if maker rebate applied)
    fee: str
    # The fee rate paid on the trade
    fee_rate: str
    """
    A trade identifier, globally unique, and monotonically increasing (not by `1`).
    All trades sharing a single taker execution share the same first component (before `-`), and `event_time`.
    `trade_id` is guaranteed to be consistent across MarketData `Trade` and Trading `Fill`.
    """
    trade_id: str
    # An order identifier
    order_id: str
    # The venue where the trade occurred
    venue: Venue
    """
    A unique identifier for the active order within a subaccount, specified by the client
    This is used to identify the order in the client's system
    This field can be used for order amendment/cancellation, but has no bearing on the smart contract layer
    This field will not be propagated to the smart contract, and should not be signed by the client
    This value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expected
    Gravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]
    To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]

    When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId
    """
    client_order_id: str
    # The address (public key) of the wallet signing the payload
    signer: str
    # If the trade is a RPI trade
    is_rpi: bool
    # Specifies the broker who brokered the order
    broker: BrokerTag | None = None


@dataclass
class ApiFillHistoryResponse:
    # The private trades matching the request asset
    result: list[Fill]
    # The cursor to indicate when to start the query from
    next: str


@dataclass
class ApiFundingPaymentHistoryRequest:
    """
    Query for all historical funding payments made by a single account.

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The sub account ID to request for
    sub_account_id: str
    # The perpetual instrument to filter for
    instrument: str | None = None
    # The start time to apply in unix nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned
    start_time: str | None = None
    # The end time to apply in unix nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the query from
    cursor: str | None = None


@dataclass
class FundingPayment:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The sub account ID that made the funding payment
    sub_account_id: str
    # The perpetual instrument being funded
    instrument: str
    # The currency of the funding payment
    currency: str
    # The amount of the funding payment. Positive if paid, negative if received
    amount: str
    """
    The transaction ID of the funding payment.
    Funding payments can be triggered by a trade, transfer, or liquidation.
    The `tx_id` will match the corresponding `trade_id` or `tx_id`.
    """
    tx_id: str


@dataclass
class ApiFundingPaymentHistoryResponse:
    # The funding payments matching the request asset
    result: list[FundingPayment]
    # The cursor to indicate when to start the query from
    next: str


@dataclass
class ApiSubAccountSummaryRequest:
    # The subaccount ID to filter by
    sub_account_id: str


@dataclass
class SpotBalance:
    # The currency you hold a spot balance in
    currency: str
    # This currency's balance in this trading account.
    balance: str
    # The index price of this currency. (reported in `USD`)
    index_price: str


@dataclass
class SubAccount:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The sub account ID this entry refers to
    sub_account_id: str
    # The type of margin algorithm this subaccount uses
    margin_type: MarginType
    """
    The settlement, margin, and reporting currency of this account.
    This subaccount can only open positions quoted in this currency

    In the future, when users select a Multi-Currency Margin Type, this will be USD
    All other assets are converted to this currency for the purpose of calculating margin
    """
    settle_currency: str
    """
    The total unrealized PnL of all positions owned by this subaccount, denominated in quote currency decimal units.
    `unrealized_pnl = sum(position.unrealized_pnl * position.quote_index_price) / settle_index_price`
    """
    unrealized_pnl: str
    """
    The notional value of your account if all positions are closed, excluding trading fees (reported in `settle_currency`).
    `total_equity = sum(spot_balance.balance * spot_balance.index_price) / settle_index_price + unrealized_pnl`
    """
    total_equity: str
    """
    The `total_equity` required to open positions in the account (reported in `settle_currency`).
    Computation is different depending on account's `margin_type`
    """
    initial_margin: str
    """
    The `total_equity` required to avoid liquidation of positions in the account (reported in `settle_currency`).
    Computation is different depending on account's `margin_type`
    """
    maintenance_margin: str
    """
    The notional value available to transfer out of the trading account into the funding account (reported in `settle_currency`).
    `available_balance = total_equity - initial_margin - min(unrealized_pnl, 0)`
    """
    available_balance: str
    # The list of spot assets owned by this sub account, and their balances
    spot_balances: list[SpotBalance]
    # The list of positions owned by this sub account
    positions: list[Positions]
    # The index price of the settle currency. (reported in `USD`)
    settle_index_price: str
    # The derisk margin of this sub account
    derisk_margin: str
    # The derisk margin to maintenance margin ratio of this sub account
    derisk_to_maintenance_margin_ratio: str
    # Whether this sub account is a vault
    is_vault: bool | None = None
    # Total amount of IM (reported in `settle_currency`) deducted from the vault due to redemptions nearing the end of their redemption period
    vault_im_additions: str | None = None


@dataclass
class ApiSubAccountSummaryResponse:
    # The sub account matching the request sub account
    result: SubAccount


@dataclass
class ApiSubAccountHistoryRequest:
    """
    The request to get the history of a sub account
    SubAccount Summary values are snapshotted once every hour
    No snapshots are taken if the sub account has no activity in the hourly window
    History is preserved only for the last 30 days

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The sub account ID to request for
    sub_account_id: str
    # Start time of sub account history in unix nanoseconds
    start_time: str | None = None
    # End time of sub account history in unix nanoseconds
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the next query from
    cursor: str | None = None


@dataclass
class ApiSubAccountHistoryResponse:
    # The sub account history matching the request sub account
    result: list[SubAccount]
    # The cursor to indicate when to start the next query from
    next: str


@dataclass
class AggregatedAccountSummary:
    # The main account ID of the account to which the summary belongs
    main_account_id: str
    # Total equity of the main (+ sub) account, denominated in USD
    total_equity: str
    # The list of spot assets owned by this main (+ sub) account, and their balances
    spot_balances: list[SpotBalance]


@dataclass
class ApiAggregatedAccountSummaryResponse:
    # The aggregated account summary
    result: AggregatedAccountSummary


@dataclass
class FundingAccountSummary:
    # The main account ID of the account to which the summary belongs
    main_account_id: str
    # Total equity of the main account, denominated in USD
    total_equity: str
    # The list of spot assets owned by this main account, and their balances
    spot_balances: list[SpotBalance]


@dataclass
class ClientTier:
    tier: int
    futures_taker_fee: int
    futures_maker_fee: int
    options_taker_fee: int
    options_maker_fee: int


@dataclass
class ApiFundingAccountSummaryResponse:
    # The funding account summary
    result: FundingAccountSummary
    # Client fee tier at the time of query
    tier: ClientTier


@dataclass
class ApiSetInitialLeverageRequest:
    # The sub account ID to set the leverage for
    sub_account_id: str
    # The instrument to set the leverage for
    instrument: str
    # The leverage to set for the sub account
    leverage: str


@dataclass
class ApiSetInitialLeverageResponse:
    # Whether the leverage was set successfully
    success: bool


@dataclass
class ApiGetAllInitialLeverageRequest:
    # The sub account ID to get the leverage for
    sub_account_id: str


@dataclass
class InitialLeverageResult:
    # The instrument to get the leverage for
    instrument: str
    # The initial leverage of the sub account
    leverage: str
    # The min leverage this sub account can set
    min_leverage: str
    # The max leverage this sub account can set
    max_leverage: str


@dataclass
class ApiGetAllInitialLeverageResponse:
    # The initial leverage of the sub account
    results: list[InitialLeverageResult]


@dataclass
class Signature:
    # The address (public key) of the wallet signing the payload
    signer: str
    # Signature R
    r: str
    # Signature S
    s: str
    # Signature V
    v: int
    # Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days
    expiration: str
    """
    Users can randomly generate this value, used as a signature deconflicting key.
    ie. You can send the same exact instruction twice with different nonces.
    When the same nonce is used, the same payload will generate the same signature.
    Our system will consider the payload a duplicate, and ignore it.
    """
    nonce: int


@dataclass
class ApiSetDeriskToMaintenanceMarginRatioRequest:
    # The sub account ID to set the leverage for
    sub_account_id: str
    # The derisk margin to maintenance margin ratio of this sub account
    ratio: str
    # The signature of this operation
    signature: Signature


@dataclass
class ApiSetDeriskToMaintenanceMarginRatioResponse:
    # Whether the derisk margin to maintenance margin ratio was set successfully
    success: bool


@dataclass
class JSONRPCRequest:
    """
    All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
    If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
    When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
    """

    # The JSON RPC version to use for the request
    jsonrpc: str
    # The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` )
    method: str
    # The parameters for the request
    params: Any
    """
    Optional Field which is used to match the response by the client.
    If not passed, this field will not be returned
    """
    id: int | None = None


@dataclass
class Error:
    # The error code for the request
    code: int
    # The error message for the request
    message: str


@dataclass
class JSONRPCResponse:
    """
    All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
    If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
    """

    # The JSON RPC version to use for the request
    jsonrpc: str
    # The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` )
    method: str
    # The result for the request
    result: Any | None = None
    # The error for the request
    error: Error | None = None
    """
    Optional Field which is used to match the response by the client.
    If not passed, this field will not be returned
    """
    id: int | None = None


@dataclass
class WSSubscribeParams:
    """
    All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.
    When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
    Sequence numbers can be either gateway-specific or global:
    - **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.
    - **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.
    Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.
    """

    # The channel to subscribe to (eg: ticker.s / ticker.d)
    stream: str
    # The list of feeds to subscribe to
    selectors: list[str]
    # Whether to use the global sequence number for the stream
    use_global_sequence_number: bool | None = None


@dataclass
class WSSubscribeResult:
    """
    To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:<ul><li>All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas</li><li>Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots</li><li>First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots</li><li>Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect</li><li>Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.</li></ul>
    When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
    """

    # The channel to subscribe to (eg: ticker.s / ticker.d)
    stream: str
    # The list of feeds subscribed to
    subs: list[str]
    # The list of feeds unsubscribed from
    unsubs: list[str]
    # The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs`
    num_snapshots: list[int]
    # The first sequence number to expect for each subscribed feed. Returned in same order as `subs`
    first_sequence_number: list[str]
    # The sequence number of the most recent message in the stream. Next received sequence number must be larger than this one. Returned in same order as `subs`
    latest_sequence_number: list[str]


@dataclass
class WSUnsubscribeParams:
    # The channel to unsubscribe from (eg: ticker.s / ticker.d)
    stream: str
    # The list of feeds to unsubscribe from
    selectors: list[str]
    # Whether to use the global sequence number for the stream
    use_global_sequence_number: bool | None = None


@dataclass
class WSUnsubscribeResult:
    # The channel to subscribe to (eg: ticker.s / ticker.d)
    stream: str
    # The list of feeds unsubscribed from
    unsubs: list[str]


@dataclass
class WSSubscribeRequestV1Legacy:
    """
    All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.
    If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).
    When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
    """

    # The channel to subscribe to (eg: ticker.s / ticker.d)
    stream: str
    # The list of feeds to subscribe to
    feed: list[str]
    # The method to use for the request (eg: subscribe / unsubscribe)
    method: str
    """
    Optional Field which is used to match the response by the client.
    If not passed, this field will not be returned
    """
    request_id: int | None = None
    # Whether the request is for full data or lite data
    is_full: bool | None = None


@dataclass
class WSSubscribeResponseV1Legacy:
    """
    All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.
    If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.
    To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:<ul><li>All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas</li><li>Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots</li><li>First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots</li><li>Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect</li><li>Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.</li></ul>
    When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.
    """

    # The channel to subscribe to (eg: ticker.s / ticker.d)
    stream: str
    # The list of feeds subscribed to
    subs: list[str]
    # The list of feeds unsubscribed from
    unsubs: list[str]
    # The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs`
    num_snapshots: list[int]
    # The first sequence number to expect for each subscribed feed. Returned in same order as `subs`
    first_sequence_number: list[str]
    # The sequence number of the most recent message in the stream. Next received sequence number must be larger than this one. Returned in same order as `subs`
    latest_sequence_number: list[str]
    """
    Optional Field which is used to match the response by the client.
    If not passed, this field will not be returned
    """
    request_id: int | None = None


@dataclass
class WSOrderbookLevelsFeedSelectorV1:
    """
    Subscribes to aggregated orderbook updates for a single instrument. The `book.s` channel offers simpler integration. To experience higher publishing rates, please use the `book.d` channel.
    Unlike the `book.d` channel which publishes an initial snapshot, then only streams deltas after, the `book.s` channel publishes full snapshots at each feed.

    The Delta feed will work as follows:<ul><li>On subscription, the server will send a full snapshot of all levels of the Orderbook.</li><li>After the snapshot, the server will only send levels that have changed in value.</li></ul>

    Subscription Pattern:<ul><li>Delta - `instrument@rate`</li><li>Snapshot - `instrument@rate-depth`</li></ul>

    Field Semantics:<ul><li>[DeltaOnly] If a level is not updated, level not published</li><li>If a level is updated, {size: '123'}</li><li>If a level is set to zero, {size: '0'}</li><li>Incoming levels will be published as soon as price moves</li><li>Outgoing levels will be published with `size = 0`</li></ul>
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    """
    The minimal rate at which we publish feeds (in milliseconds)
    Delta (50, 100, 500, 1000)
    Snapshot (500, 1000)
    """
    rate: int
    """
    Depth of the order book to be retrieved
    Delta(0 - `unlimited`)
    Snapshot(10, 50, 100, 500)
    """
    depth: int | None = None


@dataclass
class OrderbookLevel:
    # The price of the level, expressed in `9` decimals
    price: str
    # The number of assets offered, expressed in base asset decimal units
    size: str
    # The number of open orders at this level
    num_orders: int


@dataclass
class OrderbookLevels:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The list of best bids up till query depth
    bids: list[OrderbookLevel]
    # The list of best asks up till query depth
    asks: list[OrderbookLevel]


@dataclass
class WSOrderbookLevelsFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # An orderbook levels object matching the request filter
    feed: OrderbookLevels
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSMiniTickerFeedSelectorV1:
    """
    Subscribes to a mini ticker feed for a single instrument. The `mini.s` channel offers simpler integration. To experience higher publishing rates, please use the `mini.d` channel.
    Unlike the `mini.d` channel which publishes an initial snapshot, then only streams deltas after, the `mini.s` channel publishes full snapshots at each feed.

    The Delta feed will work as follows:<ul><li>On subscription, the server will send a full snapshot of the mini ticker.</li><li>After the snapshot, the server will only send deltas of the mini ticker.</li><li>The server will send a delta if any of the fields in the mini ticker have changed.</li></ul>

    Field Semantics:<ul><li>[DeltaOnly] If a field is not updated, {}</li><li>If a field is updated, {field: '123'}</li><li>If a field is set to zero, {field: '0'}</li><li>If a field is set to null, {field: ''}</li></ul>
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    """
    The minimal rate at which we publish feeds (in milliseconds)
    Delta (0 - `raw`, 50, 100, 200, 500, 1000, 5000)
    Snapshot (200, 500, 1000, 5000)
    """
    rate: int


@dataclass
class MiniTicker:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str | None = None
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str | None = None
    # The mark price of the instrument, expressed in `9` decimals
    mark_price: str | None = None
    # The index price of the instrument, expressed in `9` decimals
    index_price: str | None = None
    # The last traded price of the instrument (also close price), expressed in `9` decimals
    last_price: str | None = None
    # The number of assets traded in the last trade, expressed in base asset decimal units
    last_size: str | None = None
    # The mid price of the instrument, expressed in `9` decimals
    mid_price: str | None = None
    # The best bid price of the instrument, expressed in `9` decimals
    best_bid_price: str | None = None
    # The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units
    best_bid_size: str | None = None
    # The best ask price of the instrument, expressed in `9` decimals
    best_ask_price: str | None = None
    # The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units
    best_ask_size: str | None = None


@dataclass
class WSMiniTickerFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # A mini ticker matching the request filter
    feed: MiniTicker
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSTickerFeedSelectorV1:
    """
    Subscribes to a ticker feed for a single instrument. The `ticker.s` channel offers simpler integration. To experience higher publishing rates, please use the `ticker.d` channel.
    Unlike the `ticker.d` channel which publishes an initial snapshot, then only streams deltas after, the `ticker.s` channel publishes full snapshots at each feed.

    The Delta feed will work as follows:<ul><li>On subscription, the server will send a full snapshot of the ticker.</li><li>After the snapshot, the server will only send deltas of the ticker.</li><li>The server will send a delta if any of the fields in the ticker have changed.</li></ul>

    Field Semantics:<ul><li>[DeltaOnly] If a field is not updated, {}</li><li>If a field is updated, {field: '123'}</li><li>If a field is set to zero, {field: '0'}</li><li>If a field is set to null, {field: ''}</li></ul>
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    """
    The minimal rate at which we publish feeds (in milliseconds)
    Delta (100, 200, 500, 1000, 5000)
    Snapshot (500, 1000, 5000)
    """
    rate: int


@dataclass
class Ticker:
    """
    Derived data such as the below, will not be included by default:
      - 24 hour volume (`buyVolume + sellVolume`)
      - 24 hour taker buy/sell ratio (`buyVolume / sellVolume`)
      - 24 hour average trade price (`volumeQ / volumeU`)
      - 24 hour average trade volume (`volume / trades`)
      - 24 hour percentage change (`24hStatChange / 24hStat`)
      - 48 hour statistics (`2 * 24hStat - 24hStatChange`)

    To query for an extended ticker payload, leverage the `greeks` and the `derived` flags.
    Ticker extensions are currently under design to offer you more convenience.
    These flags are only supported on the `Ticker Snapshot` WS endpoint, and on the `Ticker` API endpoint.

    """

    # Time at which the event was emitted in unix nanoseconds
    event_time: str | None = None
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str | None = None
    # The mark price of the instrument, expressed in `9` decimals
    mark_price: str | None = None
    # The index price of the instrument, expressed in `9` decimals
    index_price: str | None = None
    # The last traded price of the instrument (also close price), expressed in `9` decimals
    last_price: str | None = None
    # The number of assets traded in the last trade, expressed in base asset decimal units
    last_size: str | None = None
    # The mid price of the instrument, expressed in `9` decimals
    mid_price: str | None = None
    # The best bid price of the instrument, expressed in `9` decimals
    best_bid_price: str | None = None
    # The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units
    best_bid_size: str | None = None
    # The best ask price of the instrument, expressed in `9` decimals
    best_ask_price: str | None = None
    # The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units
    best_ask_size: str | None = None
    # The current funding rate of the instrument, expressed in percentage points
    funding_rate_8h_curr: str | None = None
    # The average funding rate of the instrument (over last 8h), expressed in percentage points
    funding_rate_8h_avg: str | None = None
    # The interest rate of the underlying, expressed in centibeeps (1/100th of a basis point)
    interest_rate: str | None = None
    # [Options] The forward price of the option, expressed in `9` decimals
    forward_price: str | None = None
    # The 24 hour taker buy volume of the instrument, expressed in base asset decimal units
    buy_volume_24h_b: str | None = None
    # The 24 hour taker sell volume of the instrument, expressed in base asset decimal units
    sell_volume_24h_b: str | None = None
    # The 24 hour taker buy volume of the instrument, expressed in quote asset decimal units
    buy_volume_24h_q: str | None = None
    # The 24 hour taker sell volume of the instrument, expressed in quote asset decimal units
    sell_volume_24h_q: str | None = None
    # The 24 hour highest traded price of the instrument, expressed in `9` decimals
    high_price: str | None = None
    # The 24 hour lowest traded price of the instrument, expressed in `9` decimals
    low_price: str | None = None
    # The 24 hour first traded price of the instrument, expressed in `9` decimals
    open_price: str | None = None
    # The open interest in the instrument, expressed in base asset decimal units
    open_interest: str | None = None
    # The ratio of accounts that are net long vs net short on this instrument
    long_short_ratio: str | None = None


@dataclass
class WSTickerFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # A ticker matching the request filter
    feed: Ticker
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSTradeFeedSelectorV1:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The limit to query for. Valid values are (50, 200, 500, 1000). Default is 50
    limit: int


@dataclass
class Trade:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # If taker was the buyer on the trade
    is_taker_buyer: bool
    # The number of assets being traded, expressed in base asset decimal units
    size: str
    # The traded price, expressed in `9` decimals
    price: str
    # The mark price of the instrument at point of trade, expressed in `9` decimals
    mark_price: str
    # The index price of the instrument at point of trade, expressed in `9` decimals
    index_price: str
    # The interest rate of the underlying at point of trade, expressed in centibeeps (1/100th of a basis point)
    interest_rate: str
    # [Options] The forward price of the option at point of trade, expressed in `9` decimals
    forward_price: str
    """
    A trade identifier, globally unique, and monotonically increasing (not by `1`).
    All trades sharing a single taker execution share the same first component (before `-`), and `event_time`.
    `trade_id` is guaranteed to be consistent across MarketData `Trade` and Trading `Fill`.
    """
    trade_id: str
    # The venue where the trade occurred
    venue: Venue
    # If the trade is a RPI trade
    is_rpi: bool


@dataclass
class WSTradeFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # A public trade matching the request filter
    feed: Trade
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSCandlestickFeedSelectorV1:
    """
    Subscribes to a stream of Kline/Candlestick updates for an instrument. A Kline is uniquely identified by its open time.
    A new Kline is published every interval (if it exists). Upon subscription, the server will send the 5 most recent Kline for the requested interval.
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The interval of each candlestick
    interval: CandlestickInterval
    # The type of candlestick data to retrieve
    type: CandlestickType


@dataclass
class Candlestick:
    # Open time of kline bar in unix nanoseconds
    open_time: str
    # Close time of kline bar in unix nanosecond
    close_time: str
    # The open price, expressed in underlying currency resolution units
    open: str
    # The close price, expressed in underlying currency resolution units
    close: str
    # The high price, expressed in underlying currency resolution units
    high: str
    # The low price, expressed in underlying currency resolution units
    low: str
    # The underlying volume transacted, expressed in base asset decimal units
    volume_b: str
    # The quote volume transacted, expressed in quote asset decimal units
    volume_q: str
    # The number of trades transacted
    trades: int
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str


@dataclass
class WSCandlestickFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # A candlestick entry matching the request filters
    feed: Candlestick
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSUnsubscribeAllParams:
    pass


@dataclass
class StreamReference:
    # The channel to subscribe to (eg: ticker.s / ticker.d)
    stream: str
    # The list of selectors for the stream
    selectors: list[str]


@dataclass
class WSUnsubscribeAllResult:
    # The list of stream references unsubscribed from
    stream_reference: list[StreamReference]


@dataclass
class WSListStreamsParams:
    pass


@dataclass
class WSListStreamsResult:
    # The list of stream references  the connection is connected to
    stream_reference: list[StreamReference]


@dataclass
class ApiOrderbookLevelsRequest:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # Depth of the order book to be retrieved (10, 50, 100, 500)
    depth: int


@dataclass
class ApiOrderbookLevelsResponse:
    # The orderbook levels objects matching the request asset
    result: OrderbookLevels


@dataclass
class ApiMiniTickerRequest:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str


@dataclass
class ApiMiniTickerResponse:
    # The mini ticker matching the request asset
    result: MiniTicker


@dataclass
class ApiTickerRequest:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str


@dataclass
class ApiTickerResponse:
    # The mini ticker matching the request asset
    result: Ticker


@dataclass
class ApiTradeRequest:
    """
    Retrieves up to 1000 of the most recent trades in any given instrument. Do not use this to poll for data -- a websocket subscription is much more performant, and useful.
    This endpoint offers public trading data, use the Trading APIs instead to query for your personalized trade tape.
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The limit to query for. Defaults to 500; Max 1000
    limit: int


@dataclass
class ApiTradeResponse:
    # The public trades matching the request asset
    result: list[Trade]


@dataclass
class ApiTradeHistoryRequest:
    """
    Perform historical lookup of public trades in any given instrument.
    This endpoint offers public trading data, use the Trading APIs instead to query for your personalized trade tape.
    Only data from the last three months will be retained.

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The start time to apply in nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned
    start_time: str | None = None
    # The end time to apply in nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the query from
    cursor: str | None = None


@dataclass
class ApiTradeHistoryResponse:
    # The public trades matching the request asset
    result: list[Trade]
    # The cursor to indicate when to start the next query from
    next: str | None = None


@dataclass
class ApiGetInstrumentRequest:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str


@dataclass
class Instrument:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The asset ID used for instrument signing.
    instrument_hash: str
    # The base currency
    base: str
    # The quote currency
    quote: str
    # The kind of instrument
    kind: Kind
    # Venues that this instrument can be traded at
    venues: list[Venue]
    # The settlement period of the instrument
    settlement_period: InstrumentSettlementPeriod
    # The smallest denomination of the base asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1)
    base_decimals: int
    # The smallest denomination of the quote asset supported by GRVT (+3 represents 0.001, -3 represents 1000, 0 represents 1)
    quote_decimals: int
    # The size of a single tick, expressed in price decimal units
    tick_size: str
    # The minimum contract size, expressed in base asset decimal units
    min_size: str
    # Creation time in unix nanoseconds
    create_time: str
    # The maximum position size, expressed in base asset decimal units
    max_position_size: str


@dataclass
class ApiGetInstrumentResponse:
    # The instrument matching the request asset
    result: Instrument


@dataclass
class ApiGetFilteredInstrumentsRequest:
    # The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned
    kind: list[Kind] | None = None
    # The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned
    base: list[str] | None = None
    # The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned
    quote: list[str] | None = None
    # Request for active instruments only
    is_active: bool | None = None
    # The limit to query for. Defaults to 500; Max 100000
    limit: int | None = None


@dataclass
class ApiGetFilteredInstrumentsResponse:
    # The instruments matching the request filter
    result: list[Instrument]


@dataclass
class ApiGetCurrencyRequest:
    pass


@dataclass
class CurrencyDetail:
    # The integer value of the currency
    id: int
    # The name of the currency
    symbol: str
    # The balance decimals of the currency
    balance_decimals: int
    # The quantity multiplier of the currency
    quantity_multiplier: str


@dataclass
class ApiGetCurrencyResponse:
    # The list of currencies
    result: list[CurrencyDetail]


@dataclass
class ApiCandlestickRequest:
    """
    Kline/Candlestick bars for an instrument. Klines are uniquely identified by their instrument, type, interval, and open time.

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The interval of each candlestick
    interval: CandlestickInterval
    # The type of candlestick data to retrieve
    type: CandlestickType
    # Start time of kline data in unix nanoseconds
    start_time: str | None = None
    # End time of kline data in unix nanoseconds
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the query from
    cursor: str | None = None


@dataclass
class ApiCandlestickResponse:
    # The candlestick result set for given interval
    result: list[Candlestick]
    # The cursor to indicate when to start the next query from
    next: str | None = None


@dataclass
class ApiFundingRateRequest:
    """
    Lookup the historical funding rate of a perpetual future.

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # Start time of funding rate in unix nanoseconds
    start_time: str | None = None
    # End time of funding rate in unix nanoseconds
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the query from
    cursor: str | None = None


@dataclass
class FundingRate:
    # The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>
    instrument: str
    # The funding rate of the instrument, expressed in percentage points
    funding_rate: str
    # The funding timestamp of the funding rate, expressed in unix nanoseconds
    funding_time: str
    # The mark price of the instrument at funding timestamp, expressed in `9` decimals
    mark_price: str
    # The 8h average funding rate of the instrument, expressed in percentage points
    funding_rate_8_h_avg: str


@dataclass
class ApiFundingRateResponse:
    # The funding rate result set for given interval
    result: list[FundingRate]
    # The cursor to indicate when to start the next query from
    next: str | None = None


@dataclass
class ApiGetAllInstrumentsRequest:
    # Fetch only active instruments
    is_active: bool | None = None


@dataclass
class ApiGetAllInstrumentsResponse:
    # List of instruments
    result: list[Instrument]


@dataclass
class ApiQueryVaultManagerInvestorHistoryRequest:
    # The unique identifier of the vault to filter by
    vault_id: str
    # Whether to only return investments made by the manager
    only_own_investments: bool


@dataclass
class ApiVaultInvestorHistory:
    # Time at which the event was emitted in unix nanoseconds
    event_time: str
    # The off chain account id of the investor, only visible to the manager
    off_chain_account_id: str
    # The unique identifier of the vault.
    vault_id: str
    # The type of transaction that occurred. List of types: vaultInvest, vaultBurnLpToken, vaultRedeem
    type: VaultInvestorAction
    # The price of the vault LP tokens at the time of the event.
    price: str
    # The amount of Vault LP tokens invested or redeemed.
    size: str
    # The realized PnL of the vault.
    realized_pnl: str
    # The performance fee of the vault.
    performance_fee: str


@dataclass
class ApiQueryVaultManagerInvestorHistoryResponse:
    # The list of vault investor history belong to the manager
    result: list[ApiVaultInvestorHistory]


@dataclass
class OrderLeg:
    # The instrument to trade in this leg
    instrument: str
    # The total number of assets to trade in this leg, expressed in base asset decimal units.
    size: str
    # Specifies if the order leg is a buy or sell
    is_buying_asset: bool
    """
    The limit price of the order leg, expressed in `9` decimals.
    This is the number of quote currency units to pay/receive for this leg.
    This should be `null/0` if the order is a market order
    """
    limit_price: str | None = None


@dataclass
class TPSLOrderMetadata:
    """
    Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.

    ### Fields:
    - **triggerBy**: Defines the price type that activates the order (e.g., index price).
    - **triggerPrice**: The price at which the order is triggered, expressed in `9` decimal precision.


    """

    # Defines the price type that activates a Take Profit (TP) or Stop Loss (SL) order
    trigger_by: TriggerBy
    # The Trigger Price of the order, expressed in `9` decimals.
    trigger_price: str
    # If True, the order will close the position when the trigger price is reached
    close_position: bool


@dataclass
class TriggerOrderMetadata:
    """
    Contains metadata related to trigger orders, such as Take Profit (TP) or Stop Loss (SL).

    Trigger orders are used to automatically execute an order when a predefined price condition is met, allowing traders to implement risk management strategies.


    """

    # Type of the trigger order. eg: Take Profit, Stop Loss, etc
    trigger_type: TriggerType
    """
    Contains metadata for Take Profit (TP) and Stop Loss (SL) trigger orders.


    """
    tpsl: TPSLOrderMetadata


@dataclass
class OrderMetadata:
    """
    Metadata fields are used to support Backend only operations. These operations are not trustless by nature.
    Hence, fields in here are never signed, and is never transmitted to the smart contract.
    """

    """
    A unique identifier for the active order within a subaccount, specified by the client
    This is used to identify the order in the client's system
    This field can be used for order amendment/cancellation, but has no bearing on the smart contract layer
    This field will not be propagated to the smart contract, and should not be signed by the client
    This value must be unique for all active orders in a subaccount, or amendment/cancellation will not work as expected
    Gravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]
    To prevent any conflicts, client machines should generate a random clientOrderID in the range [2^63, 2^64 - 1]

    When GRVT Backend receives an order with an overlapping clientOrderID, we will reject the order with rejectReason set to overlappingClientOrderId
    """
    client_order_id: str
    # [Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds
    create_time: str | None = None
    # Trigger fields are used to support any type of trigger order such as TP/SL
    trigger: TriggerOrderMetadata | None = None
    # Specifies the broker who brokered the order
    broker: BrokerTag | None = None


@dataclass
class OrderState:
    # The status of the order
    status: OrderStatus
    # The reason for rejection or cancellation
    reject_reason: OrderRejectReason
    # The number of assets available for orderbook/RFQ matching. Sorted in same order as Order.Legs
    book_size: list[str]
    # The total number of assets traded. Sorted in same order as Order.Legs
    traded_size: list[str]
    # Time at which the order was updated by GRVT, expressed in unix nanoseconds
    update_time: str
    # The average fill price of the order. Sorted in same order as Order.Legs
    avg_fill_price: list[str]


@dataclass
class Order:
    """
    Order is a typed payload used throughout the GRVT platform to express all orderbook, RFQ, and liquidation orders.
    GRVT orders are capable of expressing both single-legged, and multi-legged orders by default.
    This increases the learning curve slightly but reduces overall integration load, since the order payload is used across all GRVT trading venues.
    Given GRVT's trustless settlement model, the Order payload also carries the signature, required to trade the order on our ZKSync Hyperchain.

    All fields in the Order payload (except `id`, `metadata`, and `state`) are trustlessly enforced on our Hyperchain.
    This minimizes the amount of trust users have to offer to GRVT
    """

    # The subaccount initiating the order
    sub_account_id: str
    """
    Four supported types of orders: GTT, IOC, AON, FOK:<ul>
    <li>PARTIAL EXECUTION = GTT / IOC - allows partial size execution on each leg</li>
    <li>FULL EXECUTION = AON / FOK - only allows full size execution on all legs</li>
    <li>TAKER ONLY = IOC / FOK - only allows taker orders</li>
    <li>MAKER OR TAKER = GTT / AON - allows maker or taker orders</li>
    </ul>Exchange only supports (GTT, IOC, FOK)
    RFQ Maker only supports (GTT, AON), RFQ Taker only supports (FOK)
    """
    time_in_force: TimeInForce
    """
    The legs present in this order
    The legs must be sorted by Asset.Instrument/Underlying/Quote/Expiration/StrikePrice
    """
    legs: list[OrderLeg]
    # The signature approving this order
    signature: Signature
    # Order Metadata, ignored by the smart contract, and unsigned by the client
    metadata: OrderMetadata
    # [Filled by GRVT Backend] A unique 128-bit identifier for the order, deterministically generated within the GRVT backend
    order_id: str | None = None
    """
    If the order is a market order
    Market Orders do not have a limit price, and are always executed according to the maker order price.
    Market Orders must always be taker orders
    """
    is_market: bool | None = None
    """
    If True, Order must be a maker order. It has to fill the orderbook instead of match it.
    If False, Order can be either a maker or taker order. <b>In this case, order creation is currently subject to a speedbump of 25ms to ensure orders are matched against updated orderbook quotes.</b>

    |               | Must Fill All | Can Fill Partial |
    | -             | -             | -                |
    | Must Be Taker | FOK + False   | IOC + False      |
    | Can Be Either | AON + False   | GTC + False      |
    | Must Be Maker | AON + True    | GTC + True       |

    """
    post_only: bool | None = None
    # If True, Order must reduce the position size, or be cancelled
    reduce_only: bool | None = None
    # [Filled by GRVT Backend] The current state of the order, ignored by the smart contract, and unsigned by the client
    state: OrderState | None = None


@dataclass
class ApiCreateOrderRequest:
    # The order to create
    order: Order


@dataclass
class ApiCreateOrderResponse:
    # The created order
    result: Order


@dataclass
class ApiCancelOrderRequest:
    # The subaccount ID cancelling the order
    sub_account_id: str
    # Cancel the order with this `order_id`
    order_id: str | None = None
    # Cancel the order with this `client_order_id`
    client_order_id: str | None = None
    """
    Specifies the time-to-live (in milliseconds) for this cancellation.
    During this period, any order creation with a matching `client_order_id` will be cancelled and not be added to the GRVT matching engine.
    This mechanism helps mitigate time-of-flight issues where cancellations might arrive before the corresponding orders.
    Hence, cancellation by `order_id` ignores this field as the exchange can only assign `order_id`s to already-processed order creations.
    The duration cannot be negative, is rounded down to the nearest 100ms (e.g., `'670'` -> `'600'`, `'30'` -> `'0'`) and capped at 5 seconds (i.e., `'5000'`).
    Value of `'0'` or omission results in the default time-to-live value being applied.
    If the caller requests multiple successive cancellations for a given order, such that the time-to-live windows overlap, only the first request will be considered.

    """
    time_to_live_ms: str | None = None


@dataclass
class ApiCancelAllOrdersRequest:
    # The subaccount ID cancelling all orders
    sub_account_id: str
    # The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be cancelled
    kind: list[Kind] | None = None
    # The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be cancelled
    base: list[str] | None = None
    # The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be cancelled
    quote: list[str] | None = None


@dataclass
class ApiOpenOrdersRequest:
    # The subaccount ID to filter by
    sub_account_id: str
    # The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned
    kind: list[Kind] | None = None
    # The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned
    base: list[str] | None = None
    # The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned
    quote: list[str] | None = None


@dataclass
class ApiOpenOrdersResponse:
    # The Open Orders matching the request filter
    result: list[Order]


@dataclass
class ApiOrderHistoryRequest:
    """
    Retrieves the order history for the account.

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The subaccount ID to filter by
    sub_account_id: str
    # The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned
    kind: list[Kind] | None = None
    # The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned
    base: list[str] | None = None
    # The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned
    quote: list[str] | None = None
    # The start time to apply in nanoseconds. If nil, this defaults to all start times. Otherwise, only entries matching the filter will be returned
    start_time: str | None = None
    # The end time to apply in nanoseconds. If nil, this defaults to all end times. Otherwise, only entries matching the filter will be returned
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the query from
    cursor: str | None = None


@dataclass
class ApiOrderHistoryResponse:
    # The Open Orders matching the request filter
    result: list[Order]
    # The cursor to indicate when to start the query from
    next: str


@dataclass
class EmptyRequest:
    pass


@dataclass
class Ack:
    # Gravity has acknowledged that the request has been successfully received and it will process it in the backend
    ack: bool


@dataclass
class AckResponse:
    # The Ack Object
    result: Ack


@dataclass
class ApiGetOrderRequest:
    # The subaccount ID to filter by
    sub_account_id: str
    # Filter for `order_id`
    order_id: str | None = None
    # Filter for `client_order_id`
    client_order_id: str | None = None


@dataclass
class ApiGetOrderResponse:
    # The order object for the requested filter
    result: Order


@dataclass
class ApiCancelOnDisconnectRequest:
    """
    Auto-Cancel All Open Orders when the countdown time hits zero.

    Market Maker inputs a countdown time parameter in milliseconds (e.g. 120000 for 120s) rounded down to the smallest second follows the following logic:
      - Market Maker initially entered a value between 0 -> 1000, which is rounded to 0: will result in termination of their COD
      - Market Maker initially entered a value between 1001 -> 300_000, which is rounded to the nearest second: will result in refresh of their COD
      - Market Maker initially entered a value bigger than 300_000, which will result in error (upper bound)
    Market Maker will send a heartbeat message by calling the endpoint at specific intervals (ex. every 30 seconds) to the server to refresh the count down.

    If the server does not receive a heartbeat message within the countdown time, it will cancel all open orders for the specified Sub Account ID.
    """

    # The subaccount ID cancelling the orders for
    sub_account_id: str
    """
    Countdown time in milliseconds (ex. 120000 for 120s).

    0 to disable the timer.

    Does not accept negative values.

    Minimum acceptable value is 1,000.

    Maximum acceptable value is 300,000
    """
    countdown_time: str | None = None


@dataclass
class WSOrderFeedSelectorV1:
    """
    Subscribes to a feed of order updates pertaining to orders made by your account.
    Each Order can be uniquely identified by its `order_id` or `client_order_id`.
    To subscribe to all orders, specify an empty `instrument` (eg. `2345123`).
    Otherwise, specify the `instrument` to only receive orders for that instrument (eg. `2345123-BTC_USDT_Perp`).
    """

    # The subaccount ID to filter by
    sub_account_id: str
    # The instrument filter to apply.
    instrument: str | None = None


@dataclass
class WSOrderFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # The order object being created or updated
    feed: Order
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSOrderStateFeedSelectorV1:
    """
    Subscribes to a feed of order updates pertaining to orders made by your account.
    Unlike the Order Stream, this only streams state updates, drastically improving throughput, and latency.
    Each Order can be uniquely identified by its `order_id` or `client_order_id`.
    To subscribe to all orders, specify an empty `instrument` (eg. `2345123`).
    Otherwise, specify the `instrument` to only receive orders for that instrument (eg. `2345123-BTC_USDT_Perp`).
    """

    # The subaccount ID to filter by
    sub_account_id: str
    # The instrument filter to apply.
    instrument: str | None = None


@dataclass
class OrderStateFeed:
    # A unique 128-bit identifier for the order, deterministically generated within the GRVT backend
    order_id: str
    # A unique identifier for the active order within a subaccount, specified by the client
    client_order_id: str
    # The order state object being created or updated
    order_state: OrderState


@dataclass
class WSOrderStateFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # The Order State Feed
    feed: OrderStateFeed
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSPositionsFeedSelectorV1:
    """
    Subscribes to a feed of position updates.
    Updates get published when a trade is executed, and when leverage configurations are changed for instruments with ongoing positions.
    To subscribe to all positions, specify an empty `instrument` (eg. `2345123`).
    Otherwise, specify the `instrument` to only receive positions for that instrument (eg. `2345123-BTC_USDT_Perp`).
    """

    # The subaccount ID to filter by
    sub_account_id: str
    # The instrument filter to apply.
    instrument: str | None = None


@dataclass
class WSPositionsFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # A Position being created or updated matching the request filter
    feed: Positions
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSFillFeedSelectorV1:
    """
    Subscribes to a feed of private trade updates. This happens when a trade is executed.
    To subscribe to all private trades, specify an empty `instrument` (eg. `2345123`).
    Otherwise, specify the `instrument` to only receive private trades for that instrument (eg. `2345123-BTC_USDT_Perp`).
    """

    # The sub account ID to request for
    sub_account_id: str
    # The instrument filter to apply.
    instrument: str | None = None


@dataclass
class WSFillFeedDataV1:
    # The websocket channel to which the response is sent
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # A private trade matching the request filter
    feed: Fill
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSTransferFeedSelectorV1:
    """
    Subscribes to a feed of transfers. This will execute when there is any transfer to or from the selected account.
    To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).
    To subscribe to a sub account, specify the main account and the sub account dash separated (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a-1920109784202388`).
    """

    # The main account ID to request for
    main_account_id: str
    # The sub account ID to request for
    sub_account_id: str | None = None


@dataclass
class TransferHistory:
    # The transaction ID of the transfer
    tx_id: str
    # The account to transfer from
    from_account_id: str
    # The subaccount to transfer from (0 if transferring from main account)
    from_sub_account_id: str
    # The account to deposit into
    to_account_id: str
    # The subaccount to transfer to (0 if transferring to main account)
    to_sub_account_id: str
    # The token currency to transfer
    currency: str
    # The number of tokens to transfer
    num_tokens: str
    # The signature of the transfer
    signature: Signature
    # The timestamp of the transfer in unix nanoseconds
    event_time: str
    # The type of transfer
    transfer_type: TransferType
    # The metadata of the transfer
    transfer_metadata: str


@dataclass
class WSTransferFeedDataV1:
    # The websocket channel to which the response is sent
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # The transfer history matching the requested filters
    feed: TransferHistory
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSDepositFeedSelectorV1:
    """
    Subscribes to a feed of deposits. This will execute when there is any deposit to selected account.
    To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).
    """

    # The main account ID to request for
    main_account_id: str


@dataclass
class Deposit:
    # The hash of the bridgemint event producing the deposit
    tx_hash: str
    # The account to deposit into
    to_account_id: str
    # The token currency to deposit
    currency: str
    # The number of tokens to deposit
    num_tokens: str


@dataclass
class WSDepositFeedDataV1:
    # The websocket channel to which the response is sent
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # The Deposit object
    feed: Deposit
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSWithdrawalFeedSelectorV1:
    """
    Subscribes to a feed of withdrawals. This will execute when there is any withdrawal from the selected account.
    To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).
    """

    # The main account ID to request for
    main_account_id: str


@dataclass
class Withdrawal:
    # The subaccount to withdraw from
    from_account_id: str
    # The ethereum address to withdraw to
    to_eth_address: str
    # The token currency to withdraw
    currency: str
    # The number of tokens to withdraw
    num_tokens: str
    # The signature of the withdrawal
    signature: Signature


@dataclass
class WSWithdrawalFeedDataV1:
    # The websocket channel to which the response is sent
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # The Withdrawal object
    feed: Withdrawal
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class CancelStatusFeed:
    # The subaccount ID that requested the cancellation
    sub_account_id: str
    # A unique identifier for the active order within a subaccount, specified by the client
    client_order_id: str
    # A unique 128-bit identifier for the order, deterministically generated within the GRVT backend
    order_id: str
    # The user-provided reason for cancelling the order
    reason: OrderRejectReason
    # Status of the cancellation attempt
    cancel_status: CancelStatus
    # [Filled by GRVT Backend] Time at which the cancellation status was updated by GRVT in unix nanoseconds
    update_time: str | None = None


@dataclass
class WSCancelFeedDataV1:
    # Stream name
    stream: str
    # Primary selector
    selector: str
    """
    A sequence number used to determine message order within a stream.
    - If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.
    - If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.
      - A single cluster payload can be multiplexed into multiple stream payloads.
      - To distinguish each stream payload, a `dedupCounter` is included.
      - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.
    """
    sequence_number: str
    # Data relating to the status of the cancellation attempt
    feed: CancelStatusFeed
    # The previous sequence number that determines the message order
    prev_sequence_number: str


@dataclass
class WSCancelFeedSelectorV1:
    """
    Subscribes to a feed of time-to-live expiry events for order cancellations requested by a given subaccount.
    **This stream presently only provides expiry updates for cancel-order requests set with a valid TTL value**.
    Successful order cancellations will reflect as updates published to the [order-state stream](https://api-docs.grvt.io/trading_streams/#order-state).
    _A future release will expand the functionality of this stream to provide more general status updates on order cancellation requests._
    Each Order can be uniquely identified by its `client_order_id`.

    """

    # The subaccount ID to filter by
    sub_account_id: str


@dataclass
class ApiWithdrawalRequest:
    """
    Leverage this API to initialize a withdrawal from GRVT's Hyperchain onto Ethereum.
    Do take note that the bridging process does take time. The GRVT UI will help you keep track of bridging progress, and notify you once its complete.

    If not withdrawing the entirety of your balance, there is a minimum withdrawal amount. Currently that amount is ~25 USDT.
    Withdrawal fees also apply to cover the cost of the Ethereum transaction.
    Note that your funds will always remain in self-custory throughout the withdrawal process. At no stage does GRVT gain control over your funds.
    """

    # The main account to withdraw from
    from_account_id: str
    # The Ethereum wallet to withdraw into
    to_eth_address: str
    # The token currency to withdraw
    currency: str
    # The number of tokens to withdraw, quoted in tokenCurrency decimal units
    num_tokens: str
    # The signature of the withdrawal
    signature: Signature


@dataclass
class ApiTransferRequest:
    """
    This API allows you to transfer funds in multiple different ways<ul>
    <li>Between SubAccounts within your Main Account</li>
    <li>Between your MainAccount and your SubAccounts</li>
    <li>To other MainAccounts that you have previously allowlisted</li>
    </ul><b>Fast Withdrawal Funding Address</b>
    For fast withdrawals, funds must be sent to the designated funding account address. Please ensure you use the correct address based on the environment:
    <b>Production Environment Address:</b>
    <em>[To be updated, not ready yet]</em>
    This address should be specified as the <code>to_account_id</code> in your API requests for transferring funds using the transfer API. Ensure accurate input to avoid loss of funds or use the UI.

    """

    # The main account to transfer from
    from_account_id: str
    # The subaccount to transfer from (0 if transferring from main account)
    from_sub_account_id: str
    # The main account to deposit into
    to_account_id: str
    # The subaccount to transfer to (0 if transferring to main account)
    to_sub_account_id: str
    # The token currency to transfer
    currency: str
    # The number of tokens to transfer, quoted in tokenCurrency decimal units
    num_tokens: str
    # The signature of the transfer
    signature: Signature
    # The type of transfer
    transfer_type: TransferType
    # The metadata of the transfer
    transfer_metadata: str


@dataclass
class ApiTransferAck:
    # Gravity has acknowledged that the transfer has been successfully processed. If true, a `tx_id` will be returned. If false, an error will be returned.
    ack: bool
    # The transaction ID of the transfer. This is only returned if the transfer is successful.
    tx_id: str


@dataclass
class ApiTransferResponse:
    # The Transfer response object
    result: ApiTransferAck


@dataclass
class ApiDepositHistoryRequest:
    """
    The request to get the historical deposits of an account
    The history is returned in reverse chronological order

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The token currency to query for, if nil or empty, return all deposits. Otherwise, only entries matching the filter will be returned
    currency: list[str]
    # The start time to query for in unix nanoseconds
    start_time: str | None = None
    # The end time to query for in unix nanoseconds
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the next query from
    cursor: str | None = None
    # Main account ID being queried. By default, applies the requestor's main account ID.
    main_account_id: str | None = None


@dataclass
class DepositHistory:
    # The L1 txHash of the deposit
    l_1_hash: str
    # The L2 txHash of the deposit
    l_2_hash: str
    # The account to deposit into
    to_account_id: str
    # The token currency to deposit
    currency: str
    # The number of tokens to deposit
    num_tokens: str
    # The timestamp when the deposit was initiated on L1 in unix nanoseconds
    initiated_time: str
    # The timestamp when the deposit was confirmed on L2 in unix nanoseconds
    confirmed_time: str
    # The address of the sender
    from_address: str


@dataclass
class ApiDepositHistoryResponse:
    # The deposit history matching the request account
    result: list[DepositHistory]
    # The cursor to indicate when to start the next query from
    next: str | None = None


@dataclass
class ApiTransferHistoryRequest:
    """
    The request to get the historical transfers of an account
    The history is returned in reverse chronological order

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The token currency to query for, if nil or empty, return all transfers. Otherwise, only entries matching the filter will be returned
    currency: list[str]
    # The start time to query for in unix nanoseconds
    start_time: str | None = None
    # The end time to query for in unix nanoseconds
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the next query from
    cursor: str | None = None
    # The transaction ID to query for
    tx_id: str | None = None
    # Main account ID being queried. By default, applies the requestor's main account ID.
    main_account_id: str | None = None


@dataclass
class ApiTransferHistoryResponse:
    # The transfer history matching the request account
    result: list[TransferHistory]
    # The cursor to indicate when to start the next query from
    next: str | None = None


@dataclass
class ApiWithdrawalHistoryRequest:
    """
    The request to get the historical withdrawals of an account
    The history is returned in reverse chronological order

    Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul>
    """

    # The token currency to query for, if nil or empty, return all withdrawals. Otherwise, only entries matching the filter will be returned
    currency: list[str]
    # The start time to query for in unix nanoseconds
    start_time: str | None = None
    # The end time to query for in unix nanoseconds
    end_time: str | None = None
    # The limit to query for. Defaults to 500; Max 1000
    limit: int | None = None
    # The cursor to indicate when to start the next query from
    cursor: str | None = None
    # Main account ID being queried. By default, applies the requestor's main account ID.
    main_account_id: str | None = None


@dataclass
class WithdrawalHistory:
    # The transaction ID of the withdrawal
    tx_id: str
    # The subaccount to withdraw from
    from_account_id: str
    # The ethereum address to withdraw to
    to_eth_address: str
    # The token currency to withdraw
    currency: str
    # The number of tokens to withdraw
    num_tokens: str
    # The signature of the withdrawal
    signature: Signature
    # The timestamp of the withdrawal in unix nanoseconds
    event_time: str


@dataclass
class ApiWithdrawalHistoryResponse:
    # The withdrawals history matching the request account
    result: list[WithdrawalHistory]
    # The cursor to indicate when to start the next query from
    next: str | None = None


@dataclass
class ApiVaultInvestRequest:
    """
    Request payload for investing in a vault.

    This API allows a client to invest a specified amount of tokens in a particular vault.
    """

    # The address of the main account initiating the investment.
    main_account_id: str
    # The unique identifier of the vault to invest in.
    vault_id: str
    # The currency used for the investment. This should be the vault's quote currency.
    currency: str
    # The investment sum, in terms of the token currency specified (i.e., `numTokens` of '1000' with `tokenCurrency` of 'USDT' denotes investment of 1,000 USDT).
    num_tokens: str
    """
    The digital signature from the investing account.
    This signature must be generated by the main account ID and is used to verify the authenticity of the request.
    The signature must comply with AccountPermExternalTransfer permission.
    """
    signature: Signature


@dataclass
class ApiVaultRedeemRequest:
    """
    Request payload for redeeming from a vault.

    This API allows a client to redeem a specified amount of tokens from a particular vault.
    """

    # The address of the main account initiating the redemption.
    main_account_id: str
    # The unique identifier of the vault to redeem from.
    vault_id: str
    # The currency used for the redemption. This should be the vault's quote currency.
    currency: str
    # The number of shares to redeem.
    num_tokens: str
    """
    The digital signature from the investing account.
    This signature must be generated by the main account ID and is used to verify the authenticity of the request.
    The signature must comply with AccountPermExternalTransfer permission.
    """
    signature: Signature


@dataclass
class ApiVaultRedeemCancelRequest:
    """
    Request payload for canceling a vault redemption.

    This API allows a client to cancel a previously initiated redemption from a vault.
    """

    # The address of the main account initiating the cancellation.
    main_account_id: str
    # The unique identifier of the vault to cancel the redemption from.
    vault_id: str


@dataclass
class ApiVaultViewRedemptionQueueRequest:
    """
    Request payload for a vault manager to view the redemption queue for their vault.

    Fetches the redemption queue for a vault, ordered by descending priority.

    <b>Urgent</b> redemption requests, defined as having been pending >90% of the manager-defined maximum redemption period, have top priority (following insertion order).

    <b>Non-urgent</b> redemption requests are otherwise prioritized by insertion order, <b>unless</b> they are >5x the size of the smallest redemption request.

    E.g., If FIFO ordering (all non-urgent) is 1k -> 50k -> 100k -> 20k -> 10k -> 25k, then priority ordering is 1k -> 10k -> 50k -> 20k -> 100k -> 25k.

    Only displays redemption requests that are eligible for automated redemption, i.e., have been pending for the manager-defined minimum redemption period.
    """

    # The address of the vault manager making the request.
    main_account_id: str
    # The unique identifier of the vault to fetch the redemption queue for.
    vault_id: str


@dataclass
class VaultRedemptionRequest:
    # [Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds
    request_time: str
    # The number of shares to redeem
    num_lp_tokens: str
    # [Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed.
    max_redemption_period_timestamp: str
    # Age category of this redemption request.
    age_category: VaultRedemptionReqAgeCategory
    # `true` if this request belongs to the vault manager, omitted otherwise.
    is_manager: bool | None = None


@dataclass
class ApiVaultViewRedemptionQueueResponse:
    """
    Response payload for a vault manager to view the redemption queue for their vault, ordered by descending priority.

    Excludes requests that have not yet aged past the minmimum redemption period.

    Also includes counters for total redemption sizes pending as well as urgent (refer to API integration guide for more detail on redemption request classifications).


    """

    # Outstanding vault redemption requests, ordered by descending priority. Excludes requests that have not yet aged past the minmimum redemption period.
    redemption_queue: list[VaultRedemptionRequest]
    # Number of shares eligible for automated redemption (held in queue for at least the minimum redemption period).
    pending_redemption_token_count: str
    # Number of shares nearing the maximum redemption period (>= 90% of maximum redemption period).
    urgent_redemption_token_count: str
    # Amount available for automated redemption request servicing (in USD).
    auto_redeemable_balance: str
    # Current share price (in USD).
    share_price: str


@dataclass
class ApiVaultInvestorSummaryRequest:
    """
    Request payload for fetching the summary of a vault investor.

    This API allows a client to retrieve the summary of investments in a specific vault.
    """

    # The address of the main account initiating the request.
    main_account_id: str
    # The unique identifier of the vault to fetch the summary for.
    vault_id: str


@dataclass
class VaultRedemption:
    """
    Vault redemption information.

    This struct contains information about a pending redemption from a vault.
    """

    # The number of LP Tokens requested for redemption.
    num_lp_tokens: str
    # The valuation (in USD) of the redemption request.
    request_valuation: str
    # [Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds
    request_time: str
    # [Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed.
    max_redemption_period_timestamp: str


@dataclass
class VaultInvestorSummary:
    """
    Vault investor summary information.

    This struct contains the summary of investments in a vault.
    """

    # The unique identifier of the vault sub account.
    sub_account_id: str
    # The number of Vault LP tokens held by the investor.
    num_lp_tokens: str
    # The average entry price (in USD) of the vault LP tokens.
    avg_entry_price: str
    # The current price (in USD) of the vault LP tokens.
    current_price: str
    # The current valuation (in USD) of all held vault LP tokens.
    total_equity: str
    # The all-time realized PnL (in USD) that the investor has received from the vault.
    all_time_realized_pnl: str
    # The singleton pending redemption (omitted if none).
    pending_redemption: VaultRedemption | None = None


@dataclass
class ApiVaultInvestorSummaryResponse:
    """
    Response payload for the summary of a vault investor.

    This API provides the summary of investments in a specific vault.
    """

    # The summary of investments in the vault.
    vault_investor_summary: list[VaultInvestorSummary]


@dataclass
class ApiVaultBurnTokensRequest:
    """
    Request payload for burning tokens in a vault.

    This API allows a client to burn a specified amount of tokens in a particular vault.
    """

    # The address of the main account initiating the burn.
    main_account_id: str
    # The unique identifier of the vault to burn tokens from.
    vault_id: str
    # The currency used for the burn. This should be the vault's quote currency.
    currency: str
    # The number of tokens to burn.
    num_tokens: str
    """
    The digital signature from the investing account.
    This signature must be generated by the main account ID and is used to verify the authenticity of the request.
    The signature must comply with AccountPermExternalTransfer permission.
    """
    signature: Signature
