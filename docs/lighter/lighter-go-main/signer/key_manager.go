package signer

import (
	"fmt"
	"hash"

	curve "github.com/elliottech/poseidon_crypto/curve/ecgfp5"
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
	schnorr "github.com/elliottech/poseidon_crypto/signature/schnorr"
)

type Signer interface {
	Sign(message []byte, hFunc hash.Hash) ([]byte, error)
}

type KeyManager interface {
	Signer
	PubKey() gFp5.Element
	PubKeyBytes() [40]byte
	PrvKeyBytes() []byte
}

type keyManager struct {
	key curve.ECgFp5Scalar
}

func NewKeyManager(b []byte) (KeyManager, error) {
	if len(b) != 40 {
		return nil, fmt.Errorf("invalid private key length. expected: 40 got: %v", len(b))
	}
	return &keyManager{key: curve.ScalarElementFromLittleEndianBytes(b)}, nil
}

func (key *keyManager) Sign(hashedMessage []byte, hFunc hash.Hash) ([]byte, error) {
	hashedMessageAsQuinticExtension, err := gFp5.FromCanonicalLittleEndianBytes(hashedMessage)
	if err != nil {
		return nil, fmt.Errorf("failed to parse message while signing. message: %v err: %w", hashedMessage, err)
	}
	return schnorr.SchnorrSignHashedMessage(hashedMessageAsQuinticExtension, key.key).ToBytes(), nil
}

func (key *keyManager) PubKey() gFp5.Element {
	return schnorr.SchnorrPkFromSk(key.key)
}

func (key *keyManager) PubKeyBytes() (res [40]byte) {
	bytes := key.PubKey().ToLittleEndianBytes()
	copy(res[:], bytes[:])
	return
}

func (key *keyManager) PrvKeyBytes() []byte {
	return key.key.ToLittleEndianBytes()
}
