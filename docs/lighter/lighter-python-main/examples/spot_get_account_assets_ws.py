import json
import logging
import asyncio
import websockets

from lighter.models import WSAccountAssets
from utils import default_example_setup, ws_subscribe, ws_ping


async def consume_messages(ws):
    while True:
        msg_str = await ws.recv()
        if isinstance(msg_str, str):
            msg = json.loads(msg_str)
        else:
            raise msg_str

        # handle ping here; if we receive, send pong
        if msg["type"] == "ping":
            await ws_ping(ws)
            continue

        # handle account_all_assets updates -- just print stuff
        if msg["type"] == "subscribed/account_all_assets" or msg["type"] == "update/account_all_assets" :
            o = WSAccountAssets.from_dict(msg)
            for asset in o.assets.values():
                print(f"{asset.symbol} total: {asset.balance} available: {float(asset.balance) - float(asset.locked_balance)} accountId: {o.account_id}")


async def main():
    client, api_client, ws_client_promise = default_example_setup()
    logging.basicConfig(level=logging.INFO)

    # set up WS client and print a connected message
    ws_client: websockets.ClientConnection = await ws_client_promise
    await ws_client.recv()

    consume_task = asyncio.create_task(consume_messages(ws_client))

    auth, _ = client.create_auth_token_with_expiry()
    await ws_subscribe(ws_client, f"account_all_assets/{client.account_index}", auth)

    # wait a bit to print messages
    await asyncio.sleep(1000)

    consume_task.cancel()
    await client.close()
    await api_client.close()
    await ws_client.close()


if __name__ == "__main__":
    asyncio.run(main())
