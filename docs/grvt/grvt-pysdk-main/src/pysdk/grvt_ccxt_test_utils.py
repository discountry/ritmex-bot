import logging
from collections.abc import Callable

from .grvt_ccxt import GrvtCcxt
from .grvt_ccxt_env import get_all_grvt_endpoints
from .grvt_ccxt_pro import GrvtCcxtPro


def default_check(return_value: dict) -> str:
    if not isinstance(return_value, list | dict):
        return "return_value is not a list or dict"
    if not return_value:
        return "return_value is empty"
    return "OK"


def validate_return_values(api: GrvtCcxt | GrvtCcxtPro, result_filename: str) -> None:
    logging.info("validate_return_values: START")
    endpoint_check_map: dict[str, Callable] = {
        "GRAPHQL": default_check,
        "AUTH": default_check,
        "CREATE_ORDER": default_check,
        "CANCEL_ALL_ORDERS": default_check,
        "CANCEL_ORDER": default_check,
        "GET_OPEN_ORDERS": default_check,
        "GET_ACCOUNT_SUMMARY": default_check,
        "GET_FUNDING_ACCOUNT_SUMMARY": default_check,
        "GET_AGGREGATED_ACCOUNT_SUMMARY": default_check,
        "GET_ACCOUNT_HISTORY": default_check,
        "GET_POSITIONS": default_check,
        "GET_ORDER": default_check,
        "GET_ORDER_HISTORY": default_check,
        "GET_FILL_HISTORY": default_check,
        "GET_ALL_INSTRUMENTS": default_check,
        "GET_INSTRUMENTS": default_check,
        "GET_INSTRUMENT": default_check,
        "GET_TICKER": default_check,
        "GET_MINI_TICKER": default_check,
        "GET_ORDER_BOOK": default_check,
        "GET_TRADES": default_check,
        "GET_TRADE_HISTORY": default_check,
        "GET_FUNDING": default_check,
        "GET_CANDLESTICK": default_check,
    }
    all_endpoints = get_all_grvt_endpoints(api.env)
    end_point_status = {}
    for short_name, endpoint in all_endpoints.items():
        if not api.was_path_called(endpoint):
            logging.info(f"validate_return_values: {short_name=}, {endpoint=}, not called")
            end_point_status[short_name] = [endpoint, "not called"]
        else:
            return_value = api.get_endpoint_return_value(endpoint)
            if short_name in endpoint_check_map:
                check_function = endpoint_check_map.get(short_name)
                if not check_function or not callable(check_function):
                    logging.error(
                        f"validate_return_values: {short_name=} "
                        f"not found in {endpoint_check_map.keys()=}"
                    )
                    continue
                check_result = check_function(return_value)
                logging.info(
                    f"validate_return_values: {short_name=}, {endpoint=}, {check_result=}"
                )
                end_point_status[short_name] = [endpoint, check_result]
            else:
                logging.error(
                    f"validate_return_values: NO {short_name=} in {endpoint_check_map.keys()=}"
                )
                end_point_status[short_name] = [endpoint, "no check"]
    with open(result_filename, "w") as file_handle:
        file_handle.write("NAME, URL, STATUS\n")
        for short_name, status in end_point_status.items():
            file_handle.write(f"{short_name}, {status[0]}, {status[1]}\n")
    logging.info("validate_return_values: END")
