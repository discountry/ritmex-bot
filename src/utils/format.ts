import { t } from "../i18n";

export type TrendLabel = "做多" | "做空" | "无信号";

export function formatTrendLabel(trend: TrendLabel): string {
  if (trend === "做多") return t("trend.label.long");
  if (trend === "做空") return t("trend.label.short");
  return t("trend.label.none");
}

export function formatNumber(value: number | null | undefined, digits = 4, fallback = "-"): string {
  if (value == null || Number.isNaN(value)) return fallback;
  return Number(value).toFixed(digits);
}
