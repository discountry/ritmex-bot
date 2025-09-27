import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { tradingConfig } from "../config";
import {
  createExchangeAdapter,
  getExchangeDisplayName,
  resolveExchangeId,
} from "../exchanges/create-adapter";
import { TrendEngine, type TrendEngineSnapshot } from "../strategy/trend-engine";
import { formatNumber } from "../utils/format";
import { DataTable, type TableColumn } from "./components/DataTable";

const READY_MESSAGE = "正在等待交易所推送数据…";

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
      let adapter;
      if (exchangeId === "aster") {
        const apiKey = process.env.ASTER_API_KEY;
        const apiSecret = process.env.ASTER_API_SECRET;
        if (!apiKey || !apiSecret) {
          setError(new Error("缺少 ASTER_API_KEY 或 ASTER_API_SECRET 环境变量"));
          return;
        }
        adapter = createExchangeAdapter({
          exchange: exchangeId,
          symbol: tradingConfig.symbol,
          aster: { apiKey, apiSecret },
        });
      } else {
        adapter = createExchangeAdapter({
          exchange: exchangeId,
          symbol: tradingConfig.symbol,
          grvt: { symbol: tradingConfig.symbol },
        });
      }
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
        <Text color="red">启动失败: {error.message}</Text>
        <Text color="gray">请检查环境变量和网络连通性。</Text>
      </Box>
    );
  }

  if (!snapshot) {
    return (
      <Box padding={1}>
        <Text>正在初始化趋势策略…</Text>
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
        <Text color="cyanBright">Trend Strategy Dashboard</Text>
        <Text>
          交易所: {exchangeName} ｜ 交易对: {snapshot.symbol} ｜ 最近价格: {formatNumber(lastPrice, 2)} ｜ SMA30: {formatNumber(sma30, 2)} ｜ 趋势: {trend}
        </Text>
        <Text color="gray">状态: {ready ? "实时运行" : READY_MESSAGE} ｜ 按 Esc 返回策略选择</Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">持仓</Text>
          {hasPosition ? (
            <>
              <Text>
                方向: {position.positionAmt > 0 ? "多" : "空"} ｜ 数量: {formatNumber(Math.abs(position.positionAmt), 4)} ｜ 开仓价: {formatNumber(position.entryPrice, 2)}
              </Text>
              <Text>
                浮动盈亏: {formatNumber(snapshot.pnl, 4)} USDT ｜ 账户未实现盈亏: {formatNumber(snapshot.unrealized, 4)} USDT
              </Text>
            </>
          ) : (
            <Text color="gray">当前无持仓</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">绩效</Text>
          <Text>
            累计交易次数: {snapshot.totalTrades} ｜ 累计收益: {formatNumber(snapshot.totalProfit, 4)} USDT
          </Text>
          <Text>
            累计成交量: {formatNumber(sessionVolume, 2)} USDT
          </Text>
          {snapshot.lastOpenSignal.side ? (
            <Text color="gray">
              最近开仓信号: {snapshot.lastOpenSignal.side} @ {formatNumber(snapshot.lastOpenSignal.price, 2)}
            </Text>
          ) : null}
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">当前挂单</Text>
        {orderRows.length > 0 ? (
          <DataTable columns={orderColumns} rows={orderRows} />
        ) : (
          <Text color="gray">暂无挂单</Text>
        )}
      </Box>

      <Box flexDirection="column">
        <Text color="yellow">最近交易与事件</Text>
        {lastLogs.length > 0 ? (
          lastLogs.map((item, index) => (
            <Text key={`${item.time}-${index}`}>
              [{item.time}] [{item.type}] {item.detail}
            </Text>
          ))
        ) : (
          <Text color="gray">暂无日志</Text>
        )}
      </Box>
    </Box>
  );
}
