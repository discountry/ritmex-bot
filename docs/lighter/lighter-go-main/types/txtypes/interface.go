package txtypes

import g "github.com/elliottech/poseidon_crypto/field/goldilocks"

type TxInfo interface {
	GetTxType() uint8

	GetTxInfo() (string, error)

	// GetTxHash returns the hash that was signed when creating this transaction.
	// The hash coincides with the TxHash received from Lighter after submitting this Tx.
	// It can be used to get the TxHash in advance, or to double-check the correctness of the SDK.
	// As this hash is signed by the ApiKey, if the value differs than the one computed by the server,
	// it'll result in an invalid signature.
	// Returns empty string if the Tx is not signed.
	GetTxHash() string

	Validate() error

	Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error)
}

type OrderInfo struct {
	MarketIndex uint8

	ClientOrderIndex int64

	BaseAmount int64
	Price      uint32
	IsAsk      uint8

	Type         uint8
	TimeInForce  uint8
	ReduceOnly   uint8
	TriggerPrice uint32
	OrderExpiry  int64
}
