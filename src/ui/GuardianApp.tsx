import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { tradingConfig } from "../config";
import { resolveExchangeId, getExchangeDisplayName } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { GuardianEngine, type GuardianEngineSnapshot } from "../strategy/guardian-engine";
import { formatNumber } from "../utils/format";
import { DataTable, type TableColumn } from "./components/DataTable";
import { t } from "../i18n";

interface GuardianAppProps {
  onExit: () => void;
}

const READY_MESSAGE = t("guardian.readyMessage");
const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function GuardianApp({ onExit }: GuardianAppProps) {
  const [snapshot, setSnapshot] = useState<GuardianEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<GuardianEngine | null>(null);
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
      const engine = new GuardianEngine(tradingConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: GuardianEngineSnapshot) => {
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
        <Text color="red">{t("guardian.startFailed", { message: error.message })}</Text>
        <Text color="gray">{t("common.checkEnv")}</Text>
      </Box>
    );
  }

  if (!snapshot) {
    return (
      <Box padding={1}>
        <Text>{t("guardian.initializing")}</Text>
      </Box>
    );
  }

  const { position, stopOrder, trailingOrder, tradeLog, ready, guardStatus } = snapshot;
  const hasPosition = Math.abs(position.positionAmt) > 1e-8;
  const stopOrderPrice = stopOrder ? Number(stopOrder.stopPrice ?? stopOrder.price) : null;
  const trailingActivate = trailingOrder ? Number(trailingOrder.activatePrice ?? (trailingOrder as any).activationPrice) : null;
  const lastLogs = tradeLog.slice(-6);
  const orderColumns: TableColumn[] = [
    { key: "id", header: "ID", align: "right", minWidth: 6 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "type", header: "Type", minWidth: 12 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "qty", header: "Qty", align: "right", minWidth: 8 },
    { key: "status", header: "Status", minWidth: 10 },
  ];
  const orderRows = [...snapshot.openOrders]
    .sort((a, b) => (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId))
    .slice(0, 8)
    .map((order) => ({
      id: order.orderId,
      side: order.side,
      type: order.type,
      price: order.price ?? order.stopPrice,
      qty: order.origQty,
      status: order.status,
    }));

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("guardian.title")}</Text>
        <Text>
          {t("guardian.headerLine", {
            exchange: exchangeName,
            symbol: snapshot.symbol,
            lastPrice: formatNumber(snapshot.lastPrice, 2),
            status: ready ? t("status.live") : READY_MESSAGE,
          })}
        </Text>
        <Text color="gray">{t("guardian.hint")}</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="greenBright">{t("guardian.positionTitle")}</Text>
        {hasPosition ? (
          <>
            <Text>
              {t("guardian.positionLine", {
                direction: position.positionAmt > 0 ? t("common.direction.long") : t("common.direction.short"),
                qty: formatNumber(Math.abs(position.positionAmt), 4),
                entry: formatNumber(position.entryPrice, 2),
                pnl: formatNumber(snapshot.pnl, 4),
              })}
            </Text>
            <Text>
              {t("guardian.stopLine", {
                targetStop: formatNumber(snapshot.targetStopPrice, 2),
                stopOrder: formatNumber(stopOrderPrice, 2),
                trailingTrigger: formatNumber(snapshot.trailingActivationPrice, 2),
                trailingOrder: formatNumber(trailingActivate, 2),
              })}
            </Text>
            <Text color={snapshot.requiresStop ? "yellow" : "gray"}>
              {t("guardian.stateLabel", {
                state:
                  guardStatus === "protecting"
                    ? t("guardian.status.protecting")
                    : guardStatus === "pending"
                      ? t("guardian.status.pending")
                      : t("guardian.status.listening"),
              })}
            </Text>
          </>
        ) : (
          <Text color="gray">{t("guardian.noPosition")}</Text>
        )}
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("common.section.orders")}</Text>
        {orderRows.length > 0 ? (
          <DataTable columns={orderColumns} rows={orderRows} />
        ) : (
          <Text color="gray">{t("guardian.noProtectiveOrders")}</Text>
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
