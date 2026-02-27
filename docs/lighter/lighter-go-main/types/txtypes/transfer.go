package txtypes

import (
	"encoding/hex"
	"fmt"
	"strings"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
	"github.com/ethereum/go-ethereum/common"
)

var _ TxInfo = (*L2TransferTxInfo)(nil)

type L2TransferTxInfo struct {
	FromAccountIndex int64
	ApiKeyIndex      uint8
	ToAccountIndex   int64
	AssetIndex       int16
	FromRouteType    uint8
	ToRouteType      uint8
	Amount           int64
	USDCFee          int64

	Memo       [32]byte
	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	L1Sig      string
	SignedHash string `json:"-"`
}

func (txInfo *L2TransferTxInfo) Validate() error {
	// FromAccountIndex
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

	// ToAccountIndex
	if txInfo.ToAccountIndex < MinAccountIndex {
		return ErrToAccountIndexTooLow
	}
	if txInfo.ToAccountIndex > MaxAccountIndex {
		return ErrToAccountIndexTooHigh
	}

	// AssetIndex
	if txInfo.AssetIndex < MinAssetIndex {
		return ErrAssetIndexTooLow
	}
	if txInfo.AssetIndex > MaxAssetIndex {
		return ErrAssetIndexTooHigh
	}

	// FromRouteType
	if txInfo.FromRouteType != AssetRouteType_Perps && txInfo.FromRouteType != AssetRouteType_Spot {
		return ErrRouteTypeInvalid
	}

	// ToRouteType
	if txInfo.ToRouteType != AssetRouteType_Perps && txInfo.ToRouteType != AssetRouteType_Spot {
		return ErrRouteTypeInvalid
	}

	if txInfo.Amount <= 0 {
		return ErrTransferAmountTooLow
	}
	if txInfo.Amount > MaxTransferAmount {
		return ErrTransferAmountTooHigh
	}

	if txInfo.USDCFee < 0 {
		return ErrTransferFeeNegative
	}
	if txInfo.USDCFee > MaxTransferAmount {
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

func (txInfo *L2TransferTxInfo) GetL1SignatureBody(chainId uint32) string {
	hexMemo := hex.EncodeToString(txInfo.Memo[:])
	hexMemo = strings.Replace(hexMemo, "0x", "", 1)

	signatureBody := fmt.Sprintf(
		TemplateTransfer,
		getHex10FromUint64(uint64(txInfo.Nonce)),
		getHex10FromUint64(uint64(txInfo.FromAccountIndex)),
		getHex10FromUint64(uint64(txInfo.FromRouteType)),
		getHex10FromUint64(uint64(txInfo.ApiKeyIndex)),
		getHex10FromUint64(uint64(txInfo.ToAccountIndex)),
		getHex10FromUint64(uint64(txInfo.ToRouteType)),
		getHex10FromUint64(uint64(txInfo.AssetIndex)),
		getHex10FromUint64(uint64(txInfo.Amount)),  //nolint:gosec
		getHex10FromUint64(uint64(txInfo.USDCFee)), //nolint:gosec
		getHex10FromUint64(uint64(chainId)),        //nolint:gosec
		hexMemo,
	)
	return signatureBody
}

func (txInfo *L2TransferTxInfo) GetL1AddressBySignature(chainId uint32) common.Address {
	return calculateL1AddressBySignature(txInfo.GetL1SignatureBody(chainId), txInfo.L1Sig)
}

func (txInfo *L2TransferTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 14)

	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2Transfer))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.FromAccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromInt64(txInfo.ToAccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.AssetIndex)))
	elems = append(elems, g.FromUint32(uint32(txInfo.FromRouteType)))
	elems = append(elems, g.FromUint32(uint32(txInfo.ToRouteType)))
	elems = append(elems, g.FromUint64((uint64(txInfo.Amount))&0xFFFFFFFF))  //nolint:gosec
	elems = append(elems, g.FromUint64(uint64(txInfo.Amount)>>32))           //nolint:gosec
	elems = append(elems, g.FromUint64((uint64(txInfo.USDCFee))&0xFFFFFFFF)) //nolint:gosec
	elems = append(elems, g.FromUint64((uint64(txInfo.USDCFee))>>32))        //nolint:gosec

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
