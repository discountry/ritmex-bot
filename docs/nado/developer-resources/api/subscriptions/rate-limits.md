# Rate limits

Each IP address is restricted to a maximum of **100** active websocket connections. Additionally, a **single wallet address** can be authenticated by up to **5** websocket connections, regardless of the originating IP address. Connections exceeding these limits will be automatically disconnected.
