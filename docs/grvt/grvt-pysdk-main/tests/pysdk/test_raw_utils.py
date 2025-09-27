import logging
import os
import random
import time

from pysdk import grvt_fixed_types, grvt_raw_types
from pysdk.grvt_raw_base import GrvtApiConfig, GrvtError
from pysdk.grvt_raw_env import GrvtEnv
from pysdk.grvt_raw_signing import sign_order, sign_transfer, sign_withdrawal
from pysdk.grvt_raw_sync import GrvtRawSync


def get_config() -> GrvtApiConfig:
    logging.basicConfig()
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    conf = GrvtApiConfig(
        env=GrvtEnv(os.getenv("GRVT_ENV", "testnet")),
        trading_account_id=os.getenv("GRVT_SUB_ACCOUNT_ID"),
        private_key=os.getenv("GRVT_PRIVATE_KEY"),
        api_key=os.getenv("GRVT_API_KEY"),
        logger=logger,
    )
    logger.debug(conf)
    return conf


def get_main_account_id(api: GrvtRawSync) -> str:
    resp = api.funding_account_summary_v1(grvt_raw_types.EmptyRequest())
    if isinstance(resp, GrvtError):
        raise ValueError(f"Received error: {resp}")
    if resp.result is None:
        raise ValueError("Expected funding_account_summary_v1 response to be non-null")
    return resp.result.main_account_id


def get_test_order(
    api: GrvtRawSync, instruments: dict[str, grvt_raw_types.Instrument]
) -> grvt_raw_types.Order | None:
    # Skip test if configs are not set
    if (
        api.config.trading_account_id is None
        or api.config.private_key is None
        or api.config.api_key is None
    ):
        return None

    order = grvt_raw_types.Order(
        sub_account_id=str(api.config.trading_account_id),
        time_in_force=grvt_raw_types.TimeInForce.GOOD_TILL_TIME,
        legs=[
            grvt_raw_types.OrderLeg(
                instrument="BTC_USDT_Perp",
                size="1.2",  # 1.2 BTC
                limit_price="64170.7",  # 80,000 USDT
                is_buying_asset=True,
            )
        ],
        signature=grvt_raw_types.Signature(
            signer="",  # Populated by sign_order
            r="",  # Populated by sign_order
            s="",  # Populated by sign_order
            v=0,  # Populated by sign_order
            expiration=str(
                time.time_ns() + 20 * 24 * 60 * 60 * 1_000_000_000
            ),  # 20 days
            nonce=random.randint(0, 2**32 - 1),
        ),
        metadata=grvt_raw_types.OrderMetadata(
            client_order_id=str(random.randint(0, 2**32 - 1)),
        ),
    )
    return sign_order(order, api.config, api.account, instruments)


def get_test_tpsl_order(
    api: GrvtRawSync, instruments: dict[str, grvt_raw_types.Instrument]
) -> grvt_raw_types.Order | None:
    order = get_test_order(api, instruments)
    if order:
        order.metadata.trigger = grvt_raw_types.TriggerOrderMetadata(
            trigger_type=grvt_raw_types.TriggerType.TAKE_PROFIT,
            tpsl=grvt_raw_types.TPSLOrderMetadata(
                trigger_by=grvt_raw_types.TriggerBy.LAST,
                trigger_price="64000",
            ),
        )
    return order


def get_test_transfer(api: GrvtRawSync) -> grvt_fixed_types.Transfer | None:
    # Skip test if configs are not set
    if (
        api.config.trading_account_id is None
        or api.config.private_key is None
        or api.config.api_key is None
    ):
        return None

    funding_account_address = get_main_account_id(api)

    return sign_transfer(
        grvt_fixed_types.Transfer(
            from_account_id=funding_account_address,
            from_sub_account_id="0",
            to_account_id=funding_account_address,
            to_sub_account_id=str(api.config.trading_account_id),
            currency="USDT",
            num_tokens="1",
            signature=grvt_raw_types.Signature(
                signer="",
                r="",
                s="",
                v=0,
                expiration=str(
                    time.time_ns() + 20 * 24 * 60 * 60 * 1_000_000_000
                ),  # 20 days
                nonce=random.randint(0, 2**32 - 1),
            ),
            transfer_type=grvt_fixed_types.TransferType.STANDARD,
            transfer_metadata="",
        ),
        api.config,
        api.account,
    )


def get_test_withdrawal(api: GrvtRawSync) -> grvt_raw_types.Withdrawal | None:
    # Skip test if configs are not set
    if (
        api.config.trading_account_id is None
        or api.config.private_key is None
        or api.config.api_key is None
    ):
        return None

    funding_account_address = get_main_account_id(api)

    return sign_withdrawal(
        grvt_raw_types.Withdrawal(
            from_account_id=funding_account_address,
            to_eth_address="0xed3FF6F4E84a64556e8F7d149dC3533f0c7D9c49",  # Just a test address
            currency="USDT",
            num_tokens="1",
            signature=grvt_raw_types.Signature(
                signer="",
                r="",
                s="",
                v=0,
                expiration=str(
                    time.time_ns() + 20 * 24 * 60 * 60 * 1_000_000_000
                ),  # 20 days
                nonce=random.randint(0, 2**32 - 1),
            ),
        ),
        api.config,
        api.account,
    )
