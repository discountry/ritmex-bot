import type { ExchangeAdapter } from "./adapter";
import { createExchangeAdapter, resolveExchangeId, type SupportedExchangeId } from "./create-adapter";
import type { AsterCredentials } from "./aster-adapter";
import type { LighterCredentials } from "./lighter/adapter";
import type { BackpackCredentials } from "./backpack/adapter";
import type { ParadexCredentials } from "./paradex/adapter";
import type { NadoCredentials } from "./nado/adapter";
import type { StandxCredentials } from "./standx/adapter";
import { t } from "../i18n";
import type { Address } from "viem";

interface BuildAdapterOptions {
  symbol: string;
  exchangeId?: string | SupportedExchangeId;
}

export function buildAdapterFromEnv(options: BuildAdapterOptions): ExchangeAdapter {
  const id = resolveExchangeId(options.exchangeId);
  const symbol = options.symbol;

  if (id === "aster") {
    const credentials = resolveAsterCredentials();
    return createExchangeAdapter({ exchange: id, symbol, aster: credentials });
  }

  if (id === "lighter") {
    const credentials = resolveLighterCredentials(symbol);
    return createExchangeAdapter({ exchange: id, symbol, lighter: credentials });
  }

  if (id === "backpack") {
    const credentials = resolveBackpackCredentials(symbol);
    return createExchangeAdapter({ exchange: id, symbol, backpack: credentials });
  }

  if (id === "paradex") {
    const credentials = resolveParadexCredentials();
    return createExchangeAdapter({ exchange: id, symbol, paradex: credentials });
  }

  if (id === "nado") {
    const credentials = resolveNadoCredentials(symbol);
    return createExchangeAdapter({ exchange: id, symbol, nado: credentials });
  }

  if (id === "standx") {
    const credentials = resolveStandxCredentials(symbol);
    return createExchangeAdapter({ exchange: id, symbol, standx: credentials });
  }

  return createExchangeAdapter({ exchange: id, symbol, grvt: { symbol } });
}

function resolveAsterCredentials(): AsterCredentials {
  const apiKey = process.env.ASTER_API_KEY;
  const apiSecret = process.env.ASTER_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error(t("env.missingAster"));
  }
  return { apiKey, apiSecret };
}

function resolveLighterCredentials(symbol: string): LighterCredentials {
  const accountIndexRaw = process.env.LIGHTER_ACCOUNT_INDEX;
  const apiPrivateKey = process.env.LIGHTER_API_PRIVATE_KEY;
  if (!accountIndexRaw || !apiPrivateKey) {
    throw new Error(t("env.missingLighter"));
  }
  const accountIndex = Number(accountIndexRaw);
  if (!Number.isInteger(accountIndex)) {
    throw new Error(t("env.lighterIndexInteger"));
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
    throw new Error(t("env.missingBackpack"));
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
    throw new Error(t("env.missingParadex"));
  }
  if (!isHex32(privateKey)) {
    throw new Error(t("env.invalidParadexPrivateKey"));
  }
  if (!isHexAddress(walletAddress)) {
    throw new Error(t("env.invalidParadexAddress"));
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

function resolveNadoCredentials(symbol: string): NadoCredentials {
  const signerPrivateKey = process.env.NADO_SIGNER_PRIVATE_KEY;
  const subaccountOwner = process.env.NADO_SUBACCOUNT_OWNER ?? process.env.NADO_EVM_ADDRESS;

  if (!signerPrivateKey || !subaccountOwner) {
    throw new Error(t("env.missingNado"));
  }
  if (!isHex32(signerPrivateKey)) {
    throw new Error(t("env.invalidNadoPrivateKey"));
  }
  if (!isHexAddress(subaccountOwner)) {
    throw new Error(t("env.invalidNadoAddress"));
  }

  const credentials: NadoCredentials = {
    symbol: process.env.NADO_SYMBOL ?? symbol,
    signerPrivateKey,
    subaccountOwner: subaccountOwner as Address,
    subaccountName: process.env.NADO_SUBACCOUNT_NAME ?? undefined,
    env: process.env.NADO_ENV as any,
    gatewayWsUrl: process.env.NADO_GATEWAY_WS_URL ?? undefined,
    subscriptionsWsUrl: process.env.NADO_SUBSCRIPTIONS_WS_URL ?? undefined,
    archiveUrl: process.env.NADO_ARCHIVE_URL ?? undefined,
    triggerUrl: process.env.NADO_TRIGGER_URL ?? undefined,
    marketSlippagePct: parseOptionalNumber(process.env.NADO_MARKET_SLIPPAGE_PCT),
    stopTriggerSource: process.env.NADO_STOP_TRIGGER_SOURCE as any,
  };

  return credentials;
}

function resolveStandxCredentials(symbol: string): StandxCredentials {
  const token = process.env.STANDX_TOKEN;
  if (!token) {
    throw new Error(t("env.missingStandx"));
  }
  return {
    token,
    symbol: process.env.STANDX_SYMBOL ?? symbol,
    baseUrl: process.env.STANDX_BASE_URL ?? undefined,
    wsUrl: process.env.STANDX_WS_URL ?? undefined,
    sessionId: process.env.STANDX_SESSION_ID ?? undefined,
    signingKey: process.env.STANDX_REQUEST_PRIVATE_KEY ?? undefined,
  };
}

function isHex32(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value.trim());
}

function isHexAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

function parseOptionalBoolean(value: string | undefined): boolean | undefined {
  if (value == null) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return true;
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
