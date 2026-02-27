import json
import logging
import sys
import time

logging.basicConfig(level=logging.INFO, force=True)


def main():
    if len(sys.argv) == 1:
        logging.error("No account index specified")
        return

    account_index = sys.argv[1]

    # Load pre-generated tokens
    with open('auth-tokens.json') as f:
        auth_tokens = json.load(f)

    # Get current aligned timestamp (6-hour boundary)
    current_timestamp = (int(time.time()) // (6 * 3600)) * (6 * 3600)

    # Look up token for specific account
    auth_token = auth_tokens[account_index][str(current_timestamp)]

    print(f"{auth_token=}")


if __name__ == "__main__":
    main()
