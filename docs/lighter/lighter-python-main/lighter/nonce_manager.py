import abc
import enum
from typing import Optional, Tuple

import requests

from lighter import api_client
from lighter.api import transaction_api
from lighter.errors import ValidationError


def get_nonce_from_api(client: api_client.ApiClient, account_index: int, api_key_index: int) -> int:
    #  uses request to avoid async initialization
    req = requests.get(
        client.configuration.host + "/api/v1/nextNonce",
        params={"account_index": account_index, "api_key_index": api_key_index},
    )
    if req.status_code != 200:
        raise Exception(f"couldn't get nonce {req.content}")
    return req.json()["nonce"]


class NonceManager(abc.ABC):
    def __init__(
        self,
        account_index: int,
        api_client: api_client.ApiClient,
        start_api_key: int,
        end_api_key: Optional[int] = None,
    ):
        if end_api_key is None:
            end_api_key = start_api_key
        if start_api_key > end_api_key or start_api_key >= 255 or end_api_key >= 255:
            raise ValidationError(f"invalid range {start_api_key=} {end_api_key=}")
        self.start_api_key = start_api_key
        self.end_api_key = end_api_key
        self.current_api_key = end_api_key  # start will be used for the first tx
        self.account_index = account_index
        self.api_client = api_client
        self.nonce = {
            api_key_index: get_nonce_from_api(api_client, account_index, api_key_index) - 1
            for api_key_index in range(start_api_key, end_api_key + 1)
        }

    def hard_refresh_nonce(self, api_key: int):
        self.nonce[api_key] = get_nonce_from_api(self.api_client, self.account_index, api_key) - 1

    @abc.abstractmethod
    def next_nonce(self) -> Tuple[int, int]:
        pass

    def acknowledge_failure(self, api_key_index: int) -> None:
        pass


def increment_circular(idx: int, start_idx: int, end_idx: int) -> int:
    idx += 1
    if idx > end_idx:
        return start_idx
    return idx


class OptimisticNonceManager(NonceManager):
    def __init__(
        self,
        account_index: int,
        api_client: api_client.ApiClient,
        start_api_key: int,
        end_api_key: Optional[int] = None,
    ) -> None:
        super().__init__(account_index, api_client, start_api_key, end_api_key)

    def next_nonce(self) -> Tuple[int, int]:
        self.current_api_key = increment_circular(self.current_api_key, self.start_api_key, self.end_api_key)
        self.nonce[self.current_api_key] += 1
        return (self.current_api_key, self.nonce[self.current_api_key])

    def acknowledge_failure(self, api_key_index: int) -> None:
        self.nonce[api_key_index] -= 1


class ApiNonceManager(NonceManager):
    def __init__(
        self,
        account_index: int,
        api_client: api_client.ApiClient,
        start_api_key: int,
        end_api_key: Optional[int] = None,
    ) -> None:
        super().__init__(account_index, api_client, start_api_key, end_api_key)

    def next_nonce(self) -> Tuple[int, int]:
        """
        It is recommended to wait at least 350ms before using the same api key.
        Please be mindful of your transaction frequency when using this nonce manager.
        predicted_execution_time_ms from the response could give you a tighter bound.
        """
        self.current_api_key = increment_circular(self.current_api_key, self.start_api_key, self.end_api_key)
        self.nonce[self.current_api_key] = get_nonce_from_api(self.api_client, self.account_index, self.current_api_key)
        return (self.current_api_key, self.nonce[self.current_api_key])

    def refresh_nonce(self, api_key_index: int) -> int:
        self.nonce[api_key_index] = get_nonce_from_api(self.api_client, self.start_api_key, self.end_api_key)


class NonceManagerType(enum.Enum):
    OPTIMISTIC = 1
    API = 2


def nonce_manager_factory(
    nonce_manager_type: NonceManagerType,
    account_index: int,
    api_client: api_client.ApiClient,
    start_api_key: int,
    end_api_key: Optional[int] = None,
) -> NonceManager:
    if nonce_manager_type == NonceManagerType.OPTIMISTIC:
        return OptimisticNonceManager(
            account_index=account_index,
            api_client=api_client,
            start_api_key=start_api_key,
            end_api_key=end_api_key,
        )
    elif nonce_manager_type == NonceManagerType.API:
        return ApiNonceManager(
            account_index=account_index,
            api_client=api_client,
            start_api_key=start_api_key,
            end_api_key=end_api_key,
        )
    raise ValidationError("invalid nonce manager type")
