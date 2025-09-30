package txtypes

import "encoding/json"

func IsValidPubKey(bytes []byte) bool {
	if len(bytes) != 40 {
		return false
	}

	return !isZeroByteSlice(bytes)
}

func isZeroByteSlice(bytes []byte) bool {
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
