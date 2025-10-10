#!/usr/bin/env bun

/**
 * Portfolio Setup CLI - 交互式配置多个交易所API密钥
 */

import { writeFileSync } from 'node:fs';
import { type PortfolioConfig, PortfolioConfigManager } from './portfolio-config';

// 简单的命令行输入函数
function prompt(question: string): Promise<string> {
   return new Promise((resolve) => {
      process.stdout.write(question);
      process.stdin.once('data', (data) => {
         resolve(data.toString().trim());
      });
   });
}

function promptBoolean(question: string, defaultValue = false): Promise<boolean> {
   return prompt(`${question} (y/n) [${defaultValue ? 'y' : 'n'}]: `).then(answer => {
      if (!answer) { return defaultValue; }
      return answer.toLowerCase().startsWith('y');
   });
}

function promptNumber(question: string, defaultValue?: number): Promise<number> {
   return prompt(`${question}${defaultValue !== undefined ? ` [${defaultValue}]` : ''}: `).then(answer => {
      if (!answer && defaultValue !== undefined) { return defaultValue; }
      const num = Number.parseInt(answer, 10);
      return Number.isNaN(num) ? (defaultValue || 0) : num;
   });
}

class PortfolioSetup {
   private configManager: PortfolioConfigManager;

   constructor() {
      this.configManager = new PortfolioConfigManager();
   }

   async run(): Promise<void> {
      console.log('🚀 Portfolio Viewer 配置向导');
      console.log('='.repeat(50));
      console.log('此工具将帮助您配置多个交易所的API密钥\n');

      // 加载现有配置
      let config = this.configManager.loadConfig() || this.configManager.createDefaultConfig();

      // 询问要配置的交易所
      const exchanges = await this.selectExchanges();

      // 配置每个选中的交易所
      for (const exchange of exchanges) {
         console.log(`\n📡 配置 ${exchange.toUpperCase()} 交易所`);
         console.log('-'.repeat(30));

         switch (exchange) {
            case 'aster':
               config.exchanges.aster = await this.configureAster(config.exchanges.aster);
               break;
            case 'grvt':
               config.exchanges.grvt = await this.configureGrvt(config.exchanges.grvt);
               break;
            case 'lighter':
               config.exchanges.lighter = await this.configureLighter(config.exchanges.lighter);
               break;
            case 'backpack':
               config.exchanges.backpack = await this.configureBackpack(config.exchanges.backpack);
               break;
            case 'paradex':
               config.exchanges.paradex = await this.configureParadex(config.exchanges.paradex);
               break;
         }
      }

      // 配置交易对
      console.log('\n📊 配置交易对');
      console.log('-'.repeat(30));
      config.symbols = await this.configureSymbols(config.symbols, exchanges);

      // 验证配置
      const errors = this.configManager.validateConfig(config);
      if (errors.length > 0) {
         console.log('\n❌ 配置验证失败:');
         errors.forEach(error => console.log(`  - ${error}`));
         return;
      }

      // 保存配置
      this.configManager.saveConfig(config);

      // 生成环境变量文件
      const generateEnv = await promptBoolean('\n是否生成 .env 文件?', true);
      if (generateEnv) {
         const envContent = this.configManager.generateEnvFile(config);
         writeFileSync('.env', envContent);
         console.log('✅ .env 文件已生成');
      }

      console.log('\n🎉 配置完成！');
      console.log('现在可以运行以下命令查看持仓信息:');
      console.log('  bun run portfolio');
      console.log('  或者: bun run src/cli/portfolio-viewer.ts');
   }

   private async selectExchanges(): Promise<string[]> {
      const availableExchanges = ['aster', 'grvt', 'lighter', 'backpack', 'paradex'];
      const selected: string[] = [];

      console.log('请选择要配置的交易所 (可多选):');

      for (const exchange of availableExchanges) {
         const shouldConfigure = await promptBoolean(`配置 ${exchange.toUpperCase()}?`, false);
         if (shouldConfigure) {
            selected.push(exchange);
         }
      }

      if (selected.length === 0) {
         console.log('❌ 至少需要选择一个交易所');
         process.exit(1);
      }

      return selected;
   }

   private async configureAster(existing?: any) {
      const apiKey = await prompt(`API Key${existing?.apiKey ? ` [${existing.apiKey.slice(0, 8)}...]` : ''}: `) || existing?.apiKey;
      const apiSecret = await prompt(`API Secret${existing?.apiSecret ? ` [${existing.apiSecret.slice(0, 8)}...]` : ''}: `) || existing?.apiSecret;

      return { apiKey, apiSecret };
   }

   private async configureGrvt(existing?: any) {
      const apiKey = await prompt(`API Key${existing?.apiKey ? ` [${existing.apiKey.slice(0, 8)}...]` : ''}: `) || existing?.apiKey;
      const apiSecret = await prompt(`API Secret${existing?.apiSecret ? ` [${existing.apiSecret.slice(0, 8)}...]` : ''}: `) || existing?.apiSecret;
      const subAccountId = await prompt(`Sub Account ID${existing?.subAccountId ? ` [${existing.subAccountId}]` : ''}: `) || existing?.subAccountId;
      const instrument = await prompt(`Instrument${existing?.instrument ? ` [${existing.instrument}]` : ''} [BTC_USDT_Perp]: `) || existing?.instrument || 'BTC_USDT_Perp';

      return { apiKey, apiSecret, subAccountId, instrument };
   }

   private async configureLighter(existing?: any) {
      const accountIndex = await promptNumber('Account Index', existing?.accountIndex || 0);
      const apiPrivateKey = await prompt(`API Private Key (0x...)${existing?.apiPrivateKey ? ` [${existing.apiPrivateKey.slice(0, 10)}...]` : ''}: `) || existing?.apiPrivateKey;
      const apiKeyIndex = await promptNumber('API Key Index', existing?.apiKeyIndex || 0);
      const environment = await prompt(`Environment${existing?.environment ? ` [${existing.environment}]` : ''} [testnet]: `) || existing?.environment || 'testnet';

      return { accountIndex, apiPrivateKey, apiKeyIndex, environment };
   }

   private async configureBackpack(existing?: any) {
      const apiKey = await prompt(`API Key${existing?.apiKey ? ` [${existing.apiKey.slice(0, 8)}...]` : ''}: `) || existing?.apiKey;
      const apiSecret = await prompt(`API Secret${existing?.apiSecret ? ` [${existing.apiSecret.slice(0, 8)}...]` : ''}: `) || existing?.apiSecret;
      const password = await prompt(`Password (可选)${existing?.password ? ` [${existing.password.slice(0, 4)}...]` : ''}: `) || existing?.password;
      const subaccount = await prompt(`Subaccount (可选)${existing?.subaccount ? ` [${existing.subaccount}]` : ''}: `) || existing?.subaccount;
      const sandbox = await promptBoolean('使用沙箱环境?', existing?.sandbox || false);

      return { apiKey, apiSecret, password: password || undefined, subaccount: subaccount || undefined, sandbox };
   }

   private async configureParadex(existing?: any) {
      const privateKey = await prompt(`Private Key (0x...)${existing?.privateKey ? ` [${existing.privateKey.slice(0, 10)}...]` : ''}: `) || existing?.privateKey;
      const walletAddress = await prompt(`Wallet Address (0x...)${existing?.walletAddress ? ` [${existing.walletAddress.slice(0, 10)}...]` : ''}: `) || existing?.walletAddress;
      const sandbox = await promptBoolean('使用沙箱环境?', existing?.sandbox || false);

      return { privateKey, walletAddress, sandbox };
   }

   private async configureSymbols(existing: any, exchanges: string[]) {
      const symbols: any = { ...existing };

      for (const exchange of exchanges) {
         const defaultSymbol = this.getDefaultSymbol(exchange);
         const symbol = await prompt(`${exchange.toUpperCase()} 交易对${existing[exchange] ? ` [${existing[exchange]}]` : ''} [${defaultSymbol}]: `) || existing[exchange] || defaultSymbol;
         symbols[exchange] = symbol;
      }

      return symbols;
   }

   private getDefaultSymbol(exchange: string): string {
      const defaults: Record<string, string> = { aster: 'BTCUSDT', grvt: 'BTCUSDT', lighter: 'BTCUSDT', backpack: 'BTC_USD_PERP', paradex: 'BTC-USD-PERP' };
      return defaults[exchange] || 'BTCUSDT';
   }
}

async function main(): Promise<void> {
   // 启用标准输入
   process.stdin.setRawMode(false);
   process.stdin.resume();
   process.stdin.setEncoding('utf8');

   try {
      const setup = new PortfolioSetup();
      await setup.run();
   } catch (error) {
      console.error('❌ 配置过程中出现错误:', error);
      process.exit(1);
   } finally {
      process.stdin.pause();
   }
}

// 如果直接运行此文件
if (import.meta.main) {
   main().catch(console.error);
}

export { PortfolioSetup };
