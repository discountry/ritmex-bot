import logging
import asyncio
import lighter
from lighter import Asset
from utils import default_example_setup

# This example shows how to fetch order books and assets details
# This information should be enough to be able to trade on Lighter
# Select the market ID accordingly to the symbol.
# For spot markets, the order book contains base asset (ETH) and quote asset (USDC)
# You can use these to keep track of your inventory
async def main():
    client, api_client, _ = default_example_setup()
    logging.basicConfig(level=logging.INFO)

    orders_api = lighter.OrderApi(api_client)
    response = await orders_api.order_books()
    response.order_books.sort(key=lambda x: x.market_id)

    # fetch all assets
    assets_response = await orders_api.asset_details()

    assets_dict: dict[int, Asset] = {}
    for asset in assets_response.asset_details:
        assets_dict[asset.asset_id] = asset

    for order_book in response.order_books:
        if order_book.market_type == 'perp':
            print(f'symbol={order_book.symbol} id={order_book.market_id} type={order_book.market_type} sizeDecimals={order_book.supported_size_decimals} priceDecimals={order_book.supported_price_decimals}')
        else:
            print(f'symbol={order_book.symbol} id={order_book.market_id} type={order_book.market_type} sizeDecimals={order_book.supported_size_decimals} priceDecimals={order_book.supported_price_decimals} baseAssetId={order_book.base_asset_id} quoteAssetId={order_book.quote_asset_id}')
            b = assets_dict[order_book.base_asset_id]
            q = assets_dict[order_book.quote_asset_id]
            print(f'    baseAsset:  symbol={b.symbol} assetId={b.asset_id} decimals={b.decimals} price={b.index_price} min_withdraw={b.min_withdrawal_amount}')
            print(f'    quoteAsset: symbol={q.symbol} assetId={q.asset_id} decimals={q.decimals} price={q.index_price} min_withdraw={q.min_withdrawal_amount}')


    await client.close()
    await api_client.close()

if __name__ == "__main__":
    asyncio.run(main())
