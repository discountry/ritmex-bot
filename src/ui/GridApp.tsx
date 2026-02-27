import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { gridConfig } from "../config";
import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { GridEngine, type GridEngineSnapshot } from "../strategy/grid-engine";
import { DataTable, type TableColumn } from "./components/DataTable";
import { formatNumber } from "../utils/format";
import { t } from "../i18n";

interface GridAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function GridApp({ onExit }: GridAppProps) {
  const [snapshot, setSnapshot] = useState<GridEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<GridEngine | null>(null);
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
      const adapter = buildAdapterFromEnv({ exchangeId, symbol: gridConfig.symbol });
      const engine = new GridEngine(gridConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: GridEngineSnapshot) => {
        setSnapshot({
          ...next,
          desiredOrders: [...next.desiredOrders],
          gridLines: [...next.gridLines],
          tradeLog: [...next.tradeLog],
        });
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
        <Text>{t("grid.initializing")}</Text>
      </Box>
    );
  }

  const feedStatus = snapshot.feedStatus;
  const feedEntries: Array<{ key: keyof typeof feedStatus; label: string }> = [
    { key: "account", label: t("maker.feed.account") },
    { key: "orders", label: t("maker.feed.orders") },
    { key: "depth", label: t("maker.feed.depth") },
    { key: "ticker", label: t("maker.feed.ticker") },
  ];
  const stopReason = snapshot.running ? null : snapshot.stopReason;
  const lastLogs = snapshot.tradeLog.slice(-5);
  const position = snapshot.position;
  const hasPosition = Math.abs(position.positionAmt) > 1e-5;

  const gridColumns: TableColumn[] = [
    { key: "level", header: "#", align: "right", minWidth: 3 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "active", header: "Active", minWidth: 6 },
    { key: "hasOrder", header: "Order", minWidth: 5 },
  ];
  const gridRows = snapshot.gridLines.map((line) => ({
    level: line.level,
    price: formatNumber(line.price, 4),
    side: line.side,
    active: line.active ? "yes" : "no",
    hasOrder: line.hasOrder ? "yes" : "no",
  }));

  const desiredColumns: TableColumn[] = [
    { key: "level", header: "#", align: "right", minWidth: 3 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "amount", header: "Qty", align: "right", minWidth: 8 },
  ];
  const desiredRows = snapshot.desiredOrders.map((order) => ({
    level: order.level,
    side: order.side,
    price: order.price,
    amount: formatNumber(order.amount, 4),
  }));
  const statusLabel = snapshot.running ? t("status.running") : t("status.paused");
  const directionLabel =
    snapshot.direction === "both"
      ? t("grid.direction.both")
      : snapshot.direction === "long"
        ? t("grid.direction.long")
        : t("grid.direction.short");

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("grid.title")}</Text>
        <Text>
          {t("grid.headerLine", {
            exchange: exchangeName,
            symbol: snapshot.symbol,
            status: statusLabel,
            direction: directionLabel,
          })}
        </Text>
        <Text>
          {t("grid.priceLine", {
            lastPrice: formatNumber(snapshot.lastPrice, 4),
            lower: formatNumber(snapshot.lowerPrice, 4),
            upper: formatNumber(snapshot.upperPrice, 4),
            count: snapshot.gridLines.length,
          })}
        </Text>
        <Text color="gray">
          {t("grid.dataStatus")}
          {feedEntries.map((entry, index) => (
            <Text key={entry.key} color={feedStatus[entry.key] ? "green" : "red"}>
              {index === 0 ? " " : " "}
              {entry.label}
            </Text>
          ))}
          {" | "}
          {t("common.backHint")}
        </Text>
        {stopReason ? <Text color="yellow">{t("grid.stopReason", { reason: stopReason })}</Text> : null}
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">{t("grid.configTitle")}</Text>
          <Text>
            {t("grid.configSize", {
              orderSize: formatNumber(gridConfig.orderSize, 6),
              maxPosition: formatNumber(gridConfig.maxPositionSize, 6),
            })}
          </Text>
          <Text>
            {t("grid.configRisk", {
              stopLoss: (gridConfig.stopLossPct * 100).toFixed(2),
              restart: (gridConfig.restartTriggerPct * 100).toFixed(2),
              autoRestart: gridConfig.autoRestart ? t("common.enabled") : t("common.disabled"),
            })}
          </Text>
          <Text>
            {t("grid.refreshInterval", { interval: gridConfig.refreshIntervalMs })}
          </Text>
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">{t("common.section.position")}</Text>
          {hasPosition ? (
            <>
              <Text>
                {t("grid.positionLine", {
                  direction: position.positionAmt > 0 ? t("common.direction.long") : t("common.direction.short"),
                  qty: formatNumber(Math.abs(position.positionAmt), 6),
                  avgPrice: formatNumber(position.entryPrice, 4),
                })}
              </Text>
              <Text>
                {t("grid.unrealizedLine", {
                  pnl: formatNumber(position.unrealizedProfit, 4),
                  mark: formatNumber(position.markPrice, 4),
                })}
              </Text>
            </>
          ) : (
            <Text color="gray">{t("common.noPosition")}</Text>
          )}
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("grid.linesTitle")}</Text>
        {gridRows.length > 0 ? (
          <DataTable columns={gridColumns} rows={gridRows} />
        ) : (
          <Text color="gray">{t("grid.noLines")}</Text>
        )}
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("maker.targetOrders")}</Text>
        {desiredRows.length > 0 ? (
          <DataTable columns={desiredColumns} rows={desiredRows} />
        ) : (
          <Text color="gray">{t("maker.noTargetOrders")}</Text>
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
