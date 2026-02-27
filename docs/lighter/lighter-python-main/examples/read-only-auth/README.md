# Read-Only Auth Token Pre-Generation

This example demonstrates how to pre-generate authentication tokens for read-only operations on the Lighter platform. By generating tokens ahead of time, you can avoid needing access to your API private keys during runtime for read-only queries.

## Overview

Authentication tokens on Lighter have a maximum expiry of 8 hours. This example allows you to:

1. Configure a dedicated API key (index 253) for all your accounts
2. Pre-generate authentication tokens for future time periods
3. Use these tokens for read-only operations without exposing your private keys

The tokens are generated at 6-hour intervals (aligned to Unix timestamp // 6 hours), with each token valid for 8 hours. This provides an overlap period ensuring continuous coverage.

## Setup

The setup script configures API key 253 for all accounts associated with your Ethereum private key.

### Running Setup

```bash
cd examples/read-only-auth
python3 setup.py config.json
```

This will:
- Query all accounts for your L1 address
- Generate new API key pairs for each account
- Change API key 253 to use the new keys
- Output configuration in JSON format

### Configuration Variables

Edit the constants in `setup.py`:

```python
BASE_URL = "https://testnet.zklighter.elliot.ai"
ETH_PRIVATE_KEY = "your_ethereum_private_key_here"
API_KEY_INDEX = 253  # Using 253 as it's typically unused
```

### Config Format

```json
{
  "BASE_URL": "https://testnet.zklighter.elliot.ai",
  "ACCOUNTS": [
    {
      "api_key_private_key": "...",
      "account_index": 0,
      "api_key_index": 253
    },
    {
      "api_key_private_key": "...",
      "account_index": 1,
      "api_key_index": 253
    }
  ]
}
```

## Generating Tokens

The generation script creates authentication tokens for future time periods.

### Running Generation

```bash
NUM_DAYS=10 python3 generate.py config.json
```

If no config file is specified, it defaults to `config.json`.

### Duration Configuration

You can specify the duration in days using the `NUM_DAYS` environment variable, as in the command above.
If the value is not specified, it defaults to 28 days.

### Output Format

The script generates `auth-tokens.json`:

```json
{
  "0": {
    "1697184000": "auth_token_string_1",
    "1697205600": "auth_token_string_2",
    "1697227200": "auth_token_string_3"
  },
  "1": {
    "1697184000": "auth_token_string_1",
    "1697205600": "auth_token_string_2"
  }
}
```

Where:
- First level key: account index
- Second level key: Unix timestamp (aligned to 6-hour boundaries)
- Value: authentication token

## Usage

### Looking Up Tokens

Check the `get_auth_token.py` script which prints the Auth Token that should be used **at this moment**, as this will be invalidated in at most 8 hours.

### Time Alignment

All timestamps are aligned to 6-hour boundaries:
- Timestamps are divisible by 21600 seconds (6 hours)
- Calculation: `unix_timestamp // (6 * 3600) * (6 * 3600)`
- This ensures consistent token lookup across different systems

### Token Expiry

Each token is valid for 8 hours from its timestamp:
- Token timestamp: aligned to 6-hour boundary
- Valid until: timestamp + 8 hours
- This provides 2 hours of overlap between consecutive tokens

## Security

### API Key 253

We use API key index 253 because:
- It's the last available index [0-253]
- It's not typically used by trading
- Easy to remember for this specific use case
- Easy to change and invalidate all tokens.

### Invalidating Tokens

To invalidate all existing tokens:

```bash
python3 setup.py config.json
```

Re-running the setup script generates new API keys for index 253, which invalidates all previously generated authentication tokens. This is useful if:
- You suspect your tokens have been compromised
- You want to rotate your tokens periodically
- You need to revoke access immediately

### Best Practices

1. **Store tokens securely**: The `auth-tokens.json` file contains sensitive data (read only, but still)
2. **Dedicated API key**: Use API key 253 for read-only token generation, as it can be invalidated easely.


## Troubleshooting

### "Account not found" error

Make sure your Ethereum private key corresponds to an account registered on the Lighter platform.

### "Failed to change API key" error

This could happen if:
- The API key change transaction failed
- Network connectivity issues
- The account is not active

## Additional Notes

- Tokens are specific to each account index
- Each account has its own set of time-aligned tokens
- The system uses the SignerClient's native `create_auth_token_with_expiry` method
