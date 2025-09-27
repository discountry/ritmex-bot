import json
import logging
import traceback

from eth_account import Account
from eth_account.messages import encode_typed_data

from pysdk.grvt_fixed_types import Transfer
from pysdk.grvt_raw_base import GrvtApiConfig
from pysdk.grvt_raw_env import GrvtEnv
from pysdk.grvt_raw_signing import (
    EIP712_ORDER_MESSAGE_TYPE,
    EIP712_TRANSFER_MESSAGE_TYPE,
    build_EIP712_order_message_data,
    build_EIP712_transfer_message_data,
    get_EIP712_domain_data,
    sign_order,
)
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
    # Generated using https://key.tokenpocket.pro/#/?network=ETH
    # NOTE: `0x` hexadecimal prefix removed
    public_key = "ee2060eECaC18beC7F8F670D751801294911E445"
    private_key = "c0663ca94684aead40c41a1cb3a94b68a24296e87245be3a186e882a29a15ee0"

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
            "expected_message_data_json": """
{
  "subAccountID": "8289849667772468",
  "isMarket": false,
  "timeInForce": 1,
  "postOnly": false,
  "reduceOnly": false,
  "legs": [
    {
      "assetID": "0x030501",
      "contractSize": 1013000000,
      "limitPrice": 68900500000000,
      "isBuyingContract": false
    }
  ],
  "nonce": 828700936,
  "expiration": 1730800479321350000
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 326
}""",
            # Per EIP-191: https://eips.ethereum.org/EIPS/eip-191
            "expected_signable_message": """
{
  "version": "01",
  "header": "1254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16",
  "body": "41650c08ab6e720f899307d7c2b4381a10c1301888375cec2dfefd6a583859eb"
}""",
            # EIP-712 signable message format: https://eips.ethereum.org/EIPS/eip-712
            # Pre-image of the signed message's message hash
            # encode(domainSeparator : 𝔹²⁵⁶, message : 𝕊) = "\x19"‖ version ‖ domainSeparator ‖ hashStruct(message)
            "digest_input": "0x19011254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f1641650c08ab6e720f899307d7c2b4381a10c1301888375cec2dfefd6a583859eb",
            "expected_signed_message": """
{
  "message_hash": "03cb7ca7b353969ab2c00ff92fd472f81f59a84d28fa1aa39128176f21062982",
  "r": 14615867946748605809126568669694142791729730263440553623296112010401671344650,
  "s": 41758084966111141828834491248882149351523023670747687501271185591898818786045,
  "v": 28,
  "signature": "205049c0db6e38fd88e4e46be81db7bc354520d52ec6268d210fa35b86c4f20a5c523d0ff8e6f12542fdcf34a6e6e2c547986b7c8fa53f86a5e656d9ab44b2fd1c"
}""",
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
            "expected_message_data_json": """
{
  "subAccountID": "8289849667772468",
  "isMarket": false,
  "timeInForce": 1,
  "postOnly": false,
  "reduceOnly": false,
  "legs": [
    {
      "assetID": "0x030501",
      "contractSize": 1123123123,
      "limitPrice": 68900777123479,
      "isBuyingContract": false
    }
  ],
  "nonce": 828700936,
  "expiration": 1730800479321350000
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 326
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "1254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16",
  "body": "e85ffec169d4ebd4b8057e5fbd31ed31d4511b2f2299bbce0adab6beb5fe2814"
}""",
            "digest_input": "0x19011254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16e85ffec169d4ebd4b8057e5fbd31ed31d4511b2f2299bbce0adab6beb5fe2814",
            "expected_signed_message": """
{
  "message_hash": "2d0a437f7d64523386974c2a729d69604f8e2a7f0684b7de923845d8b175ab69",
  "r": 30067953785684815030293507105225786115862149795459199007947867478230986262090,
  "s": 23299979093064779986156565292425191814752388247725004533191995996670719399433,
  "v": 28,
  "signature": "4279dbd734584fb07b016bce7d9f029e7f7f80e378dc65cddc06aa6b0c9e064a33835221a0fbcb700de3068169b45572a27756bff479f2887e8c89139e6f96091c"
}""",
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
            "expected_message_data_json": """
{
  "subAccountID": "8289849667772468",
  "isMarket": false,
  "timeInForce": 1,
  "postOnly": false,
  "reduceOnly": false,
  "legs": [
    {
      "assetID": "0x030501",
      "contractSize": 1123123123,
      "limitPrice": 68900777123479,
      "isBuyingContract": false
    }
  ],
  "nonce": 828700936,
  "expiration": 1730800479321350000
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 326
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "1254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16",
  "body": "e85ffec169d4ebd4b8057e5fbd31ed31d4511b2f2299bbce0adab6beb5fe2814"
}""",
            "digest_input": "0x19011254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16e85ffec169d4ebd4b8057e5fbd31ed31d4511b2f2299bbce0adab6beb5fe2814",
            "expected_signed_message": """
{
  "message_hash": "2d0a437f7d64523386974c2a729d69604f8e2a7f0684b7de923845d8b175ab69",
  "r": 30067953785684815030293507105225786115862149795459199007947867478230986262090,
  "s": 23299979093064779986156565292425191814752388247725004533191995996670719399433,
  "v": 28,
  "signature": "4279dbd734584fb07b016bce7d9f029e7f7f80e378dc65cddc06aa6b0c9e064a33835221a0fbcb700de3068169b45572a27756bff479f2887e8c89139e6f96091c"
}""",
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
            "expected_message_data_json": """
{
  "subAccountID": "8289849667772468",
  "isMarket": false,
  "timeInForce": 1,
  "postOnly": false,
  "reduceOnly": false,
  "legs": [
    {
      "assetID": "0x030501",
      "contractSize": 1123123123,
      "limitPrice": 68900777123479,
      "isBuyingContract": false
    }
  ],
  "nonce": 828700936,
  "expiration": 1730800479321350000
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 326
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "1254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16",
  "body": "e85ffec169d4ebd4b8057e5fbd31ed31d4511b2f2299bbce0adab6beb5fe2814"
}""",
            "digest_input": "0x19011254f97f8495f704630a238cbcd898a4b8ab20d77bb93e17049d3445f4f81f16e85ffec169d4ebd4b8057e5fbd31ed31d4511b2f2299bbce0adab6beb5fe2814",
            "expected_signed_message": """
{
  "message_hash": "2d0a437f7d64523386974c2a729d69604f8e2a7f0684b7de923845d8b175ab69",
  "r": 30067953785684815030293507105225786115862149795459199007947867478230986262090,
  "s": 23299979093064779986156565292425191814752388247725004533191995996670719399433,
  "v": 28,
  "signature": "4279dbd734584fb07b016bce7d9f029e7f7f80e378dc65cddc06aa6b0c9e064a33835221a0fbcb700de3068169b45572a27756bff479f2887e8c89139e6f96091c"
}""",
        },
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

        # Get intermediate values
        message_data = build_EIP712_order_message_data(tc["order"], instruments)
        domain_data = get_EIP712_domain_data(config.env, 326)
        signable_message = encode_typed_data(
            domain_data, EIP712_ORDER_MESSAGE_TYPE, message_data
        )
        signed_message = account.sign_message(signable_message)
        signed_order = sign_order(tc["order"], config, account, instruments)

        # Convert to comparable strings
        message_data_json = json.dumps(message_data, indent=2)
        domain_data_json = json.dumps(domain_data, indent=2)
        signable_message_json = json.dumps(
            {
                "version": signable_message.version.hex(),
                "header": signable_message.header.hex(),
                "body": signable_message.body.hex(),
            },
            indent=2,
        )
        signed_message_json = json.dumps(
            {
                "message_hash": signed_message.message_hash.hex(),
                "r": signed_message.r,
                "s": signed_message.s,
                "v": signed_message.v,
                "signature": signed_message.signature.hex(),
            },
            indent=2,
        )
        # EIP-712 signable message format: https://eips.ethereum.org/EIPS/eip-712
        signed_message_hash_preimage = (
            "0x19"
            + signable_message.version.hex()
            + signable_message.header.hex()
            + signable_message.body.hex()
        )

        # Strip whitespace for comparison
        assert (
            message_data_json.strip() == tc["expected_message_data_json"].strip()
        ), f"""
Test '{tc['name']}' failed: message_data mismatch.
Wanted:
{tc['expected_message_data_json'].strip()}
Got:
{message_data_json.strip()}
"""
        assert (
            domain_data_json.strip() == tc["expected_domain_data_json"].strip()
        ), f"""
Test '{tc['name']}' failed: domain_data mismatch.
Wanted:
{tc['expected_domain_data_json'].strip()}
Got:
{domain_data_json.strip()}
"""
        assert (
            signable_message_json.strip() == tc["expected_signable_message"].strip()
        ), f"""
Test '{tc['name']}' failed: signable_message mismatch.
Wanted:
{tc['expected_signable_message'].strip()}
Got:
{signable_message_json.strip()}
"""
        assert (
            signed_message_hash_preimage.strip() == tc["digest_input"].strip()
        ), f"""
Test '{tc['name']}' failed: digest_input mismatch.
Wanted:
{tc["digest_input"].strip()
}
Got:
{signed_message_hash_preimage.strip()}
"""
        assert (
            signed_message_json.strip() == tc["expected_signed_message"].strip()
        ), f"""
Test '{tc['name']}' failed: signed_message mismatch.
Wanted:
{tc['expected_signed_message'].strip()}
Got:
{signed_message_json.strip()}
"""
        assert (
            signed_order.signature.signer == str(account.address) == "0x" + public_key
        ), f"""Test '{tc['name']}' failed: signer mismatch."""


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
            "expected_message_data_json": """
{
  "fromAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "fromSubAccount": "0",
  "toAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "toSubAccount": "8289849667772468",
  "tokenCurrency": 3,
  "numTokens": 1000000,
  "nonce": 828700936,
  "expiration": "1730800479321350000"
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 1
}""",
            # Per EIP-191: https://eips.ethereum.org/EIPS/eip-191
            "expected_signable_message": """
{
  "version": "01",
  "header": "950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6",
  "body": "8dfbfc161ca14b60b318aec118c0f77137ab6d5c0d6f4aa283a75995ec842a9f"
}""",
            # EIP-712 signable message format: https://eips.ethereum.org/EIPS/eip-712
            # Pre-image of the signed message's message hash
            # encode(domainSeparator : 𝔹²⁵⁶, message : 𝕊) = "\x19"‖ version ‖ domainSeparator ‖ hashStruct(message)
            "digest_input": "0x1901950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f68dfbfc161ca14b60b318aec118c0f77137ab6d5c0d6f4aa283a75995ec842a9f",
            "expected_signed_message": """
{
  "message_hash": "f237c6e8ceaf8f75c35537c26a5810f5029fe3fa0179d636cfa75dba0eeaecda",
  "r": 15279414997690414521303216846501751476684522786442627331685751803272563600625,
  "s": 49712406548009011982925909577001640710775887931482920893646195243522061953552,
  "v": 28,
  "signature": "21c7d7a8e225cb146c80dc79bbe818f915536817f1343e974cfdbe2bfc952cf16de83999555f6236e5a56c86876defe00b4776c428ab5a4d7f997d290baaea101c"
}""",
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
            "expected_message_data_json": """
{
  "fromAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "fromSubAccount": "0",
  "toAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "toSubAccount": "8289849667772468",
  "tokenCurrency": 3,
  "numTokens": 1500000,
  "nonce": 828700936,
  "expiration": "1730800479321350000"
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 1
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6",
  "body": "efc25031927cbee99a4b8c408d427168218312cb5fcbc2ef0644a25c411e9cd6"
}""",
            "digest_input": "0x1901950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6efc25031927cbee99a4b8c408d427168218312cb5fcbc2ef0644a25c411e9cd6",
            "expected_signed_message": """
{
  "message_hash": "e9a82979035693538d20cbd16a231379d68b2484f065a64b5ac962a0ef45ed2c",
  "r": 101618044735866410136029494650850506089543609286068143785089360195209387957707,
  "s": 2923457745704967739422721965786309607758766142290846761836065357300251710122,
  "v": 28,
  "signature": "e0a9c66d8d11c3a9ae3624e150cbbdf85d542722cac5255cad4e50af5ac1ddcb06769e5284352ead5735b8b11f9e9510d024bbb889a828889db4cb04132b52aa1c"
}""",
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
            "expected_message_data_json": """
{
  "fromAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "fromSubAccount": "8289849667772468",
  "toAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "toSubAccount": "0",
  "tokenCurrency": 3,
  "numTokens": 1000000,
  "nonce": 828700936,
  "expiration": "1730800479321350000"
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 1
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6",
  "body": "325bbcdd0af37fd856ab19d5a34f04c98b4b9125fd924a41d149290d85cf5d1a"
}""",
            "digest_input": "0x1901950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6325bbcdd0af37fd856ab19d5a34f04c98b4b9125fd924a41d149290d85cf5d1a",
            "expected_signed_message": """
{
  "message_hash": "05a4682aaaffda9347f7f577623dc86be873d75680250d94f30e27fb450b0597",
  "r": 87355230145152558239319417798390737905701563801639010151017443441731256782876,
  "s": 20754249269006714296744776682911604802815023385414018875577784419437276970483,
  "v": 27,
  "signature": "c1214ee17dbc14f183297b9dd3f93120b16e633691817ee26045451bc629101c2de27d226a3d3188742629ab222d430d7989d6ea3e6a86bc259606e371123df31b"
}""",
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
            "expected_message_data_json": """
{
  "fromAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "fromSubAccount": "8289849667772468",
  "toAccount": "0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1",
  "toSubAccount": "0",
  "tokenCurrency": 3,
  "numTokens": 1500000,
  "nonce": 828700936,
  "expiration": "1730800479321350000"
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 1
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6",
  "body": "d20efa4f5ca3d7cd996d0a7be827a788fdea40ad9dc3f7d64f909ec3df2f0f1c"
}""",
            "digest_input": "0x1901950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6d20efa4f5ca3d7cd996d0a7be827a788fdea40ad9dc3f7d64f909ec3df2f0f1c",
            "expected_signed_message": """
{
  "message_hash": "57de810bfd4c46796b923242eba5fba199c69ec6159fd7f0bae13d20e6b2e32f",
  "r": 84003073399296424218543069615592899281416934630850361306323613156742252728687,
  "s": 27475502714605040799395938380083883707063662756512201821577577919846841662182,
  "v": 27,
  "signature": "b9b80dfd4b0d53e64b6dd1067d7d936c79a8c3966175bcefb2021cc71d08116f3cbe955c9f56e41f70c658e02df07873e77d347aa5c422943b87fdfd94293ae61b"
}""",
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
            "expected_message_data_json": """
{
  "fromAccount": "0x922a4874196806460fc63b5bcbff45f94c87f76f",
  "fromSubAccount": "0",
  "toAccount": "0x6a3434fce60ff567f60d80fb98f2f981e9b081fd",
  "toSubAccount": "0",
  "tokenCurrency": 3,
  "numTokens": 1000000,
  "nonce": 828700936,
  "expiration": "1730800479321350000"
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 1
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6",
  "body": "c92edbd85a6756bbc1d472694218135800c5c34cecd62dfecf8b79696fb30a5a"
}""",
            "digest_input": "0x1901950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6c92edbd85a6756bbc1d472694218135800c5c34cecd62dfecf8b79696fb30a5a",
            "expected_signed_message": """
{
  "message_hash": "aa540bb37dc69583724239e2ee089f9863760b1f5dd3707f63254f5f9045a36b",
  "r": 11015968193451536627767691276906473050663313657726362297424610772811255519811,
  "s": 40117308978565698603770991327546519074883337154968913527997965101318785819773,
  "v": 28,
  "signature": "185ad129ca0de3584fcd91f6df0c25d8065411041db117c50dabd057249a1a4358b1979c1f8c65970578bc2756f17a0b5c7352c27007811800dcd8966351647d1c"
}""",
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
            "expected_message_data_json": """
{
  "fromAccount": "0x6a3434fce60ff567f60d80fb98f2f981e9b081fd",
  "fromSubAccount": "0",
  "toAccount": "0x922a4874196806460fc63b5bcbff45f94c87f76f",
  "toSubAccount": "0",
  "tokenCurrency": 3,
  "numTokens": 1500000,
  "nonce": 828700936,
  "expiration": "1730800479321350000"
}""",
            "expected_domain_data_json": """
{
  "name": "GRVT Exchange",
  "version": "0",
  "chainId": 1
}""",
            "expected_signable_message": """
{
  "version": "01",
  "header": "950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f6",
  "body": "5660d6d82b43a7bd01c7bee9379478b27e2c7774d9e9aebd69ea163c523f8730"
}""",
            "digest_input": "0x1901950ca409f14e4f89a10e63790c40b5dc9c5fab89944e8c98112dece5b08415f65660d6d82b43a7bd01c7bee9379478b27e2c7774d9e9aebd69ea163c523f8730",
            "expected_signed_message": """
{
  "message_hash": "2a02bf2a7772d74f176d75f987e984dd253837aba1faed4b0a65ba5a3038ce06",
  "r": 84973466961705873082056285677608514305288271637256010073726199940890275535890,
  "s": 4896548729346283309439956649162331116008267310844279523516289648065258100769,
  "v": 28,
  "signature": "bbdd4726fef5cddb6eeb5fac07ed95702673293133d66481777a6a3ee82adc120ad3592ea3ebf428b260c56723386383253481bc188d9aeb87d9b21b850698211c"
}""",
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
        message_data = build_EIP712_transfer_message_data(
            tc["transfer"], 3  # assume all test cases are USDT transfers
        )
        domain_data = get_EIP712_domain_data(config.env, chainId)
        signable_message = encode_typed_data(
            domain_data, EIP712_TRANSFER_MESSAGE_TYPE, message_data
        )
        signed_message = account.sign_message(signable_message)

        # Convert to comparable strings
        message_data_json = json.dumps(message_data, indent=2)
        domain_data_json = json.dumps(domain_data, indent=2)
        signable_message_json = json.dumps(
            {
                "version": signable_message.version.hex(),
                "header": signable_message.header.hex(),
                "body": signable_message.body.hex(),
            },
            indent=2,
        )
        signed_message_json = json.dumps(
            {
                "message_hash": signed_message.message_hash.hex(),
                "r": signed_message.r,
                "s": signed_message.s,
                "v": signed_message.v,
                "signature": signed_message.signature.hex(),
            },
            indent=2,
        )
        # EIP-712 signable message format: https://eips.ethereum.org/EIPS/eip-712
        signed_message_hash_preimage = (
            "0x19"
            + signable_message.version.hex()
            + signable_message.header.hex()
            + signable_message.body.hex()
        )

        # Strip whitespace for comparison
        assert (
            message_data_json.strip() == tc["expected_message_data_json"].strip()
        ), f"""
Test '{tc['name']}' failed: message_data mismatch.
Wanted:
{tc['expected_message_data_json'].strip()}
Got:
{message_data_json.strip()}
"""
        assert (
            domain_data_json.strip() == tc["expected_domain_data_json"].strip()
        ), f"""
Test '{tc['name']}' failed: domain_data mismatch.
Wanted:
{tc['expected_domain_data_json'].strip()}
Got:
{domain_data_json.strip()}
"""
        assert (
            signable_message_json.strip() == tc["expected_signable_message"].strip()
        ), f"""
Test '{tc['name']}' failed: signable_message mismatch.
Wanted:
{tc['expected_signable_message'].strip()}
Got:
{signable_message_json.strip()}
"""
        assert (
            signed_message_hash_preimage.strip() == tc["digest_input"].strip()
        ), f"""
Test '{tc['name']}' failed: digest_input mismatch.
Wanted:
{tc["digest_input"].strip()
}
Got:
{signed_message_hash_preimage.strip()}
"""
        assert (
            signed_message_json.strip() == tc["expected_signed_message"].strip()
        ), f"""
Test '{tc['name']}' failed: signed_message mismatch.
Wanted:
{tc['expected_signed_message'].strip()}
Got:
{signed_message_json.strip()}
"""


def main():
    functions = [
        test_sign_transfer_table,
    ]
    for f in functions:
        try:
            f()
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {e} {traceback.format_exc()}")


if __name__ == "__main__":
    main()
