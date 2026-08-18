import React from "react";
import { Box, Text } from "ink";
import type { MakerPointsSnapshot } from "../strategy/maker-points-engine";
import { DataTable, type TableColumn } from "./components/DataTable";
import { formatNumber } from "../utils/format";
import { useStrategyEngine } from "./useStrategyEngine";
import { t } from "../i18n";

interface MakerPointsAppProps {
  onExit: () => void;
}

export function MakerPointsApp({ onExit }: MakerPointsAppProps) {
  const { snapshot, error, exchangeName } = useStrategyEngine<MakerPointsSnapshot>("maker-points", {
    onExit
  });

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
        <Text>{t("makerPoints.initializing")}</Text>
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
  // Maker Points 只对停留超过 3 秒的挂单计分，所以存活时长要直接可见
  const formatResting = (orderId: string | number) => {
    const ms = snapshot.orderRestingMs[String(orderId)];
    if (ms == null) return "-";
    const seconds = ms / 1000;
    return `${seconds < 3 ? "!" : ""}${formatNumber(seconds, 1)}s`;
  };
  const openOrderRows = sortedOrders.slice(0, 8).map((order) => ({
    id: order.orderId,
    side: order.side,
    price: order.price,
    qty: order.origQty,
    filled: order.executedQty,
    resting: formatResting(order.orderId),
    reduceOnly: order.reduceOnly ? "yes" : "no",
    status: order.status,
  }));
  const openOrderColumns: TableColumn[] = [
    { key: "id", header: "ID", align: "right", minWidth: 6 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "qty", header: "Qty", align: "right", minWidth: 8 },
    { key: "filled", header: "Filled", align: "right", minWidth: 8 },
    { key: "resting", header: "Rest", align: "right", minWidth: 6 },
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
  const feedStatus = snapshot.feedStatus;
  const feedEntries: Array<{ key: keyof typeof feedStatus; label: string }> = [
    { key: "account", label: t("maker.feed.account") },
    { key: "orders", label: t("maker.feed.orders") },
    { key: "depth", label: t("maker.feed.depth") },
    { key: "ticker", label: t("maker.feed.ticker") },
    { key: "binance", label: t("makerPoints.feed.binance") },
  ];
  const readyStatus = snapshot.ready ? t("status.live") : t("status.waitingData");
  const imbalanceStatus = snapshot.binanceDepth?.imbalance ?? "balanced";
  const imbalanceLabel =
    imbalanceStatus === "buy_dominant"
      ? t("offset.imbalance.buy")
      : imbalanceStatus === "sell_dominant"
        ? t("offset.imbalance.sell")
        : t("offset.imbalance.balanced");
  const quoteMode = snapshot.quoteStatus.closeOnly ? t("makerPoints.mode.closeOnly") : t("makerPoints.mode.normal");
  const formatDepth = (value: number | null) => (value == null ? "-" : formatNumber(value, 4));
  const formatDistance = (value: number | null) => (value == null ? "-" : `${formatNumber(value, 1)}bps`);
  const formatMultiplier = (value: number | null) =>
    value == null ? "-" : `${formatNumber(value * 100, 2)}%`;

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("makerPoints.title")}</Text>
        <Text>
          {t("makerPoints.headerLine", {
            exchange: exchangeName,
            symbol: snapshot.symbol,
            bid: formatNumber(topBid, priceDigits),
            ask: formatNumber(topAsk, priceDigits),
            spread: spreadDisplay,
          })}
        </Text>
        <Text color={snapshot.markPrice == null ? "yellow" : undefined}>
          {t("makerPoints.markLine", {
            mark: snapshot.markPrice == null ? "-" : formatNumber(snapshot.markPrice, priceDigits),
            maxDistance: snapshot.maxDistanceBps,
          })}
        </Text>
        <Text color="gray">{t("trend.statusLine", { status: readyStatus })}</Text>
        <Text>
          {t("makerPoints.quoteLine", {
            mode: quoteMode,
            buy: snapshot.quoteStatus.skipBuy ? t("common.disabled") : t("common.enabled"),
            sell: snapshot.quoteStatus.skipSell ? t("common.disabled") : t("common.enabled"),
          })}
        </Text>
        <Text>
          {t("makerPoints.binanceLine", {
            buy: formatNumber(snapshot.binanceDepth?.buySum ?? 0, 4),
            sell: formatNumber(snapshot.binanceDepth?.sellSum ?? 0, 4),
            windowBps: snapshot.binanceDepth?.windowBps ?? 5,
            status: imbalanceLabel,
          })}
        </Text>
        {snapshot.bandDepths.map((band) => (
          <Text key={band.band} color={band.enabled ? undefined : "gray"}>
            {t("makerPoints.bandDepthLine", {
              band: band.band,
              target: formatNumber(band.bps, 1),
              buyDist: formatDistance(band.buyDistanceBps),
              buyMult: formatMultiplier(band.buyMultiplier),
              buy: formatDepth(band.buyDepth),
              sellDist: formatDistance(band.sellDistanceBps),
              sellMult: formatMultiplier(band.sellMultiplier),
              sell: formatDepth(band.sellDepth),
            })}
            {band.enabled ? "" : t("makerPoints.bandDisabled")}
          </Text>
        ))}
        <Text>
          {t("maker.dataStatus")}
          {feedEntries.map((entry, index) => (
            <Text key={entry.key} color={feedStatus[entry.key] ? "green" : "red"}>
              {index === 0 ? " " : " "}
              {entry.label}
            </Text>
          ))}
        </Text>
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
