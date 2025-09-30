package client

import (
	"fmt"

	"github.com/elliottech/lighter-go/types"
	"github.com/elliottech/lighter-go/types/txtypes"
	schnorr "github.com/elliottech/poseidon_crypto/signature/schnorr"
)

func (c *TxClient) GetChangePubKeyTransaction(tx *types.ChangePubKeyReq, ops *types.TransactOpts) (*txtypes.L2ChangePubKeyTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructChangePubKeyTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}

	pk := c.keyManager.PubKeyBytes()
	msgHash, _ := txInfo.Hash(c.chainId)

	if err := schnorr.Validate(pk[:], msgHash, txInfo.Sig); err != nil {
		return nil, fmt.Errorf("failed to validate signature. error: %v", err)
	}

	return txInfo, nil
}

func (c *TxClient) GetCreateSubAccountTransaction(ops *types.TransactOpts) (*txtypes.L2CreateSubAccountTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructCreateSubAccountTx(c.keyManager, c.chainId, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetCreatePublicPoolTransaction(tx *types.CreatePublicPoolTxReq, ops *types.TransactOpts) (*txtypes.L2CreatePublicPoolTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructCreatePublicPoolTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetUpdatePublicPoolTransaction(tx *types.UpdatePublicPoolTxReq, ops *types.TransactOpts) (*txtypes.L2UpdatePublicPoolTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructUpdatePublicPoolTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetTransferTransaction(tx *types.TransferTxReq, ops *types.TransactOpts) (*txtypes.L2TransferTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructTransferTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetWithdrawTransaction(tx *types.WithdrawTxReq, ops *types.TransactOpts) (*txtypes.L2WithdrawTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructWithdrawTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}

	return txInfo, nil
}

func (c *TxClient) GetCreateOrderTransaction(tx *types.CreateOrderTxReq, ops *types.TransactOpts) (*txtypes.L2CreateOrderTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructCreateOrderTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetCancelOrderTransaction(tx *types.CancelOrderTxReq, ops *types.TransactOpts) (*txtypes.L2CancelOrderTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructL2CancelOrderTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetModifyOrderTransaction(tx *types.ModifyOrderTxReq, ops *types.TransactOpts) (*txtypes.L2ModifyOrderTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}

	txInfo, err := types.ConstructL2ModifyOrderTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}

	return txInfo, nil
}

func (c *TxClient) GetCancelAllOrdersTransaction(tx *types.CancelAllOrdersTxReq, ops *types.TransactOpts) (*txtypes.L2CancelAllOrdersTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructL2CancelAllOrdersTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetMintSharesTransaction(tx *types.MintSharesTxReq, ops *types.TransactOpts) (*txtypes.L2MintSharesTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructMintSharesTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetBurnSharesTransaction(tx *types.BurnSharesTxReq, ops *types.TransactOpts) (*txtypes.L2BurnSharesTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructBurnSharesTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetUpdateLeverageTransaction(tx *types.UpdateLeverageTxReq, ops *types.TransactOpts) (*txtypes.L2UpdateLeverageTxInfo, error) {
	ops, err := c.FullFillDefaultOps(ops)
	if err != nil {
		return nil, err
	}
	txInfo, err := types.ConstructUpdateLeverageTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}

func (c *TxClient) GetUpdateMarginTransaction(tx *types.UpdateMarginTxReq, ops *types.TransactOpts) (*txtypes.L2UpdateMarginTxInfo, error) {
	if c.keyManager == nil {
		return nil, fmt.Errorf("key manager is nil")
	}

	if ops == nil {
		ops = new(types.TransactOpts)
	}

	txInfo, err := types.ConstructUpdateMarginTx(c.keyManager, c.chainId, tx, ops)
	if err != nil {
		return nil, err
	}
	return txInfo, nil
}
