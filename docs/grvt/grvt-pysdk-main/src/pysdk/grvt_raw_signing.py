from enum import Enum
from decimal import Decimal
from typing import Any, Optional

from eth_account import Account
from eth_account.messages import encode_typed_data

from .grvt_ccxt_utils import GrvtCurrency
from .grvt_raw_base import GrvtApiConfig, GrvtEnv
from .grvt_raw_types import Instrument, Order, Withdrawal, TimeInForce
from .grvt_fixed_types import Transfer

#########################
# INSTRUMENT CONVERSION #
#########################


PRICE_MULTIPLIER = 1_000_000_000


class SignTimeInForce(Enum):
    GOOD_TILL_TIME = 1
    ALL_OR_NONE = 2
    IMMEDIATE_OR_CANCEL = 3
    FILL_OR_KILL = 4


TIME_IN_FORCE_TO_SIGN_TIME_IN_FORCE = {
    TimeInForce.GOOD_TILL_TIME: SignTimeInForce.GOOD_TILL_TIME,
    TimeInForce.ALL_OR_NONE: SignTimeInForce.ALL_OR_NONE,
    TimeInForce.IMMEDIATE_OR_CANCEL: SignTimeInForce.IMMEDIATE_OR_CANCEL,
    TimeInForce.FILL_OR_KILL: SignTimeInForce.FILL_OR_KILL,
}


#####################
# EIP-712 chain IDs #
#####################
CHAIN_IDS = {
    GrvtEnv.DEV: 327,
    GrvtEnv.STAGING: 327,
    GrvtEnv.TESTNET: 326,
    GrvtEnv.PROD: 325,
}


def get_EIP712_domain_data(env: GrvtEnv, chainId: int | None) -> dict[str, str | int]:
    return {
        "name": "GRVT Exchange",
        "version": "0",
        "chainId": chainId or CHAIN_IDS[env],
    }


#####################
# Sign Order #
#####################

EIP712_ORDER_MESSAGE_TYPE = {
    "Order": [
        {"name": "subAccountID", "type": "uint64"},
        {"name": "isMarket", "type": "bool"},
        {"name": "timeInForce", "type": "uint8"},
        {"name": "postOnly", "type": "bool"},
        {"name": "reduceOnly", "type": "bool"},
        {"name": "legs", "type": "OrderLeg[]"},
        {"name": "nonce", "type": "uint32"},
        {"name": "expiration", "type": "int64"},
    ],
    "OrderLeg": [
        {"name": "assetID", "type": "uint256"},
        {"name": "contractSize", "type": "uint64"},
        {"name": "limitPrice", "type": "uint64"},
        {"name": "isBuyingContract", "type": "bool"},
    ],
}


def sign_order(
    order: Order,
    config: GrvtApiConfig,
    account: Account,
    instruments: dict[str, Instrument],
) -> Order:
    if config.private_key is None:
        raise ValueError("Private key is not set")

    message_data = build_EIP712_order_message_data(order, instruments)

    domain_data = get_EIP712_domain_data(config.env, CHAIN_IDS[config.env])
    signable_message = encode_typed_data(
        domain_data, EIP712_ORDER_MESSAGE_TYPE, message_data
    )
    signed_message = account.sign_message(signable_message)

    order.signature.s = "0x" + signed_message.s.to_bytes(32, byteorder="big").hex()
    order.signature.r = "0x" + signed_message.r.to_bytes(32, byteorder="big").hex()
    order.signature.v = signed_message.v
    order.signature.signer = str(account.address)

    return order


def build_EIP712_order_message_data(
    order: Order, instruments: dict[str, Instrument]
) -> dict[str, Any]:
    legs = []
    for leg in order.legs:
        instrument = instruments[leg.instrument]
        size_multiplier = 10**instrument.base_decimals

        # use Decimal() instead of float() to avoid precision loss
        # int(float("1.013") * 1e9) = 1012999999
        # int(Decimal("1.013") * Decimal(1e9) = 1013000000
        size_int = int(Decimal(leg.size) * Decimal(size_multiplier))
        price_int = int(Decimal(leg.limit_price) * Decimal(PRICE_MULTIPLIER))
        legs.append(
            {
                "assetID": instrument.instrument_hash,
                "contractSize": size_int,
                "limitPrice": price_int,
                "isBuyingContract": leg.is_buying_asset,
            }
        )
    return {
        "subAccountID": order.sub_account_id,
        "isMarket": order.is_market or False,
        "timeInForce": TIME_IN_FORCE_TO_SIGN_TIME_IN_FORCE[order.time_in_force].value,
        "postOnly": order.post_only or False,
        "reduceOnly": order.reduce_only or False,
        "legs": legs,
        "nonce": order.signature.nonce,
        "expiration": order.signature.expiration,
    }


#####################
# Sign Transfer #
#####################

EIP712_TRANSFER_MESSAGE_TYPE = {
    "Transfer": [
        {"name": "fromAccount", "type": "address"},
        {"name": "fromSubAccount", "type": "uint64"},
        {"name": "toAccount", "type": "address"},
        {"name": "toSubAccount", "type": "uint64"},
        {"name": "tokenCurrency", "type": "uint8"},
        {"name": "numTokens", "type": "uint64"},
        {"name": "nonce", "type": "uint32"},
        {"name": "expiration", "type": "int64"},
    ],
}


def build_EIP712_transfer_message_data(transfer: Transfer, currencyId: int):
    return {
        "fromAccount": transfer.from_account_id,
        "fromSubAccount": transfer.from_sub_account_id,
        "toAccount": transfer.to_account_id,
        "toSubAccount": transfer.to_sub_account_id,
        "tokenCurrency": currencyId,
        "numTokens": int(
            Decimal(transfer.num_tokens) * Decimal(1e6)
        ),  # USDT has 6 decimals
        "nonce": transfer.signature.nonce,
        "expiration": transfer.signature.expiration,
    }


def sign_transfer(
    transfer: Transfer,
    config: GrvtApiConfig,
    account: Account,
    chainId: int | None = None,
    currencyId: int = 3,  # currencyId of USDT; refer to Get Currency API
) -> Transfer:
    if config.private_key is None:
        raise ValueError("Private key is not set")

    domain = get_EIP712_domain_data(config.env, chainId)

    message_data = build_EIP712_transfer_message_data(transfer, currencyId)
    signable_message = encode_typed_data(
        domain, EIP712_TRANSFER_MESSAGE_TYPE, message_data
    )
    signed_message = account.sign_message(signable_message)

    transfer.signature.r = "0x" + signed_message.r.to_bytes(32, byteorder="big").hex()
    transfer.signature.s = "0x" + signed_message.s.to_bytes(32, byteorder="big").hex()
    transfer.signature.v = signed_message.v
    transfer.signature.signer = str(account.address)

    return transfer


#####################
# Sign Withdrawal #
#####################

EIP712_WITHDRAWAL_MESSAGE_TYPE = {
    "Withdrawal": [
        {"name": "fromAccount", "type": "address"},
        {"name": "toEthAddress", "type": "address"},
        {"name": "tokenCurrency", "type": "uint8"},
        {"name": "numTokens", "type": "uint64"},
        {"name": "nonce", "type": "uint32"},
        {"name": "expiration", "type": "int64"},
    ],
}


def build_EIP712_withdrawal_message_data(withdrawal: Withdrawal, currencyId: int):
    return {
        "fromAccount": withdrawal.from_account_id,
        "toEthAddress": withdrawal.to_eth_address,
        "tokenCurrency": currencyId,
        "numTokens": int(
            Decimal(withdrawal.num_tokens) * Decimal(1e6)
        ),  # USDT has 6 decimals
        "nonce": withdrawal.signature.nonce,
        "expiration": withdrawal.signature.expiration,
    }


def sign_withdrawal(
    withdrawal: Withdrawal,
    config: GrvtApiConfig,
    account: Account,
    chainId: int | None = None,
    currencyId: int = 3,  # currencyId of USDT; refer to Get Currency API
) -> Withdrawal:
    if config.private_key is None:
        raise ValueError("Private key is not set")

    domain = get_EIP712_domain_data(config.env, chainId)

    message_data = build_EIP712_withdrawal_message_data(withdrawal, currencyId)
    signable_message = encode_typed_data(
        domain, EIP712_WITHDRAWAL_MESSAGE_TYPE, message_data
    )
    signed_message = account.sign_message(signable_message)

    withdrawal.signature.r = "0x" + signed_message.r.to_bytes(32, byteorder="big").hex()
    withdrawal.signature.s = "0x" + signed_message.s.to_bytes(32, byteorder="big").hex()
    withdrawal.signature.v = signed_message.v
    withdrawal.signature.signer = str(account.address)

    return withdrawal
