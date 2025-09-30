package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2UpdatePublicPoolTxInfo)(nil)

type L2UpdatePublicPoolTxInfo struct {
	AccountIndex int64 // Master account index
	ApiKeyIndex  uint8

	PublicPoolIndex int64

	Status               uint8
	OperatorFee          int64
	MinOperatorShareRate int64

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2UpdatePublicPoolTxInfo) GetTxType() uint8 {
	return TxTypeL2UpdatePublicPool
}

func (txInfo *L2UpdatePublicPoolTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2UpdatePublicPoolTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2UpdatePublicPoolTxInfo) Validate() error {
	// AccountIndex
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

	// PublicPoolIndex
	if txInfo.PublicPoolIndex < MinAccountIndex {
		return ErrPublicPoolIndexTooLow
	}
	if txInfo.PublicPoolIndex > MaxAccountIndex {
		return ErrPublicPoolIndexTooHigh
	}

	// Status
	if txInfo.Status != 0 && txInfo.Status != 1 {
		return ErrInvalidPoolStatus
	}

	// OperatorFee
	if txInfo.OperatorFee < 0 || txInfo.OperatorFee > FeeTick {
		return ErrInvalidPoolOperatorFee
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

func (txInfo *L2UpdatePublicPoolTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 10)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2UpdatePublicPool))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.AccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromInt64(txInfo.PublicPoolIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.Status)))
	elems = append(elems, g.FromInt64(txInfo.OperatorFee))
	elems = append(elems, g.FromInt64(txInfo.MinOperatorShareRate))

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
