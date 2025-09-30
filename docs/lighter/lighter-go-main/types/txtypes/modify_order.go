package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2ModifyOrderTxInfo)(nil)

type L2ModifyOrderTxInfo struct {
	AccountIndex int64
	ApiKeyIndex  uint8

	MarketIndex  uint8
	Index        int64 // Client Order Index or Order Index of the order to modify
	BaseAmount   int64
	Price        uint32
	TriggerPrice uint32

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2ModifyOrderTxInfo) GetTxType() uint8 {
	return TxTypeL2ModifyOrder
}

func (txInfo *L2ModifyOrderTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2ModifyOrderTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2ModifyOrderTxInfo) Validate() error {
	// AccountIndex
	if txInfo.AccountIndex < MinAccountIndex {
		return ErrAccountIndexTooLow
	}
	if txInfo.AccountIndex > MaxAccountIndex {
		return ErrAccountIndexTooHigh
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

	// Index
	if txInfo.Index < MinClientOrderIndex && txInfo.Index < MinOrderIndex {
		return ErrClientOrderIndexTooLow
	}
	if txInfo.Index > MaxClientOrderIndex && txInfo.Index > MaxOrderIndex {
		return ErrClientOrderIndexTooHigh
	}

	// BaseAmount
	if txInfo.BaseAmount != NilOrderBaseAmount && txInfo.BaseAmount < MinOrderBaseAmount {
		return ErrBaseAmountTooLow
	}
	if txInfo.BaseAmount > MaxOrderBaseAmount {
		return ErrBaseAmountTooHigh
	}

	// Price
	if txInfo.Price < MinOrderPrice {
		return ErrPriceTooLow
	}
	if txInfo.Price > MaxOrderPrice {
		return ErrPriceTooHigh
	}

	// TriggerPrice
	if (txInfo.TriggerPrice < MinOrderTriggerPrice || txInfo.TriggerPrice > MaxOrderTriggerPrice) && txInfo.TriggerPrice != NilOrderTriggerPrice {
		return ErrOrderTriggerPriceInvalid
	}

	// Nonce
	if txInfo.Nonce < MinNonce {
		return ErrNonceTooLow
	}

	if txInfo.ExpiredAt < 0 || txInfo.ExpiredAt > MaxTimestamp {
		return ErrExpiredAtInvalid
	}

	return nil
}

func (txInfo *L2ModifyOrderTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 11)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2ModifyOrder))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.AccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromUint32(uint32(txInfo.MarketIndex)))
	elems = append(elems, g.FromInt64(txInfo.Index))
	elems = append(elems, g.FromInt64(txInfo.BaseAmount))
	elems = append(elems, g.FromUint32(txInfo.Price))
	elems = append(elems, g.FromUint32(txInfo.TriggerPrice))

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
