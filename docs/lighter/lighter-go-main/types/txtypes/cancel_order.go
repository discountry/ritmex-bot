package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2CancelOrderTxInfo)(nil)

type L2CancelOrderTxInfo struct {
	AccountIndex int64
	ApiKeyIndex  uint8

	MarketIndex uint8
	Index       int64 // Client Order Index or Order Index of the order to cancel

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2CancelOrderTxInfo) GetTxType() uint8 {
	return TxTypeL2CancelOrder
}

func (txInfo *L2CancelOrderTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2CancelOrderTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2CancelOrderTxInfo) Validate() error {
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
		return ErrOrderIndexTooLow
	}
	if txInfo.Index > MaxClientOrderIndex && txInfo.Index > MaxOrderIndex {
		return ErrOrderIndexTooHigh
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

func (txInfo *L2CancelOrderTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 7)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2CancelOrder))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.AccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromUint32(uint32(txInfo.MarketIndex)))
	elems = append(elems, g.FromInt64(txInfo.Index))

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
