package http

const (
	CodeOK = 200
)

type ResultCode struct {
	Code    int32  `json:"code,example=200"`
	Message string `json:"message,omitempty"`
}

type NextNonce struct {
	ResultCode
	Nonce int64 `json:"nonce,example=722"`
}

type ApiKey struct {
	AccountIndex int64  `json:"account_index,example=3"`
	ApiKeyIndex  uint8  `json:"api_key_index,example=0"`
	Nonce        int64  `json:"nonce,example=722"`
	PublicKey    string `json:"public_key"`
}

type AccountApiKeys struct {
	ResultCode
	ApiKeys []*ApiKey `json:"api_keys"`
}
