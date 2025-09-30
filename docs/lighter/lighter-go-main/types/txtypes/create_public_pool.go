package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2CreatePublicPoolTxInfo)(nil)

type L2CreatePublicPoolTxInfo struct {
	AccountIndex int64 // Master account index
	ApiKeyIndex  uint8

	OperatorFee          int64
	InitialTotalShares   int64
	MinOperatorShareRate int64

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2CreatePublicPoolTxInfo) GetTxType() uint8 {
	return TxTypeL2CreatePublicPool
}

func (txInfo *L2CreatePublicPoolTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2CreatePublicPoolTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2CreatePublicPoolTxInfo) Validate() error {
	// AccountIndex
	if txInfo.AccountIndex < MinAccountIndex {
		return ErrFromAccountIndexTooLow
	}
	if txInfo.AccountIndex > MaxMasterAccountIndex {
		return ErrFromAccountIndexTooHigh
	}

	// ApiKeyIndex
	if txInfo.ApiKeyIndex < MinApiKeyIndex {
		return ErrApiKeyIndexTooLow
	}
	if txInfo.ApiKeyIndex > MaxApiKeyIndex {
		return ErrApiKeyIndexTooHigh
	}

	// OperatorFee
	if txInfo.OperatorFee < 0 || txInfo.OperatorFee > FeeTick {
		return ErrInvalidPoolOperatorFee
	}

	// InitialTotalShares
	if txInfo.InitialTotalShares <= 0 {
		return ErrPoolInitialTotalSharesTooLow
	}
	if txInfo.InitialTotalShares > MaxInitialTotalShares {
		return ErrPoolInitialTotalSharesTooHigh
	}

	// MinOperatorShareRate
	if txInfo.MinOperatorShareRate < 0 {
		return ErrPoolMinOperatorShareRateTooLow
	}
	if txInfo.MinOperatorShareRate > ShareTick {
		return ErrPoolMinOperatorShareRateTooHigh
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

func (txInfo *L2CreatePublicPoolTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 9)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2CreatePublicPool))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.AccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromInt64(txInfo.OperatorFee))
	elems = append(elems, g.FromInt64(txInfo.InitialTotalShares))
	elems = append(elems, g.FromInt64(txInfo.MinOperatorShareRate))

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
