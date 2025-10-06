import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AsterExchangeAdapter } from '../src/exchanges/aster-adapter';
import { BackpackExchangeAdapter } from '../src/exchanges/backpack/adapter';
import { createExchangeAdapter, resolveExchangeId } from '../src/exchanges/create-adapter';
import { GrvtExchangeAdapter } from '../src/exchanges/grvt/adapter';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
   process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
   process.env = { ...ORIGINAL_ENV };
});

describe('exchange factory', () => {
   it('defaults to aster when no env is provided', () => {
      delete process.env.EXCHANGE;
      process.env.ASTER_API_KEY = 'key';
      process.env.ASTER_API_SECRET = 'secret';
      const adapter = createExchangeAdapter({ symbol: 'BTCUSDT' });
      expect(adapter).toBeInstanceOf(AsterExchangeAdapter);
      expect(adapter.id).toBe('aster');
   });

   it('resolves exchange id case-insensitively', () => {
      expect(resolveExchangeId('Grvt')).toBe('grvt');
      expect(resolveExchangeId('ASTER')).toBe('aster');
      expect(resolveExchangeId('BACKPACK')).toBe('backpack');
   });

   it('creates grvt adapter when EXCHANGE=grvt', () => {
      process.env.EXCHANGE = 'grvt';
      process.env.GRVT_API_KEY = 'api-key';
      process.env.GRVT_API_SECRET = '0x' + '1'.repeat(64);
      process.env.GRVT_SUB_ACCOUNT_ID = 'sub';
      process.env.GRVT_INSTRUMENT = 'BTC_USDT_Perp';
      process.env.GRVT_SYMBOL = 'BTCUSDT';
      delete process.env.GRVT_SIGNER_PATH;

      const adapter = createExchangeAdapter({ symbol: 'BTCUSDT' });
      expect(adapter).toBeInstanceOf(GrvtExchangeAdapter);
      expect(adapter.id).toBe('grvt');
   });

   it('creates backpack adapter when EXCHANGE=backpack', () => {
      process.env.EXCHANGE = 'backpack';
      process.env.BACKPACK_API_KEY = 'api-key';
      process.env.BACKPACK_API_SECRET = 'secret';
      process.env.TRADE_SYMBOL = 'BTCUSDC';

      const adapter = createExchangeAdapter({ symbol: 'BTCUSDC' });
      expect(adapter).toBeInstanceOf(BackpackExchangeAdapter);
      expect(adapter.id).toBe('backpack');
   });
});
