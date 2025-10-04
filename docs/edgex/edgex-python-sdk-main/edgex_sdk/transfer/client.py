from typing import Dict, Any, List

from ..internal.async_client import AsyncClient


class GetTransferOutByIdParams:
    """Parameters for getting transfer out records by ID."""

    def __init__(self, transfer_id_list: List[str]):
        self.transfer_id_list = transfer_id_list


class GetTransferInByIdParams:
    """Parameters for getting transfer in records by ID."""

    def __init__(self, transfer_id_list: List[str]):
        self.transfer_id_list = transfer_id_list


class GetWithdrawAvailableAmountParams:
    """Parameters for getting available withdrawal amount."""

    def __init__(self, coin_id: str):
        self.coin_id = coin_id


class CreateTransferOutParams:
    """Parameters for creating a transfer out order."""

    def __init__(
        self,
        coin_id: str,
        amount: str,
        address: str,
        network: str,
        memo: str = "",
        client_order_id: str = None
    ):
        self.coin_id = coin_id
        self.amount = amount
        self.address = address
        self.network = network
        self.memo = memo
        self.client_order_id = client_order_id


class GetTransferOutPageParams:
    """Parameters for getting transfer out page."""

    def __init__(self, size: str = "10", offset_data: str = "", filter_coin_id_list: List[str] = None,
                 filter_status_list: List[str] = None, filter_start_created_time_inclusive: int = 0,
                 filter_end_created_time_exclusive: int = 0):
        self.size = size
        self.offset_data = offset_data
        self.filter_coin_id_list = filter_coin_id_list or []
        self.filter_status_list = filter_status_list or []
        self.filter_start_created_time_inclusive = filter_start_created_time_inclusive
        self.filter_end_created_time_exclusive = filter_end_created_time_exclusive


class GetTransferInPageParams:
    """Parameters for getting transfer in page."""

    def __init__(self, size: str = "10", offset_data: str = "", filter_coin_id_list: List[str] = None,
                 filter_status_list: List[str] = None, filter_start_created_time_inclusive: int = 0,
                 filter_end_created_time_exclusive: int = 0):
        self.size = size
        self.offset_data = offset_data
        self.filter_coin_id_list = filter_coin_id_list or []
        self.filter_status_list = filter_status_list or []
        self.filter_start_created_time_inclusive = filter_start_created_time_inclusive
        self.filter_end_created_time_exclusive = filter_end_created_time_exclusive


class Client:
    """Client for transfer-related API endpoints."""

    def __init__(self, async_client: AsyncClient):
        """
        Initialize the transfer client.

        Args:
            async_client: The async client for common functionality
        """
        self.async_client = async_client

    async def get_transfer_out_by_id(self, params: GetTransferOutByIdParams) -> Dict[str, Any]:
        """
        Get transfer out records by ID.

        Args:
            params: Transfer out query parameters

        Returns:
            Dict[str, Any]: The transfer out records

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id()),
            "transferIdList": ",".join(params.transfer_id_list)
        }

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/transfer/getTransferOutById",
            params=query_params
        )

    async def get_transfer_in_by_id(self, params: GetTransferInByIdParams) -> Dict[str, Any]:
        """
        Get transfer in records by ID.

        Args:
            params: Transfer in query parameters

        Returns:
            Dict[str, Any]: The transfer in records

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id()),
            "transferIdList": ",".join(params.transfer_id_list)
        }

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/transfer/getTransferInById",
            params=query_params
        )

    async def get_withdraw_available_amount(self, params: GetWithdrawAvailableAmountParams) -> Dict[str, Any]:
        """
        Get the available withdrawal amount.

        Args:
            params: Withdrawal available amount query parameters

        Returns:
            Dict[str, Any]: The available withdrawal amount

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id()),
            "coinId": params.coin_id
        }

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/transfer/getTransferOutAvailableAmount",
            params=query_params
        )

    async def create_transfer_out(self, params: CreateTransferOutParams, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Create a new transfer out order.

        Args:
            params: Transfer out parameters
            metadata: Exchange metadata (optional, not used in current implementation)

        Returns:
            Dict[str, Any]: The created transfer out order

        Raises:
            ValueError: If the request fails
        """
        client_order_id = params.client_order_id or self.async_client.generate_uuid()

        data = {
            "accountId": str(self.async_client.get_account_id()),
            "coinId": params.coin_id,
            "amount": params.amount,
            "address": params.address,
            "network": params.network,
            "clientOrderId": client_order_id
        }

        if params.memo:
            data["memo"] = params.memo

        # TODO: Implement signature calculation for transfer out
        # This would require:
        # 1. Asset ID from metadata based on coin_id
        # 2. Receiver public key from address
        # 3. Position IDs for sender, receiver, and fee
        # 4. Proper expiration time calculation
        # 5. Call to calc_transfer_hash and sign the result
        # For now, the API call is made without signature (may fail on actual server)

        return await self.async_client.make_authenticated_request(
            method="POST",
            path="/api/v1/private/transfer/createTransferOut",
            data=data
        )

    async def get_transfer_out_page(
        self,
        params: GetTransferOutPageParams
    ) -> Dict[str, Any]:
        """
        Get transfer out records with pagination.

        Args:
            params: Parameters for the request

        Returns:
            Dict[str, Any]: The transfer out records

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
        if params.filter_coin_id_list:
            query_params["filterCoinIdList"] = ",".join(params.filter_coin_id_list)
        if params.filter_status_list:
            query_params["filterStatusList"] = ",".join(params.filter_status_list)

        # Add time filters
        if params.filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(params.filter_start_created_time_inclusive)
        if params.filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(params.filter_end_created_time_exclusive)

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/transfer/getActiveTransferOut",
            params=query_params
        )

    async def get_transfer_in_page(
        self,
        params: GetTransferInPageParams
    ) -> Dict[str, Any]:
        """
        Get transfer in records with pagination.

        Args:
            params: Parameters for the request

        Returns:
            Dict[str, Any]: The transfer in records

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
        if params.filter_coin_id_list:
            query_params["filterCoinIdList"] = ",".join(params.filter_coin_id_list)
        if params.filter_status_list:
            query_params["filterStatusList"] = ",".join(params.filter_status_list)

        # Add time filters
        if params.filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(params.filter_start_created_time_inclusive)
        if params.filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(params.filter_end_created_time_exclusive)

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/private/transfer/getActiveTransferIn",
            params=query_params
        )
