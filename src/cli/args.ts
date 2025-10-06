export type StrategyId = 'trend' | 'maker' | 'offset-maker';

export interface CliOptions {
   strategy?: StrategyId;
   silent: boolean;
   help: boolean;
   exchange?: 'aster' | 'grvt' | 'lighter' | 'backpack';
}

const STRATEGY_VALUES = new Set<StrategyId>(['trend', 'maker', 'offset-maker']);

export function parseCliArgs(argv: string[] = process.argv.slice(2)): CliOptions {
   const options: CliOptions = { silent: false, help: false };

   for (let i = 0; i < argv.length; i += 1) {
      const arg = argv[i];
      if (!arg) { continue; }

      if (arg === '--silent' || arg === '-q' || arg === '--quiet') {
         options.silent = true;
         continue;
      }
      if (arg === '--help' || arg === '-h') {
         options.help = true;
         continue;
      }
      if (arg.startsWith('--strategy=')) {
         const value = arg.split('=', 2)[1] ?? '';
         assignStrategy(options, value);
         continue;
      }
      if (arg === '--strategy' || arg === '-s') {
         const value = argv[i + 1];
         if (value) {
            assignStrategy(options, value);
            i += 1;
         }
         continue;
      }
      if (arg.startsWith('--exchange=')) {
         const value = arg.split('=', 2)[1] ?? '';
         assignExchange(options, value);
         continue;
      }
      if (arg === '--exchange' || arg === '-e') {
         const value = argv[i + 1];
         if (value) {
            assignExchange(options, value);
            i += 1;
         }
      }
   }

   return options;
}

function assignStrategy(options: CliOptions, raw: string): void {
   const normalized = raw.trim().toLowerCase();
   if (!normalized) { return; }
   if (STRATEGY_VALUES.has(normalized as StrategyId)) {
      options.strategy = normalized as StrategyId;
   } else if (normalized === 'offset' || normalized === 'offsetmaker' || normalized === 'offset-maker') {
      options.strategy = 'offset-maker';
   }
}

function assignExchange(options: CliOptions, raw: string): void {
   const normalized = raw.trim().toLowerCase();
   if (!normalized) { return; }
   if (normalized === 'aster' || normalized === 'grvt' || normalized === 'lighter' || normalized === 'backpack') {
      options.exchange = normalized as CliOptions['exchange'];
   } else if (normalized === 'gravity' || normalized === 'grav' || normalized === 'grv') {
      options.exchange = 'grvt';
   }
}

export function printCliHelp(): void {
   // eslint-disable-next-line no-console
   console.log(
      `Usage: bun run index.ts [--strategy <trend|maker|offset-maker>] [--exchange <aster|grvt|lighter|backpack>] [--silent]\n\n` +
         `Options:\n` +
         `  --strategy, -s    Automatically start the specified strategy without the interactive menu.\n` +
         `                    Aliases: offset, offset-maker for the offset maker engine.\n` +
         `  --exchange, -e    Choose exchange. Overrides EXCHANGE/TRADE_EXCHANGE environment variables.\n` +
         `  --silent, -q      Reduce console output. When used with --strategy, runs in silent daemon mode.\n` +
         `  --help, -h        Show this help message.\n`,
   );
}
