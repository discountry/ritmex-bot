package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2UpdateLeverageTxInfo)(nil)

type L2UpdateLeverageTxInfo struct {
	AccountIndex int64
	ApiKeyIndex  uint8

	MarketIndex           uint8
	InitialMarginFraction uint16
	MarginMode            uint8

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2UpdateLeverageTxInfo) GetTxType() uint8 {
	return TxTypeL2UpdateLeverage
}

func (txInfo *L2UpdateLeverageTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2UpdateLeverageTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2UpdateLeverageTxInfo) Validate() error {
	if txInfo.AccountIndex < MinAccountIndex {
		return ErrFromAccountIndexTooLow
	}
	if txInfo.AccountIndex > MaxAccountIndex {
		return ErrFromAccountIndexTooHigh
	}

	// ApiKeyIndex
	if txInfo.ApiKeyIndex < MinApiKeyIndex {
		return ErrApiKeyIndexTooLow
	}
	if txInfo.ApiKeyIndex > MaxApiKeyIndex {
		return ErrApiKeyIndexTooHigh
	}

	// MarketIndex
	if txInfo.MarketIndex < MinMarketIndex {
		return ErrMarketIndexTooLow
	}
	if txInfo.MarketIndex > MaxMarketIndex {
		return ErrMarketIndexTooHigh
	}

	// InitialMarginFraction
	if txInfo.InitialMarginFraction <= 0 {
		return ErrInitialMarginFractionTooLow
	}
	if txInfo.InitialMarginFraction > uint16(MarginFractionTick) { //nolint:gosec
		return ErrInitialMarginFractionTooHigh
	}

	if txInfo.Nonce < MinNonce {
		return ErrNonceTooLow
	}

	if txInfo.ExpiredAt < 0 || txInfo.ExpiredAt > MaxTimestamp {
		return ErrExpiredAtInvalid
	}

	if txInfo.MarginMode != CrossMargin && txInfo.MarginMode != IsolatedMargin {
		return ErrInvalidMarginMode
	}

	return nil
}

func (txInfo *L2UpdateLeverageTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 9)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2UpdateLeverage))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.AccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromInt64(int64(txInfo.MarketIndex)))
	elems = append(elems, g.FromInt64(int64(txInfo.InitialMarginFraction)))
	elems = append(elems, g.FromUint32(uint32(txInfo.MarginMode)))

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
