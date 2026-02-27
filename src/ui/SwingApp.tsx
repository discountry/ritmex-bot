import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { swingConfig } from "../config";
import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { SwingEngine, type SwingEngineSnapshot } from "../strategy/swing-engine";
import { formatNumber } from "../utils/format";
import { DataTable, type TableColumn } from "./components/DataTable";
import { t } from "../i18n";

const READY_MESSAGE = t("swing.readyMessage");

interface SwingAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function SwingApp({ onExit }: SwingAppProps) {
  const [snapshot, setSnapshot] = useState<SwingEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<SwingEngine | null>(null);
  const exchangeId = useMemo(() => resolveExchangeId(), []);
  const exchangeName = useMemo(() => getExchangeDisplayName(exchangeId), [exchangeId]);

  useInput(
    (_input, key) => {
      if (key.escape) {
        engineRef.current?.stop();
        onExit();
      }
    },
    { isActive: inputSupported }
  );

  useEffect(() => {
    try {
      const adapter = buildAdapterFromEnv({ exchangeId, symbol: swingConfig.symbol });
      const engine = new SwingEngine(swingConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: SwingEngineSnapshot) => {
        setSnapshot({ ...next, tradeLog: [...next.tradeLog], openOrders: [...next.openOrders] });
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
        <Text>{t("common.initializing", { target: t("swing.name") })}</Text>
      </Box>
    );
  }

  const zoneLabel =
    snapshot.rsiZone === "overbought"
      ? t("swing.zone.overbought")
      : snapshot.rsiZone === "oversold"
        ? t("swing.zone.oversold")
        : snapshot.rsiZone === "neutral"
          ? t("swing.zone.neutral")
          : t("swing.zone.unknown");

  const phaseLabel =
    snapshot.phase === "disabled"
      ? t("swing.phase.disabled")
      : snapshot.phase === "initializing"
        ? t("swing.phase.initializing")
        : snapshot.phase === "waiting_open_short"
          ? t("swing.phase.waitingOpenShort")
          : snapshot.phase === "waiting_close_short"
            ? t("swing.phase.waitingCloseShort")
            : snapshot.phase === "waiting_open_long"
              ? t("swing.phase.waitingOpenLong")
              : snapshot.phase === "waiting_close_long"
                ? t("swing.phase.waitingCloseLong")
                : t("swing.phase.observing");

  const lastLogs = snapshot.tradeLog.slice(-5);
  const sortedOrders = [...snapshot.openOrders].sort(
    (a, b) => (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId)
  );
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

  const hasPosition = Math.abs(snapshot.position.positionAmt) > 1e-5;

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("swing.title")}</Text>
        <Text>
          {t("swing.headerLine", {
            exchange: exchangeName,
            symbol: snapshot.symbol,
            direction: snapshot.direction,
            lastPrice: formatNumber(snapshot.lastPrice, 6),
            phase: phaseLabel,
          })}
        </Text>
        <Text color="gray">
          {t("swing.signalLine", {
            binanceSymbol: "ETHBTC",
            binancePrice: formatNumber(snapshot.binancePrice, 8),
            rsi: formatNumber(snapshot.rsi, 2),
            zone: zoneLabel,
            connection: snapshot.binanceConnection,
          })}
        </Text>
        <Text color={snapshot.disabled ? "red" : "gray"}>
          {t("swing.statusLine", {
            status: snapshot.disabled
              ? t("status.paused")
              : snapshot.ready
                ? t("status.live")
                : READY_MESSAGE,
          })}
        </Text>
        {snapshot.error ? <Text color="red">{snapshot.error}</Text> : null}
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">{t("common.section.position")}</Text>
          {hasPosition ? (
            <>
              <Text>
                {t("swing.positionLine", {
                  direction: snapshot.position.positionAmt > 0 ? t("common.direction.long") : t("common.direction.short"),
                  qty: formatNumber(Math.abs(snapshot.position.positionAmt), 4),
                  entry: formatNumber(snapshot.position.entryPrice, 6),
                })}
              </Text>
              <Text>
                {t("swing.pnlLine", {
                  pnl: formatNumber(snapshot.pnl, 4),
                  unrealized: formatNumber(snapshot.unrealized, 4),
                })}
              </Text>
              <Text color={snapshot.stopLossKillSwitch ? "red" : "gray"}>
                {t("swing.stopLine", { stop: formatNumber(snapshot.stopLossTarget, 6) })}
              </Text>
            </>
          ) : (
            <Text color="gray">{t("common.noPosition")}</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">{t("swing.stateTitle")}</Text>
          <Text color="gray">
            {t("swing.armedLine", {
              se: snapshot.armed.armedShortEntry ? "Y" : "N",
              sx: snapshot.armed.armedShortExit ? "Y" : "N",
              le: snapshot.armed.armedLongEntry ? "Y" : "N",
              lx: snapshot.armed.armedLongExit ? "Y" : "N",
            })}
          </Text>
          <Text color="gray">{t("swing.volumeLine", { volume: formatNumber(snapshot.sessionVolume, 2) })}</Text>
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("common.section.orders")}</Text>
        {orderRows.length > 0 ? <DataTable columns={orderColumns} rows={orderRows} /> : <Text color="gray">{t("common.noOrders")}</Text>}
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

