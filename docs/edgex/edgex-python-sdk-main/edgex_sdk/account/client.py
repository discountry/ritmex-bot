from typing import Dict, Any, List, Optional

from ..internal.async_client import AsyncClient


class GetPositionTransactionPageParams:
    """Parameters for getting position transactions with pagination."""

    def __init__(
        self,
        size: str = "",
        offset_data: str = "",
        filter_contract_id_list: List[str] = None,
        filter_start_created_time_inclusive: int = 0,
        filter_end_created_time_exclusive: int = 0
    ):
        self.size = size
        self.offset_data = offset_data
        self.filter_contract_id_list = filter_contract_id_list or []
        self.filter_start_created_time_inclusive = filter_start_created_time_inclusive
        self.filter_end_created_time_exclusive = filter_end_created_time_exclusive


class GetCollateralTransactionPageParams:
    """Parameters for getting collateral transactions with pagination."""

    def __init__(
        self,
        size: str = "",
        offset_data: str = "",
        filter_start_created_time_inclusive: int = 0,
        filter_end_created_time_exclusive: int = 0
    ):
        self.size = size
        self.offset_data = offset_data
        self.filter_start_created_time_inclusive = filter_start_created_time_inclusive
        self.filter_end_created_time_exclusive = filter_end_created_time_exclusive


class GetPositionTermPageParams:
    """Parameters for getting position terms with pagination."""

    def __init__(
        self,
        size: str = "",
        offset_data: str = "",
        filter_contract_id_list: List[str] = None,
        filter_start_created_time_inclusive: int = 0,
        filter_end_created_time_exclusive: int = 0
    ):
        self.size = size
        self.offset_data = offset_data
        self.filter_contract_id_list = filter_contract_id_list or []
        self.filter_start_created_time_inclusive = filter_start_created_time_inclusive
        self.filter_end_created_time_exclusive = filter_end_created_time_exclusive


class GetAccountAssetSnapshotPageParams:
    """Parameters for getting account asset snapshots with pagination."""

    def __init__(
        self,
        size: str = "",
        offset_data: str = "",
        filter_start_created_time_inclusive: int = 0,
        filter_end_created_time_exclusive: int = 0
    ):
        self.size = size
        self.offset_data = offset_data
        self.filter_start_created_time_inclusive = filter_start_created_time_inclusive
        self.filter_end_created_time_exclusive = filter_end_created_time_exclusive


class Client:
    """Client for account-related API endpoints."""

    def __init__(self, async_client: AsyncClient):
        """
        Initialize the account client.

        Args:
            async_client: The async client for common functionality
        """
        self.async_client = async_client

    async def get_account_asset(self) -> Dict[str, Any]:
        """
        Get the account asset information.

        Returns:
            Dict[str, Any]: The account asset information

        Raises:
            ValueError: If the request fails
        """
        params = {
            "accountId": str(self.async_client.get_account_id())
        }

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/account/getAccountAsset",
            params=params
        )

    async def get_account_positions(self) -> Dict[str, Any]:
        """
        Get the account positions.

        Note: This calls the same endpoint as get_account_asset, which returns both
        collateral and position data. The position data is in the 'positionAssetList' field.

        Returns:
            Dict[str, Any]: The account positions (same as account asset response)

        Raises:
            ValueError: If the request fails
        """
        # Use the same endpoint as get_account_asset (matching Go SDK behavior)
        return await self.get_account_asset()

    async def get_position_transaction_page(self, params: GetPositionTransactionPageParams) -> Dict[str, Any]:
        """
        Get the position transactions with pagination.

        Args:
            params: Position transaction query parameters

        Returns:
            Dict[str, Any]: The position transactions

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id())
        }

        # Add pagination parameters
        if params.size:
            query_params["size"] = params.size
        if params.offset_data:
            query_params["offsetData"] = params.offset_data

        # Add filter parameters
        if params.filter_contract_id_list:
            query_params["filterContractIdList"] = ",".join(params.filter_contract_id_list)

        # Add time filters
        if params.filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(params.filter_start_created_time_inclusive)
        if params.filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(params.filter_end_created_time_exclusive)

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/account/getPositionTransactionPage",
            params=query_params
        )

    async def get_collateral_transaction_page(self, params: GetCollateralTransactionPageParams) -> Dict[str, Any]:
        """
        Get the collateral transactions with pagination.

        Args:
            params: Collateral transaction query parameters

        Returns:
            Dict[str, Any]: The collateral transactions

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id())
        }

        # Add pagination parameters
        if params.size:
            query_params["size"] = params.size
        if params.offset_data:
            query_params["offsetData"] = params.offset_data

        # Add time filters
        if params.filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(params.filter_start_created_time_inclusive)
        if params.filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(params.filter_end_created_time_exclusive)

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/account/getCollateralTransactionPage",
            params=query_params
        )

    async def get_position_term_page(self, params: GetPositionTermPageParams) -> Dict[str, Any]:
        """
        Get the position terms with pagination.

        Args:
            params: Position term query parameters

        Returns:
            Dict[str, Any]: The position terms

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.base_url}/api/v1/private/account/getPositionTermPage"
        query_params = {
            "accountId": str(self.internal_client.get_account_id())
        }

        # Add pagination parameters
        if params.size:
            query_params["size"] = params.size
        if params.offset_data:
            query_params["offsetData"] = params.offset_data

        # Add filter parameters
        if params.filter_contract_id_list:
            query_params["filterContractIdList"] = ",".join(params.filter_contract_id_list)

        # Add time filters
        if params.filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(params.filter_start_created_time_inclusive)
        if params.filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(params.filter_end_created_time_exclusive)

        response = self.session.get(url, params=query_params)

        if response.status_code != 200:
            raise ValueError(f"request failed with status code: {response.status_code}")

        resp_data = response.json()

        if resp_data.get("code") != ResponseCode.SUCCESS:
            error_param = resp_data.get("errorParam")
            if error_param:
                raise ValueError(f"request failed with error params: {error_param}")
            raise ValueError(f"request failed with code: {resp_data.get('code')}")

        return resp_data

    async def get_account_by_id(self) -> Dict[str, Any]:
        """
        Get account information by ID.

        Returns:
            Dict[str, Any]: The account information

        Raises:
            ValueError: If the request fails
        """
        params = {
            "accountId": str(self.async_client.get_account_id())
        }

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/account/getAccountById",
            params=params
        )

    async def get_account_deleverage_light(self) -> Dict[str, Any]:
        """
        Get account deleverage light information.

        Returns:
            Dict[str, Any]: The account deleverage light information

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.base_url}/api/v1/private/account/getAccountDeleverageLight"
        params = {
            "accountId": str(self.internal_client.get_account_id())
        }

        response = self.session.get(url, params=params)

        if response.status_code != 200:
            raise ValueError(f"request failed with status code: {response.status_code}")

        resp_data = response.json()

        if resp_data.get("code") != ResponseCode.SUCCESS:
            error_param = resp_data.get("errorParam")
            if error_param:
                raise ValueError(f"request failed with error params: {error_param}")
            raise ValueError(f"request failed with code: {resp_data.get('code')}")

        return resp_data

    async def get_account_asset_snapshot_page(self, params: GetAccountAssetSnapshotPageParams) -> Dict[str, Any]:
        """
        Get account asset snapshots with pagination.

        Args:
            params: Account asset snapshot query parameters

        Returns:
            Dict[str, Any]: The account asset snapshots

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.base_url}/api/v1/private/account/getAccountAssetSnapshotPage"
        query_params = {
            "accountId": str(self.internal_client.get_account_id())
        }

        # Add pagination parameters
        if params.size:
            query_params["size"] = params.size
        if params.offset_data:
            query_params["offsetData"] = params.offset_data

        # Add time filters
        if params.filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(params.filter_start_created_time_inclusive)
        if params.filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(params.filter_end_created_time_exclusive)

        response = self.session.get(url, params=query_params)

        if response.status_code != 200:
            raise ValueError(f"request failed with status code: {response.status_code}")

        resp_data = response.json()

        if resp_data.get("code") != ResponseCode.SUCCESS:
            error_param = resp_data.get("errorParam")
            if error_param:
                raise ValueError(f"request failed with error params: {error_param}")
            raise ValueError(f"request failed with code: {resp_data.get('code')}")

        return resp_data

    async def get_position_transaction_by_id(self, transaction_ids: List[str]) -> Dict[str, Any]:
        """
        Get position transactions by IDs.

        Args:
            transaction_ids: List of transaction IDs

        Returns:
            Dict[str, Any]: The position transactions

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.base_url}/api/v1/private/account/getPositionTransactionById"
        query_params = {
            "accountId": str(self.internal_client.get_account_id()),
            "transactionIdList": ",".join(transaction_ids)
        }

        response = self.session.get(url, params=query_params)

        if response.status_code != 200:
            raise ValueError(f"request failed with status code: {response.status_code}")

        resp_data = response.json()

        if resp_data.get("code") != ResponseCode.SUCCESS:
            error_param = resp_data.get("errorParam")
            if error_param:
                raise ValueError(f"request failed with error params: {error_param}")
            raise ValueError(f"request failed with code: {resp_data.get('code')}")

        return resp_data

    async def get_collateral_transaction_by_id(self, transaction_ids: List[str]) -> Dict[str, Any]:
        """
        Get collateral transactions by IDs.

        Args:
            transaction_ids: List of transaction IDs

        Returns:
            Dict[str, Any]: The collateral transactions

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.base_url}/api/v1/private/account/getCollateralTransactionById"
        query_params = {
            "accountId": str(self.internal_client.get_account_id()),
            "transactionIdList": ",".join(transaction_ids)
        }

        response = self.session.get(url, params=query_params)

        if response.status_code != 200:
            raise ValueError(f"request failed with status code: {response.status_code}")

        resp_data = response.json()

        if resp_data.get("code") != ResponseCode.SUCCESS:
            error_param = resp_data.get("errorParam")
            if error_param:
                raise ValueError(f"request failed with error params: {error_param}")
            raise ValueError(f"request failed with code: {resp_data.get('code')}")

        return resp_data

    async def update_leverage_setting(self, contract_id: str, leverage: str) -> None:
        """
        Update the account leverage settings.

        Args:
            contract_id: The contract ID
            leverage: The leverage value

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.base_url}/api/v1/private/account/updateLeverageSetting"
        data = {
            "accountId": str(self.internal_client.get_account_id()),
            "contractId": contract_id,
            "leverage": leverage
        }

        response = self.session.post(url, json=data)

        if response.status_code != 200:
            raise ValueError(f"request failed with status code: {response.status_code}")

        resp_data = response.json()

        if resp_data.get("code") != ResponseCode.SUCCESS:
            error_param = resp_data.get("errorParam")
            if error_param:
                raise ValueError(f"request failed with error params: {error_param}")
            raise ValueError(f"request failed with code: {resp_data.get('code')}")
