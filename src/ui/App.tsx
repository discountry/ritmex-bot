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
import { loadCopyrightFragments, verifyCopyrightIntegrity } from "../utils/copyright";
import { resolveExchangeId } from "../exchanges/create-adapter";
import { availableStrategies } from "../strategy/registry";
import type { StrategyId } from "../strategy/strategy-ids";
import { t } from "../i18n";

type StrategyView = React.ComponentType<{ onExit: () => void }>;

/**
 * The only strategy knowledge the UI owns: which screen renders which engine.
 * Typed as a total Record, so adding a strategy to the registry fails to compile
 * here until it has a view.
 */
const STRATEGY_VIEWS: Record<StrategyId, StrategyView> = {
  trend: TrendApp,
  swing: SwingApp,
  guardian: GuardianApp,
  maker: MakerApp,
  "maker-points": MakerPointsApp,
  grid: GridApp,
  "offset-maker": OffsetMakerApp,
  "liquidity-maker": LiquidityMakerApp,
  basis: BasisApp,
};

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function App() {
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<StrategyId | null>(null);
  const copyright = useMemo(() => loadCopyrightFragments(), []);
  const integrityOk = useMemo(() => verifyCopyrightIntegrity(), []);
  const exchangeId = useMemo(() => resolveExchangeId(), []);
  const strategies = useMemo(() => availableStrategies(exchangeId), [exchangeId]);

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
          setSelected(strategy.id);
        }
      }
    },
    { isActive: inputSupported && !selected }
  );

  if (selected) {
    const Selected = STRATEGY_VIEWS[selected];
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
                {active ? "➤" : "  "} {t(strategy.labelKey)}
              </Text>
              <Text color="gray">    {t(strategy.descriptionKey)}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
