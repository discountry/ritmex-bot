package txtypes

import (
	"math"

	curve "github.com/elliottech/poseidon_crypto/curve/ecgfp5"
	schnorr "github.com/elliottech/poseidon_crypto/signature/schnorr"
)

type (
	Signature  = schnorr.Signature
	PrivateKey = curve.ECgFp5Scalar
)

const (
	NilApiKeyIndex = MaxApiKeyIndex + 1
)

const (
	TxTypeL2ChangePubKey     = 8
	TxTypeL2CreateSubAccount = 9
	TxTypeL2CreatePublicPool = 10
	TxTypeL2UpdatePublicPool = 11
	TxTypeL2Transfer         = 12
	TxTypeL2Withdraw         = 13
	TxTypeL2CreateOrder      = 14
	TxTypeL2CancelOrder      = 15
	TxTypeL2CancelAllOrders  = 16
	TxTypeL2ModifyOrder      = 17
	TxTypeL2MintShares       = 18
	TxTypeL2BurnShares       = 19
	TxTypeL2UpdateLeverage   = 20

	TxTypeInternalClaimOrder        = 21
	TxTypeInternalCancelOrder       = 22
	TxTypeInternalDeleverage        = 23
	TxTypeInternalExitPosition      = 24
	TxTypeInternalCancelAllOrders   = 25
	TxTypeInternalLiquidatePosition = 26
	TxTypeInternalCreateOrder       = 27

	TxTypeL2CreateGroupedOrders = 28
	TxTypeL2UpdateMargin        = 29
)

// Order Type
const (
	// User set order types
	LimitOrder           = iota
	MarketOrder          = 1
	StopLossOrder        = 2
	StopLossLimitOrder   = 3
	TakeProfitOrder      = 4
	TakeProfitLimitOrder = 5
	TWAPOrder            = 6

	// Internal order types
	TWAPSubOrder     = 7
	LiquidationOrder = 8

	ApiMaxOrderType = TWAPOrder
)

// Order Time-In-Force
const (
	ImmediateOrCancel = iota
	GoodTillTime      = 1
	PostOnly          = 2
)

// Grouping Type
const (
	GroupingType                                = 0
	GroupingType_OneTriggersTheOther            = 1
	GroupingType_OneCancelsTheOther             = 2
	GroupingType_OneTriggersAOneCancelsTheOther = 3
)

// Cancel All Orders Time-In-Force
const (
	ImmediateCancelAll      = iota
	ScheduledCancelAll      = 1
	AbortScheduledCancelAll = 2
)

const (
	HashLength int = 32

	OneUSDC = 1000000

	FeeTick            int64 = 1_000_000
	MarginFractionTick int64 = 10_000
	ShareTick          int64 = 10_000

	MinAccountIndex       int64 = 0
	MaxAccountIndex       int64 = 281474976710654 // (1 << 48) - 2
	MinApiKeyIndex        uint8 = 0
	MaxApiKeyIndex        uint8 = 254             // (1 << 8) - 2
	MaxMasterAccountIndex int64 = 140737488355327 // (1 << 47) - 1

	MinMarketIndex uint8 = 0
	MaxMarketIndex uint8 = 254 // (1 << 8) - 2

	MaxInvestedPublicPoolCount int64 = 16
	InitialPoolShareValue      int64 = 1_000                                             // 0.001 USDC
	MinInitialTotalShares      int64 = 1_000 * (OneUSDC / InitialPoolShareValue)         // 1,000 USDC worth of shares
	MaxInitialTotalShares      int64 = 1_000_000_000 * (OneUSDC / InitialPoolShareValue) // 1,000,000,000 USDC worth of shares
	MaxPoolShares              int64 = (1 << 60) - 1
	MaxBurntShareUSDCValue     int64 = (1 << 60) - 1

	MaxPoolEntryUSDC                = (1 << 56) - 1 // 2^56 - 1 max USDC to invest in a pool
	MinPoolSharesToMintOrBurn int64 = 1
	MaxPoolSharesToMintOrBurn int64 = (1 << 60) - 1

	MinNonce int64 = 0

	MinOrderNonce int64 = 0
	MaxOrderNonce int64 = (1 << 48) - 1

	NilClientOrderIndex int64 = 0
	NilOrderIndex       int64 = 0

	MinClientOrderIndex int64 = 1
	MaxClientOrderIndex int64 = (1 << 48) - 1

	MinOrderIndex int64 = MaxClientOrderIndex + 1
	MaxOrderIndex int64 = (1 << 56) - 1

	MinOrderBaseAmount int64 = 1
	MaxOrderBaseAmount int64 = (1 << 48) - 1
	NilOrderBaseAmount int64 = 0

	NilOrderPrice uint32 = 0
	MinOrderPrice uint32 = 1
	MaxOrderPrice uint32 = (1 << 32) - 1

	MinOrderCancelAllPeriod int64 = 1000 * 60 * 5            // 5 minutes
	MaxOrderCancelAllPeriod int64 = 1000 * 60 * 60 * 24 * 15 // 15 days

	NilOrderExpiry int64 = 0
	MinOrderExpiry int64 = 1
	MaxOrderExpiry int64 = math.MaxInt64

	MinOrderExpiryPeriod int64 = 1000 * 60 * 5            // 5 minutes
	MaxOrderExpiryPeriod int64 = 1000 * 60 * 60 * 24 * 30 // 30 days

	NilOrderTriggerPrice uint32 = 0
	MinOrderTriggerPrice uint32 = 1
	MaxOrderTriggerPrice uint32 = (1 << 32) - 1

	MaxGroupedOrderCount int64 = 3

	MaxTimestamp = (1 << 48) - 1
)

const (
	MaxExchangeUSDC = (1 << 60) - 1

	MinTransferAmount int64 = 1
	MaxTransferAmount int64 = MaxExchangeUSDC

	MinWithdrawalAmount uint64 = 1
	MaxWithdrawalAmount uint64 = MaxExchangeUSDC
)

// Margin Modes
const (
	CrossMargin    = iota
	IsolatedMargin = 1
)

const (
	RemoveFromIsolatedMargin = 0
	AddToIsolatedMargin      = 1
)
