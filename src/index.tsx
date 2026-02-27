import React from "react";
import { render } from "ink";
import { App } from "./ui/App";
import { setupGlobalErrorHandlers } from "./runtime-errors";
import { parseCliArgs, printCliHelp } from "./cli/args";
import { startStrategy } from "./cli/strategy-runner";
import { resolveExchangeId } from "./exchanges/create-adapter";
import { CommandParseError, parseCommandArgv, printCommandHelp } from "./cli/command-parser";
import { executeCliCommand, renderCommandPayload } from "./cli/command-executor";

setupGlobalErrorHandlers();
void run();

async function run(): Promise<void> {
  const rawArgv = process.argv.slice(2);

  try {
    const parsedCommand = parseCommandArgv(rawArgv);
    if (parsedCommand) {
      if (parsedCommand.kind === "help") {
        printCommandHelp(parsedCommand.topic);
        process.exit(0);
      }
      const result = await executeCliCommand(parsedCommand);
      const output = renderCommandPayload(result.payload, parsedCommand.json);
      if (result.payload.success) {
        console.log(output);
      } else {
        console.error(output);
      }
      if (result.forceExit) {
        process.exit(result.exitCode);
      }
      return;
    }
  } catch (error) {
    if (error instanceof CommandParseError) {
      console.error(`[CLI] ${error.message}`);
      process.exit(2);
    }
    throw error;
  }

  const options = parseCliArgs(rawArgv);
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
}
