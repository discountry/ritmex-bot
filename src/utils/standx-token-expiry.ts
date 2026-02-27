import { isStandxTokenExpired, getStandxTokenExpiryInfo, standxTokenConfig } from "../config";

export type TokenExpiryState = "active" | "expired" | "expired_with_position" | "silent";

export interface TokenExpiryStatus {
  state: TokenExpiryState;
  expired: boolean;
  expiryTimestamp: number | null;
  remainingMs: number | null;
  hasPosition: boolean;
  hasOpenOrders: boolean;
}

export interface TokenExpiryCheckParams {
  positionAmt: number;
  openOrderCount: number;
}

export function checkStandxTokenExpiry(params: TokenExpiryCheckParams): TokenExpiryStatus {
  const info = getStandxTokenExpiryInfo();
  const hasPosition = Math.abs(params.positionAmt) > 1e-8;
  const hasOpenOrders = params.openOrderCount > 0;

  if (!info.expired) {
    return {
      state: "active",
      expired: false,
      expiryTimestamp: info.expiryTimestamp,
      remainingMs: info.remainingMs,
      hasPosition,
      hasOpenOrders,
    };
  }

  if (hasPosition) {
    return {
      state: "expired_with_position",
      expired: true,
      expiryTimestamp: info.expiryTimestamp,
      remainingMs: 0,
      hasPosition: true,
      hasOpenOrders,
    };
  }

  if (!hasOpenOrders) {
    return {
      state: "silent",
      expired: true,
      expiryTimestamp: info.expiryTimestamp,
      remainingMs: 0,
      hasPosition: false,
      hasOpenOrders: false,
    };
  }

  return {
    state: "expired",
    expired: true,
    expiryTimestamp: info.expiryTimestamp,
    remainingMs: 0,
    hasPosition,
    hasOpenOrders,
  };
}

export function formatTokenExpiryMessage(status: TokenExpiryStatus): string | null {
  if (!status.expired) {
    if (status.remainingMs != null && status.remainingMs < 3600_000) {
      const mins = Math.ceil(status.remainingMs / 60_000);
      return `StandX Token 将在 ${mins} 分钟后过期`;
    }
    return null;
  }

  switch (status.state) {
    case "expired":
      return "StandX Token 已过期，正在取消所有挂单";
    case "expired_with_position":
      return "StandX Token 已过期，仅保留平仓/止损逻辑";
    case "silent":
      return "StandX Token 已过期，进入静默数据接收模式";
    default:
      return null;
  }
}

export function isTokenExpiryConfigured(): boolean {
  return standxTokenConfig.expiryTimestamp != null;
}

export { isStandxTokenExpired, getStandxTokenExpiryInfo };
