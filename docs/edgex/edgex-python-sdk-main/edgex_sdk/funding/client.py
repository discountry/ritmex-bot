from typing import Dict, Any, List

from ..internal.async_client import AsyncClient


class Client:
    """Client for funding-related API endpoints."""

    def __init__(self, async_client: AsyncClient):
        """
        Initialize the funding client.

        Args:
            async_client: The async client for common functionality
        """
        self.async_client = async_client

    async def get_funding_transactions(
        self,
        size: str = "",
        offset_data: str = "",
        filter_coin_id_list: List[str] = None,
        filter_type_list: List[str] = None,
        filter_start_created_time_inclusive: int = 0,
        filter_end_created_time_exclusive: int = 0
    ) -> Dict[str, Any]:
        """
        Get funding transactions with pagination.

        Args:
            size: Size of the page
            offset_data: Offset data for pagination
            filter_coin_id_list: Filter by coin IDs
            filter_type_list: Filter by transaction types
            filter_start_created_time_inclusive: Filter start time (inclusive)
            filter_end_created_time_exclusive: Filter end time (exclusive)

        Returns:
            Dict[str, Any]: The funding transactions

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id())
        }

        # Add pagination parameters
        if size:
            query_params["size"] = size
        if offset_data:
            query_params["offsetData"] = offset_data

        # Add filter parameters
        if filter_coin_id_list:
            query_params["filterCoinIdList"] = ",".join(filter_coin_id_list)
        if filter_type_list:
            query_params["filterTypeList"] = ",".join(filter_type_list)

        # Add time filters
        if filter_start_created_time_inclusive > 0:
            query_params["filterStartCreatedTimeInclusive"] = str(filter_start_created_time_inclusive)
        if filter_end_created_time_exclusive > 0:
            query_params["filterEndCreatedTimeExclusive"] = str(filter_end_created_time_exclusive)

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/public/funding/getFundingRatePage",
            params=query_params
        )

    async def get_funding_account(self) -> Dict[str, Any]:
        """
        Get funding account information.

        Returns:
            Dict[str, Any]: The funding account information

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

    async def get_funding_transaction_by_id(self, transaction_ids: List[str]) -> Dict[str, Any]:
        """
        Get funding transactions by IDs.

        Args:
            transaction_ids: List of transaction IDs

        Returns:
            Dict[str, Any]: The funding transactions

        Raises:
            ValueError: If the request fails
        """
        query_params = {
            "accountId": str(self.async_client.get_account_id()),
            "transactionIdList": ",".join(transaction_ids)
        }

        return await self.async_client.make_authenticated_request(
            method="GET",
            path="/api/v1/public/funding/getLatestFundingRate",
            params=query_params
        )
