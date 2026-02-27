package client

import (
	"fmt"
	"strings"
	"sync"

	curve "github.com/elliottech/poseidon_crypto/curve/ecgfp5"
	schnorr "github.com/elliottech/poseidon_crypto/signature/schnorr"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

// SharedClientManager holds the global txClient and backupTxClients
// This will be managed by both sharedlib and wasm builds
// Supports multiple accounts and API keys with thread safety
var (
	txClientMu              sync.Mutex
	defaultTxClient         *TxClient
	defaultClientPerAccount = make(map[int64]*TxClient)
	allTxClients            map[int64]map[uint8]*TxClient // accountIndex -> apiKeyIndex -> client
)

// GenerateAPIKey generates a new API key pair from a seed
func GenerateAPIKey(seed string) (string, string, error) {
	var seedP *string
	if seed != "" {
		seedP = &seed
	}

	key := curve.SampleScalar(seedP)
	publicKeyStr := hexutil.Encode(schnorr.SchnorrPkFromSk(key).ToLittleEndianBytes())
	privateKeyStr := hexutil.Encode(key.ToLittleEndianBytes())

	return privateKeyStr, publicKeyStr, nil
}

// GetClient retrieves a client for specific account and API key
// If apiKeyIndex==255 && accountIndex==-1, returns default client
func GetClient(apiKeyIndex uint8, accountIndex int64) (*TxClient, error) {
	txClientMu.Lock()
	defer txClientMu.Unlock()

	if apiKeyIndex == 255 && accountIndex != -1 {
		client := defaultClientPerAccount[accountIndex]
		if client != nil {
			return client, nil
		}
	}

	// Special case: return default client
	if apiKeyIndex == 255 && accountIndex == -1 {
		if defaultTxClient == nil {
			return nil, fmt.Errorf("client is not created, call CreateClient() first")
		}
		return defaultTxClient, nil
	}

	// Look up client in double map
	var c *TxClient
	if allTxClients[accountIndex] != nil {
		c = allTxClients[accountIndex][apiKeyIndex]
	}

	if c == nil {
		return nil, fmt.Errorf("client is not created for apiKeyIndex: %v accountIndex: %v", apiKeyIndex, accountIndex)
	}
	return c, nil
}

// CreateClient creates a new TxClient and stores it
// httpClientFactory is a function that creates an HTTP client from a URL string
func CreateClient(httpClient MinimalHTTPClient, privateKey string, chainId uint32, apiKeyIndex uint8, accountIndex int64) (*TxClient, error) {
	if accountIndex <= 0 {
		return nil, fmt.Errorf("invalid account index")
	}

	txClientInstance, err := NewTxClient(httpClient, privateKey, accountIndex, apiKeyIndex, chainId)
	if err != nil {
		return nil, fmt.Errorf("error occurred when creating TxClient. err: %v", err)
	}

	txClientMu.Lock()
	if allTxClients == nil {
		allTxClients = make(map[int64]map[uint8]*TxClient)
	}
	if allTxClients[accountIndex] == nil {
		allTxClients[accountIndex] = make(map[uint8]*TxClient)
	}
	allTxClients[accountIndex][apiKeyIndex] = txClientInstance

	// Update default client (most recently created becomes default)
	defaultTxClient = txClientInstance
	defaultClientPerAccount[accountIndex] = txClientInstance
	txClientMu.Unlock()

	return txClientInstance, nil
}

// Check validates that the client exists and the API key matches the one on the server
func (c *TxClient) Check() error {
	// check that the API key registered on Lighter matches this one
	publicKey, err := c.HTTP().GetApiKey(c.accountIndex, c.apiKeyIndex)
	if err != nil {
		return fmt.Errorf("failed to get Api Keys. err: %v", err)
	}

	pubKeyBytes := c.GetKeyManager().PubKeyBytes()
	pubKeyStr := hexutil.Encode(pubKeyBytes[:])
	pubKeyStr = strings.Replace(pubKeyStr, "0x", "", 1)

	if publicKey != pubKeyStr {
		return fmt.Errorf("private key does not match the one on Lighter. ownPubKey: %s response: %+v", pubKeyStr, publicKey)
	}

	return nil
}
