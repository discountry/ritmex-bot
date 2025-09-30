import json
import logging
import lighter

logging.basicConfig(level=logging.INFO)


def on_order_book_update(market_id, order_book):
    logging.info(f"Order book {market_id}:\n{json.dumps(order_book, indent=2)}")


def on_account_update(account_id, account):
    logging.info(f"Account {account_id}:\n{json.dumps(account, indent=2)}")


client = lighter.WsClient(
    order_book_ids=[0, 1],
    account_ids=[1, 2],
    on_order_book_update=on_order_book_update,
    on_account_update=on_account_update,
)

client.run()
