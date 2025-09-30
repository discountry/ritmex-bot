import { describe, expect, it } from "vitest";
import { LighterSigner } from "../../src/exchanges/lighter/signer";
import { LIGHTER_ORDER_TYPE, LIGHTER_TIME_IN_FORCE } from "../../src/exchanges/lighter/constants";

describe("LighterSigner", () => {
  it("produces deterministic create order signature", () => {
    const signer = new LighterSigner({
      accountIndex: 65,
      chainId: 300,
      apiKeys: {
        3: "0xed636277f3753b6c0275f7a28c2678a7f3a95655e09deaebec15179b50c5da7f903152e50f594f7b",
      },
    });

    const signed = signer.signCreateOrder({
      marketIndex: 0,
      clientOrderIndex: 123n,
      baseAmount: 1000n,
      price: 170000,
      isAsk: 1,
      orderType: LIGHTER_ORDER_TYPE.MARKET,
      timeInForce: LIGHTER_TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
      reduceOnly: 0,
      triggerPrice: 0,
      orderExpiry: 0n,
      expiredAt: 1700000000000n,
      apiKeyIndex: 3,
      nonce: 42n,
    });

    const payload = JSON.parse(signed.txInfo);
    expect(payload.AccountIndex).toBe(65);
    expect(payload.ApiKeyIndex).toBe(3);
    expect(payload.OrderInfo).toMatchObject({
      MarketIndex: 0,
      ClientOrderIndex: 123,
      BaseAmount: 1000,
      Price: 170000,
      IsAsk: 1,
      Type: LIGHTER_ORDER_TYPE.MARKET,
      TimeInForce: LIGHTER_TIME_IN_FORCE.IMMEDIATE_OR_CANCEL,
      ReduceOnly: 0,
      TriggerPrice: 0,
      OrderExpiry: 0,
    });
    expect(typeof payload.Sig).toBe("string");
    expect(payload.Sig.length).toBeGreaterThan(0);
    expect(signed.txHash).toBe("3ef41bc5fdb2e2146b5f5df046fb1ad801dc2aa5c47703665bfd3eb67a21e67048957f7187b12035");
    expect(typeof signed.signature).toBe("string");
    expect(signed.signature.length).toBeGreaterThan(0);
  });
});
