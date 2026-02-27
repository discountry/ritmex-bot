package client

type MinimalHTTPClient interface {
	GetNextNonce(accountIndex int64, apiKeyIndex uint8) (int64, error)
	GetApiKey(accountIndex int64, apiKeyIndex uint8) (string, error)
}
