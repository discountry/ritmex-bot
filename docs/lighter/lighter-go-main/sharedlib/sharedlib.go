package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/elliottech/lighter-go/client"
	"github.com/elliottech/lighter-go/types"
	curve "github.com/elliottech/poseidon_crypto/curve/ecgfp5"
	schnorr "github.com/elliottech/poseidon_crypto/signature/schnorr"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

/*
#include <stdlib.h>
typedef struct {
	char* str;
	char* err;
} StrOrErr;

typedef struct {
	char* privateKey;
	char* publicKey;
	char* err;
} ApiKeyResponse;
*/
import "C"

var (
	txClient        *client.TxClient
	backupTxClients map[uint8]*client.TxClient
)

func wrapErr(err error) (ret *C.char) {
	return C.CString(fmt.Sprintf("%v", err))
}

//export GenerateAPIKey
func GenerateAPIKey(cSeed *C.char) (ret C.ApiKeyResponse) {
	var err error
	var privateKeyStr string
	var publicKeyStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.ApiKeyResponse{
				err: wrapErr(err),
			}
		} else {
			ret = C.ApiKeyResponse{
				privateKey: C.CString(privateKeyStr),
				publicKey:  C.CString(publicKeyStr),
			}
		}
	}()

	seed := C.GoString(cSeed)
	seedP := &seed
	if seed == "" {
		seedP = nil
	}

	key := curve.SampleScalar(seedP)

	publicKeyStr = hexutil.Encode(schnorr.SchnorrPkFromSk(key).ToLittleEndianBytes())
	privateKeyStr = hexutil.Encode(key.ToLittleEndianBytes())

	return
}

//export CreateClient
func CreateClient(cUrl *C.char, cPrivateKey *C.char, cChainId C.int, cApiKeyIndex C.int, cAccountIndex C.longlong) (ret *C.char) {
	var err error
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = wrapErr(err)
		}
	}()

	url := C.GoString(cUrl)
	privateKey := C.GoString(cPrivateKey)
	chainId := uint32(cChainId)
	apiKeyIndex := uint8(cApiKeyIndex)
	accountIndex := int64(cAccountIndex)

	if accountIndex <= 0 {
		err = fmt.Errorf("invalid account index")
		return
	}

	httpClient := client.NewHTTPClient(url)
	txClient, err = client.NewTxClient(httpClient, privateKey, accountIndex, apiKeyIndex, chainId)
	if err != nil {
		err = fmt.Errorf("error occurred when creating TxClient. err: %v", err)
		return
	}
	if backupTxClients == nil {
		backupTxClients = make(map[uint8]*client.TxClient)
	}
	backupTxClients[apiKeyIndex] = txClient

	return nil
}

//export CheckClient
func CheckClient(cApiKeyIndex C.int, cAccountIndex C.longlong) (ret *C.char) {
	var err error
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = wrapErr(err)
		}
	}()

	apiKeyIndex := uint8(cApiKeyIndex)
	accountIndex := int64(cAccountIndex)

	client, ok := backupTxClients[apiKeyIndex]
	if !ok {
		err = fmt.Errorf("api key not registered")
		return
	}

	if client.GetApiKeyIndex() != apiKeyIndex {
		err = fmt.Errorf("apiKeyIndex does not match. expected %v but got %v", client.GetApiKeyIndex(), apiKeyIndex)
		return
	}
	if client.GetAccountIndex() != accountIndex {
		err = fmt.Errorf("accountIndex does not match. expected %v but got %v", client.GetAccountIndex(), accountIndex)
		return
	}

	// check that the API key registered on Lighter matches this one
	key, err := client.HTTP().GetApiKey(accountIndex, apiKeyIndex)
	if err != nil {
		err = fmt.Errorf("failed to get Api Keys. err: %v", err)
		return
	}

	pubKeyBytes := client.GetKeyManager().PubKeyBytes()
	pubKeyStr := hexutil.Encode(pubKeyBytes[:])
	pubKeyStr = strings.Replace(pubKeyStr, "0x", "", 1)

	ak := key.ApiKeys[0]
	if ak.PublicKey != pubKeyStr {
		err = fmt.Errorf("private key does not match the one on Lighter. ownPubKey: %s response: %+v", pubKeyStr, ak)
		return
	}

	return
}

//export SignChangePubKey
func SignChangePubKey(cPubKey *C.char, cNonce C.longlong) (ret C.StrOrErr) {
	// Note: The ChangePubKey TX needs to be signed by the API key that's being changed to as well.
	//       Because of that, there's no reason to add the params for apiKeyIndex & accountIndex, because this
	//       version of the SDK doesn't have support for multiple signers.
	//       Even if it'd had, the flow would look something like this:
	//       - first you select which client you're sending the TX from
	//       - then we use the ApiKeyIndex & AccountIndex from that client
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	nonce := int64(cNonce)

	// handle PubKey
	pubKeyStr := C.GoString(cPubKey)
	pubKeyBytes, err := hexutil.Decode(pubKeyStr)
	if err != nil {
		return
	}
	if len(pubKeyBytes) != 40 {
		err = fmt.Errorf("invalid pub key length. expected 40 but got %v", len(pubKeyBytes))
		return
	}
	var pubKey [40]byte
	copy(pubKey[:], pubKeyBytes)

	txInfo := &types.ChangePubKeyReq{
		PubKey: pubKey,
	}
	ops := &types.TransactOpts{}
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetChangePubKeyTransaction(txInfo, ops)
	if err != nil {
		return
	}

	// === manually add MessageToSign to the response:
	// - marshal the tx
	// - unmarshal it into a generic map
	// - add the new field
	// - marshal it again
	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}
	obj := make(map[string]interface{})
	err = json.Unmarshal(txInfoBytes, &obj)
	obj["MessageToSign"] = tx.GetL1SignatureBody()
	txInfoBytes, err = json.Marshal(obj)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignCreateOrder
func SignCreateOrder(cMarketIndex C.int, cClientOrderIndex C.longlong, cBaseAmount C.longlong, cPrice C.int, cIsAsk C.int, cOrderType C.int, cTimeInForce C.int, cReduceOnly C.int, cTriggerPrice C.int, cOrderExpiry C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	marketIndex := uint8(cMarketIndex)
	clientOrderIndex := int64(cClientOrderIndex)
	baseAmount := int64(cBaseAmount)
	price := uint32(cPrice)
	isAsk := uint8(cIsAsk)
	orderType := uint8(cOrderType)
	timeInForce := uint8(cTimeInForce)
	reduceOnly := uint8(cReduceOnly)
	triggerPrice := uint32(cTriggerPrice)
	orderExpiry := int64(cOrderExpiry)
	nonce := int64(cNonce)

	if orderExpiry == -1 {
		orderExpiry = time.Now().Add(time.Hour * 24 * 28).UnixMilli() // 28 days
	}

	txInfo := &types.CreateOrderTxReq{
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
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetCreateOrderTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignCancelOrder
func SignCancelOrder(cMarketIndex C.int, cOrderIndex C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	marketIndex := uint8(cMarketIndex)
	orderIndex := int64(cOrderIndex)
	nonce := int64(cNonce)

	txInfo := &types.CancelOrderTxReq{
		MarketIndex: marketIndex,
		Index:       orderIndex,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetCancelOrderTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignWithdraw
func SignWithdraw(cUSDCAmount C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	usdcAmount := uint64(cUSDCAmount)
	nonce := int64(cNonce)

	txInfo := types.WithdrawTxReq{
		USDCAmount: usdcAmount,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetWithdrawTransaction(&txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignCreateSubAccount
func SignCreateSubAccount(cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	nonce := int64(cNonce)

	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetCreateSubAccountTransaction(ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignCancelAllOrders
func SignCancelAllOrders(cTimeInForce C.int, cTime C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	timeInForce := uint8(cTimeInForce)
	t := int64(cTime)
	nonce := int64(cNonce)

	txInfo := &types.CancelAllOrdersTxReq{
		TimeInForce: timeInForce,
		Time:        t,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetCancelAllOrdersTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignModifyOrder
func SignModifyOrder(cMarketIndex C.int, cIndex C.longlong, cBaseAmount C.longlong, cPrice C.longlong, cTriggerPrice C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	marketIndex := uint8(cMarketIndex)
	index := int64(cIndex)
	baseAmount := int64(cBaseAmount)
	price := uint32(cPrice)
	triggerPrice := uint32(cTriggerPrice)
	nonce := int64(cNonce)

	txInfo := &types.ModifyOrderTxReq{
		MarketIndex:  marketIndex,
		Index:        index,
		BaseAmount:   baseAmount,
		Price:        price,
		TriggerPrice: triggerPrice,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetModifyOrderTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignTransfer
func SignTransfer(cToAccountIndex C.longlong, cUSDCAmount C.longlong, cFee C.longlong, cMemo *C.char, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	toAccountIndex := int64(cToAccountIndex)
	usdcAmount := int64(cUSDCAmount)
	nonce := int64(cNonce)
	fee := int64(cFee)
	memo := [32]byte{}
	memoStr := C.GoString(cMemo)
	if len(memoStr) != 32 {
		err = fmt.Errorf("memo expected to be 32 bytes long")
		return
	}
	for i := 0; i < 32; i++ {
		memo[i] = byte(memoStr[i])
	}

	txInfo := &types.TransferTxReq{
		ToAccountIndex: toAccountIndex,
		USDCAmount:     usdcAmount,
		Fee:            fee,
		Memo:           memo,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetTransferTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	obj := make(map[string]interface{})
	err = json.Unmarshal(txInfoBytes, &obj)
	obj["MessageToSign"] = tx.GetL1SignatureBody()
	txInfoBytes, err = json.Marshal(obj)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignCreatePublicPool
func SignCreatePublicPool(cOperatorFee C.longlong, cInitialTotalShares C.longlong, cMinOperatorShareRate C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	operatorFee := int64(cOperatorFee)
	initialTotalShares := int64(cInitialTotalShares)
	minOperatorShareRate := int64(cMinOperatorShareRate)
	nonce := int64(cNonce)

	txInfo := &types.CreatePublicPoolTxReq{
		OperatorFee:          operatorFee,
		InitialTotalShares:   initialTotalShares,
		MinOperatorShareRate: minOperatorShareRate,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetCreatePublicPoolTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignUpdatePublicPool
func SignUpdatePublicPool(cPublicPoolIndex C.longlong, cStatus C.int, cOperatorFee C.longlong, cMinOperatorShareRate C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	publicPoolIndex := int64(cPublicPoolIndex)
	status := uint8(cStatus)
	operatorFee := int64(cOperatorFee)
	minOperatorShareRate := int64(cMinOperatorShareRate)
	nonce := int64(cNonce)

	txInfo := &types.UpdatePublicPoolTxReq{
		PublicPoolIndex:      publicPoolIndex,
		Status:               status,
		OperatorFee:          operatorFee,
		MinOperatorShareRate: minOperatorShareRate,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetUpdatePublicPoolTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignMintShares
func SignMintShares(cPublicPoolIndex C.longlong, cShareAmount C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	publicPoolIndex := int64(cPublicPoolIndex)
	shareAmount := int64(cShareAmount)
	nonce := int64(cNonce)

	txInfo := &types.MintSharesTxReq{
		PublicPoolIndex: publicPoolIndex,
		ShareAmount:     shareAmount,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetMintSharesTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignBurnShares
func SignBurnShares(cPublicPoolIndex C.longlong, cShareAmount C.longlong, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	publicPoolIndex := int64(cPublicPoolIndex)
	shareAmount := int64(cShareAmount)
	nonce := int64(cNonce)

	txInfo := &types.BurnSharesTxReq{
		PublicPoolIndex: publicPoolIndex,
		ShareAmount:     shareAmount,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetBurnSharesTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export SignUpdateLeverage
func SignUpdateLeverage(cMarketIndex C.int, cInitialMarginFraction C.int, cMarginMode C.int, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	marketIndex := uint8(cMarketIndex)
	initialMarginFraction := uint16(cInitialMarginFraction)
	nonce := int64(cNonce)
	marginMode := uint8(cMarginMode)

	txInfo := &types.UpdateLeverageTxReq{
		MarketIndex:           marketIndex,
		InitialMarginFraction: initialMarginFraction,
		MarginMode:            uint8(marginMode),
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetUpdateLeverageTransaction(txInfo, ops)
	if err != nil {
		return
	}

	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return
	}

	txInfoStr = string(txInfoBytes)
	return
}

//export CreateAuthToken
func CreateAuthToken(cDeadline C.longlong) (ret C.StrOrErr) {
	var err error
	var authToken string

	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(authToken),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("client is not created, call CreateClient() first")
		return
	}

	deadline := int64(cDeadline)
	if deadline == 0 {
		deadline = time.Now().Add(time.Hour * 7).Unix()
	}

	authToken, err = txClient.GetAuthToken(time.Unix(deadline, 0))
	if err != nil {
		return
	}

	return
}

//export SwitchAPIKey
func SwitchAPIKey(c C.int) (ret *C.char) {
	var err error
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
		if err != nil {
			ret = wrapErr(err)
		}
	}()

	txClient = backupTxClients[uint8(c)]
	if txClient == nil {
		err = fmt.Errorf("no client initialized for api key")
	}

	return
}

//export SignUpdateMargin
func SignUpdateMargin(cMarketIndex C.int, cUSDCAmount C.longlong, cDirection C.int, cNonce C.longlong) (ret C.StrOrErr) {
	var err error
	var txInfoStr string
	defer func() {
		if r := recover(); r != nil {
			wrapErr(fmt.Errorf("panic: %v", r))
		}
		if err != nil {
			ret = C.StrOrErr{
				err: wrapErr(err),
			}
		} else {
			ret = C.StrOrErr{
				str: C.CString(txInfoStr),
			}
		}
	}()

	if txClient == nil {
		err = fmt.Errorf("Client is not created, call CreateClient() first")
	}

	marketIndex := uint8(cMarketIndex)
	usdcAmount := int64(cUSDCAmount)
	direction := uint8(cDirection)
	nonce := int64(cNonce)

	txInfo := &types.UpdateMarginTxReq{
		MarketIndex: marketIndex,
		USDCAmount:  usdcAmount,
		Direction:   direction,
	}
	ops := new(types.TransactOpts)
	if nonce != -1 {
		ops.Nonce = &nonce
	}

	tx, err := txClient.GetUpdateMarginTransaction(txInfo, ops)

	txInfoBytes, err := json.Marshal(tx)
	txInfoStr = string(txInfoBytes)

	return ret
}

func main() {}
