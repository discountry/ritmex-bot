import React from "react";
import { render } from "ink";
import { App } from "./ui/App";
import { setupGlobalErrorHandlers } from "./runtime-errors";
import { parseCliArgs, printCliHelp } from "./cli/args";
import { startStrategy } from "./cli/strategy-runner";

setupGlobalErrorHandlers();
const options = parseCliArgs();

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
