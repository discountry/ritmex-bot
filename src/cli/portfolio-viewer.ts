import { resolveSymbolFromEnv } from '../config';
import type { SupportedExchangeId } from '../exchanges/create-adapter';
import { buildAdapterFromEnv } from '../exchanges/resolve-from-env';
import type { AsterAccountPosition, AsterAccountSnapshot, AsterOrder } from '../exchanges/types';
import { parseCliArgs } from './args';

interface PositionInfo {
   exchange: string;
   symbol: string;
   entryPrice: number;
   size: number;
   currentPrice: number;
   unrealizedPnl: number;
   unrealizedPnlPct: number;
}

interface OrderInfo {
   exchange: string;
   symbol: string;
   price: number;
   size: number;
   side: string;
   type: string;
   status: string;
}

interface ExchangeConfig {
   id: SupportedExchangeId;
   enabled: boolean;
   symbol: string;
}

// 辅助函数：将基于回调的API转换为Promise
function promisifyWithTimeout<T>(callbackFn: (resolve: (value: T) => void) => void, timeoutMs: number, fallbackValue: T): Promise<T> {
   return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(fallbackValue), timeoutMs);
      callbackFn((value) => {
         clearTimeout(timeout);
         resolve(value);
      });
   });
}

class PortfolioViewer {
   private exchanges: ExchangeConfig[] = [];
   private positions: PositionInfo[] = [];
   private orders: OrderInfo[] = [];

   constructor() {
      this.initializeExchanges();
   }

   private initializeExchanges(): void {
      // 检查每个交易所的配置
      const exchangeConfigs: Array<{ id: SupportedExchangeId; envKeys: string[] }> = [
         { id: 'aster', envKeys: ['ASTER_API_KEY', 'ASTER_API_SECRET'] },
         { id: 'grvt', envKeys: ['GRVT_API_KEY', 'GRVT_API_SECRET'] },
         { id: 'lighter', envKeys: ['LIGHTER_ACCOUNT_INDEX', 'LIGHTER_API_PRIVATE_KEY'] },
         { id: 'backpack', envKeys: ['BACKPACK_API_KEY', 'BACKPACK_API_SECRET'] },
         { id: 'paradex', envKeys: ['PARADEX_PRIVATE_KEY', 'PARADEX_WALLET_ADDRESS'] },
      ];

      for (const config of exchangeConfigs) {
         const enabled = config.envKeys.every(key => process.env[key]);
         if (enabled) {
            this.exchanges.push({ id: config.id, enabled: true, symbol: resolveSymbolFromEnv(config.id) });
         }
      }

      if (this.exchanges.length === 0) {
         console.error('❌ 未找到任何已配置的交易所。请检查环境变量配置。');
         process.exit(1);
      }

      console.log(`✅ 发现 ${this.exchanges.length} 个已配置的交易所: ${this.exchanges.map(e => e.id).join(', ')}`);
   }

   async fetchAllData(): Promise<void> {
      console.log('🔄 正在获取所有交易所数据...\n');

      // 首次获取数据
      await this.fetchAllExchangesData();

      // 显示初始结果
      this.displayResults();

      // // 启动定时更新
      // console.log('\n⏰ 启动实时更新 (每30秒刷新一次，按 Ctrl+C 退出)...\n');

      // const updateInterval = setInterval(async () => {
      //    try {
      //       // 清空之前的数据
      //       this.positions = [];
      //       this.orders = [];

      //       // 重新获取数据
      //       await this.fetchAllExchangesData();

      //       // 清屏并重新显示
      //       console.clear();
      //       console.log(`🔄 最后更新时间: ${new Date().toLocaleString()}\n`);
      //       this.displayResults();
      //    } catch (error) {
      //       console.error('❌ 数据更新失败');
      //    }
      // }, 30000); // 每30秒更新一次

      // // 处理程序退出
      // process.on('SIGINT', () => {
      //    clearInterval(updateInterval);
      //    console.log('\n👋 程序已退出');
      //    process.exit(0);
      // });
   }

   private async fetchAllExchangesData(): Promise<void> {
      const promises = this.exchanges.map(async (exchangeConfig) => {
         try {
            await this.fetchExchangeDataHttp(exchangeConfig);
         } catch (error) {
            console.error(`❌ ${exchangeConfig.id.toUpperCase()} 数据获取失败`);
         }
      });

      await Promise.allSettled(promises);
   }

   private async fetchExchangeDataHttp(exchangeConfig: ExchangeConfig): Promise<void> {
      try {
         const adapter = buildAdapterFromEnv({ symbol: exchangeConfig.symbol, exchangeId: exchangeConfig.id });

         // 使用HTTP API直接获取数据
         const [accountSnapshot, orders] = await Promise.all([this.getAccountSnapshotHttp(adapter), this.getOrdersHttp(adapter)]);

         // 处理持仓数据
         if (accountSnapshot?.positions) {
            for (const position of accountSnapshot.positions) {
               const positionSize = Number.parseFloat(position.positionAmt || '0');
               if (positionSize !== 0) {
                  const entryPrice = Number.parseFloat(position.entryPrice || '0');
                  const currentPrice = Number.parseFloat(position.markPrice || '0');
                  const exchangeUnrealizedPnl = Number.parseFloat(position.unrealizedProfit || '0');

                  // 计算未实现盈亏和收益率
                  const { unrealizedPnl, unrealizedPnlPct } = this.calculatePnlAndPercentage(entryPrice, currentPrice, positionSize, exchangeUnrealizedPnl);

                  this.positions.push({ exchange: exchangeConfig.id.toUpperCase(), symbol: position.symbol, entryPrice, size: positionSize, currentPrice, unrealizedPnl, unrealizedPnlPct });
               }
            }
         }

         // 处理订单数据
         if (orders && Array.isArray(orders)) {
            for (const order of orders) {
               // 检查订单是否有效
               if (!order || !order.symbol || !order.status) {
                  continue;
               }

               // 过滤活跃订单状态 (不同交易所可能有不同的状态名称)
               const activeStatuses = ['NEW', 'PARTIALLY_FILLED', 'OPEN', 'PENDING', 'ACTIVE', 'PARTIALLY_EXECUTED', 'WORKING', 'SUBMITTED'];

               if (activeStatuses.includes(order.status.toUpperCase())) {
                  const origQty = Number.parseFloat(order.origQty || '0');
                  const executedQty = Number.parseFloat(order.executedQty || '0');
                  const remainingSize = origQty - executedQty;

                  // 只显示还有剩余数量的订单
                  if (remainingSize > 0) {
                     this.orders.push({
                        exchange: exchangeConfig.id.toUpperCase(),
                        symbol: order.symbol,
                        price: Number.parseFloat(order.price || '0'),
                        size: remainingSize,
                        side: order.side || 'UNKNOWN',
                        type: order.type || 'UNKNOWN',
                        status: order.status,
                     });
                  }
               }
            }
         }
      } catch (error) {
         console.warn(`⚠️  ${exchangeConfig.id.toUpperCase()} 连接异常`);
      }
   }

   private async getAccountSnapshotHttp(adapter: any): Promise<AsterAccountSnapshot | null> {
      // 先尝试获取现有快照
      if (typeof adapter.getAccountSnapshot === 'function') {
         const existing = adapter.getAccountSnapshot();
         if (existing) {
            return existing;
         }
      }

      // 使用watchAccount但只获取一次数据，带超时
      return promisifyWithTimeout<AsterAccountSnapshot | null>(
         (resolve) => {
            let resolved = false;

            const handler = (snapshot: AsterAccountSnapshot) => {
               if (!resolved) {
                  resolved = true;
                  resolve(snapshot);
               }
            };

            adapter.watchAccount(handler);
         },
         8000,
         null,
      );
   }

   private async getOrdersHttp(adapter: any): Promise<AsterOrder[]> {
      // 先尝试获取现有订单快照
      if (typeof adapter.getOpenOrdersSnapshot === 'function') {
         try {
            const existing = await adapter.getOpenOrdersSnapshot();
            if (existing !== null && existing !== undefined) {
               return Array.isArray(existing) ? existing : [];
            }
         } catch (error) {
            // 静默处理错误
         }
      }

      // 使用watchOrders但只获取一次数据，带超时
      return promisifyWithTimeout<AsterOrder[]>(
         (resolve) => {
            let resolved = false;

            const handler = (orderList: AsterOrder[]) => {
               if (!resolved) {
                  resolved = true;
                  // 确保返回数组格式
                  const orders = Array.isArray(orderList) ? orderList : [];
                  resolve(orders);
               }
            };

            try {
               adapter.watchOrders(handler);
            } catch (error) {
               if (!resolved) {
                  resolved = true;
                  resolve([]);
               }
            }
         },
         8000,
         [],
      );
   }

   private calculatePnlAndPercentage(entryPrice: number, currentPrice: number, size: number, exchangeUnrealizedPnl: number): { unrealizedPnl: number; unrealizedPnlPct: number } {
      // 验证输入数据
      if (entryPrice <= 0 || currentPrice <= 0 || size === 0) {
         return { unrealizedPnl: 0, unrealizedPnlPct: 0 };
      }

      const isLong = size > 0;
      const absSize = Math.abs(size);

      // 计算理论未实现盈亏
      let theoreticalPnl: number;
      if (isLong) {
         // 多头：(当前价格 - 开仓价格) * 持仓数量
         theoreticalPnl = (currentPrice - entryPrice) * absSize;
      } else {
         // 空头：(开仓价格 - 当前价格) * 持仓数量
         theoreticalPnl = (entryPrice - currentPrice) * absSize;
      }

      // 优先使用交易所提供的未实现盈亏，如果不合理则使用计算值
      let unrealizedPnl = exchangeUnrealizedPnl;

      // 验证交易所提供的盈亏是否合理（允许10%的误差）
      if (Math.abs(theoreticalPnl) > 0.01) { // 避免除零
         const errorRate = Math.abs((exchangeUnrealizedPnl - theoreticalPnl) / theoreticalPnl);
         if (errorRate > 0.1) { // 误差超过10%，使用计算值
            unrealizedPnl = theoreticalPnl;
         }
      } else {
         unrealizedPnl = theoreticalPnl;
      }

      // 计算收益率：盈亏 / (开仓价格 * 持仓数量) * 100%
      const positionValue = entryPrice * absSize;
      const unrealizedPnlPct = positionValue > 0 ? (unrealizedPnl / positionValue) * 100 : 0;

      return { unrealizedPnl, unrealizedPnlPct };
   }

   displayResults(): void {
      console.log('\n' + '='.repeat(80));
      console.log('📊 持仓信息汇总');
      console.log('='.repeat(80));

      if (this.positions.length === 0) {
         console.log('📭 暂无持仓');
      } else {
         // 表头
         console.log('交易所'.padEnd(12) + '交易对'.padEnd(15) + '开仓价格'.padEnd(12) + '持仓数量'.padEnd(15) + '当前价格'.padEnd(12) + '未实现盈亏'.padEnd(15) + '收益率(%)');
         console.log('-'.repeat(80));

         // 数据行
         for (const position of this.positions) {
            const pnlColor = position.unrealizedPnl >= 0 ? '\x1b[32m' : '\x1b[31m'; // 绿色/红色
            const resetColor = '\x1b[0m';

            // 格式化显示数值
            const sizeDisplay = position.size >= 0 ? `+${position.size.toFixed(6)}` : position.size.toFixed(6);
            const pnlDisplay = position.unrealizedPnl >= 0 ? `+${position.unrealizedPnl.toFixed(4)}` : position.unrealizedPnl.toFixed(4);
            const pnlPctDisplay = position.unrealizedPnlPct >= 0 ? `+${position.unrealizedPnlPct.toFixed(2)}%` : `${position.unrealizedPnlPct.toFixed(2)}%`;

            console.log(
               position.exchange.padEnd(12) +
                  position.symbol.padEnd(15) +
                  position.entryPrice.toFixed(2).padEnd(12) +
                  sizeDisplay.padEnd(15) +
                  position.currentPrice.toFixed(2).padEnd(12) +
                  `${pnlColor}${pnlDisplay}${resetColor}`.padEnd(25) +
                  `${pnlColor}${pnlPctDisplay}${resetColor}`,
            );
         }
      }

      console.log('\n' + '='.repeat(80));
      console.log('📋 委托订单汇总');
      console.log('='.repeat(80));

      if (this.orders.length === 0) {
         console.log('📭 暂无委托订单');
      } else {
         // 表头
         console.log('交易所'.padEnd(12) + '交易对'.padEnd(15) + '价格'.padEnd(12) + '数量'.padEnd(15) + '方向'.padEnd(8) + '类型'.padEnd(10) + '状态');
         console.log('-'.repeat(80));

         // 数据行
         for (const order of this.orders) {
            const sideColor = order.side === 'BUY' ? '\x1b[32m' : '\x1b[31m'; // 绿色买入/红色卖出
            const resetColor = '\x1b[0m';

            console.log(order.exchange.padEnd(12) + order.symbol.padEnd(15) + order.price.toFixed(2).padEnd(12) + order.size.toFixed(6).padEnd(15) + `${sideColor}${order.side}${resetColor}`.padEnd(16) + order.type.padEnd(10) + order.status);
         }
      }

      console.log('\n' + '='.repeat(80));
      console.log(`📈 汇总: ${this.positions.length} 个持仓, ${this.orders.length} 个委托订单`);
      console.log('='.repeat(80));

      // 计算总盈亏
      const totalPnl = this.positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
      const totalPnlColor = totalPnl >= 0 ? '\x1b[32m' : '\x1b[31m';
      const resetColor = '\x1b[0m';
      const totalPnlDisplay = totalPnl >= 0 ? `+${totalPnl.toFixed(4)}` : totalPnl.toFixed(4);

      console.log(`💰 总未实现盈亏: ${totalPnlColor}${totalPnlDisplay} USDT${resetColor}`);
   }
}

async function main(): Promise<void> {
   const args = parseCliArgs();

   if (args.help) {
      console.log(`
Portfolio Viewer - 交易所持仓和订单查看工具

用法: bun run src/cli/portfolio-viewer.ts [选项]

选项:
  --help, -h        显示帮助信息
  --silent, -q      静默模式，减少输出

环境变量配置:
  每个交易所需要配置相应的API密钥:

  Aster:
    ASTER_API_KEY=your_api_key
    ASTER_API_SECRET=your_api_secret

  GRVT:
    GRVT_API_KEY=your_api_key
    GRVT_API_SECRET=your_api_secret

  Lighter:
    LIGHTER_ACCOUNT_INDEX=0
    LIGHTER_API_PRIVATE_KEY=0x...

  Backpack:
    BACKPACK_API_KEY=your_api_key
    BACKPACK_API_SECRET=your_api_secret

  Paradex:
    PARADEX_PRIVATE_KEY=0x...
    PARADEX_WALLET_ADDRESS=0x...

示例:
  bun run src/cli/portfolio-viewer.ts
  bun run src/cli/portfolio-viewer.ts --silent
`);
      return;
   }

   try {
      const viewer = new PortfolioViewer();
      await viewer.fetchAllData();
      process.exit(0);
   } catch (error) {
      console.error('❌ 程序启动失败');
      process.exit(1);
   }
}

main().catch(console.error);
