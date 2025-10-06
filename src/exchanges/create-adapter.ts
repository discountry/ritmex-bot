import type { ExchangeAdapter } from './adapter';
import { type AsterCredentials, AsterExchangeAdapter } from './aster-adapter';
import { type BackpackCredentials, BackpackExchangeAdapter } from './backpack/adapter';
import { type GrvtCredentials, GrvtExchangeAdapter } from './grvt/adapter';
import { type LighterCredentials, LighterExchangeAdapter } from './lighter/adapter';

export interface ExchangeFactoryOptions {
   symbol: string;
   exchange?: string;
   aster?: AsterCredentials;
   grvt?: GrvtCredentials;
   lighter?: LighterCredentials;
   backpack?: BackpackCredentials;
}

export type SupportedExchangeId = 'aster' | 'grvt' | 'lighter' | 'backpack';

export function resolveExchangeId(value?: string | null): SupportedExchangeId {
   const fallback = (value ?? process.env.EXCHANGE ?? process.env.TRADE_EXCHANGE ?? 'aster').toString().trim().toLowerCase();
   if (fallback === 'grvt') { return 'grvt'; }
   if (fallback === 'lighter') { return 'lighter'; }
   if (fallback === 'backpack') { return 'backpack'; }
   return 'aster';
}

export function getExchangeDisplayName(id: SupportedExchangeId): string {
   if (id === 'grvt') { return 'GRVT'; }
   if (id === 'lighter') { return 'Lighter'; }
   if (id === 'backpack') { return 'Backpack'; }
   return 'AsterDex';
}

export function createExchangeAdapter(options: ExchangeFactoryOptions): ExchangeAdapter {
   const id = resolveExchangeId(options.exchange);
   if (id === 'grvt') {
      return new GrvtExchangeAdapter({ ...options.grvt, symbol: options.symbol });
   }
   if (id === 'lighter') {
      return new LighterExchangeAdapter({ ...options.lighter, displaySymbol: options.symbol });
   }
   if (id === 'backpack') {
      return new BackpackExchangeAdapter({ ...options.backpack, symbol: options.symbol });
   }
   return new AsterExchangeAdapter({ ...options.aster, symbol: options.symbol });
}
