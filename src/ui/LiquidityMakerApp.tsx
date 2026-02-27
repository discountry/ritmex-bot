import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { liquidityMakerConfig } from "../config";
import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { LiquidityMakerEngine, type LiquidityMakerEngineSnapshot } from "../strategy/liquidity-maker-engine";
import { DataTable, type TableColumn } from "./components/DataTable";
import { formatNumber } from "../utils/format";
import { t } from "../i18n";

interface LiquidityMakerAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function LiquidityMakerApp({ onExit }: LiquidityMakerAppProps) {
  const [snapshot, setSnapshot] = useState<LiquidityMakerEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<LiquidityMakerEngine | null>(null);
  const exchangeId = useMemo(() => resolveExchangeId(), []);
  const exchangeName = useMemo(() => getExchangeDisplayName(exchangeId), [exchangeId]);

  useInput(
    (input, key) => {
      if (key.escape) {
        engineRef.current?.stop();
        onExit();
      }
    },
    { isActive: inputSupported }
  );

  useEffect(() => {
    try {
      const adapter = buildAdapterFromEnv({ exchangeId, symbol: liquidityMakerConfig.symbol });
      const engine = new LiquidityMakerEngine(liquidityMakerConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: LiquidityMakerEngineSnapshot) => {
        setSnapshot({ ...next, tradeLog: [...next.tradeLog] });
      };
      engine.on("update", handler);
      engine.start();
      return () => {
        engine.off("update", handler);
        engine.stop();
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [exchangeId]);

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">{t("common.startFailed", { message: error.message })}</Text>
        <Text color="gray">{t("common.checkEnv")}</Text>
      </Box>
    );
  }

  if (!snapshot) {
    return (
      <Box padding={1}>
        <Text>{t("liquidityMaker.initializing")}</Text>
      </Box>
    );
  }

  const topBid = snapshot.topBid;
  const topAsk = snapshot.topAsk;
  const priceDigits = snapshot.priceDecimals ?? 2;
  const spreadDigits = Math.max(priceDigits + 1, 4);
  const spreadDisplay =
    snapshot.spread != null ? `${formatNumber(snapshot.spread, spreadDigits)} USDT` : "-";
  const hasPosition = Math.abs(snapshot.position.positionAmt) > 1e-5;
  const sortedOrders = [...snapshot.openOrders].sort((a, b) =>
    (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId)
  );
  const openOrderRows = sortedOrders.slice(0, 8).map((order) => ({
    id: order.orderId,
    side: order.side,
    price: order.price,
    qty: order.origQty,
    filled: order.executedQty,
    reduceOnly: order.reduceOnly ? "yes" : "no",
    status: order.status,
  }));
  const openOrderColumns: TableColumn[] = [
    { key: "id", header: "ID", align: "right", minWidth: 6 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "qty", header: "Qty", align: "right", minWidth: 8 },
    { key: "filled", header: "Filled", align: "right", minWidth: 8 },
    { key: "reduceOnly", header: "RO", minWidth: 4 },
    { key: "status", header: "Status", minWidth: 10 },
  ];

  const desiredRows = snapshot.desiredOrders.map((order, index) => ({
    index: index + 1,
    side: order.side,
    price: order.price,
    amount: order.amount,
    reduceOnly: order.reduceOnly ? "yes" : "no",
  }));
  const desiredColumns: TableColumn[] = [
    { key: "index", header: "#", align: "right", minWidth: 2 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "amount", header: "Qty", align: "right", minWidth: 8 },
    { key: "reduceOnly", header: "RO", minWidth: 4 },
  ];

  const lastLogs = snapshot.tradeLog.slice(-5);
  const imbalanceLabel =
    snapshot.depthImbalance === "balanced"
      ? t("offset.imbalance.balanced")
      : snapshot.depthImbalance === "buy_dominant"
        ? t("offset.imbalance.buy")
        : t("offset.imbalance.sell");
  const readyStatus = snapshot.ready ? t("status.live") : t("status.waitingData");

  // 显示最近成交信息
  const lastFillInfo = snapshot.lastFill
    ? `${snapshot.lastFill.side} ${formatNumber(snapshot.lastFill.amount, 6)} @ ${formatNumber(snapshot.lastFill.price, priceDigits)}`
    : t("liquidityMaker.noFill");

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("liquidityMaker.title")}</Text>
        <Text>
          {t("offset.headerLine", {
            exchange: exchangeName,
            symbol: snapshot.symbol,
            bid: formatNumber(topBid, priceDigits),
            ask: formatNumber(topAsk, priceDigits),
            spread: spreadDisplay,
          })}
        </Text>
        <Text>
          {t("offset.depthLine", {
            buy: formatNumber(snapshot.buyDepthSum10, 4),
            sell: formatNumber(snapshot.sellDepthSum10, 4),
            status: imbalanceLabel,
          })}
        </Text>
        <Text color="gray">
          {t("offset.strategyStatus", {
            buyStatus: snapshot.skipBuySide ? t("common.disabled") : t("common.enabled"),
            sellStatus: snapshot.skipSellSide ? t("common.disabled") : t("common.enabled"),
          })}
        </Text>
        <Text color="gray">{t("liquidityMaker.lastFill", { info: lastFillInfo })}</Text>
        <Text color="gray">{t("trend.statusLine", { status: readyStatus })}</Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">{t("common.section.position")}</Text>
          {hasPosition ? (
            <>
              <Text>
                {t("maker.positionLine", {
                  direction:
                    snapshot.position.positionAmt > 0 ? t("common.direction.long") : t("common.direction.short"),
                  qty: formatNumber(Math.abs(snapshot.position.positionAmt), 4),
                  entry: formatNumber(snapshot.position.entryPrice, priceDigits),
                })}
              </Text>
              <Text>
                {t("maker.pnlLine", {
                  pnl: formatNumber(snapshot.pnl, 4),
                  accountPnl: formatNumber(snapshot.accountUnrealized, 4),
                })}
              </Text>
            </>
          ) : (
            <Text color="gray">{t("common.noPosition")}</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">{t("maker.targetOrders")}</Text>
          {desiredRows.length > 0 ? (
            <DataTable columns={desiredColumns} rows={desiredRows} />
          ) : (
            <Text color="gray">{t("maker.noTargetOrders")}</Text>
          )}
          <Text>
            {t("trend.volumeLine", { volume: formatNumber(snapshot.sessionVolume, 2) })}
          </Text>
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("common.section.orders")}</Text>
        {openOrderRows.length > 0 ? (
          <DataTable columns={openOrderColumns} rows={openOrderRows} />
        ) : (
          <Text color="gray">{t("common.noOrders")}</Text>
        )}
      </Box>

      <Box flexDirection="column">
        <Text color="yellow">{t("common.section.recent")}</Text>
        {lastLogs.length > 0 ? (
          lastLogs.map((item, index) => (
            <Text key={`${item.time}-${index}`}>
              [{item.time}] [{item.type}] {item.detail}
            </Text>
          ))
        ) : (
          <Text color="gray">{t("common.noLogs")}</Text>
        )}
      </Box>
    </Box>
  );
}
