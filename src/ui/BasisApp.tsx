import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { basisConfig } from "../config";
import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { BasisArbEngine, type BasisArbSnapshot } from "../strategy/basis-arb-engine";
import { formatNumber } from "../utils/format";
import { t } from "../i18n";

interface BasisAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function BasisApp({ onExit }: BasisAppProps) {
  const [snapshot, setSnapshot] = useState<BasisArbSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<BasisArbEngine | null>(null);
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
    if (exchangeId !== "aster" && exchangeId !== "nado" && exchangeId !== "standx") {
      setError(new Error(t("basis.onlyAster")));
      return;
    }
    try {
      const adapter = buildAdapterFromEnv({ exchangeId, symbol: basisConfig.futuresSymbol });
      const engine = new BasisArbEngine(basisConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: BasisArbSnapshot) => {
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
        <Text color="red">{t("basis.startFailed", { message: error.message })}</Text>
        <Text color="gray">{t("common.backHint")}</Text>
      </Box>
    );
  }

  if (!snapshot) {
    return (
      <Box padding={1}>
        <Text>{t("basis.initializing")}</Text>
      </Box>
    );
  }

  const futuresBid = formatNumber(snapshot.futuresBid, 4);
  const futuresAsk = formatNumber(snapshot.futuresAsk, 4);
  const spotBid = formatNumber(snapshot.spotBid, 4);
  const spotAsk = formatNumber(snapshot.spotAsk, 4);
  const spread = formatNumber(snapshot.spread, 4);
  const spreadBps = formatNumber(snapshot.spreadBps, 2);
  const netSpread = formatNumber(snapshot.netSpread, 4);
  const netSpreadBps = formatNumber(snapshot.netSpreadBps, 2);
  const lastUpdated = snapshot.lastUpdated ? new Date(snapshot.lastUpdated).toLocaleTimeString() : "-";
  const futuresUpdated = snapshot.futuresLastUpdate ? new Date(snapshot.futuresLastUpdate).toLocaleTimeString() : "-";
  const spotUpdated = snapshot.spotLastUpdate ? new Date(snapshot.spotLastUpdate).toLocaleTimeString() : "-";
  const fundingRatePct = snapshot.fundingRate != null ? `${(snapshot.fundingRate * 100).toFixed(4)}%` : "-";
  const fundingUpdated = snapshot.fundingLastUpdate ? new Date(snapshot.fundingLastUpdate).toLocaleTimeString() : "-";
  const nextFundingTime = snapshot.nextFundingTime ? new Date(snapshot.nextFundingTime).toLocaleTimeString() : "-";
  const fundingIncomePerFunding =
    snapshot.fundingIncomePerFunding != null ? `${formatNumber(snapshot.fundingIncomePerFunding, 4)} USDT` : "-";
  const fundingIncomePerDay =
    snapshot.fundingIncomePerDay != null ? `${formatNumber(snapshot.fundingIncomePerDay, 4)} USDT` : "-";
  const takerFeesPerRoundTrip =
    snapshot.takerFeesPerRoundTrip != null ? `${formatNumber(snapshot.takerFeesPerRoundTrip, 4)} USDT` : "-";
  const fundingCountToBreakeven =
    snapshot.fundingCountToBreakeven != null ? formatNumber(snapshot.fundingCountToBreakeven, 2) : "-";
  const feePct = (basisConfig.takerFeeRate * 100).toFixed(4);
  const feedStatus = snapshot.feedStatus;
  const lastLogs = snapshot.tradeLog.slice(-5);
  const spotBalances = (snapshot.spotBalances ?? []).filter((b) => Math.abs(b.free) > 0 || Math.abs(b.locked) > 0);
  const futuresBalances = (snapshot.futuresBalances ?? []).filter((b) => Math.abs(b.wallet) > 0);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyanBright">{t("basis.title")}</Text>
        <Text>
          {t("basis.headerLine", {
            exchange: exchangeName,
            futures: snapshot.futuresSymbol,
            spot: snapshot.spotSymbol,
          })}
        </Text>
        <Text color="gray">
          {t("basis.statusLine", {
            futuresStatus: feedStatus.futures ? "OK" : "--",
            spotStatus: feedStatus.spot ? "OK" : "--",
            fundingStatus: feedStatus.funding ? "OK" : "--",
          })}
        </Text>
        <Text color="gray">{t("basis.lastUpdated", { time: lastUpdated })}</Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">{t("basis.section.futures")}</Text>
          <Text>{t("basis.bookLine", { bid: futuresBid, ask: futuresAsk })}</Text>
          <Text color="gray">{t("basis.updatedAt", { time: futuresUpdated })}</Text>
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">{t("basis.section.spot")}</Text>
          <Text>{t("basis.bookLine", { bid: spotBid, ask: spotAsk })}</Text>
          <Text color="gray">{t("basis.updatedAt", { time: spotUpdated })}</Text>
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">{t("basis.section.funding")}</Text>
        <Text>{t("basis.fundingRate", { rate: fundingRatePct })}</Text>
        <Text color="gray">
          {t("basis.fundingTimes", { updated: fundingUpdated, next: nextFundingTime })}
        </Text>
        <Text>{t("basis.fundingIncome", { per: fundingIncomePerFunding, perDay: fundingIncomePerDay })}</Text>
        <Text>{t("basis.takerFees", { fees: takerFeesPerRoundTrip, count: fundingCountToBreakeven })}</Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="cyan">{t("basis.spotBalanceTitle")}</Text>
          {spotBalances.length ? (
            spotBalances.map((b) => (
              <Text key={`spot-${b.asset}`}>
                {t("basis.balanceLine", {
                  asset: b.asset,
                  free: formatNumber(b.free, 8),
                  locked: formatNumber(b.locked, 8),
                })}
              </Text>
            ))
          ) : (
            <Text color="gray">{t("basis.none")}</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="cyan">{t("basis.futuresBalanceTitle")}</Text>
          {futuresBalances.length ? (
            futuresBalances.map((b) => (
              <Text key={`fut-${b.asset}`}>
                {t("basis.futuresBalanceLine", {
                  asset: b.asset,
                  wallet: formatNumber(b.wallet, 8),
                  available: formatNumber(b.available, 8),
                })}
              </Text>
            ))
          ) : (
            <Text color="gray">{t("basis.none")}</Text>
          )}
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={snapshot.opportunity ? "greenBright" : "redBright"}>{t("basis.spreadTitle")}</Text>
        <Text color={snapshot.opportunity ? "green" : undefined}>
          {t("basis.spreadLine", { spread, bps: spreadBps })}
        </Text>
        <Text color={snapshot.opportunity ? "green" : "red"}>
          {t("basis.netSpreadLine", { feePct, net: netSpread, netBps: netSpreadBps })}
        </Text>
      </Box>

      <Box flexDirection="column">
        <Text color="yellow">{t("common.section.recent")}</Text>
        {lastLogs.length ? (
          lastLogs.map((entry, index) => {
            const color = entry.type === "entry" ? "green" : entry.type === "exit" ? "red" : undefined;
            return (
              <Text key={`${entry.time}-${index}`} color={color}>
                [{entry.time}] [{entry.type}] {entry.detail}
              </Text>
            );
          })
        ) : (
          <Text color="gray">{t("common.noLogs")}</Text>
        )}
      </Box>
    </Box>
  );
}
