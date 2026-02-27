package txtypes

import (
	"encoding/json"
	"fmt"
	"strings"

	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
	gQuint "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

const (
	TemplateChangePubKey = "Register Lighter Account\n\npubkey: 0x%s\nnonce: %s\naccount index: %s\napi key index: %s\nOnly sign this message for a trusted client!"
	TemplateTransfer     = "Transfer\n\nnonce: %s\nfrom: %s (route %s)\napi key: %s\nto: %s (route %s)\nasset: %s\namount: %s\nfee: %s" +
		"\nchainId: %s\nmemo: %s\nOnly sign this message for a trusted client!"
	TemplateSubAccount = "Create Lighter Sub Account\n\nmaster account index: %s\nOnly sign this message for a trusted client!"
)

const SignatureLength = 80
const L1SignatureLength = 65
const PubKeyLength = gFp5.Bytes
const HashLength = gQuint.Bytes

func IsValidPubKeyLength(bytes []byte) bool {
	return len(bytes) == gFp5.Bytes
}

func IsZeroByteSlice(bytes []byte) bool {
	for _, s := range bytes {
		if s != 0 {
			return false
		}
	}
	return true
}

func getTxInfo(tx interface{}) (string, error) {
	txInfoBytes, err := json.Marshal(tx)
	if err != nil {
		return "", err
	}
	return string(txInfoBytes), nil
}

func getHex10FromUint64(value uint64) string {
	v := hexutil.EncodeUint64(value)
	v = strings.Replace(v, "0x", "", 1)

	// Make sure result has fixed bytes
	vBytes := []byte(v)
	if len(vBytes) < 16 {
		toAppend := make([]byte, 16-len(vBytes))
		for i := range toAppend {
			toAppend[i] = 48
		}
		vBytes = append(toAppend, vBytes...)
	}

	return fmt.Sprintf("0x%s", string(vBytes))
}

func calculateL1AddressBySignature(signatureBody, l1Signature string) common.Address {
	message := accounts.TextHash([]byte(signatureBody))
	// Decode from signature string to get the signature byte array
	signatureContent, err := hexutil.Decode(l1Signature)
	if err != nil {
		return [20]byte{}
	}

	// Transform yellow paper V from 27/28 to 0/1
	if signatureContent[64] >= 27 {
		signatureContent[64] -= 27
	}

	// Calculate the public key from the signature and source string
	signaturePublicKey, err := crypto.SigToPub(message, signatureContent)
	if err != nil {
		return [20]byte{}
	}

	// Calculate the address from the public key
	publicAddress := crypto.PubkeyToAddress(*signaturePublicKey)
	return publicAddress
}
