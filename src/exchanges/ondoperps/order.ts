import { createOrderHandlers } from "../order-handlers";

const handlers = createOrderHandlers({
  exchangeName: "Ondo Perps",
  defaultLimitTimeInForce: "GTX",
  defaultMarketTimeInForce: "IOC",
  defaultCloseTimeInForce: "IOC",
  defaultStopTimeInForce: "GTC",
  defaultStopTriggerType: "STOP_LOSS",
  supportsTrailingStop: false,
  supportsTriggerType: true,
  stopDefaultReduceOnly: true,
  stopDefaultClosePosition: true,
  closeDefaultClosePosition: true,
});

export const {
  createLimitOrder,
  createMarketOrder,
  createStopOrder,
  createTrailingStopOrder,
  createClosePositionOrder,
} = handlers;
