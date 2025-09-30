package txtypes

import (
	"encoding/hex"
	"fmt"
	"strings"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

const templateTransfer = "Transfer\n\nnonce: %s\nfrom: %s\napi key: %s\nto: %s\namount: %s\nfee: %s\nmemo: %s\nOnly sign this message for a trusted client!"

var _ TxInfo = (*L2TransferTxInfo)(nil)

type L2TransferTxInfo struct {
	FromAccountIndex int64
	ApiKeyIndex      uint8

	ToAccountIndex int64
	USDCAmount     int64 // USDCAmount is given with 6 decimals
	Fee            int64
	Memo           [32]byte

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2TransferTxInfo) Validate() error {
	// plus one for treasury account
	if txInfo.FromAccountIndex < MinAccountIndex+1 {
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

	if txInfo.ToAccountIndex < MinAccountIndex+1 {
		return ErrToAccountIndexTooLow
	}
	if txInfo.ToAccountIndex > MaxAccountIndex {
		return ErrToAccountIndexTooHigh
	}

	if txInfo.USDCAmount <= 0 {
		return ErrTransferAmountTooLow
	}
	if txInfo.USDCAmount > MaxTransferAmount {
		return ErrTransferAmountTooHigh
	}

	if txInfo.Fee < 0 {
		return ErrTransferFeeNegative
	}
	if txInfo.Fee > MaxTransferAmount {
		return ErrTransferFeeTooHigh
	}

	if txInfo.Nonce < MinNonce {
		return ErrNonceTooLow
	}

	if txInfo.ExpiredAt < 0 || txInfo.ExpiredAt > MaxTimestamp {
		return ErrExpiredAtInvalid
	}

	return nil
}

func (txInfo *L2TransferTxInfo) GetTxType() uint8 {
	return TxTypeL2Transfer
}

func (txInfo *L2TransferTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2TransferTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2TransferTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 11)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2Transfer))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.FromAccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromInt64(txInfo.ToAccountIndex))
	elems = append(elems, g.FromUint64(uint64(txInfo.USDCAmount)&0xFFFFFFFF)) //nolint:gosec
	elems = append(elems, g.FromUint64(uint64(txInfo.USDCAmount)>>32))        //nolint:gosec
	elems = append(elems, g.FromUint64(uint64(txInfo.Fee)&0xFFFFFFFF))        //nolint:gosec
	elems = append(elems, g.FromUint64(uint64(txInfo.Fee)>>32))               //nolint:gosec

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}

func (txInfo *L2TransferTxInfo) GetL1SignatureBody() string {
	hexMemo := hex.EncodeToString(txInfo.Memo[:])
	hexMemo = strings.Replace(hexMemo, "0x", "", 1)

	signatureBody := fmt.Sprintf(
		templateTransfer,

		getHex10FromUint64(uint64(txInfo.Nonce)),
		getHex10FromUint64(uint64(txInfo.FromAccountIndex)),
		getHex10FromUint64(uint64(txInfo.ApiKeyIndex)),
		getHex10FromUint64(uint64(txInfo.ToAccountIndex)),
		getHex10FromUint64(uint64(txInfo.USDCAmount)),
		getHex10FromUint64(uint64(txInfo.Fee)),
		hexMemo,
	)
	return signatureBody
}
