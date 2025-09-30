package types

import (
	"fmt"
	"time"

	"github.com/elliottech/lighter-go/signer"
	"github.com/elliottech/lighter-go/types/txtypes"
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

type TransactOpts struct {
	FromAccountIndex *int64
	ApiKeyIndex      *uint8
	ExpiredAt        int64
	Nonce            *int64
	DryRun           bool
}

type PublicKey = gFp5.Element

type ChangePubKeyReq struct {
	PubKey [40]byte
}

type TransferTxReq struct {
	ToAccountIndex int64
	USDCAmount     int64
	Fee            int64
	Memo           [32]byte
}

type WithdrawTxReq struct {
	USDCAmount uint64
}

type CreateOrderTxReq struct {
	MarketIndex      uint8
	ClientOrderIndex int64
	BaseAmount       int64
	Price            uint32
	IsAsk            uint8
	Type             uint8
	TimeInForce      uint8
	ReduceOnly       uint8
	TriggerPrice     uint32
	OrderExpiry      int64
}

type CreateGroupedOrdersTxReq struct {
	GroupingType uint8
	Orders       []*CreateOrderTxReq
}

type ModifyOrderTxReq struct {
	MarketIndex  uint8
	Index        int64
	BaseAmount   int64
	Price        uint32
	TriggerPrice uint32
}

type CancelOrderTxReq struct {
	MarketIndex uint8
	Index       int64
}

type CancelAllOrdersTxReq struct {
	TimeInForce uint8
	Time        int64
}

type CreatePublicPoolTxReq struct {
	OperatorFee          int64
	InitialTotalShares   int64
	MinOperatorShareRate int64
}

type UpdatePublicPoolTxReq struct {
	PublicPoolIndex      int64
	Status               uint8
	OperatorFee          int64
	MinOperatorShareRate int64
}

type MintSharesTxReq struct {
	PublicPoolIndex int64
	ShareAmount     int64
}

type BurnSharesTxReq struct {
	PublicPoolIndex int64
	ShareAmount     int64
}

type UpdateLeverageTxReq struct {
	MarketIndex           uint8
	InitialMarginFraction uint16
	MarginMode            uint8
}

type UpdateMarginTxReq struct {
	MarketIndex uint8
	USDCAmount  int64
	Direction   uint8
}

func ConstructAuthToken(key signer.Signer, deadline time.Time, ops *TransactOpts) (string, error) {
	if ops.FromAccountIndex == nil {
		return "", fmt.Errorf("missing FromAccountIndex")
	}
	if ops.ApiKeyIndex == nil {
		return "", fmt.Errorf("missing ApiKeyIndex")
	}
	message := fmt.Sprintf("%v:%v:%v", deadline.Unix(), *ops.FromAccountIndex, *ops.ApiKeyIndex)

	msgInField, err := g.ArrayFromCanonicalLittleEndianBytes([]byte(message))
	if err != nil {
		return "", fmt.Errorf("failed to convert bytes to field element. message: %s, error: %w", message, err)
	}

	msgHash := p2.HashToQuinticExtension(msgInField).ToLittleEndianBytes()

	signatureBytes, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return "", err
	}
	signature := ethCommon.Bytes2Hex(signatureBytes)

	return fmt.Sprintf("%v:%v", message, signature), err
}

func ConstructChangePubKeyTx(key signer.Signer, lighterChainId uint32, tx *ChangePubKeyReq, ops *TransactOpts) (*txtypes.L2ChangePubKeyTxInfo, error) {
	convertedTx := ConvertChangePubKeyTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructCreateSubAccountTx(key signer.Signer, lighterChainId uint32, ops *TransactOpts) (*txtypes.L2CreateSubAccountTxInfo, error) {
	convertedTx := ConvertCreateSubAccountTx(ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructCreatePublicPoolTx(key signer.Signer, lighterChainId uint32, tx *CreatePublicPoolTxReq, ops *TransactOpts) (*txtypes.L2CreatePublicPoolTxInfo, error) {
	convertedTx := ConvertCreatePublicPoolTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructUpdatePublicPoolTx(key signer.Signer, lighterChainId uint32, tx *UpdatePublicPoolTxReq, ops *TransactOpts) (*txtypes.L2UpdatePublicPoolTxInfo, error) {
	convertedTx := ConvertUpdatePublicPoolTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructWithdrawTx(key signer.Signer, lighterChainId uint32, tx *WithdrawTxReq, ops *TransactOpts) (*txtypes.L2WithdrawTxInfo, error) {
	convertedTx := ConvertWithdrawTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructCreateOrderTx(key signer.Signer, lighterChainId uint32, tx *CreateOrderTxReq, ops *TransactOpts) (*txtypes.L2CreateOrderTxInfo, error) {
	convertedTx := ConvertCreateOrderTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructL2CreateGroupedOrdersTx(key signer.Signer, lighterChainId uint32, tx *CreateGroupedOrdersTxReq, ops *TransactOpts) (*txtypes.L2CreateGroupedOrdersTxInfo, error) {
	convertedTx := ConvertCreateGroupedOrdersTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructL2CancelOrderTx(key signer.Signer, lighterChainId uint32, tx *CancelOrderTxReq, ops *TransactOpts) (*txtypes.L2CancelOrderTxInfo, error) {
	convertedTx := ConvertCancelOrderTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructL2ModifyOrderTx(key signer.Signer, lighterChainId uint32, tx *ModifyOrderTxReq, ops *TransactOpts) (*txtypes.L2ModifyOrderTxInfo, error) {
	convertedTx := ConvertModifyOrderTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructL2CancelAllOrdersTx(key signer.Signer, lighterChainId uint32, tx *CancelAllOrdersTxReq, ops *TransactOpts) (*txtypes.L2CancelAllOrdersTxInfo, error) {
	convertedTx := ConvertCancelAllOrdersTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructTransferTx(key signer.Signer, lighterChainId uint32, tx *TransferTxReq, ops *TransactOpts) (*txtypes.L2TransferTxInfo, error) {
	convertedTx := ConvertTransferTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructMintSharesTx(key signer.Signer, lighterChainId uint32, tx *MintSharesTxReq, ops *TransactOpts) (*txtypes.L2MintSharesTxInfo, error) {
	convertedTx := ConvertMintSharesTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructBurnSharesTx(key signer.Signer, lighterChainId uint32, tx *BurnSharesTxReq, ops *TransactOpts) (*txtypes.L2BurnSharesTxInfo, error) {
	convertedTx := ConvertBurnSharesTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructUpdateLeverageTx(key signer.Signer, lighterChainId uint32, tx *UpdateLeverageTxReq, ops *TransactOpts) (*txtypes.L2UpdateLeverageTxInfo, error) {
	convertedTx := ConvertUpdateLeverageTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConstructUpdateMarginTx(key signer.Signer, lighterChainId uint32, tx *UpdateMarginTxReq, ops *TransactOpts) (*txtypes.L2UpdateMarginTxInfo, error) {
	convertedTx := ConvertUpdateMarginTx(tx, ops)
	err := convertedTx.Validate()
	if err != nil {
		return nil, err
	}

	msgHash, err := convertedTx.Hash(lighterChainId)
	if err != nil {
		return nil, err
	}

	signature, err := key.Sign(msgHash, p2.NewPoseidon2())
	if err != nil {
		return nil, err
	}

	convertedTx.SignedHash = ethCommon.Bytes2Hex(msgHash)
	convertedTx.Sig = signature
	return convertedTx, nil
}

func ConvertTransferTx(tx *TransferTxReq, ops *TransactOpts) *txtypes.L2TransferTxInfo {
	return &txtypes.L2TransferTxInfo{
		FromAccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:      *ops.ApiKeyIndex,
		ToAccountIndex:   tx.ToAccountIndex,
		USDCAmount:       tx.USDCAmount,
		Fee:              tx.Fee,
		Memo:             tx.Memo,
		ExpiredAt:        ops.ExpiredAt,
		Nonce:            *ops.Nonce,
	}
}

func ConvertCreateOrderTx(tx *CreateOrderTxReq, ops *TransactOpts) *txtypes.L2CreateOrderTxInfo {
	return &txtypes.L2CreateOrderTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		OrderInfo: &txtypes.OrderInfo{MarketIndex: tx.MarketIndex,
			ClientOrderIndex: tx.ClientOrderIndex,
			BaseAmount:       tx.BaseAmount,
			Price:            tx.Price,
			IsAsk:            tx.IsAsk,
			Type:             tx.Type,
			TimeInForce:      tx.TimeInForce,
			ReduceOnly:       tx.ReduceOnly,
			TriggerPrice:     tx.TriggerPrice,
			OrderExpiry:      tx.OrderExpiry,
		},
		ExpiredAt: ops.ExpiredAt,
		Nonce:     *ops.Nonce,
	}
}

func ConvertCreateGroupedOrdersTx(tx *CreateGroupedOrdersTxReq, ops *TransactOpts) *txtypes.L2CreateGroupedOrdersTxInfo {
	ret := &txtypes.L2CreateGroupedOrdersTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		GroupingType: tx.GroupingType,
		Orders:       []*txtypes.OrderInfo{},
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}

	for _, order := range tx.Orders {
		ret.Orders = append(ret.Orders, &txtypes.OrderInfo{
			MarketIndex:      order.MarketIndex,
			ClientOrderIndex: order.ClientOrderIndex,
			BaseAmount:       order.BaseAmount,
			Price:            order.Price,
			IsAsk:            order.IsAsk,
			Type:             order.Type,
			TimeInForce:      order.TimeInForce,
			ReduceOnly:       order.ReduceOnly,
			TriggerPrice:     order.TriggerPrice,
			OrderExpiry:      order.OrderExpiry,
		})
	}
	return ret
}

func ConvertCancelOrderTx(tx *CancelOrderTxReq, ops *TransactOpts) *txtypes.L2CancelOrderTxInfo {
	return &txtypes.L2CancelOrderTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		MarketIndex:  tx.MarketIndex,
		Index:        tx.Index,
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}
}

func ConvertModifyOrderTx(tx *ModifyOrderTxReq, ops *TransactOpts) *txtypes.L2ModifyOrderTxInfo {
	return &txtypes.L2ModifyOrderTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		MarketIndex:  tx.MarketIndex,
		Index:        tx.Index,
		BaseAmount:   tx.BaseAmount,
		Price:        tx.Price,
		TriggerPrice: tx.TriggerPrice,
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}
}

func ConvertCancelAllOrdersTx(tx *CancelAllOrdersTxReq, ops *TransactOpts) *txtypes.L2CancelAllOrdersTxInfo {
	return &txtypes.L2CancelAllOrdersTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		TimeInForce:  tx.TimeInForce,
		Time:         tx.Time,
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}
}

func ConvertWithdrawTx(tx *WithdrawTxReq, ops *TransactOpts) *txtypes.L2WithdrawTxInfo {
	return &txtypes.L2WithdrawTxInfo{
		FromAccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:      *ops.ApiKeyIndex,
		USDCAmount:       tx.USDCAmount,
		ExpiredAt:        ops.ExpiredAt,
		Nonce:            *ops.Nonce,
	}
}

func ConvertChangePubKeyTx(tx *ChangePubKeyReq, ops *TransactOpts) *txtypes.L2ChangePubKeyTxInfo {
	return &txtypes.L2ChangePubKeyTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		PubKey:       tx.PubKey[:],
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}
}

func ConvertCreateSubAccountTx(ops *TransactOpts) *txtypes.L2CreateSubAccountTxInfo {
	return &txtypes.L2CreateSubAccountTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}
}

func ConvertCreatePublicPoolTx(tx *CreatePublicPoolTxReq, ops *TransactOpts) *txtypes.L2CreatePublicPoolTxInfo {
	return &txtypes.L2CreatePublicPoolTxInfo{
		AccountIndex:         *ops.FromAccountIndex,
		ApiKeyIndex:          *ops.ApiKeyIndex,
		OperatorFee:          tx.OperatorFee,
		InitialTotalShares:   tx.InitialTotalShares,
		MinOperatorShareRate: tx.MinOperatorShareRate,
		ExpiredAt:            ops.ExpiredAt,
		Nonce:                *ops.Nonce,
	}
}

func ConvertUpdatePublicPoolTx(tx *UpdatePublicPoolTxReq, ops *TransactOpts) *txtypes.L2UpdatePublicPoolTxInfo {
	return &txtypes.L2UpdatePublicPoolTxInfo{
		AccountIndex:         *ops.FromAccountIndex,
		ApiKeyIndex:          *ops.ApiKeyIndex,
		PublicPoolIndex:      tx.PublicPoolIndex,
		Status:               tx.Status,
		OperatorFee:          tx.OperatorFee,
		MinOperatorShareRate: tx.MinOperatorShareRate,
		ExpiredAt:            ops.ExpiredAt,
		Nonce:                *ops.Nonce,
	}
}

func ConvertMintSharesTx(tx *MintSharesTxReq, ops *TransactOpts) *txtypes.L2MintSharesTxInfo {
	return &txtypes.L2MintSharesTxInfo{
		AccountIndex:    *ops.FromAccountIndex,
		ApiKeyIndex:     *ops.ApiKeyIndex,
		PublicPoolIndex: tx.PublicPoolIndex,
		ShareAmount:     tx.ShareAmount,
		ExpiredAt:       ops.ExpiredAt,
		Nonce:           *ops.Nonce,
	}
}

func ConvertBurnSharesTx(tx *BurnSharesTxReq, ops *TransactOpts) *txtypes.L2BurnSharesTxInfo {
	return &txtypes.L2BurnSharesTxInfo{
		AccountIndex:    *ops.FromAccountIndex,
		ApiKeyIndex:     *ops.ApiKeyIndex,
		PublicPoolIndex: tx.PublicPoolIndex,
		ShareAmount:     tx.ShareAmount,
		ExpiredAt:       ops.ExpiredAt,
		Nonce:           *ops.Nonce,
	}
}

func ConvertUpdateLeverageTx(tx *UpdateLeverageTxReq, ops *TransactOpts) *txtypes.L2UpdateLeverageTxInfo {
	return &txtypes.L2UpdateLeverageTxInfo{
		AccountIndex:          *ops.FromAccountIndex,
		ApiKeyIndex:           *ops.ApiKeyIndex,
		MarketIndex:           tx.MarketIndex,
		InitialMarginFraction: tx.InitialMarginFraction,
		ExpiredAt:             ops.ExpiredAt,
		Nonce:                 *ops.Nonce,
	}
}

func ConvertUpdateMarginTx(tx *UpdateMarginTxReq, ops *TransactOpts) *txtypes.L2UpdateMarginTxInfo {
	return &txtypes.L2UpdateMarginTxInfo{
		AccountIndex: *ops.FromAccountIndex,
		ApiKeyIndex:  *ops.ApiKeyIndex,
		MarketIndex:  tx.MarketIndex,
		USDCAmount:   tx.USDCAmount,
		Direction:    tx.Direction,
		ExpiredAt:    ops.ExpiredAt,
		Nonce:        *ops.Nonce,
	}
}
