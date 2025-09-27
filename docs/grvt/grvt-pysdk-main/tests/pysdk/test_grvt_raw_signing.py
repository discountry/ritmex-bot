import logging
import traceback
from pprint import pprint

from eth_account import Account

from pysdk.grvt_fixed_types import Transfer
from pysdk.grvt_raw_base import GrvtApiConfig
from pysdk.grvt_raw_env import GrvtEnv
from pysdk.grvt_raw_signing import sign_order, sign_transfer
from pysdk.grvt_raw_types import (
    Instrument,
    InstrumentSettlementPeriod,
    Kind,
    Order,
    OrderLeg,
    OrderMetadata,
    Signature,
    TimeInForce,
    TransferType,
)

# Setup logger
logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def test_sign_order_table():
    private_key = "f7934647276a6e1fa0af3f4467b4b8ddaf45d25a7368fa1a295eef49a446819d"
    sub_account_id = "8289849667772468"
    expiry = 1730800479321350000
    nonce = 828700936

    test_cases = [
        {
            "name": "test decimal precision 1, 3 decimals",
            "order": Order(
                metadata=OrderMetadata(
                    client_order_id="1", create_time="1730800479321350000"
                ),
                sub_account_id=sub_account_id,
                time_in_force=TimeInForce.GOOD_TILL_TIME,
                post_only=False,
                is_market=False,
                reduce_only=False,
                legs=[
                    OrderLeg(
                        instrument="BTC_USDT_Perp",
                        size="1.013",
                        limit_price="68900.5",
                        is_buying_asset=False,
                    )
                ],
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
            ),
            "want_r": "0xb00512d986a718b15136a8ba23de1c1ec84bbdb9958629cbbe4909bae620bb04",
            "want_s": "0x79f706de61c68cc14d7734594b5d8689df2b2a7b25951f9a3f61d799f4327ffc",
            "want_v": 28,
            "want_error": None,
        },
        {
            "name": "test decimal precision 2, 9 decimals",
            "order": Order(
                metadata=OrderMetadata(
                    client_order_id="1", create_time="1730800479321350000"
                ),
                sub_account_id=sub_account_id,
                time_in_force=TimeInForce.GOOD_TILL_TIME,
                post_only=False,
                is_market=False,
                reduce_only=False,
                legs=[
                    OrderLeg(
                        instrument="BTC_USDT_Perp",
                        size="1.123123123",
                        limit_price="68900.777123479",
                        is_buying_asset=False,
                    )
                ],
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
            ),
            "want_r": "0x365ec79d299c8bcd5f2acff89faf741a90ca02a4b8a6b1b1a5d4f3d16130f9f0",
            "want_s": "0x465129bca7855f008ea5bc22fe3ee630e4a8e3b9b99c1745631deef29957048a",
            "want_v": 28,
            "want_error": None,
        },
        {
            "name": "test decimal precision 3, round down",
            "order": Order(
                metadata=OrderMetadata(
                    client_order_id="1", create_time="1730800479321350000"
                ),
                sub_account_id=sub_account_id,
                time_in_force=TimeInForce.GOOD_TILL_TIME,
                post_only=False,
                is_market=False,
                reduce_only=False,
                legs=[
                    OrderLeg(
                        instrument="BTC_USDT_Perp",
                        size="1.1231231234",
                        limit_price="68900.7771234794",
                        is_buying_asset=False,
                    )
                ],
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
            ),
            "want_r": "0x365ec79d299c8bcd5f2acff89faf741a90ca02a4b8a6b1b1a5d4f3d16130f9f0",
            "want_s": "0x465129bca7855f008ea5bc22fe3ee630e4a8e3b9b99c1745631deef29957048a",
            "want_v": 28,
            "want_error": None,
        },
        {
            "name": "test decimal precision 4, round down",
            "order": Order(
                metadata=OrderMetadata(
                    client_order_id="1", create_time="1730800479321350000"
                ),
                sub_account_id=sub_account_id,
                time_in_force=TimeInForce.GOOD_TILL_TIME,
                post_only=False,
                is_market=False,
                reduce_only=False,
                legs=[
                    OrderLeg(
                        instrument="BTC_USDT_Perp",
                        size="1.1231231239",
                        limit_price="68900.7771234799",
                        is_buying_asset=False,
                    )
                ],
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
            ),
            "want_r": "0x365ec79d299c8bcd5f2acff89faf741a90ca02a4b8a6b1b1a5d4f3d16130f9f0",
            "want_s": "0x465129bca7855f008ea5bc22fe3ee630e4a8e3b9b99c1745631deef29957048a",
            "want_v": 28,
            "want_error": None,
        },
        # {
        #     "name": "no private key",
        #     "order": Order(),
        #     "want_error": ValueError("Private key is not set")
        # },
        # {
        #     "name": "decimal precision test",
        #     "order": Order(
        #         sub_account_id="123",
        #         time_in_force=TimeInForce.GOOD_TILL_TIME,
        #         legs=[
        #             OrderLeg(
        #                 instrument="BTC_USDT_Perp",
        #                 size="1.013",
        #                 limit_price="64170.7",
        #                 is_buying_asset=True
        #             )
        #         ],
        #         signature=Signature(
        #             expiration=expiry,
        #             nonce=nonce
        #         )
        #     ),
        #     "want_error": None
        # }
    ]

    account = Account.from_key(private_key)

    instruments = {
        "BTC_USDT_Perp": Instrument(
            instrument="BTC_USDT_Perp",
            instrument_hash="0x030501",
            base="BTC",
            quote="USDT",
            kind=Kind.PERPETUAL,
            venues=[],
            settlement_period=InstrumentSettlementPeriod.DAILY,
            tick_size="0.00000001",
            min_size="0.00000001",
            create_time="123",
            base_decimals=9,
            quote_decimals=9,
            max_position_size="1000000",
        )
    }

    for tc in test_cases:
        config = GrvtApiConfig(
            env=GrvtEnv.TESTNET,
            private_key=private_key,
            trading_account_id=sub_account_id,
            api_key="not-needed",
            logger=logger,
        )

        signed_order = sign_order(tc["order"], config, account, instruments)
        pprint(signed_order)

        # Verify signature fields are populated
        assert signed_order.signature.signer == str(account.address)

        # Compare r, s, v values with expected values
        if "want_r" in tc:
            assert (
                signed_order.signature.r == tc["want_r"]
            ), f"Test '{tc['name']}' failed: r value mismatch"
        if "want_s" in tc:
            assert (
                signed_order.signature.s == tc["want_s"]
            ), f"Test '{tc['name']}' failed: s value mismatch"
        if "want_v" in tc:
            assert (
                signed_order.signature.v == tc["want_v"]
            ), f"Test '{tc['name']}' failed: v value mismatch"


def test_sign_transfer_table():
    chainId = 1
    private_key = "f7934647276a6e1fa0af3f4467b4b8ddaf45d25a7368fa1a295eef49a446819d"
    main_account_id = "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1"
    sub_account_id = "8289849667772468"
    expiry = "1730800479321350000"
    nonce = 828700936

    test_cases = [
        {
            "name": "Transfer $1 from main account to sub account",
            "transfer": Transfer(
                from_account_id=main_account_id,
                from_sub_account_id="0",
                to_account_id=main_account_id,
                to_sub_account_id=sub_account_id,
                currency="USDT",
                num_tokens="1",
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
                transfer_type=TransferType.STANDARD,
                transfer_metadata="",
            ),
            "want_r": "0x21c7d7a8e225cb146c80dc79bbe818f915536817f1343e974cfdbe2bfc952cf1",
            "want_s": "0x6de83999555f6236e5a56c86876defe00b4776c428ab5a4d7f997d290baaea10",
            "want_v": 28,
            "want_error": None,
        },
        {
            "name": "Transfer $1.5 from main account to sub account",
            "transfer": Transfer(
                from_account_id=main_account_id,
                from_sub_account_id="0",
                to_account_id=main_account_id,
                to_sub_account_id=sub_account_id,
                currency="USDT",
                num_tokens="1.5",
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
                transfer_type=TransferType.STANDARD,
                transfer_metadata="",
            ),
            "want_r": "0xe0a9c66d8d11c3a9ae3624e150cbbdf85d542722cac5255cad4e50af5ac1ddcb",
            "want_s": "0x06769e5284352ead5735b8b11f9e9510d024bbb889a828889db4cb04132b52aa",
            "want_v": 28,
            "want_error": None,
        },
        {
            "name": "Transfer $1 from sub account to main account",
            "transfer": Transfer(
                from_account_id=main_account_id,
                from_sub_account_id=sub_account_id,
                to_account_id=main_account_id,
                to_sub_account_id="0",
                currency="USDT",
                num_tokens="1",
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
                transfer_type=TransferType.STANDARD,
                transfer_metadata="",
            ),
            "want_r": "0xc1214ee17dbc14f183297b9dd3f93120b16e633691817ee26045451bc629101c",
            "want_s": "0x2de27d226a3d3188742629ab222d430d7989d6ea3e6a86bc259606e371123df3",
            "want_v": 27,
            "want_error": None,
        },
        {
            "name": "Transfer $1.5 from sub account to main account",
            "transfer": Transfer(
                from_account_id=main_account_id,
                from_sub_account_id=sub_account_id,
                to_account_id=main_account_id,
                to_sub_account_id="0",
                currency="USDT",
                num_tokens="1.5",
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
                transfer_type=TransferType.STANDARD,
                transfer_metadata="",
            ),
            "want_r": "0xb9b80dfd4b0d53e64b6dd1067d7d936c79a8c3966175bcefb2021cc71d08116f",
            "want_s": "0x3cbe955c9f56e41f70c658e02df07873e77d347aa5c422943b87fdfd94293ae6",
            "want_v": 27,
            "want_error": None,
        },
        {
            "name": "Transfer $1 external",
            "transfer": Transfer(
                from_account_id="0x922a4874196806460fc63b5bcbff45f94c87f76f",
                from_sub_account_id="0",
                to_account_id="0x6a3434fce60ff567f60d80fb98f2f981e9b081fd",
                to_sub_account_id="0",
                currency="USDT",
                num_tokens="1",
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
                transfer_type=TransferType.STANDARD,
                transfer_metadata="",
            ),
            "want_r": "0x185ad129ca0de3584fcd91f6df0c25d8065411041db117c50dabd057249a1a43",
            "want_s": "0x58b1979c1f8c65970578bc2756f17a0b5c7352c27007811800dcd8966351647d",
            "want_v": 28,
            "want_error": None,
        },
        {
            "name": "Transfer $1.5 external revert",
            "transfer": Transfer(
                from_account_id="0x6a3434fce60ff567f60d80fb98f2f981e9b081fd",
                from_sub_account_id="0",
                to_account_id="0x922a4874196806460fc63b5bcbff45f94c87f76f",
                to_sub_account_id="0",
                currency="USDT",
                num_tokens="1.5",
                signature=Signature(
                    signer="", r="", s="", v=0, expiration=expiry, nonce=nonce
                ),
                transfer_type=TransferType.STANDARD,
                transfer_metadata="",
            ),
            "want_r": "0xbbdd4726fef5cddb6eeb5fac07ed95702673293133d66481777a6a3ee82adc12",
            "want_s": "0x0ad3592ea3ebf428b260c56723386383253481bc188d9aeb87d9b21b85069821",
            "want_v": 28,
            "want_error": None,
        },
    ]

    account = Account.from_key(private_key)
    config = GrvtApiConfig(
        env=GrvtEnv.TESTNET,
        private_key=private_key,
        trading_account_id=sub_account_id,
        api_key="not-needed",
        logger=logger,
    )

    for tc in test_cases:
        signed = sign_transfer(tc["transfer"], config, account, chainId)
        pprint(signed)

        # Verify signature fields are populated
        assert signed.signature.signer == str(account.address)

        # Compare r, s, v values with expected values
        if "want_r" in tc:
            assert (
                signed.signature.r == tc["want_r"]
            ), f"Test '{tc['name']}' failed: r value mismatch"
        if "want_s" in tc:
            assert (
                signed.signature.s == tc["want_s"]
            ), f"Test '{tc['name']}' failed: s value mismatch"
        if "want_v" in tc:
            assert (
                signed.signature.v == tc["want_v"]
            ), f"Test '{tc['name']}' failed: v value mismatch"


def main():
    functions = [
        test_sign_order_table,
        test_sign_transfer_table,
    ]
    for f in functions:
        try:
            f()
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {e} {traceback.format_exc()}")


if __name__ == "__main__":
    main()
