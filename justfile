set shell := ["cmd.exe", "/c"]
set dotenv-load

default: help
help:
  just -l
check:
  dprint fmt
  tsc --noEmit
  biome lint --fix
  oxlint --fix
# build all codes
build:
  bun build --target=bun --minify --outfile=../ritmex/ritmex-bot.js ./index.ts
# bbgo backtest -v --config bbgo.yaml
backtest:
  bun run --watch .\src\cli\backtest.ts
klineUpdater:
  bun run --watch .\test\tasks\klineUpdater.ts
dl-klines symbol='BTC' days='300' timeframe='4h' usdt='USDT':
  ninjabot download -p {{symbol}}{{usdt}} -d {{days}} -t {{timeframe}} -o ./test/data/{{symbol}}-{{timeframe}}.csv -f
dlAll:
  just dl-klines BTC
  just dl-klines ETH
  just dl-klines BNB
  just dl-klines PENDLE
  just dl-klines GMX
  just dl-klines CAKE
  just dl-klines DOGE
  just dl-klines 1000SHIB
  just dl-klines XRP
  just dl-klines ARB
  just dl-klines OP
  just dl-klines AVAX
  just dl-klines BCH
  just dl-klines SOL
  just dl-klines DYDX
  just dl-klines DOT
  just dl-klines FIL
  just dl-klines ASTER
  just dl-klines XPL
  just dl-klines HYPE
