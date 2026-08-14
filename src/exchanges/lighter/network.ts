import {
  DEFAULT_LIGHTER_ENVIRONMENT,
  LIGHTER_APP_HOSTS,
  LIGHTER_ENVIRONMENT_ALIASES,
  LIGHTER_NETWORKS,
  type LighterEnvironment,
} from "./constants";

export interface LighterNetworkResolution {
  /** `null` only for a self-hosted/proxied REST host we cannot map to a known deployment. */
  environment: LighterEnvironment | null;
  restUrl: string;
  wsUrl: string;
  chainId: number;
  expectedL1ChainId: number | null;
  expectedZkLighterContract: string | null;
  defaultQuoteAsset: string;
}

export interface ResolveLighterNetworkOptions {
  environment?: string | null;
  baseUrl?: string | null;
  wsUrl?: string | null;
  chainId?: number | null;
}

const KNOWN_ENVIRONMENTS = Object.keys(LIGHTER_NETWORKS) as LighterEnvironment[];

function isLighterEnvironment(value: string): value is LighterEnvironment {
  return Object.prototype.hasOwnProperty.call(LIGHTER_NETWORKS, value);
}

/**
 * Canonicalizes a user-supplied environment name. Returns `null` for empty input and throws
 * on a non-empty unknown value — silently falling back would point a live bot at the wrong
 * chain, which is exactly the failure this module exists to prevent.
 */
export function normalizeEnvironmentName(value: string | null | undefined): LighterEnvironment | null {
  if (value == null) return null;
  const trimmed = String(value).trim().toLowerCase();
  if (!trimmed) return null;
  if (isLighterEnvironment(trimmed)) return trimmed;
  const alias = LIGHTER_ENVIRONMENT_ALIASES[trimmed];
  if (alias) return alias;
  throw new Error(
    `Unknown Lighter environment "${value}". Valid values: ${KNOWN_ENVIRONMENTS.join(", ")} ` +
      `(aliases: ${Object.keys(LIGHTER_ENVIRONMENT_ALIASES).join(", ")})`
  );
}

function extractHostname(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).hostname.toLowerCase();
  } catch {
    // Bare hostnames ("api.rh.lighter.xyz") are accepted too.
    const withoutPath = trimmed.split("/")[0] ?? "";
    return withoutPath.toLowerCase() || null;
  }
}

/** Maps a web-app hostname (not an API host) onto the deployment it belongs to. */
export function detectEnvironmentFromAppHost(value: string | null | undefined): LighterEnvironment | null {
  const host = extractHostname(value);
  if (!host) return null;
  return LIGHTER_APP_HOSTS[host] ?? null;
}

/**
 * Maps an API hostname onto a known deployment. Order matters: the Robinhood hosts are matched
 * before the substring rules, because `api.rh-testnet.lighter.xyz` contains "testnet" and would
 * otherwise be mistaken for the zklighter testnet.
 */
export function detectEnvironmentFromUrl(value: string | null | undefined): LighterEnvironment | null {
  const host = extractHostname(value);
  if (!host) return null;

  for (const env of KNOWN_ENVIRONMENTS) {
    const configured = extractHostname(LIGHTER_NETWORKS[env].rest);
    if (configured && configured === host) return env;
  }

  if (host.includes("rh-testnet.lighter") || host.includes("robinhood-testnet")) return "rh-testnet";
  if (host.includes("rh.lighter") || host.includes("robinhood")) return "rh";
  if (host.includes("mainnet")) return "mainnet";
  if (host.includes("testnet")) return "testnet";
  if (host.includes("staging")) return "staging";
  if (host.includes("dev")) return "dev";
  return null;
}

/** Turns a REST base URL into the matching stream URL for a self-hosted deployment. */
export function deriveWebSocketUrl(restUrl: string): string {
  const trimmed = restUrl.trim().replace(/\/+$/, "");
  const withScheme = /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const swapped = withScheme.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://");
  return swapped.endsWith("/stream") ? swapped : `${swapped}/stream`;
}

function sameHost(a: string, b: string): boolean {
  const hostA = extractHostname(a);
  const hostB = extractHostname(b);
  return hostA != null && hostA === hostB;
}

/**
 * Single place where REST host, websocket host and signing chain id are decided together.
 * Precedence: explicit environment > web-app hostname > API hostname > default environment.
 */
export function resolveLighterNetwork(options: ResolveLighterNetworkOptions = {}): LighterNetworkResolution {
  const explicitEnv = normalizeEnvironmentName(options.environment);
  const baseUrl = options.baseUrl?.trim() || null;
  const appHostEnv = detectEnvironmentFromAppHost(baseUrl);
  const detectedEnv = detectEnvironmentFromUrl(baseUrl);

  const environment: LighterEnvironment | null =
    explicitEnv ?? appHostEnv ?? detectedEnv ?? (baseUrl ? null : DEFAULT_LIGHTER_ENVIRONMENT);
  const config = environment ? LIGHTER_NETWORKS[environment] : null;

  // A web-app URL never serves the API, so it selects the deployment and is then discarded.
  const restUrl = (appHostEnv ? config?.rest : baseUrl ?? config?.rest) ?? config?.rest ?? null;
  if (!restUrl) {
    throw new Error("Lighter REST base URL could not be resolved; set LIGHTER_ENV or LIGHTER_BASE_URL");
  }

  const explicitWs = options.wsUrl?.trim() || null;
  const wsUrl =
    explicitWs ?? (config && sameHost(restUrl, config.rest) ? config.ws : deriveWebSocketUrl(restUrl));

  const chainId = options.chainId ?? config?.chainId ?? null;
  if (chainId == null) {
    throw new Error(
      `Cannot determine the Lighter signing chain id for host ${extractHostname(restUrl) ?? restUrl}. ` +
        `Set LIGHTER_ENV to a known deployment (${KNOWN_ENVIRONMENTS.join(", ")}) or set LIGHTER_CHAIN_ID explicitly.`
    );
  }

  return {
    environment,
    restUrl: restUrl.replace(/\/+$/, ""),
    wsUrl,
    chainId,
    expectedL1ChainId: config?.l1ChainId ?? null,
    expectedZkLighterContract: config?.zkLighterContract ?? null,
    defaultQuoteAsset: config?.defaultQuoteAsset ?? "USDC",
  };
}
