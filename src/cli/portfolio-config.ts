/**
 * Portfolio Configuration Helper
 * 帮助用户配置多个交易所的API密钥
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ExchangeCredentials {
   aster?: { apiKey: string; apiSecret: string };
   grvt?: { apiKey: string; apiSecret: string; subAccountId: string; instrument: string };
   lighter?: { accountIndex: number; apiPrivateKey: string; apiKeyIndex?: number; environment?: string };
   backpack?: { apiKey: string; apiSecret: string; password?: string; subaccount?: string; sandbox?: boolean };
   paradex?: { privateKey: string; walletAddress: string; sandbox?: boolean };
}

export interface PortfolioConfig {
   exchanges: ExchangeCredentials;
   symbols: { [exchangeId: string]: string };
}

const CONFIG_FILE = '.portfolio-config.json';

export class PortfolioConfigManager {
   private configPath: string;

   constructor(configDir: string = process.cwd()) {
      this.configPath = join(configDir, CONFIG_FILE);
   }

   loadConfig(): PortfolioConfig | null {
      if (!existsSync(this.configPath)) {
         return null;
      }

      try {
         const content = readFileSync(this.configPath, 'utf-8');
         return JSON.parse(content) as PortfolioConfig;
      } catch (error) {
         console.error('❌ 配置文件格式错误:', error);
         return null;
      }
   }

   saveConfig(config: PortfolioConfig): void {
      try {
         writeFileSync(this.configPath, JSON.stringify(config, null, 2));
         console.log(`✅ 配置已保存到 ${this.configPath}`);
      } catch (error) {
         console.error('❌ 保存配置失败:', error);
         throw error;
      }
   }

   createDefaultConfig(): PortfolioConfig {
      return { exchanges: {}, symbols: { aster: 'BTCUSDT', grvt: 'BTCUSDT', lighter: 'BTCUSDT', backpack: 'BTC_USD_PERP', paradex: 'BTC-USD-PERP' } };
   }

   generateEnvFile(config: PortfolioConfig): string {
      const lines: string[] = ['# Portfolio Viewer Configuration', '# 由 portfolio-config 工具自动生成', ''];

      // Aster
      if (config.exchanges.aster) {
         lines.push('# Aster Exchange');
         lines.push(`ASTER_API_KEY=${config.exchanges.aster.apiKey}`);
         lines.push(`ASTER_API_SECRET=${config.exchanges.aster.apiSecret}`);
         lines.push(`ASTER_SYMBOL=${config.symbols.aster || 'BTCUSDT'}`);
         lines.push('');
      }

      // GRVT
      if (config.exchanges.grvt) {
         lines.push('# GRVT Exchange');
         lines.push(`GRVT_API_KEY=${config.exchanges.grvt.apiKey}`);
         lines.push(`GRVT_API_SECRET=${config.exchanges.grvt.apiSecret}`);
         lines.push(`GRVT_SUB_ACCOUNT_ID=${config.exchanges.grvt.subAccountId}`);
         lines.push(`GRVT_INSTRUMENT=${config.exchanges.grvt.instrument}`);
         lines.push(`GRVT_SYMBOL=${config.symbols.grvt || 'BTCUSDT'}`);
         lines.push('GRVT_ENV=prod');
         lines.push('');
      }

      // Lighter
      if (config.exchanges.lighter) {
         lines.push('# Lighter Exchange');
         lines.push(`LIGHTER_ACCOUNT_INDEX=${config.exchanges.lighter.accountIndex}`);
         lines.push(`LIGHTER_API_PRIVATE_KEY=${config.exchanges.lighter.apiPrivateKey}`);
         if (config.exchanges.lighter.apiKeyIndex !== undefined) {
            lines.push(`LIGHTER_API_KEY_INDEX=${config.exchanges.lighter.apiKeyIndex}`);
         }
         lines.push(`LIGHTER_ENV=${config.exchanges.lighter.environment || 'testnet'}`);
         lines.push(`LIGHTER_SYMBOL=${config.symbols.lighter || 'BTCUSDT'}`);
         lines.push('');
      }

      // Backpack
      if (config.exchanges.backpack) {
         lines.push('# Backpack Exchange');
         lines.push(`BACKPACK_API_KEY=${config.exchanges.backpack.apiKey}`);
         lines.push(`BACKPACK_API_SECRET=${config.exchanges.backpack.apiSecret}`);
         if (config.exchanges.backpack.password) {
            lines.push(`BACKPACK_PASSWORD=${config.exchanges.backpack.password}`);
         }
         if (config.exchanges.backpack.subaccount) {
            lines.push(`BACKPACK_SUBACCOUNT=${config.exchanges.backpack.subaccount}`);
         }
         lines.push(`BACKPACK_SANDBOX=${config.exchanges.backpack.sandbox || false}`);
         lines.push(`BACKPACK_SYMBOL=${config.symbols.backpack || 'BTC_USD_PERP'}`);
         lines.push('');
      }

      // Paradex
      if (config.exchanges.paradex) {
         lines.push('# Paradex Exchange');
         lines.push(`PARADEX_PRIVATE_KEY=${config.exchanges.paradex.privateKey}`);
         lines.push(`PARADEX_WALLET_ADDRESS=${config.exchanges.paradex.walletAddress}`);
         lines.push(`PARADEX_SANDBOX=${config.exchanges.paradex.sandbox || false}`);
         lines.push(`PARADEX_SYMBOL=${config.symbols.paradex || 'BTC-USD-PERP'}`);
         lines.push('');
      }

      return lines.join('\n');
   }

   validateConfig(config: PortfolioConfig): string[] {
      const errors: string[] = [];

      // 检查是否至少配置了一个交易所
      const exchangeCount = Object.keys(config.exchanges).length;
      if (exchangeCount === 0) {
         errors.push('至少需要配置一个交易所');
      }

      // 验证 Aster 配置
      if (config.exchanges.aster) {
         if (!config.exchanges.aster.apiKey) {
            errors.push('Aster API Key 不能为空');
         }
         if (!config.exchanges.aster.apiSecret) {
            errors.push('Aster API Secret 不能为空');
         }
      }

      // 验证 GRVT 配置
      if (config.exchanges.grvt) {
         if (!config.exchanges.grvt.apiKey) {
            errors.push('GRVT API Key 不能为空');
         }
         if (!config.exchanges.grvt.apiSecret) {
            errors.push('GRVT API Secret 不能为空');
         }
         if (!config.exchanges.grvt.subAccountId) {
            errors.push('GRVT Sub Account ID 不能为空');
         }
         if (!config.exchanges.grvt.instrument) {
            errors.push('GRVT Instrument 不能为空');
         }
      }

      // 验证 Lighter 配置
      if (config.exchanges.lighter) {
         if (!Number.isInteger(config.exchanges.lighter.accountIndex)) {
            errors.push('Lighter Account Index 必须是整数');
         }
         if (!config.exchanges.lighter.apiPrivateKey) {
            errors.push('Lighter API Private Key 不能为空');
         }
         if (config.exchanges.lighter.apiPrivateKey && !config.exchanges.lighter.apiPrivateKey.startsWith('0x')) {
            errors.push('Lighter API Private Key 必须以 0x 开头');
         }
      }

      // 验证 Backpack 配置
      if (config.exchanges.backpack) {
         if (!config.exchanges.backpack.apiKey) {
            errors.push('Backpack API Key 不能为空');
         }
         if (!config.exchanges.backpack.apiSecret) {
            errors.push('Backpack API Secret 不能为空');
         }
      }

      // 验证 Paradex 配置
      if (config.exchanges.paradex) {
         if (!config.exchanges.paradex.privateKey) {
            errors.push('Paradex Private Key 不能为空');
         }
         if (!config.exchanges.paradex.walletAddress) {
            errors.push('Paradex Wallet Address 不能为空');
         }
         if (config.exchanges.paradex.privateKey && !config.exchanges.paradex.privateKey.startsWith('0x')) {
            errors.push('Paradex Private Key 必须以 0x 开头');
         }
         if (config.exchanges.paradex.walletAddress && !config.exchanges.paradex.walletAddress.startsWith('0x')) {
            errors.push('Paradex Wallet Address 必须以 0x 开头');
         }
      }

      return errors;
   }
}
