import { describe, expect, it } from "vitest";
import { BackpackGateway } from "../src/exchanges/backpack/gateway";

describe("BackpackGateway account snapshots", () => {
  const createGateway = () =>
    new BackpackGateway({
      apiKey: "key",
      apiSecret: "secret",
      symbol: "BTCUSDC",
      logger: () => {},
    }) as any;

  it("maps spot balances without positions", () => {
    const gateway = createGateway();
    gateway.isContractMarket = false;

    const balance = {
      info: {},
      free: { USDC: "10" },
      used: { USDC: "5" },
      total: { USDC: "15" },
      USDC: { free: "10", used: "5", total: "15" },
    } as any;

    const snapshot = gateway.mapBalanceToAccountSnapshotWithPositions(balance, []);

    expect(snapshot.positions).toEqual([]);
    expect(snapshot.totalWalletBalance).toBe("15");
    expect(snapshot.totalUnrealizedProfit).toBe("0");
    expect(snapshot.availableBalance).toBe("10");
    expect(snapshot.maxWithdrawAmount).toBe("10");
    expect(snapshot.totalMarginBalance).toBeUndefined();
    expect(snapshot.assets).toHaveLength(1);
    expect(snapshot.assets[0]).toMatchObject({
      asset: "USDC",
      walletBalance: "15",
      availableBalance: "10",
    });
  });

  it("includes derivative positions when present", () => {
    const gateway = createGateway();
    gateway.isContractMarket = true;
    gateway.marketSymbol = "BTC/USDC:USDC";

    const balance = {
      info: {},
      free: { USDC: "80" },
      used: { USDC: "20" },
      total: { USDC: "100" },
      USDC: { free: "80", used: "20", total: "100" },
    } as any;

    const positions = [
      {
        symbol: "BTC/USDC:USDC",
        contracts: "2",
        side: "long",
        entryPrice: "25000",
        markPrice: "25200",
        unrealizedPnl: "400",
        info: {
          estLiquidationPrice: "15000",
        },
      },
      {
        info: {
          symbol: "ETH/USDC:USDC",
          netExposureQuantity: "0.5",
          netCost: "-100",
          entryPrice: "3000",
          pnlUnrealized: "-10",
          markPrice: "2900",
          estLiquidationPrice: "1000",
        },
      },
    ];

    const snapshot = gateway.mapBalanceToAccountSnapshotWithPositions(balance, positions);

    expect(snapshot.positions).toHaveLength(2);
    expect(snapshot.positions[0]).toMatchObject({
      symbol: "BTC/USDC:USDC",
      positionAmt: "2",
      positionSide: "LONG",
      entryPrice: "25000",
      unrealizedProfit: "400",
      markPrice: "25200",
      liquidationPrice: "15000",
    });
    expect(snapshot.positions[1]).toMatchObject({
      symbol: "ETH/USDC:USDC",
      positionAmt: "-0.5",
      positionSide: "SHORT",
      entryPrice: "3000",
      unrealizedProfit: "-10",
      markPrice: "2900",
      liquidationPrice: "1000",
    });

    expect(snapshot.totalWalletBalance).toBe("100");
    expect(snapshot.totalUnrealizedProfit).toBe("390");
    expect(snapshot.totalMarginBalance).toBe("490");
    expect(snapshot.totalCrossWalletBalance).toBe("100");
    expect(snapshot.totalCrossUnPnl).toBe("390");
  });
});
