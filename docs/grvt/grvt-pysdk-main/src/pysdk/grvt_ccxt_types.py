# ruff: noqa: D200
# ruff: noqa: D204
# ruff: noqa: D205
# ruff: noqa: D404
# ruff: noqa: W291
# ruff: noqa: D400
# ruff: noqa: E501

from decimal import Decimal
from enum import Enum
from typing import Literal

Num = None | str | float | int | Decimal
Amount = Decimal | int | float | str
GrvtOrderSide = Literal["buy", "sell"]
GrvtOrderType = Literal["limit", "market"]

DURATION_SECOND_IN_NSEC = 1_000_000_000
PRICE_MULTIPLIER = 1_000_000_000
BTC_ETH_SIZE_MULTIPLIER = 1_000_000_000


class GrvtInvalidOrder(Exception):
    pass


class CandlestickInterval(Enum):
    CI_1_M = "CI_1_M"
    CI_3_M = "CI_3_M"
    CI_5_M = "CI_5_M"
    CI_15_M = "CI_15_M"
    CI_30_M = "CI_30_M"
    CI_1_H = "CI_1_H"
    CI_2_H = "CI_2_H"
    CI_4_H = "CI_4_H"
    CI_6_H = "CI_6_H"
    CI_8_H = "CI_8_H"
    CI_12_H = "CI_12_H"
    CI_1_D = "CI_1_D"
    CI_3_D = "CI_3_D"
    CI_5_D = "CI_5_D"
    CI_1_W = "CI_1_W"
    CI_2_W = "CI_2_W"
    CI_3_W = "CI_3_W"
    CI_4_W = "CI_4_W"


ccxt_interval_to_grvt_candlestick_interval = {
    "1m": CandlestickInterval.CI_1_M,
    "3m": CandlestickInterval.CI_3_M,
    "5m": CandlestickInterval.CI_5_M,
    "15m": CandlestickInterval.CI_15_M,
    "30m": CandlestickInterval.CI_30_M,
    "1h": CandlestickInterval.CI_1_H,
    "2h": CandlestickInterval.CI_2_H,
    "4h": CandlestickInterval.CI_4_H,
    "6h": CandlestickInterval.CI_6_H,
    "8h": CandlestickInterval.CI_8_H,
    "12h": CandlestickInterval.CI_12_H,
    "1d": CandlestickInterval.CI_1_D,
    "3d": CandlestickInterval.CI_3_D,
    "5d": CandlestickInterval.CI_5_D,
    "1w": CandlestickInterval.CI_1_W,
    "2w": CandlestickInterval.CI_2_W,
    "3w": CandlestickInterval.CI_3_W,
    "4w": CandlestickInterval.CI_4_W,
}


class CandlestickType(Enum):
    TRADE = "TRADE"
    MARK = "MARK"
    INDEX = "INDEX"
    MID = "MID"


class GrvtInstrumentKind(Enum):
    PERPETUAL = "PERPETUAL"
    FUTURE = "FUTURE"
    CALL = "CALL"
    PUT = "PUT"
