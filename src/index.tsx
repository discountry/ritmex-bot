import React from "react";
import { render } from "ink";
import { App } from "./ui/App";
import { setupGlobalErrorHandlers } from "./runtime-errors";
import { parseCliArgs, printCliHelp } from "./cli/args";
import { startStrategy } from "./cli/strategy-runner";
import { resolveExchangeId } from "./exchanges/create-adapter";

setupGlobalErrorHandlers();
const options = parseCliArgs();
// If user specifies --exchange, override environment-based resolution for this process
if (options.exchange) {
  // Ensure downstream calls to resolveExchangeId() pick the CLI value.
  // We set both common env keys respected by resolveExchangeId.
  process.env.EXCHANGE = options.exchange;
  process.env.TRADE_EXCHANGE = options.exchange;
}

if (options.help) {
  printCliHelp();
  process.exit(0);
}

if (options.strategy) {
  startStrategy(options.strategy, { silent: options.silent })
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Strategy] Failed to start: ${message}`);
      process.exit(1);
    });
} else {
  render(<App />);
}
