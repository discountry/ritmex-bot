import React, { useMemo, useState } from "react";
import { Box, Text, useInput } from "ink";
import { TrendApp } from "./TrendApp";
import { SwingApp } from "./SwingApp";
import { GuardianApp } from "./GuardianApp";
import { MakerApp } from "./MakerApp";
import { MakerPointsApp } from "./MakerPointsApp";
import { OffsetMakerApp } from "./OffsetMakerApp";
import { LiquidityMakerApp } from "./LiquidityMakerApp";
import { GridApp } from "./GridApp";
import { BasisApp } from "./BasisApp";
import { isBasisStrategyEnabled } from "../config";
import { loadCopyrightFragments, verifyCopyrightIntegrity } from "../utils/copyright";
import { resolveExchangeId } from "../exchanges/create-adapter";
import { t } from "../i18n";

interface StrategyOption {
  id: "trend" | "swing" | "guardian" | "maker" | "maker-points" | "offset-maker" | "liquidity-maker" | "basis" | "grid";
  label: string;
  description: string;
  component: React.ComponentType<{ onExit: () => void }>;
}

const BASE_STRATEGIES: StrategyOption[] = [
  {
    id: "trend",
    label: t("app.strategy.trend.label"),
    description: t("app.strategy.trend.desc"),
    component: TrendApp,
  },
  {
    id: "swing",
    label: t("app.strategy.swing.label"),
    description: t("app.strategy.swing.desc"),
    component: SwingApp,
  },
  {
    id: "guardian",
    label: t("app.strategy.guardian.label"),
    description: t("app.strategy.guardian.desc"),
    component: GuardianApp,
  },
  {
    id: "maker",
    label: t("app.strategy.maker.label"),
    description: t("app.strategy.maker.desc"),
    component: MakerApp,
  },
  {
    id: "grid",
    label: t("app.strategy.grid.label"),
    description: t("app.strategy.grid.desc"),
    component: GridApp,
  },
  {
    id: "offset-maker",
    label: t("app.strategy.offset.label"),
    description: t("app.strategy.offset.desc"),
    component: OffsetMakerApp,
  },
  {
    id: "liquidity-maker",
    label: t("app.strategy.liquidityMaker.label"),
    description: t("app.strategy.liquidityMaker.desc"),
    component: LiquidityMakerApp,
  },
];

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function App() {
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<StrategyOption | null>(null);
  const copyright = useMemo(() => loadCopyrightFragments(), []);
  const integrityOk = useMemo(() => verifyCopyrightIntegrity(), []);
  const exchangeId = useMemo(() => resolveExchangeId(), []);
  const strategies = useMemo(() => {
    const next: StrategyOption[] = [...BASE_STRATEGIES];
    if (exchangeId === "standx") {
      const gridIndex = next.findIndex((s) => s.id === "grid");
      const insertAt = gridIndex === -1 ? next.length : gridIndex;
      next.splice(insertAt, 0, {
        id: "maker-points" as const,
        label: t("app.strategy.makerPoints.label"),
        description: t("app.strategy.makerPoints.desc"),
        component: MakerPointsApp,
      });
    }
    if (isBasisStrategyEnabled()) {
      next.push({
        id: "basis" as const,
        label: t("app.strategy.basis.label"),
        description: t("app.strategy.basis.desc"),
        component: BasisApp,
      });
    }
    return next;
  }, [exchangeId]);

  useInput(
    (input, key) => {
      if (selected) return;
      if (key.upArrow) {
        setCursor((prev) => (prev - 1 + strategies.length) % strategies.length);
      } else if (key.downArrow) {
        setCursor((prev) => (prev + 1) % strategies.length);
      } else if (key.return) {
        const strategy = strategies[cursor];
        if (strategy) {
          setSelected(strategy);
        }
      }
    },
    { isActive: inputSupported && !selected }
  );

  if (selected) {
    const Selected = selected.component;
    return <Selected onExit={() => setSelected(null)} />;
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Text color="gray">{copyright.bannerText}</Text>
      {integrityOk ? null : (
        <Text color="red">{t("app.integrity.warning")}</Text>
      )}
      <Box height={1}>
        <Text color="gray">────────────────────────────────────────────────────</Text>
      </Box>
      <Text color="cyanBright">{t("app.pickStrategy")}</Text>
      <Text color="gray">{t("app.pickHint")}</Text>
      <Box flexDirection="column" marginTop={1}>
        {strategies.map((strategy, index) => {
          const active = index === cursor;
          return (
            <Box key={strategy.id} flexDirection="column" marginBottom={1}>
              <Text color={active ? "greenBright" : undefined}>
                {active ? "➤" : "  "} {strategy.label}
              </Text>
              <Text color="gray">    {strategy.description}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
