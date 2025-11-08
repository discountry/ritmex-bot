import type { ExchangeAdapter } from './adapter';
import type { AsterCredentials } from './aster-adapter';
import type { BackpackCredentials } from './backpack/adapter';
import { createExchangeAdapter, resolveExchangeId, type SupportedExchangeId } from './create-adapter';
import type { LighterCredentials } from './lighter/adapter';
import type { ParadexCredentials } from './paradex/adapter';

interface BuildAdapterOptions {
   symbol: string;
   exchangeId?: string | SupportedExchangeId;
}

export function buildAdapterFromEnv(options: BuildAdapterOptions): ExchangeAdapter {
   const id = resolveExchangeId(options.exchangeId);
   const symbol = options.symbol;

   if (id === 'aster') {
      const credentials = resolveAsterCredentials();
      return createExchangeAdapter({ exchange: id, symbol, aster: credentials });
   }

   if (id === 'lighter') {
      const credentials = resolveLighterCredentials(symbol);
      return createExchangeAdapter({ exchange: id, symbol, lighter: credentials });
   }

   if (id === 'backpack') {
      const credentials = resolveBackpackCredentials(symbol);
      return createExchangeAdapter({ exchange: id, symbol, backpack: credentials });
   }

   if (id === 'paradex') {
      const credentials = resolveParadexCredentials();
      return createExchangeAdapter({ exchange: id, symbol, paradex: credentials });
   }

   return createExchangeAdapter({ exchange: id, symbol, grvt: { symbol } });
}

function resolveAsterCredentials(): AsterCredentials {
   const apiKey = process.env.ASTER_API_KEY;
   const apiSecret = process.env.ASTER_API_SECRET;
   if (!apiKey || !apiSecret) {
      throw new Error('缺少 ASTER_API_KEY 或 ASTER_API_SECRET 环境变量');
   }
   return { apiKey, apiSecret };
}

function resolveLighterCredentials(symbol: string): LighterCredentials {
   const accountIndexRaw = process.env.LIGHTER_ACCOUNT_INDEX;
   const apiPrivateKey = process.env.LIGHTER_API_PRIVATE_KEY;
   if (!accountIndexRaw || !apiPrivateKey) {
      throw new Error('缺少 LIGHTER_ACCOUNT_INDEX 或 LIGHTER_API_PRIVATE_KEY 环境变量');
   }
   const accountIndex = Number(accountIndexRaw);
   if (!Number.isInteger(accountIndex)) {
      throw new Error('LIGHTER_ACCOUNT_INDEX 必须是整数');
   }
   const credentials: LighterCredentials = {
      displaySymbol: symbol,
      accountIndex,
      apiPrivateKey,
      apiKeyIndex: process.env.LIGHTER_API_KEY_INDEX ? Number(process.env.LIGHTER_API_KEY_INDEX) : 0,
      environment: process.env.LIGHTER_ENV,
      baseUrl: process.env.LIGHTER_BASE_URL,
      l1Address: process.env.LIGHTER_L1_ADDRESS,
      marketSymbol: process.env.LIGHTER_SYMBOL,
      marketId: process.env.LIGHTER_MARKET_ID ? Number(process.env.LIGHTER_MARKET_ID) : undefined,
      priceDecimals: process.env.LIGHTER_PRICE_DECIMALS ? Number(process.env.LIGHTER_PRICE_DECIMALS) : undefined,
      sizeDecimals: process.env.LIGHTER_SIZE_DECIMALS ? Number(process.env.LIGHTER_SIZE_DECIMALS) : undefined,
   };
   return credentials;
}

function resolveBackpackCredentials(symbol: string): BackpackCredentials {
   const apiKey = process.env.BACKPACK_API_KEY;
   const apiSecret = process.env.BACKPACK_API_SECRET;
   if (!apiKey || !apiSecret) {
      throw new Error('缺少 BACKPACK_API_KEY 或 BACKPACK_API_SECRET 环境变量');
   }
   const credentials: BackpackCredentials = {
      apiKey,
      apiSecret,
      password: process.env.BACKPACK_PASSWORD,
      subaccount: process.env.BACKPACK_SUBACCOUNT,
      symbol: process.env.BACKPACK_SYMBOL ?? symbol,
      sandbox: parseOptionalBoolean(process.env.BACKPACK_SANDBOX),
   };
   return credentials;
}

function resolveParadexCredentials(): ParadexCredentials {
   const privateKey = process.env.PARADEX_PRIVATE_KEY;
   const walletAddress = process.env.PARADEX_WALLET_ADDRESS;

   if (!privateKey || !walletAddress) {
      throw new Error('Paradex 需要配置 PARADEX_PRIVATE_KEY 与 PARADEX_WALLET_ADDRESS');
   }
   if (!isHex32(privateKey)) {
      throw new Error('PARADEX_PRIVATE_KEY 必须是 0x 开头的 32 字节十六进制字符串');
   }
   if (!isHexAddress(walletAddress)) {
      throw new Error('PARADEX_WALLET_ADDRESS 必须是有效的 0x 开头 40 字节十六进制地址');
   }

   const credentials: ParadexCredentials = {
      privateKey,
      walletAddress,
      sandbox: parseOptionalBoolean(process.env.PARADEX_SANDBOX),
      usePro: parseOptionalBoolean(process.env.PARADEX_USE_PRO),
      watchReconnectDelayMs: parseOptionalNumber(process.env.PARADEX_RECONNECT_DELAY_MS),
   };

   return credentials;
}

function isHex32(value: string): boolean {
   return /^0x[0-9a-fA-F]{64}$/.test(value.trim());
}

function isHexAddress(value: string): boolean {
   return /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

function parseOptionalBoolean(value: string | undefined): boolean | undefined {
   if (!value || value === null) { return undefined; }
   const normalized = value.trim().toLowerCase();
   if (!normalized) { return undefined; }
   if (['false', '0', 'no', 'off'].includes(normalized)) { return false; }
   return true;
}

function parseOptionalNumber(value: string | undefined): number | undefined {
   if (!value) { return undefined; }
   const parsed = Number(value);
   return Number.isFinite(parsed) ? parsed : undefined;
}
