import asyncio
import websockets
from utils import default_example_setup, ws_send_tx


async def main():
    client, api_client, ws_client_promise = default_example_setup()

    # set up WS client and print a connected message
    ws_client: websockets.ClientConnection = await ws_client_promise
    print("Received:", await ws_client.recv())

    # Note: the HTTP method `update_margin` receives `usdc_amount` (float) as the argument,
    # while the WS one that calls `sign_update_margin` to get the TX to send it directly over WS
    # receives `usdc_amount` (int) as the argument, which is the float one * 1_000_000
    # this was kept this way to not break backwards compatibility. Ideally, they would be consistent.

    tx_type, tx_info, tx_hash, err = client.sign_update_margin(
        market_index=0,
        usdc_amount=5_000_000,  # 5 USDC
        direction=client.ISOLATED_MARGIN_REMOVE_COLLATERAL
    )
    if err is not None:
        raise Exception(err)
    await ws_send_tx(ws_client, tx_type, tx_info, tx_hash)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
