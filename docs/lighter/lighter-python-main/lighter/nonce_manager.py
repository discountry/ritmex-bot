import abc
import enum
from typing import Optional, Tuple, List

import requests

from lighter.api_client import ApiClient
from lighter.errors import ValidationError


def get_nonce_from_api(client: ApiClient, account_index: int, api_key: int) -> int:
    #  uses request to avoid async initialization
    req = requests.get(
        client.configuration.host + "/api/v1/nextNonce",
        params={"account_index": account_index, "api_key_index": api_key},
    )
    if req.status_code != 200:
        raise Exception(f"couldn't get nonce {req.content}")
    return req.json()["nonce"]


class NonceManager(abc.ABC):
    def __init__(
            self,
            account_index: int,
            api_client: ApiClient,
            api_keys_list: List[int],
    ):
        if len(api_keys_list) == 0:
            raise ValidationError(f"No API Key provided")

        self.current = 0  # cycle through api keys
        self.account_index = account_index
        self.api_client = api_client
        self.api_keys_list = api_keys_list
        self.nonce = {
            api_keys_list[i]: get_nonce_from_api(api_client, account_index, api_keys_list[i]) - 1
            for i in range(len(api_keys_list))
        }

    def refresh_nonce(self, api_key: int) -> int:
        self.nonce[api_key] = get_nonce_from_api(self.api_client, self.account_index, api_key)
        return self.nonce[api_key]

    def hard_refresh_nonce(self, api_key: int):
        self.nonce[api_key] = get_nonce_from_api(self.api_client, self.account_index, api_key) - 1

    @abc.abstractmethod
    def next_nonce(self, api_key: Optional[int] = None) -> Tuple[int, int]:
        pass

    def acknowledge_failure(self, api_key: int) -> None:
        pass


class OptimisticNonceManager(NonceManager):
    def __init__(
            self,
            account_index: int,
            api_client: ApiClient,
            api_keys_list: List[int]
    ) -> None:
        super().__init__(account_index, api_client, api_keys_list)

    def next_nonce(self, api_key: Optional[int] = None) -> Tuple[int, int]:
        if api_key is None:
            self.current = (self.current + 1) % len(self.api_keys_list)
            api_key = self.api_keys_list[self.current]

        self.nonce[api_key] += 1
        return api_key, self.nonce[api_key]

    def acknowledge_failure(self, api_key: int) -> None:
        self.nonce[api_key] -= 1


class ApiNonceManager(NonceManager):
    def __init__(
            self,
            account_index: int,
            api_client: ApiClient,
            api_keys_list: List[int],
    ) -> None:
        super().__init__(account_index, api_client, api_keys_list)

    def next_nonce(self, api_key: Optional[int] = None) -> Tuple[int, int]:
        """
        It is recommended to wait at least 350ms before using the same api key.
        Please be mindful of your transaction frequency when using this nonce manager.
        predicted_execution_time_ms from the response could give you a tighter bound.
        """
        if api_key is None:
            self.current = (self.current + 1) % len(self.api_keys_list)
            api_key = self.api_keys_list[self.current]

        nonce = self.refresh_nonce(api_key)
        return api_key, nonce


class NonceManagerType(enum.Enum):
    OPTIMISTIC = 1
    API = 2


def nonce_manager_factory(
        nonce_manager_type: NonceManagerType,
        account_index: int,
        api_client: ApiClient,
        api_keys_list: List[int],
) -> NonceManager:
    if nonce_manager_type == NonceManagerType.OPTIMISTIC:
        return OptimisticNonceManager(
            account_index=account_index,
            api_client=api_client,
            api_keys_list=api_keys_list,
        )
    elif nonce_manager_type == NonceManagerType.API:
        return ApiNonceManager(
            account_index=account_index,
            api_client=api_client,
            api_keys_list=api_keys_list,
        )
    raise ValidationError("invalid nonce manager type")
