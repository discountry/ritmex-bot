#!/usr/bin/env python3

"""Lightweight bridge to the Lighter signer shared library using stdin/stdout JSON RPC."""

import ctypes
import json
import os
import platform
import subprocess
import sys
from typing import Any, Dict


class StrOrErr(ctypes.Structure):
    _fields_ = [("str", ctypes.c_char_p), ("err", ctypes.c_char_p)]


class SignedTxResponse(ctypes.Structure):
    _fields_ = [
        ("txType", ctypes.c_uint8),
        ("txInfo", ctypes.c_char_p),
        ("txHash", ctypes.c_char_p),
        ("messageToSign", ctypes.c_char_p),
        ("err", ctypes.c_char_p),
    ]


def _resolve_signer_path() -> str:
    base = os.path.abspath(os.path.dirname(__file__))
    signers_dir = os.path.join(base, "signers")
    system = platform.system()
    machine = platform.machine().lower()

    if system == "Darwin":
        path = os.path.join(signers_dir, "signer-arm64.dylib" if machine == "arm64" else "signer-amd64.dylib")
    elif system == "Linux":
        path = os.path.join(signers_dir, "signer-amd64.so")
    else:
        raise RuntimeError(f"Unsupported platform: {system} {machine}")

    if not os.path.exists(path):
        raise FileNotFoundError(f"Signer library missing: {path}")
    return path


def _load_library(path: str) -> ctypes.CDLL:
    try:
        return ctypes.CDLL(path)
    except OSError as exc:  # pragma: no cover - runtime environment guard
        message = str(exc)
        if platform.system() == "Darwin" and "code signature" in message:
            subprocess.run(["/usr/bin/xattr", "-d", "com.apple.quarantine", path], check=False, capture_output=True)
            subprocess.run(["/usr/bin/codesign", "--force", "--sign", "-", path], check=False, capture_output=True)
            return ctypes.CDLL(path)
        raise


SIGNER_PATH = _resolve_signer_path()

try:
    LIB = _load_library(SIGNER_PATH)
except OSError as exc:  # pragma: no cover - runtime environment guard
    print(json.dumps({"id": None, "error": f"failed_to_load_signer:{exc}"}), flush=True)
    sys.exit(1)


LIB.CreateClient.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int, ctypes.c_int, ctypes.c_longlong]
LIB.CreateClient.restype = ctypes.c_char_p

# New signer exports: SwitchAPIKey removed; apiKeyIndex is passed to every call
LIB.SignCreateOrder.argtypes = [
    ctypes.c_int,  # marketIndex
    ctypes.c_longlong,  # clientOrderIndex
    ctypes.c_longlong,  # baseAmount
    ctypes.c_int,  # price
    ctypes.c_int,  # isAsk
    ctypes.c_int,  # orderType
    ctypes.c_int,  # timeInForce
    ctypes.c_int,  # reduceOnly
    ctypes.c_int,  # triggerPrice
    ctypes.c_longlong,  # orderExpiry
    ctypes.c_longlong,  # nonce
    ctypes.c_int,  # apiKeyIndex
    ctypes.c_longlong,  # accountIndex
]
LIB.SignCreateOrder.restype = SignedTxResponse

LIB.SignCancelOrder.argtypes = [
    ctypes.c_int,  # marketIndex
    ctypes.c_longlong,  # orderIndex
    ctypes.c_longlong,  # nonce
    ctypes.c_int,  # apiKeyIndex
    ctypes.c_longlong,  # accountIndex
]
LIB.SignCancelOrder.restype = SignedTxResponse

LIB.SignCancelAllOrders.argtypes = [
    ctypes.c_int,  # timeInForce
    ctypes.c_longlong,  # scheduledTime
    ctypes.c_longlong,  # nonce
    ctypes.c_int,  # apiKeyIndex
    ctypes.c_longlong,  # accountIndex
]
LIB.SignCancelAllOrders.restype = SignedTxResponse

LIB.CreateAuthToken.argtypes = [ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
LIB.CreateAuthToken.restype = StrOrErr


def _unwrap(result: StrOrErr) -> Dict[str, Any]:
    if isinstance(result, SignedTxResponse):
        if result.err:
            return {"error": ctypes.string_at(result.err).decode("utf-8", errors="replace")}
        tx_info = ctypes.string_at(result.txInfo).decode("utf-8", errors="replace") if result.txInfo else None
        tx_hash = ctypes.string_at(result.txHash).decode("utf-8", errors="replace") if result.txHash else None
        msg = ctypes.string_at(result.messageToSign).decode("utf-8", errors="replace") if result.messageToSign else None
        return {"result": tx_info, "txHash": tx_hash, "messageToSign": msg}
    if result.err:
        return {"error": ctypes.string_at(result.err).decode("utf-8", errors="replace")}
    if result.str:
        return {"result": ctypes.string_at(result.str).decode("utf-8", errors="replace")}
    return {"result": None}


def _maybe_error(ptr: ctypes.c_char_p) -> Dict[str, Any]:
    if ptr:
        return {"error": ctypes.string_at(ptr).decode("utf-8", errors="replace")}
    return {"result": "ok"}


_INITIALISED_KEYS = set()
_CLIENT_CONFIG: Dict[int, Dict[str, Any]] = {}


def _ensure_client(params: Dict[str, Any]) -> Dict[str, Any]:
    api_key_index = int(params["apiKeyIndex"])

    config = _CLIENT_CONFIG.get(api_key_index)
    if "baseUrl" in params and "privateKey" in params:
        config = {
            "baseUrl": params["baseUrl"],
            "privateKey": params["privateKey"],
            "chainId": int(params["chainId"]),
            "accountIndex": int(params["accountIndex"]),
        }
        _CLIENT_CONFIG[api_key_index] = config

    if config is None:
        return {"error": "client_not_initialized"}

    err_ptr = LIB.CreateClient(
        config["baseUrl"].encode("utf-8"),
        config["privateKey"].encode("utf-8"),
        ctypes.c_int(int(config["chainId"])),
        ctypes.c_int(api_key_index),
        ctypes.c_longlong(int(config["accountIndex"])),
    )
    outcome = _maybe_error(err_ptr)
    if "error" in outcome:
        return outcome
    _INITIALISED_KEYS.add(api_key_index)
    return {"result": "ok"}


def _switch_api_key(api_key_index: int) -> Dict[str, Any]:
    # No-op with new signer (apiKeyIndex is passed to each call)
    return {"result": "ok"}


def handle_create_client(params: Dict[str, Any]) -> Dict[str, Any]:
    return _ensure_client(params)


def handle_sign_create_order(params: Dict[str, Any]) -> Dict[str, Any]:
    ensure = _ensure_client(params)
    if "error" in ensure:
        return ensure

    api_key_index = int(params["apiKeyIndex"])
    expiry = int(params["orderExpiry"])
    result = LIB.SignCreateOrder(
        ctypes.c_int(int(params["marketIndex"])),
        ctypes.c_longlong(int(params["clientOrderIndex"])),
        ctypes.c_longlong(int(params["baseAmount"])),
        ctypes.c_int(int(params["price"])),
        ctypes.c_int(int(params["isAsk"])),
        ctypes.c_int(int(params["orderType"])),
        ctypes.c_int(int(params["timeInForce"])),
        ctypes.c_int(int(params["reduceOnly"])),
        ctypes.c_int(int(params["triggerPrice"])),
        ctypes.c_longlong(expiry),
        ctypes.c_longlong(int(params["nonce"])),
        ctypes.c_int(api_key_index),
        ctypes.c_longlong(int(params["accountIndex"])),
    )
    return _unwrap(result)


def handle_sign_cancel_order(params: Dict[str, Any]) -> Dict[str, Any]:
    ensure = _ensure_client(params)
    if "error" in ensure:
        return ensure

    api_key_index = int(params["apiKeyIndex"])
    result = LIB.SignCancelOrder(
        ctypes.c_int(int(params["marketIndex"])),
        ctypes.c_longlong(int(params["orderIndex"])),
        ctypes.c_longlong(int(params["nonce"])),
        ctypes.c_int(api_key_index),
        ctypes.c_longlong(int(params["accountIndex"])),
    )
    return _unwrap(result)


def handle_sign_cancel_all(params: Dict[str, Any]) -> Dict[str, Any]:
    ensure = _ensure_client(params)
    if "error" in ensure:
        return ensure

    api_key_index = int(params["apiKeyIndex"])
    result = LIB.SignCancelAllOrders(
        ctypes.c_int(int(params["timeInForce"])),
        ctypes.c_longlong(int(params["scheduledTime"])),
        ctypes.c_longlong(int(params["nonce"])),
        ctypes.c_int(api_key_index),
        ctypes.c_longlong(int(params["accountIndex"])),
    )
    return _unwrap(result)


def handle_create_auth_token(params: Dict[str, Any]) -> Dict[str, Any]:
    ensure = _ensure_client(params)
    if "error" in ensure:
        return ensure

    api_key_index = int(params["apiKeyIndex"])

    result = LIB.CreateAuthToken(
        ctypes.c_longlong(int(params["deadlineMs"])),
        ctypes.c_int(api_key_index),
        ctypes.c_longlong(int(params["accountIndex"])),
    )
    return _unwrap(result)


HANDLERS = {
    "create_client": handle_create_client,
    "sign_create_order": handle_sign_create_order,
    "sign_cancel_order": handle_sign_cancel_order,
    "sign_cancel_all": handle_sign_cancel_all,
    "create_auth_token": handle_create_auth_token,
}


def main() -> None:
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
        except json.JSONDecodeError as exc:  # pragma: no cover - defensive
            print(json.dumps({"id": None, "error": f"invalid_json:{exc}"}), flush=True)
            continue

        req_id = request.get("id")
        method = request.get("method")
        params = request.get("params", {})

        handler = HANDLERS.get(method)
        if not handler:
            response = {"id": req_id, "error": f"unknown_method:{method}"}
        else:
            try:
                outcome = handler(params)
                outcome.setdefault("id", req_id)
                response = outcome
            except Exception as exc:  # pragma: no cover - safety net
                response = {"id": req_id, "error": f"exception:{exc}"}

        print(json.dumps(response), flush=True)


if __name__ == "__main__":
    main()
