import { Box, Text, useInput } from 'ink';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { basisConfig } from '../config';
import { getExchangeDisplayName, resolveExchangeId } from '../exchanges/create-adapter';
import { buildAdapterFromEnv } from '../exchanges/resolve-from-env';
import { BasisArbEngine, type BasisArbSnapshot } from '../strategy/basis-arb-engine';
import { formatNumber } from '../utils/format';

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

   useInput((input, key) => {
      if (key.escape) {
         engineRef.current?.stop();
         onExit();
      }
   }, { isActive: inputSupported });

   useEffect(() => {
      if (exchangeId !== 'aster') {
         setError(new Error('期现套利策略目前仅支持 Aster 交易所。请设置 EXCHANGE=aster 后重试。'));
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
         engine.on('update', handler);
         engine.start();
         return () => {
            engine.off('update', handler);
            engine.stop();
         };
      } catch (err) {
         console.error(err);
         setError(err instanceof Error ? err : new Error(String(err)));
      }
   }, [exchangeId]);

   if (error) {
      return (
         <Box flexDirection='column' padding={1}>
            <Text color='red'>无法启动期现套利策略: {error.message}</Text>
            <Text color='gray'>按 Esc 返回菜单。</Text>
         </Box>
      );
   }

   if (!snapshot) {
      return (
         <Box padding={1}>
            <Text>正在初始化期现套利监控…</Text>
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
   const lastUpdated = snapshot.lastUpdated ? new Date(snapshot.lastUpdated).toLocaleTimeString() : '-';
   const futuresUpdated = snapshot.futuresLastUpdate ? new Date(snapshot.futuresLastUpdate).toLocaleTimeString() : '-';
   const spotUpdated = snapshot.spotLastUpdate ? new Date(snapshot.spotLastUpdate).toLocaleTimeString() : '-';
   const feedStatus = snapshot.feedStatus;
   const lastLogs = snapshot.tradeLog.slice(-5);

   return (
      <Box flexDirection='column' paddingX={1}>
         <Box flexDirection='column' marginBottom={1}>
            <Text color='cyanBright'>Basis Arbitrage Dashboard</Text>
            <Text>交易所: {exchangeName} ｜ 期货合约: {snapshot.futuresSymbol} ｜ 现货交易对: {snapshot.spotSymbol}</Text>
            <Text color='gray'>按 Esc 返回策略选择 ｜ 数据状态: 期货({feedStatus.futures ? 'OK' : '--'}) 现货({feedStatus.spot ? 'OK' : '--'})</Text>
            <Text color='gray'>最近更新时间: {lastUpdated}</Text>
         </Box>

         <Box flexDirection='row' marginBottom={1}>
            <Box flexDirection='column' marginRight={4}>
               <Text color='greenBright'>期货盘口</Text>
               <Text>买一: {futuresBid} ｜ 卖一: {futuresAsk}</Text>
               <Text color='gray'>更新时间: {futuresUpdated}</Text>
            </Box>
            <Box flexDirection='column'>
               <Text color='greenBright'>现货盘口</Text>
               <Text>买一: {spotBid} ｜ 卖一: {spotAsk}</Text>
               <Text color='gray'>更新时间: {spotUpdated}</Text>
            </Box>
         </Box>

         <Box flexDirection='column' marginBottom={1}>
            <Text color={snapshot.opportunity ? 'greenBright' : 'redBright'}>套利差价（卖期货 / 买现货）</Text>
            <Text color={snapshot.opportunity ? 'green' : undefined}>毛价差: {spread} USDT ｜ {spreadBps} bp</Text>
            <Text color={snapshot.opportunity ? 'green' : 'red'}>扣除 taker 手续费 ({(basisConfig.takerFeeRate * 100).toFixed(4)}% × 双边): {netSpread} USDT ｜ {netSpreadBps} bp</Text>
         </Box>

         <Box flexDirection='column'>
            <Text color='yellow'>最近事件</Text>
            {lastLogs.length ? (lastLogs.map((entry, index) => <Text key={`${entry.time}-${index}`}>[{entry.time}] [{entry.type}] {entry.detail}</Text>)) : <Text color='gray'>暂无日志</Text>}
         </Box>
      </Box>
   );
}
