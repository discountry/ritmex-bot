//go:build js
// +build js

package main

import (
	"fmt"
	"strconv"
	"syscall/js"
	"time"

	"github.com/elliottech/lighter-go/client"
	"github.com/elliottech/lighter-go/client/http"
	"github.com/elliottech/lighter-go/types"
	"github.com/elliottech/lighter-go/types/txtypes"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

func wrapErr(err error) js.Value {
	if err != nil {
		return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("%v", err)})
	}
	return js.ValueOf(map[string]interface{}{})
}

func messageToSign(info txtypes.TxInfo) string {
	switch tx := info.(type) {
	case *txtypes.L2ChangePubKeyTxInfo:
		return tx.GetL1SignatureBody()
	case *txtypes.L2TransferTxInfo:
		return tx.GetL1SignatureBody()
	default:
		return ""
	}
}

func convertTxInfoToJS(info txtypes.TxInfo, err error) js.Value {
	if err != nil {
		return wrapErr(err)
	}
	if info == nil {
		return js.ValueOf(map[string]interface{}{"error": "nil response"})
	}

	txInfoStr, strErr := info.GetTxInfo()
	if strErr != nil {
		return wrapErr(strErr)
	}

	out := map[string]interface{}{
		"txType": info.GetTxType(),
		"txInfo": txInfoStr,
		"txHash": info.GetTxHash(),
	}
	if msg := messageToSign(info); msg != "" {
		out["messageToSign"] = msg
	}
	return js.ValueOf(out)
}

// safeInt safely extracts an int from a js.Value, handling undefined values
func safeInt(v js.Value, index int) (int64, error) {
	if v.Type() == js.TypeUndefined {
		return 0, fmt.Errorf("argument %d is undefined", index)
	}
	return int64(v.Int()), nil
}

// safeUint8 safely extracts a uint8 from a js.Value, handling undefined values
func safeUint8(v js.Value, index int) (uint8, error) {
	if v.Type() == js.TypeUndefined {
		return 0, fmt.Errorf("argument %d is undefined", index)
	}
	return uint8(v.Int()), nil
}

// safeUint32 safely extracts a uint32 from a js.Value, handling undefined values
func safeUint32(v js.Value, index int) (uint32, error) {
	if v.Type() == js.TypeUndefined {
		return 0, fmt.Errorf("argument %d is undefined", index)
	}
	return uint32(v.Int()), nil
}

func getClient(args []js.Value) (*client.TxClient, error) {
	l := len(args)
	if l < 2 {
		return nil, fmt.Errorf("insufficient arguments: need at least 2 for apiKeyIndex and accountIndex")
	}
	// Check if the last two arguments are valid and extract safely
	if args[l-2].Type() == js.TypeUndefined || args[l-1].Type() == js.TypeUndefined {
		return nil, fmt.Errorf("apiKeyIndex or accountIndex is undefined")
	}
	apiKeyIndexVal, err := safeUint8(args[l-2], l-2)
	if err != nil {
		return nil, err
	}
	accountIndexVal, err := safeInt(args[l-1], l-1)
	if err != nil {
		return nil, err
	}
	return client.GetClient(apiKeyIndexVal, accountIndexVal)
}

// recoverPanic wraps a function execution with panic recovery
func recoverPanic(fn func() js.Value) (result js.Value) {
	defer func() {
		if r := recover(); r != nil {
			result = wrapErr(fmt.Errorf("panic: %v", r))
		}
	}()
	return fn()
}

func main() {
	js.Global().Set("GenerateAPIKey", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 1 {
				return js.ValueOf(map[string]interface{}{"error": "GenerateAPIKey expects 1 arg: seed"})
			}
			seed := args[0].String()
			privateKey, publicKey, err := client.GenerateAPIKey(seed)
			if err != nil {
				return wrapErr(err)
			}
			return js.ValueOf(map[string]interface{}{"privateKey": privateKey, "publicKey": publicKey})
		})
	}))

	js.Global().Set("CreateClient", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 5 {
				return js.ValueOf(map[string]interface{}{"error": "CreateClient expects 5 args: url, privateKey, chainId, apiKeyIndex, accountIndex"})
			}
			url := args[0].String()
			privateKey := args[1].String()
			chainId := uint32(args[2].Int())
			apiKeyIndex := uint8(args[3].Int())
			accountIndex := int64(args[4].Int())
			httpClient := http.NewClient(url)
			_, err := client.CreateClient(httpClient, privateKey, chainId, apiKeyIndex, accountIndex)
			if err != nil {
				return wrapErr(err)
			}
			return wrapErr(nil)
		})
	}))

	js.Global().Set("CheckClient", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 2 {
				return js.ValueOf(map[string]interface{}{"error": "CheckClient expects 2 args: apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			err = c.Check()
			if err != nil {
				return wrapErr(err)
			}
			return wrapErr(nil)
		})
	}))

	js.Global().Set("CreateAuthToken", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 3 {
				return js.ValueOf(map[string]interface{}{"error": "CreateAuthToken expects 3 args: deadline, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			deadline := int64(args[0].Int())
			if deadline == 0 {
				deadline = time.Now().Add(time.Hour * 7).Unix()
			}

			token, err := c.GetAuthToken(time.Unix(deadline, 0))
			if err != nil {
				return wrapErr(err)
			}
			return js.ValueOf(map[string]interface{}{"authToken": token})
		})
	}))

	js.Global().Set("SignChangePubKey", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 4 {
				return js.ValueOf(map[string]interface{}{"error": "SignChangePubKey expects 4 args: pubKeyHex, nonce, apiKeyIndex, accountIndex"})
			}
			pubKeyHex := args[0].String()
			nonce := int64(args[1].Int())

			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			pubKeyBytes, err := hexutil.Decode(pubKeyHex)
			if err != nil {
				return wrapErr(err)
			}
			if len(pubKeyBytes) != 40 {
				return js.ValueOf(map[string]interface{}{"error": "invalid pub key length. expected 40 but got " + strconv.Itoa(len(pubKeyBytes))})
			}
			var pubKey [40]byte
			copy(pubKey[:], pubKeyBytes)

			txInfo := &types.ChangePubKeyReq{
				PubKey: pubKey,
			}
			ops := &types.TransactOpts{
				Nonce: &nonce,
			}

			tx, err := c.GetChangePubKeyTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignCreateOrder", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 13 {
				return js.ValueOf(map[string]interface{}{"error": "SignCreateOrder expects 13 args: marketIndex, clientOrderIndex, baseAmount, price, isAsk, orderType, timeInForce, reduceOnly, triggerPrice, orderExpiry, nonce, apiKeyIndex, accountIndex"})
			}
			// Validate all arguments are defined before accessing
			for i := 0; i < 13; i++ {
				if args[i].Type() == js.TypeUndefined {
					return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("argument %d is undefined", i)})
				}
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			marketIndex, err := safeUint8(args[0], 0)
			if err != nil {
				return wrapErr(err)
			}
			clientOrderIndex, err := safeInt(args[1], 1)
			if err != nil {
				return wrapErr(err)
			}
			baseAmount, err := safeInt(args[2], 2)
			if err != nil {
				return wrapErr(err)
			}
			price, err := safeUint32(args[3], 3)
			if err != nil {
				return wrapErr(err)
			}
			isAsk, err := safeUint8(args[4], 4)
			if err != nil {
				return wrapErr(err)
			}
			orderType, err := safeUint8(args[5], 5)
			if err != nil {
				return wrapErr(err)
			}
			timeInForce, err := safeUint8(args[6], 6)
			if err != nil {
				return wrapErr(err)
			}
			reduceOnly, err := safeUint8(args[7], 7)
			if err != nil {
				return wrapErr(err)
			}
			triggerPrice, err := safeUint32(args[8], 8)
			if err != nil {
				return wrapErr(err)
			}
			orderExpiry, err := safeInt(args[9], 9)
			if err != nil {
				return wrapErr(err)
			}
			nonce, err := safeInt(args[10], 10)
			if err != nil {
				return wrapErr(err)
			}

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

			tx, err := c.GetCreateOrderTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignCancelOrder", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 5 {
				return js.ValueOf(map[string]interface{}{"error": "SignCancelOrder expects 5 args: marketIndex, orderIndex, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			marketIndex := uint8(args[0].Int())
			orderIndex := int64(args[1].Int())
			nonce := int64(args[2].Int())

			txInfo := &types.CancelOrderTxReq{
				MarketIndex: marketIndex,
				Index:       orderIndex,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetCancelOrderTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignCancelAllOrders", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 5 {
				return js.ValueOf(map[string]interface{}{"error": "SignCancelAllOrders expects 5 args: timeInForce, time, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			timeInForce := uint8(args[0].Int())
			timeVal := int64(args[1].Int())
			nonce := int64(args[2].Int())

			txInfo := &types.CancelAllOrdersTxReq{
				TimeInForce: timeInForce,
				Time:        timeVal,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetCancelAllOrdersTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignTransfer", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 7 {
				return js.ValueOf(map[string]interface{}{"error": "SignTransfer expects 7 args: toAccount, usdcAmount, fee, memo, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			toAccount := int64(args[0].Int())
			usdcAmount := int64(args[1].Int())
			fee := int64(args[2].Int())
			memoStr := args[3].String()
			nonce := int64(args[4].Int())

			var memoArr [32]byte
			bs := []byte(memoStr)
			if len(bs) != 32 {
				return wrapErr(fmt.Errorf("memo expected to be 32 bytes long"))
			}
			for i := 0; i < 32; i++ {
				memoArr[i] = bs[i]
			}

			txInfo := &types.TransferTxReq{
				ToAccountIndex: toAccount,
				USDCAmount:     usdcAmount,
				Fee:            fee,
				Memo:           memoArr,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetTransferTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignWithdraw", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 4 {
				return js.ValueOf(map[string]interface{}{"error": "SignWithdraw expects 4 args: usdcAmount, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			usdcAmount := uint64(args[0].Int())
			nonce := int64(args[1].Int())

			txInfo := &types.WithdrawTxReq{
				USDCAmount: usdcAmount,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetWithdrawTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignUpdateLeverage", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 6 {
				return js.ValueOf(map[string]interface{}{"error": "SignUpdateLeverage expects 6 args: marketIndex, fraction, marginMode, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			marketIndex := uint8(args[0].Int())
			fraction := uint16(args[1].Int())
			marginMode := uint8(args[2].Int())
			nonce := int64(args[3].Int())

			txInfo := &types.UpdateLeverageTxReq{
				MarketIndex:           marketIndex,
				InitialMarginFraction: fraction,
				MarginMode:            marginMode,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetUpdateLeverageTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignModifyOrder", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 8 {
				return js.ValueOf(map[string]interface{}{"error": "SignModifyOrder expects 8 args: marketIndex, index, baseAmount, price, triggerPrice, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			marketIndex := uint8(args[0].Int())
			index := int64(args[1].Int())
			baseAmount := int64(args[2].Int())
			price := uint32(args[3].Int())
			triggerPrice := uint32(args[4].Int())
			nonce := int64(args[5].Int())

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

			tx, err := c.GetModifyOrderTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignCreateSubAccount", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 3 {
				return js.ValueOf(map[string]interface{}{"error": "SignCreateSubAccount expects 3 args: nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			nonce := int64(args[0].Int())

			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetCreateSubAccountTransaction(ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignCreatePublicPool", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 6 {
				return js.ValueOf(map[string]interface{}{"error": "SignCreatePublicPool expects 6 args: operatorFee, initialTotalShares, minOperatorShareRate, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			operatorFee := int64(args[0].Int())
			initialTotalShares := int64(args[1].Int())
			minOperatorShareRate := int64(args[2].Int())
			nonce := int64(args[3].Int())

			txInfo := &types.CreatePublicPoolTxReq{
				OperatorFee:          operatorFee,
				InitialTotalShares:   initialTotalShares,
				MinOperatorShareRate: minOperatorShareRate,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetCreatePublicPoolTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignUpdatePublicPool", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 7 {
				return js.ValueOf(map[string]interface{}{"error": "SignUpdatePublicPool expects 7 args: publicPoolIndex, status, operatorFee, minOperatorShareRate, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			publicPoolIndex := uint8(args[0].Int())
			status := uint8(args[1].Int())
			operatorFee := int64(args[2].Int())
			minOperatorShareRate := int64(args[3].Int())
			nonce := int64(args[4].Int())

			txInfo := &types.UpdatePublicPoolTxReq{
				PublicPoolIndex:      int64(publicPoolIndex),
				Status:               status,
				OperatorFee:          operatorFee,
				MinOperatorShareRate: minOperatorShareRate,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetUpdatePublicPoolTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignMintShares", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 5 {
				return js.ValueOf(map[string]interface{}{"error": "SignMintShares expects 5 args: publicPoolIndex, shareAmount, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			publicPoolIndex := int64(args[0].Int())
			shareAmount := int64(args[1].Int())
			nonce := int64(args[2].Int())

			txInfo := &types.MintSharesTxReq{
				PublicPoolIndex: publicPoolIndex,
				ShareAmount:     shareAmount,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetMintSharesTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignBurnShares", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 5 {
				return js.ValueOf(map[string]interface{}{"error": "SignBurnShares expects 5 args: publicPoolIndex, shareAmount, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			publicPoolIndex := int64(args[0].Int())
			shareAmount := int64(args[1].Int())
			nonce := int64(args[2].Int())

			txInfo := &types.BurnSharesTxReq{
				PublicPoolIndex: publicPoolIndex,
				ShareAmount:     shareAmount,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetBurnSharesTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignUpdateMargin", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 6 {
				return js.ValueOf(map[string]interface{}{"error": "SignUpdateMargin expects 6 args: marketIndex, usdcAmount, direction, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			marketIndex := uint8(args[0].Int())
			usdcAmount := int64(args[1].Int())
			direction := uint8(args[2].Int())
			nonce := int64(args[3].Int())

			txInfo := &types.UpdateMarginTxReq{
				MarketIndex: marketIndex,
				USDCAmount:  usdcAmount,
				Direction:   direction,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			tx, err := c.GetUpdateMarginTransaction(txInfo, ops)
			return convertTxInfoToJS(tx, err)
		})
	}))

	js.Global().Set("SignCreateGroupedOrders", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return recoverPanic(func() js.Value {
			if len(args) < 5 {
				return js.ValueOf(map[string]interface{}{"error": "SignCreateGroupedOrders expects 5 args: groupingType, orders array, nonce, apiKeyIndex, accountIndex"})
			}
			c, err := getClient(args)
			if err != nil {
				return wrapErr(err)
			}

			groupingType := uint8(args[0].Int())

			// Parse orders array from JS
			ordersArg := args[1]
			if ordersArg.Type() != js.TypeObject {
				return js.ValueOf(map[string]interface{}{"error": "orders must be an array"})
			}
			length := ordersArg.Length()
			orders := make([]*types.CreateOrderTxReq, length)

			for i := 0; i < length; i++ {
				orderObj := ordersArg.Index(i)
				if orderObj.Type() != js.TypeObject {
					return js.ValueOf(map[string]interface{}{"error": fmt.Sprintf("order %d must be an object", i)})
				}

				orderExpiry := int64(orderObj.Get("OrderExpiry").Int())
				if orderExpiry == -1 {
					orderExpiry = time.Now().Add(time.Hour * 24 * 28).UnixMilli()
				}

				orders[i] = &types.CreateOrderTxReq{
					MarketIndex:      uint8(orderObj.Get("MarketIndex").Int()),
					ClientOrderIndex: int64(orderObj.Get("ClientOrderIndex").Int()),
					BaseAmount:       int64(orderObj.Get("BaseAmount").Int()),
					Price:            uint32(orderObj.Get("Price").Int()),
					IsAsk:            uint8(orderObj.Get("IsAsk").Int()),
					Type:             uint8(orderObj.Get("Type").Int()),
					TimeInForce:      uint8(orderObj.Get("TimeInForce").Int()),
					ReduceOnly:       uint8(orderObj.Get("ReduceOnly").Int()),
					TriggerPrice:     uint32(orderObj.Get("TriggerPrice").Int()),
					OrderExpiry:      orderExpiry,
				}
			}

			nonce := int64(args[2].Int())

			req := &types.CreateGroupedOrdersTxReq{
				GroupingType: groupingType,
				Orders:       orders,
			}
			ops := new(types.TransactOpts)
			if nonce != -1 {
				ops.Nonce = &nonce
			}

			txInfo, err := c.GetCreateGroupedOrdersTransaction(req, ops)
			return convertTxInfoToJS(txInfo, err)
		})
	}))

	select {}
}
