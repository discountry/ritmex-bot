package main

import (
	"encoding/hex"
	"fmt"
	"time"
	"unsafe"

	"github.com/elliottech/lighter-go/client"
	"github.com/elliottech/lighter-go/client/http"
	"github.com/elliottech/lighter-go/types"
	"github.com/elliottech/lighter-go/types/txtypes"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

/*
#include <stdlib.h>
#include <stdint.h>
typedef struct {
	char* str;
	char* err;
} StrOrErr;

typedef struct {
	uint8_t txType;
	char* txInfo;
	char* txHash;
	char* messageToSign;
	char* err;
} SignedTxResponse;

typedef struct {
	char* privateKey;
	char* publicKey;
	char* err;
} ApiKeyResponse;

typedef struct {
    uint8_t MarketIndex;
    int64_t ClientOrderIndex;
    int64_t BaseAmount;
    uint32_t Price;
    uint8_t IsAsk;
    uint8_t Type;
    uint8_t TimeInForce;
    uint8_t ReduceOnly;
    uint32_t TriggerPrice;
    int64_t OrderExpiry;
} CreateOrderTxReq;
*/
import "C"

var chainId uint32

func wrapErr(err any) *C.char {
	if err == nil {
		return nil
	}
	return C.CString(fmt.Sprintf("%v", err))
}

func messageToSign(txInfo txtypes.TxInfo) string {
	switch typed := txInfo.(type) {
	case *txtypes.L2ChangePubKeyTxInfo:
		return typed.GetL1SignatureBody()
	case *txtypes.L2TransferTxInfo:
		return typed.GetL1SignatureBody(chainId)
	default:
		return ""
	}
}

func signedTxResponseErr(err any) C.SignedTxResponse {
	return C.SignedTxResponse{err: wrapErr(err)}
}

func signedTxResponsePanic(err any) C.SignedTxResponse {
	return signedTxResponseErr(fmt.Errorf("panic: %v", err))
}

func convertTxInfoToResponse(txInfo txtypes.TxInfo, err error) C.SignedTxResponse {
	if err != nil {
		return signedTxResponseErr(err)
	}
	if txInfo == nil {
		return signedTxResponseErr("nil transaction info")
	}

	txInfoStr, err := txInfo.GetTxInfo()
	if err != nil {
		return signedTxResponseErr(err)
	}

	resp := C.SignedTxResponse{
		txType: C.uint8_t(txInfo.GetTxType()),
		txInfo: C.CString(txInfoStr),
		txHash: C.CString(txInfo.GetTxHash()),
	}

	if msg := messageToSign(txInfo); msg != "" {
		resp.messageToSign = C.CString(msg)
	}

	return resp
}

// getClient returns the go TxClient from the specified cApiKeyIndex and cAccountIndex
func getClient(cApiKeyIndex C.int, cAccountIndex C.longlong) (*client.TxClient, error) {
	apiKeyIndex := uint8(cApiKeyIndex)
	accountIndex := int64(cAccountIndex)
	return client.GetClient(apiKeyIndex, accountIndex)
}

func getTransactOpts(cNonce C.longlong) *types.TransactOpts {
	nonce := int64(cNonce)
	return &types.TransactOpts{
		Nonce: &nonce,
	}
}

//export GenerateAPIKey
func GenerateAPIKey(cSeed *C.char) (ret C.ApiKeyResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = C.ApiKeyResponse{err: wrapErr(fmt.Errorf("panic: %v", r))}
		}
	}()

	seed := C.GoString(cSeed)
	privateKeyStr, publicKeyStr, err := client.GenerateAPIKey(seed)
	if err != nil {
		return C.ApiKeyResponse{err: wrapErr(err)}
	}

	return C.ApiKeyResponse{
		privateKey: C.CString(privateKeyStr),
		publicKey:  C.CString(publicKeyStr),
	}
}

//export CreateClient
func CreateClient(cUrl *C.char, cPrivateKey *C.char, cChainId C.int, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret *C.char) {
	defer func() {
		if r := recover(); r != nil {
			ret = wrapErr(fmt.Errorf("panic: %v", r))
		}
	}()

	url := C.GoString(cUrl)
	privateKey := C.GoString(cPrivateKey)
	chainId = uint32(cChainId)
	apiKeyIndex := uint8(cApiKeyIndex)
	accountIndex := int64(cAccountIndex)

	httpClient := http.NewClient(url)

	_, err := client.CreateClient(httpClient, privateKey, chainId, apiKeyIndex, accountIndex)
	return wrapErr(err)
}

//export CheckClient
func CheckClient(cApiKeyIndex C.int, cAccountIndex C.longlong) (ret *C.char) {
	defer func() {
		if r := recover(); r != nil {
			ret = wrapErr(fmt.Errorf("panic: %v", r))
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return wrapErr(err)
	}

	return wrapErr(c.Check())
}

//export SignChangePubKey
func SignChangePubKey(cPubKey *C.char, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	pubKeyStr := C.GoString(cPubKey)
	pubKeyBytes, err := hexutil.Decode(pubKeyStr)
	if err != nil {
		return signedTxResponseErr(err)
	}
	if len(pubKeyBytes) != 40 {
		return signedTxResponseErr(fmt.Errorf("invalid pub key length. expected 40 but got %v", len(pubKeyBytes)))
	}
	var pubKey [40]byte
	copy(pubKey[:], pubKeyBytes)

	tx := &types.ChangePubKeyReq{
		PubKey: pubKey,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetChangePubKeyTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignCreateOrder
func SignCreateOrder(cMarketIndex C.int, cClientOrderIndex C.longlong, cBaseAmount C.longlong, cPrice C.int, cIsAsk C.int, cOrderType C.int, cTimeInForce C.int, cReduceOnly C.int, cTriggerPrice C.int, cOrderExpiry C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	marketIndex := int16(cMarketIndex)
	clientOrderIndex := int64(cClientOrderIndex)
	baseAmount := int64(cBaseAmount)
	price := uint32(cPrice)
	isAsk := uint8(cIsAsk)
	orderType := uint8(cOrderType)
	timeInForce := uint8(cTimeInForce)
	reduceOnly := uint8(cReduceOnly)
	triggerPrice := uint32(cTriggerPrice)
	orderExpiry := int64(cOrderExpiry)

	if orderExpiry == -1 {
		orderExpiry = time.Now().Add(time.Hour * 24 * 28).UnixMilli() // 28 days
	}

	tx := &types.CreateOrderTxReq{
		MarketIndex:      marketIndex,
		ClientOrderIndex: clientOrderIndex,
		BaseAmount:       baseAmount,
		Price:            price,
		IsAsk:            isAsk,
		Type:             orderType,
		TimeInForce:      timeInForce,
		ReduceOnly:       reduceOnly,
		TriggerPrice:     triggerPrice,
		OrderExpiry:      orderExpiry,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetCreateOrderTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignCreateGroupedOrders
func SignCreateGroupedOrders(cGroupingType C.uint8_t, cOrders *C.CreateOrderTxReq, cLen C.int, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	length := int(cLen)
	orders := make([]*types.CreateOrderTxReq, length)
	size := unsafe.Sizeof(*cOrders)

	for i := 0; i < length; i++ {
		order := (*C.CreateOrderTxReq)(unsafe.Pointer(uintptr(unsafe.Pointer(cOrders)) + uintptr(i)*uintptr(size)))

		orderExpiry := int64(order.OrderExpiry)
		if orderExpiry == -1 {
			orderExpiry = time.Now().Add(time.Hour * 24 * 28).UnixMilli()
		}

		orders[i] = &types.CreateOrderTxReq{
			MarketIndex:      int16(order.MarketIndex),
			ClientOrderIndex: int64(order.ClientOrderIndex),
			BaseAmount:       int64(order.BaseAmount),
			Price:            uint32(order.Price),
			IsAsk:            uint8(order.IsAsk),
			Type:             uint8(order.Type),
			TimeInForce:      uint8(order.TimeInForce),
			ReduceOnly:       uint8(order.ReduceOnly),
			TriggerPrice:     uint32(order.TriggerPrice),
			OrderExpiry:      orderExpiry,
		}
	}

	tx := &types.CreateGroupedOrdersTxReq{
		GroupingType: uint8(cGroupingType),
		Orders:       orders,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetCreateGroupedOrdersTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignCancelOrder
func SignCancelOrder(cMarketIndex C.int, cOrderIndex C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	marketIndex := int16(cMarketIndex)
	orderIndex := int64(cOrderIndex)

	tx := &types.CancelOrderTxReq{
		MarketIndex: marketIndex,
		Index:       orderIndex,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetCancelOrderTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignWithdraw
func SignWithdraw(cAssetIndex C.int, cRouteType C.int, cAmount C.ulonglong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	assetIndex := int16(cAssetIndex)
	routeType := uint8(cRouteType)
	amount := uint64(cAmount)

	tx := &types.WithdrawTxReq{
		AssetIndex: assetIndex,
		RouteType:  routeType,
		Amount:     amount,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetWithdrawTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignCreateSubAccount
func SignCreateSubAccount(cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetCreateSubAccountTransaction(ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignCancelAllOrders
func SignCancelAllOrders(cTimeInForce C.int, cTime C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	timeInForce := uint8(cTimeInForce)
	t := int64(cTime)

	tx := &types.CancelAllOrdersTxReq{
		TimeInForce: timeInForce,
		Time:        t,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetCancelAllOrdersTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignModifyOrder
func SignModifyOrder(cMarketIndex C.int, cIndex C.longlong, cBaseAmount C.longlong, cPrice C.longlong, cTriggerPrice C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	marketIndex := int16(cMarketIndex)
	index := int64(cIndex)
	baseAmount := int64(cBaseAmount)
	price := uint32(cPrice)
	triggerPrice := uint32(cTriggerPrice)

	tx := &types.ModifyOrderTxReq{
		MarketIndex:  marketIndex,
		Index:        index,
		BaseAmount:   baseAmount,
		Price:        price,
		TriggerPrice: triggerPrice,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetModifyOrderTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignTransfer
func SignTransfer(cToAccountIndex C.longlong, cAssetIndex C.int16_t, cFromRouteType, cToRouteType C.uint8_t, cAmount, cUsdcFee C.longlong, cMemo *C.char, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	toAccountIndex := int64(cToAccountIndex)
	assetIndex := int16(cAssetIndex)
	fromRouteType := uint8(cFromRouteType)
	toRouteType := uint8(cToRouteType)
	amount := int64(cAmount)
	usdcFee := int64(cUsdcFee)
	memo := [32]byte{}
	memoStr := C.GoString(cMemo)
	if len(memoStr) == 66 {
		if memoStr[0:2] == "0x" {
			memoStr = memoStr[2:66]
		} else {
			return signedTxResponseErr(fmt.Sprintf("memo expected to be 32 bytes or 64 hex encoded or 66 if 0x hex encoded -- long but received %v", len(memoStr)))
		}
	}

	// assume hex encoded here
	if len(memoStr) == 64 {
		b, err := hex.DecodeString(memoStr)
		if err != nil {
			return signedTxResponseErr(fmt.Sprintf("failed to decode hex string. err: %v", err))
		}

		for i := 0; i < 32; i += 1 {
			memo[i] = b[i]
		}
	} else if len(memoStr) == 32 {
		for i := 0; i < 32; i++ {
			memo[i] = byte(memoStr[i])
		}
	} else {
		return signedTxResponseErr(fmt.Sprintf("memo expected to be 32 bytes or 64 hex encoded or 66 if 0x hex encoded -- long but received %v", len(memoStr)))
	}

	tx := &types.TransferTxReq{
		ToAccountIndex: toAccountIndex,
		AssetIndex:     assetIndex,
		FromRouteType:  fromRouteType,
		ToRouteType:    toRouteType,
		Amount:         amount,
		USDCFee:        usdcFee,
		Memo:           memo,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetTransferTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignCreatePublicPool
func SignCreatePublicPool(cOperatorFee C.longlong, cInitialTotalShares C.int, cMinOperatorShareRate C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	operatorFee := int64(cOperatorFee)
	initialTotalShares := int64(cInitialTotalShares)
	minOperatorShareRate := uint16(cMinOperatorShareRate)

	tx := &types.CreatePublicPoolTxReq{
		OperatorFee:          operatorFee,
		InitialTotalShares:   initialTotalShares,
		MinOperatorShareRate: minOperatorShareRate,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetCreatePublicPoolTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignUpdatePublicPool
func SignUpdatePublicPool(cPublicPoolIndex C.longlong, cStatus C.int, cOperatorFee C.longlong, cMinOperatorShareRate C.int, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	publicPoolIndex := int64(cPublicPoolIndex)
	status := uint8(cStatus)
	operatorFee := int64(cOperatorFee)
	minOperatorShareRate := uint16(cMinOperatorShareRate)

	tx := &types.UpdatePublicPoolTxReq{
		PublicPoolIndex:      publicPoolIndex,
		Status:               status,
		OperatorFee:          operatorFee,
		MinOperatorShareRate: minOperatorShareRate,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetUpdatePublicPoolTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignMintShares
func SignMintShares(cPublicPoolIndex C.longlong, cShareAmount C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	publicPoolIndex := int64(cPublicPoolIndex)
	shareAmount := int64(cShareAmount)

	tx := &types.MintSharesTxReq{
		PublicPoolIndex: publicPoolIndex,
		ShareAmount:     shareAmount,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetMintSharesTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignBurnShares
func SignBurnShares(cPublicPoolIndex C.longlong, cShareAmount C.longlong, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	publicPoolIndex := int64(cPublicPoolIndex)
	shareAmount := int64(cShareAmount)

	tx := &types.BurnSharesTxReq{
		PublicPoolIndex: publicPoolIndex,
		ShareAmount:     shareAmount,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetBurnSharesTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export SignUpdateLeverage
func SignUpdateLeverage(cMarketIndex C.int, cInitialMarginFraction C.int, cMarginMode C.int, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	marketIndex := int16(cMarketIndex)
	initialMarginFraction := uint16(cInitialMarginFraction)
	marginMode := uint8(cMarginMode)

	tx := &types.UpdateLeverageTxReq{
		MarketIndex:           marketIndex,
		InitialMarginFraction: initialMarginFraction,
		MarginMode:            marginMode,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetUpdateLeverageTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

//export CreateAuthToken
func CreateAuthToken(cDeadline C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.StrOrErr) {
	defer func() {
		if r := recover(); r != nil {
			ret = C.StrOrErr{err: wrapErr(fmt.Errorf("panic: %v", r))}
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return C.StrOrErr{err: wrapErr(err)}
	}

	deadline := int64(cDeadline)
	if deadline == 0 {
		deadline = time.Now().Add(time.Hour * 7).Unix()
	}

	authToken, err := c.GetAuthToken(time.Unix(deadline, 0))
	if err != nil {
		return C.StrOrErr{err: wrapErr(err)}
	}

	return C.StrOrErr{str: C.CString(authToken)}
}

//export SignUpdateMargin
func SignUpdateMargin(cMarketIndex C.int, cUSDCAmount C.longlong, cDirection C.int, cNonce C.longlong, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret C.SignedTxResponse) {
	defer func() {
		if r := recover(); r != nil {
			ret = signedTxResponsePanic(r)
		}
	}()

	c, err := getClient(cApiKeyIndex, cAccountIndex)
	if err != nil {
		return signedTxResponseErr(err)
	}

	marketIndex := int16(cMarketIndex)
	usdcAmount := int64(cUSDCAmount)
	direction := uint8(cDirection)

	tx := &types.UpdateMarginTxReq{
		MarketIndex: marketIndex,
		USDCAmount:  usdcAmount,
		Direction:   direction,
	}
	ops := getTransactOpts(cNonce)

	txInfo, err := c.GetUpdateMarginTransaction(tx, ops)
	return convertTxInfoToResponse(txInfo, err)
}

func main() {}
