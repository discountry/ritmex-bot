import { t } from "../i18n";

export type TrendLabel = "long" | "short" | "none";

export function formatTrendLabel(trend: TrendLabel): string {
  if (trend === "long") return t("trend.label.long");
  if (trend === "short") return t("trend.label.short");
  return t("trend.label.none");
}

export function formatNumber(value: number | null | undefined, digits = 4, fallback = "-"): string {
  if (value == null || Number.isNaN(value)) return fallback;
  return Number(value).toFixed(digits);
}
