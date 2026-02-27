---
title: "Cm Position Adl Quantile Estimation | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation"
fetched_at: "2026-01-27T05:28:19.496Z"
---
# CM Position ADL Quantile Estimation(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)

Query CM Position ADL Quantile Estimation

> -   Values update every 30s.
> -   Values 0, 1, 2, 3, 4 shows the queue position and possibility of ADL from low to high.
> -   For positions of the symbol are in One-way Mode or isolated margined in Hedge Mode, "LONG", "SHORT", and "BOTH" will be returned to show the positions' adl quantiles of different position sides.
> -   If the positions of the symbol are crossed margined in Hedge Mode:
>     -   "HEDGE" as a sign will be returned instead of "BOTH";
>     -   A same value caculated on unrealized pnls on long and short sides' positions will be shown for "LONG" and "SHORT" when there are positions in both of long and short sides.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)

GET `/papi/v1/cm/adlQuantile`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)

**5**

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)

```
[    {        "symbol": "BTCUSD_200925",         "adlQuantile":             {                // if the positions of the symbol are crossed margined in Hedge Mode, "LONG" and "SHORT" will be returned a same quantile value, and "HEDGE" will be returned instead of "BOTH".                "LONG": 3,                  "SHORT": 3,                 "HEDGE": 0   // only a sign, ignore the value            }        },    {        "symbol": "BTCUSD_201225",         "adlQuantile":             {                // for positions of the symbol are in One-way Mode                "LONG": 1,  // adl quantile for "LONG" position in hedge mode                "SHORT": 2,     // adl qauntile for "SHORT" position in hedge mode                "BOTH": 0       // adl qunatile for position in one-way mode            }    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Position-ADL-Quantile-Estimation)
