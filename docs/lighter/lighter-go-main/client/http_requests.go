package client

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/elliottech/lighter-go/types/txtypes"
)

func (c *HTTPClient) parseResultStatus(respBody []byte) error {
	resultStatus := &ResultCode{}
	if err := json.Unmarshal(respBody, resultStatus); err != nil {
		return err
	}
	if resultStatus.Code != CodeOK {
		return errors.New(resultStatus.Message)
	}
	return nil
}

func (c *HTTPClient) getAndParseL2HTTPResponse(path string, params map[string]any, result interface{}) error {
	u, err := url.Parse(c.endpoint)
	if err != nil {
		return err
	}
	u.Path = path

	q := u.Query()
	for k, v := range params {
		q.Set(k, fmt.Sprintf("%v", v))
	}
	u.RawQuery = q.Encode()
	resp, err := httpClient.Get(u.String())
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	if resp.StatusCode != http.StatusOK {
		return errors.New(string(body))
	}
	if err = c.parseResultStatus(body); err != nil {
		return err
	}
	if err := json.Unmarshal(body, result); err != nil {
		return err
	}
	return nil
}

func (c *HTTPClient) GetNextNonce(accountIndex int64, apiKeyIndex uint8) (int64, error) {
	result := &NextNonce{}
	err := c.getAndParseL2HTTPResponse("api/v1/nextNonce", map[string]any{"account_index": accountIndex, "api_key_index": apiKeyIndex}, result)
	if err != nil {
		return -1, err
	}
	return result.Nonce, nil
}

func (c *HTTPClient) GetApiKey(accountIndex int64, apiKeyIndex uint8) (*AccountApiKeys, error) {
	result := &AccountApiKeys{}
	err := c.getAndParseL2HTTPResponse("api/v1/apikeys", map[string]any{"account_index": accountIndex, "api_key_index": apiKeyIndex}, result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (c *HTTPClient) SendRawTx(tx txtypes.TxInfo) (string, error) {
	txType := tx.GetTxType()
	txInfo, err := tx.GetTxInfo()
	if err != nil {
		return "", err
	}

	data := url.Values{"tx_type": {strconv.Itoa(int(txType))}, "tx_info": {txInfo}}

	if c.fatFingerProtection == false {
		data.Add("price_protection", "false")
	}

	req, _ := http.NewRequest("POST", c.endpoint+"/api/v1/sendTx", strings.NewReader(data.Encode()))
	req.Header.Set("Channel-Name", c.channelName)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	if resp.StatusCode != http.StatusOK {
		return "", errors.New(string(body))
	}
	if err = c.parseResultStatus(body); err != nil {
		return "", err
	}
	res := &TxHash{}
	if err := json.Unmarshal(body, res); err != nil {
		return "", err
	}

	return res.TxHash, nil
}

func (c *HTTPClient) GetTransferFeeInfo(accountIndex, toAccountIndex int64, auth string) (*TransferFeeInfo, error) {
	result := &TransferFeeInfo{}
	err := c.getAndParseL2HTTPResponse("api/v1/transferFeeInfo", map[string]any{
		"account_index":    accountIndex,
		"to_account_index": toAccountIndex,
		"auth":             auth,
	}, result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
