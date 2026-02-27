package http

import (
	"crypto/tls"
	"net"
	"net/http"
	"time"

	core "github.com/elliottech/lighter-go/client"
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
		TLSClientConfig:     &tls.Config{InsecureSkipVerify: false},
	}

	httpClient = &http.Client{
		Timeout:   time.Second * 30,
		Transport: transport,
	}
)

var _ core.MinimalHTTPClient = (*client)(nil)

type client struct {
	endpoint string
}

func NewClient(baseUrl string) core.MinimalHTTPClient {
	if baseUrl == "" {
		return nil
	}

	return &client{
		endpoint: baseUrl,
	}
}
