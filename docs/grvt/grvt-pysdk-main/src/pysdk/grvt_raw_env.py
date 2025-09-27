from dataclasses import dataclass
from enum import Enum


class GrvtEnv(Enum):
    DEV = "dev"
    STAGING = "staging"
    TESTNET = "testnet"
    PROD = "prod"


@dataclass
class GrvtEndpointConfig:
    rpc_endpoint: str
    ws_endpoint: str | None


@dataclass
class GrvtEnvConfig:
    edge: GrvtEndpointConfig
    trade_data: GrvtEndpointConfig
    market_data: GrvtEndpointConfig
    chain_id: int


def get_env_config(environment: GrvtEnv) -> GrvtEnvConfig:
    match environment:
        case GrvtEnv.PROD:
            return GrvtEnvConfig(
                edge=GrvtEndpointConfig(
                    rpc_endpoint="https://edge.grvt.io",
                    ws_endpoint=None,
                ),
                trade_data=GrvtEndpointConfig(
                    rpc_endpoint="https://trades.grvt.io",
                    ws_endpoint="wss://trades.grvt.io/ws",
                ),
                market_data=GrvtEndpointConfig(
                    rpc_endpoint="https://market-data.grvt.io",
                    ws_endpoint="wss://market-data.grvt.io/ws",
                ),
                chain_id=325,
            )
        case GrvtEnv.TESTNET:
            return GrvtEnvConfig(
                edge=GrvtEndpointConfig(
                    rpc_endpoint=f"https://edge.{environment.value}.grvt.io",
                    ws_endpoint=None,
                ),
                trade_data=GrvtEndpointConfig(
                    rpc_endpoint=f"https://trades.{environment.value}.grvt.io",
                    ws_endpoint=f"wss://trades.{environment.value}.grvt.io/ws",
                ),
                market_data=GrvtEndpointConfig(
                    rpc_endpoint=f"https://market-data.{environment.value}.grvt.io",
                    ws_endpoint=f"wss://market-data.{environment.value}.grvt.io/ws",
                ),
                chain_id=326,
            )
        case GrvtEnv.DEV | GrvtEnv.STAGING:
            return GrvtEnvConfig(
                edge=GrvtEndpointConfig(
                    rpc_endpoint=f"https://edge.{environment.value}.gravitymarkets.io",
                    ws_endpoint=None,
                ),
                trade_data=GrvtEndpointConfig(
                    rpc_endpoint=f"https://trades.{environment.value}.gravitymarkets.io",
                    ws_endpoint=f"wss://trades.{environment.value}.gravitymarkets.io/ws",
                ),
                market_data=GrvtEndpointConfig(
                    rpc_endpoint=f"https://market-data.{environment.value}.gravitymarkets.io",
                    ws_endpoint=f"wss://market-data.{environment.value}.gravitymarkets.io/ws",
                ),
                chain_id=327 if environment == GrvtEnv.DEV else 328,
            )
        case _:
            raise ValueError(f"Unknown environment={environment}")
