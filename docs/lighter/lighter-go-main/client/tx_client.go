package client

import (
	"encoding/hex"
	"fmt"
	"time"

	"github.com/elliottech/lighter-go/signer"
	"github.com/elliottech/lighter-go/types"
)

const (
	defaultExpireTime = time.Minute*10 - time.Second // we need to give a second margin, to eliminate millisecond differences
)

type TxClient struct {
	apiClient    *HTTPClient
	chainId      uint32
	keyManager   signer.KeyManager
	accountIndex int64
	apiKeyIndex  uint8
}

// NewTxClient is linked to a specific (account, apiKey) pair
// apiKeyPrivateKey should be hex-encoded bytes generated using `hexutil.Encode(TxClient.GetKeyManager().PrvKeyBytes())`
func NewTxClient(apiClient *HTTPClient, apiKeyPrivateKey string, accountIndex int64, apiKeyIndex uint8, chainId uint32) (*TxClient, error) {
	// remove 0x from private key, if any, and parse to bytes
	if len(apiKeyPrivateKey) < 2 {
		return nil, fmt.Errorf("empty private key")
	}
	if apiKeyPrivateKey[:2] == "0x" {
		apiKeyPrivateKey = apiKeyPrivateKey[2:]
	}
	b, err := hex.DecodeString(apiKeyPrivateKey)
	if err != nil {
		return nil, err
	}

	keyManager, err := signer.NewKeyManager(b)
	if err != nil {
		return nil, err
	}

	return &TxClient{
		apiClient:    apiClient,
		apiKeyIndex:  apiKeyIndex,
		accountIndex: accountIndex,
		chainId:      chainId,
		keyManager:   keyManager,
	}, nil
}

func (c *TxClient) FullFillDefaultOps(ops *types.TransactOpts) (*types.TransactOpts, error) {
	if ops == nil {
		ops = new(types.TransactOpts)
	}
	if ops.ExpiredAt == 0 {
		ops.ExpiredAt = time.Now().Add(defaultExpireTime).UnixMilli()
	}
	if ops.FromAccountIndex == nil {
		ops.FromAccountIndex = &c.accountIndex
	}
	if ops.ApiKeyIndex == nil {
		ops.ApiKeyIndex = &c.apiKeyIndex
	}
	if ops.Nonce == nil {
		if c.apiClient == nil {
			return nil, fmt.Errorf("nonce was not provided & HTTPClient is nil. Either provide the nonce or enable HTTPClient to get the nonce from Lighter")
		}
		nonce, err := c.apiClient.GetNextNonce(*ops.FromAccountIndex, *ops.ApiKeyIndex)
		if err != nil {
			return nil, err
		}
		ops.Nonce = &nonce
	}

	return ops, nil
}

func (c *TxClient) GetAccountIndex() int64 {
	return c.accountIndex
}

func (c *TxClient) GetApiKeyIndex() uint8 {
	return c.apiKeyIndex
}

func (c *TxClient) GetKeyManager() signer.KeyManager {
	return c.keyManager
}

func (c *TxClient) GetAuthToken(deadline time.Time) (string, error) {
	if time.Until(deadline) > (7 * time.Hour) {
		return "", fmt.Errorf("deadline should be within 7 hours")
	}

	return types.ConstructAuthToken(c.keyManager, deadline, &types.TransactOpts{
		ApiKeyIndex:      &c.apiKeyIndex,
		FromAccountIndex: &c.accountIndex,
	})
}

func (c *TxClient) HTTP() *HTTPClient {
	return c.apiClient
}

func (c *TxClient) SwitchAPIKey(apiKey uint8) {
	c.apiKeyIndex = apiKey
}
