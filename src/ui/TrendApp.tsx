import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { tradingConfig } from "../config";
import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { TrendEngine, type TrendEngineSnapshot } from "../strategy/trend-engine";
import { formatNumber, formatTrendLabel } from "../utils/format";
import { DataTable, type TableColumn } from "./components/DataTable";
import { t } from "../i18n";

const READY_MESSAGE = t("trend.readyMessage");

interface TrendAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function TrendApp({ onExit }: TrendAppProps) {
  const [snapshot, setSnapshot] = useState<TrendEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<TrendEngine | null>(null);
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
      const adapter = buildAdapterFromEnv({ exchangeId, symbol: tradingConfig.symbol });
      const engine = new TrendEngine(tradingConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: TrendEngineSnapshot) => {
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
        <Text>{t("common.initializing", { target: t("trend.name") })}</Text>
      </Box>
    );
  }

  const { position, tradeLog, openOrders, trend, ready, lastPrice, sma30, sessionVolume } = snapshot;
  const hasPosition = Math.abs(position.positionAmt) > 1e-5;
  const lastLogs = tradeLog.slice(-5);
  const sortedOrders = [...openOrders].sort((a, b) => (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId));
  const orderRows = sortedOrders.slice(0, 8).map((order) => ({
    id: order.orderId,
    side: order.side,
    type: order.type,
    price: order.price,
    qty: order.origQty,
    filled: order.executedQty,
    status: order.status,
  }));
  const orderColumns: TableColumn[] = [
    { key: "id", header: "ID", align: "right", minWidth: 6 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "type", header: "Type", minWidth: 10 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "qty", header: "Qty", align: "right", minWidth: 8 },
    { key: "filled", header: "Filled", align: "right", minWidth: 8 },
    { key: "status", header: "Status", minWidth: 10 },
  ];

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("trend.title")}</Text>
        <Text>
          {t("trend.headerLine", {
            exchange: exchangeName,
            symbol: snapshot.symbol,
            lastPrice: formatNumber(lastPrice, 2),
            sma: formatNumber(sma30, 2),
            trend: formatTrendLabel(trend),
          })}
        </Text>
        <Text color="gray">
          {t("trend.statusLine", { status: ready ? t("status.live") : READY_MESSAGE })}
        </Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">{t("common.section.position")}</Text>
          {hasPosition ? (
            <>
              <Text>
                {t("trend.positionLine", {
                  direction: position.positionAmt > 0 ? t("common.direction.long") : t("common.direction.short"),
                  qty: formatNumber(Math.abs(position.positionAmt), 4),
                  entry: formatNumber(position.entryPrice, 2),
                })}
              </Text>
              <Text>
                {t("trend.pnlLine", {
                  pnl: formatNumber(snapshot.pnl, 4),
                  unrealized: formatNumber(snapshot.unrealized, 4),
                })}
              </Text>
            </>
          ) : (
            <Text color="gray">{t("common.noPosition")}</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">{t("common.section.performance")}</Text>
          <Text>
            {t("trend.performanceLine", {
              trades: snapshot.totalTrades,
              profit: formatNumber(snapshot.totalProfit, 4),
            })}
          </Text>
          <Text>
            {t("trend.volumeLine", { volume: formatNumber(sessionVolume, 2) })}
          </Text>
          {snapshot.lastOpenSignal.side ? (
            <Text color="gray">
              {t("trend.lastSignal", {
                side: snapshot.lastOpenSignal.side,
                price: formatNumber(snapshot.lastOpenSignal.price, 2),
              })}
            </Text>
          ) : null}
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("common.section.orders")}</Text>
        {orderRows.length > 0 ? (
          <DataTable columns={orderColumns} rows={orderRows} />
        ) : (
          <Text color="gray">{t("common.noOrders")}</Text>
        )}
      </Box>

      <Box flexDirection="column">
        <Text color="yellow">{t("common.section.recentTrades")}</Text>
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
