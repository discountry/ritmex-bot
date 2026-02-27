import json
from websockets.sync.client import connect
from websockets.client import connect as connect_async
from lighter.configuration import Configuration

class WsClient:
    def __init__(
        self,
        host=None,
        path="/stream",
        order_book_ids=[],
        account_ids=[],
        on_order_book_update=print,
        on_account_update=print,
    ):
        if host is None:
            host = Configuration.get_default().host.replace("https://", "")

        self.base_url = f"wss://{host}{path}"

        self.subscriptions = {
            "order_books": order_book_ids,
            "accounts": account_ids,
        }

        if len(order_book_ids) == 0 and len(account_ids) == 0:
            raise Exception("No subscriptions provided.")

        self.order_book_states = {}
        self.account_states = {}

        self.on_order_book_update = on_order_book_update
        self.on_account_update = on_account_update

        self.ws = None

    def on_message(self, ws, message):
        if isinstance(message, str):
            message = json.loads(message)

        message_type = message.get("type")

        if message_type == "connected":
            self.handle_connected(ws)
        elif message_type == "subscribed/order_book":
            self.handle_subscribed_order_book(message)
        elif message_type == "update/order_book":
            self.handle_update_order_book(message)
        elif message_type == "subscribed/account_all":
            self.handle_subscribed_account(message)
        elif message_type == "update/account_all":
            self.handle_update_account(message)
        elif message_type == "ping":
            # Respond to ping with pong
            ws.send(json.dumps({"type": "pong"}))
        else:
            self.handle_unhandled_message(message)

    async def on_message_async(self, ws, message):
        message = json.loads(message)
        message_type = message.get("type")

        if message_type == "connected":
            await self.handle_connected_async(ws)
        elif message_type == "ping":
            # Respond to ping with pong
            await ws.send(json.dumps({"type": "pong"}))
        else:
            self.on_message(ws, message)

    def handle_connected(self, ws):
        for market_id in self.subscriptions["order_books"]:
            ws.send(
                json.dumps({"type": "subscribe", "channel": f"order_book/{market_id}"})
            )
        for account_id in self.subscriptions["accounts"]:
            ws.send(
                json.dumps(
                    {"type": "subscribe", "channel": f"account_all/{account_id}"}
                )
            )

    async def handle_connected_async(self, ws):
        for market_id in self.subscriptions["order_books"]:
            await ws.send(
                json.dumps({"type": "subscribe", "channel": f"order_book/{market_id}"})
            )
        for account_id in self.subscriptions["accounts"]:
            await ws.send(
                json.dumps(
                    {"type": "subscribe", "channel": f"account_all/{account_id}"}
                )
            )

    def handle_subscribed_order_book(self, message):
        market_id = message["channel"].split(":")[1]
        self.order_book_states[market_id] = message["order_book"]
        if self.on_order_book_update:
            self.on_order_book_update(market_id, self.order_book_states[market_id])

    def handle_update_order_book(self, message):
        market_id = message["channel"].split(":")[1]
        self.update_order_book_state(market_id, message["order_book"])
        if self.on_order_book_update:
            self.on_order_book_update(market_id, self.order_book_states[market_id])

    def update_order_book_state(self, market_id, order_book):
        self.update_orders(
            order_book["asks"], self.order_book_states[market_id]["asks"]
        )
        self.update_orders(
            order_book["bids"], self.order_book_states[market_id]["bids"]
        )

    def update_orders(self, new_orders, existing_orders):
        for new_order in new_orders:
            is_new_order = True
            for existing_order in existing_orders:
                if new_order["price"] == existing_order["price"]:
                    is_new_order = False
                    existing_order["size"] = new_order["size"]
                    if float(new_order["size"]) == 0:
                        existing_orders.remove(existing_order)
                    break
            if is_new_order:
                existing_orders.append(new_order)

        existing_orders = [
            order for order in existing_orders if float(order["size"]) > 0
        ]

    def handle_subscribed_account(self, message):
        account_id = message["channel"].split(":")[1]
        self.account_states[account_id] = message
        if self.on_account_update:
            self.on_account_update(account_id, self.account_states[account_id])

    def handle_update_account(self, message):
        account_id = message["channel"].split(":")[1]
        self.account_states[account_id] = message
        if self.on_account_update:
            self.on_account_update(account_id, self.account_states[account_id])

    def handle_unhandled_message(self, message):
        raise Exception(f"Unhandled message: {message}")

    def on_error(self, ws, error):
        raise Exception(f"Error: {error}")

    def on_close(self, ws, close_status_code, close_msg):
        raise Exception(f"Closed: {close_status_code} {close_msg}")

    def run(self):
        ws = connect(self.base_url)
        self.ws = ws

        for message in ws:
            self.on_message(ws, message)

    async def run_async(self):
        ws = await connect_async(self.base_url)
        self.ws = ws

        async for message in ws:
            await self.on_message_async(ws, message)
