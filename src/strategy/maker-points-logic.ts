export interface MakerPointsBandConfig {
  band0To10: boolean;
  band10To30: boolean;
  band30To100: boolean;
}

export function buildBpsTargets(config: MakerPointsBandConfig): number[] {
  const targets: number[] = [];
  if (config.band0To10) targets.push(9);
  if (config.band10To30) targets.push(29);
  if (config.band30To100) targets.push(99);
  return targets.sort((a, b) => a - b);
}
