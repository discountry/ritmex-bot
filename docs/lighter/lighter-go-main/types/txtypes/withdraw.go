package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2WithdrawTxInfo)(nil)

type L2WithdrawTxInfo struct {
	FromAccountIndex int64
	ApiKeyIndex      uint8

	USDCAmount uint64 // USDCAmount is given with 6 decimals

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2WithdrawTxInfo) Validate() error {
	if txInfo.FromAccountIndex < MinAccountIndex {
		return ErrFromAccountIndexTooLow
	}
	if txInfo.FromAccountIndex > MaxAccountIndex {
		return ErrFromAccountIndexTooHigh
	}

	// ApiKeyIndex
	if txInfo.ApiKeyIndex < MinApiKeyIndex {
		return ErrApiKeyIndexTooLow
	}
	if txInfo.ApiKeyIndex > MaxApiKeyIndex {
		return ErrApiKeyIndexTooHigh
	}

	if txInfo.USDCAmount == 0 {
		return ErrWithdrawalAmountTooLow
	}
	if txInfo.USDCAmount > MaxWithdrawalAmount {
		return ErrWithdrawalAmountTooHigh
	}

	if txInfo.Nonce < MinNonce {
		return ErrNonceTooLow
	}

	if txInfo.ExpiredAt < 0 || txInfo.ExpiredAt > MaxTimestamp {
		return ErrExpiredAtInvalid
	}

	return nil
}

func (txInfo *L2WithdrawTxInfo) GetTxType() uint8 {
	return TxTypeL2Withdraw
}

func (txInfo *L2WithdrawTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2WithdrawTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2WithdrawTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 8)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2Withdraw))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.FromAccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromUint64(uint64(txInfo.USDCAmount)&0xFFFFFFFF)) //nolint:gosec
	elems = append(elems, g.FromUint64(uint64(txInfo.USDCAmount)>>32))        //nolint:gosec

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
