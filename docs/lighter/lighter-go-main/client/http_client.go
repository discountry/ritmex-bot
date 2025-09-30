package client

import (
	"crypto/tls"
	"net"
	"net/http"
	"time"
)

var (
	dialer = &net.Dialer{
		Timeout:   10 * time.Second,
		KeepAlive: 60 * time.Second,
	}
	transport = &http.Transport{
		DialContext:         dialer.DialContext,
		MaxConnsPerHost:     1000,
		MaxIdleConnsPerHost: 100,
		IdleConnTimeout:     10 * time.Second,
		TLSClientConfig:     &tls.Config{InsecureSkipVerify: true},
	}

	httpClient = &http.Client{
		Timeout:   time.Second * 30,
		Transport: transport,
	}
)

type HTTPClient struct {
	endpoint            string
	channelName         string
	fatFingerProtection bool
}

func NewHTTPClient(baseUrl string) *HTTPClient {
	if baseUrl == "" {
		return nil
	}

	return &HTTPClient{
		endpoint:            baseUrl,
		channelName:         "",
		fatFingerProtection: true,
	}
}

func (c *HTTPClient) SetFatFingerProtection(enabled bool) {
	c.fatFingerProtection = enabled
}
