import asyncio
from lighter.signer_client import CreateOrderTxReq
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # Creates a position tied SL/TP pair
    # The SL/TP orders will close your whole position, even if you add/remove from it later on
    # if the positions reach 0 or switches from short -> long, the orders are canceled

    # this particular example, sets the SL/TP for a short position
    # set SL trigger price at 5000 and limit price at 5050
    # set TP trigger price at 1500 and limit price at 1550
    # Note: set the limit price to be higher than the SL/TP trigger price to ensure the order will be filled
    # If the mark price of ETH reaches 1500, there might be no one willing to sell you ETH at 1500, so trying to buy at 1550 would increase the fill rate

    # Create a One-Cancels-the-Other grouped order with a take-profit and a stop-loss order
    take_profit_order = CreateOrderTxReq(
        MarketIndex=0,
        ClientOrderIndex=0,
        BaseAmount=0,
        Price=1550_00,
        IsAsk=0,
        Type=client.ORDER_TYPE_TAKE_PROFIT_LIMIT,
        TimeInForce=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        ReduceOnly=1,
        TriggerPrice=1500_00,
        OrderExpiry=-1,
    )

    stop_loss_order = CreateOrderTxReq(
        MarketIndex=0,
        ClientOrderIndex=0,
        BaseAmount=0,
        Price=4050_00,
        IsAsk=0,
        Type=client.ORDER_TYPE_STOP_LOSS_LIMIT,
        TimeInForce=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        ReduceOnly=1,
        TriggerPrice=4000_00,
        OrderExpiry=-1,
    )

    transaction = await client.create_grouped_orders(
        grouping_type=client.GROUPING_TYPE_ONE_CANCELS_THE_OTHER,
        orders=[take_profit_order, stop_loss_order],
    )

    print("Create Grouped Order Tx:", transaction)
    await client.close()
    await api_client.close()

if __name__ == "__main__":
    asyncio.run(main())
