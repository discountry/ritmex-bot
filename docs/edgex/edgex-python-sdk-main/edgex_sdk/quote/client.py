from typing import Dict, Any, List

from ..internal.async_client import AsyncClient


class GetKLineParams:
    """Parameters for getting K-line data."""

    def __init__(
        self,
        contract_id: str,
        interval: str,
        size: str = "",
        offset_data: str = "",
        filter_start_time_inclusive: int = 0,
        filter_end_time_exclusive: int = 0
    ):
        self.contract_id = contract_id
        self.interval = interval
        self.size = size
        self.offset_data = offset_data
        self.filter_start_time_inclusive = filter_start_time_inclusive
        self.filter_end_time_exclusive = filter_end_time_exclusive


class GetOrderBookDepthParams:
    """Parameters for getting order book depth."""

    def __init__(
        self,
        contract_id: str,
        limit: int = 50
    ):
        self.contract_id = contract_id
        self.limit = limit


class GetMultiContractKLineParams:
    """Parameters for getting K-line data for multiple contracts."""

    def __init__(
        self,
        contract_id_list: List[str],
        interval: str,
        limit: int = 1
    ):
        self.contract_id_list = contract_id_list
        self.interval = interval
        self.limit = limit


class Client:
    """Client for quote-related API endpoints."""

    def __init__(self, async_client: AsyncClient):
        """
        Initialize the quote client.

        Args:
            async_client: The async client for common functionality
        """
        self.async_client = async_client

    async def get_quote_summary(self, contract_id: str) -> Dict[str, Any]:
        """
        Get the quote summary for a given contract.

        Args:
            contract_id: The contract ID

        Returns:
            Dict[str, Any]: The quote summary

        Raises:
            ValueError: If the request fails
        """
        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/quote/getTicketSummary"
        params = {
            "contractId": contract_id
        }

        try:
            async with self.async_client.session.get(url, params=params) as response:
                if response.status != 200:
                    try:
                        error_detail = await response.json()
                        raise ValueError(f"request failed with status code: {response.status}, response: {error_detail}")
                    except:
                        text = await response.text()
                        raise ValueError(f"request failed with status code: {response.status}, response: {text}")

                resp_data = await response.json()

                if resp_data.get("code") != "SUCCESS":
                    error_param = resp_data.get("errorParam")
                    if error_param:
                        raise ValueError(f"request failed with error params: {error_param}")
                    raise ValueError(f"request failed with code: {resp_data.get('code')}")

                return resp_data

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"request failed: {str(e)}")

    async def get_24_hour_quote(self, contract_id: str) -> Dict[str, Any]:
        """
        Get the 24-hour quotes for a given contract.

        Args:
            contract_id: The contract ID

        Returns:
            Dict[str, Any]: The 24-hour quotes

        Raises:
            ValueError: If the request fails
        """
        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/quote/getTicker"
        params = {
            "contractId": contract_id
        }

        try:
            async with self.async_client.session.get(url, params=params) as response:
                if response.status != 200:
                    try:
                        error_detail = await response.json()
                        raise ValueError(f"request failed with status code: {response.status}, response: {error_detail}")
                    except:
                        text = await response.text()
                        raise ValueError(f"request failed with status code: {response.status}, response: {text}")

                resp_data = await response.json()

                if resp_data.get("code") != "SUCCESS":
                    error_param = resp_data.get("errorParam")
                    if error_param:
                        raise ValueError(f"request failed with error params: {error_param}")
                    raise ValueError(f"request failed with code: {resp_data.get('code')}")

                return resp_data

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"request failed: {str(e)}")

    async def get_k_line(self, params: GetKLineParams) -> Dict[str, Any]:
        """
        Get the K-line data for a contract.

        Args:
            params: K-line query parameters

        Returns:
            Dict[str, Any]: The K-line data

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.async_client.base_url}/api/v1/public/quote/getKline"
        query_params = {
            "contractId": params.contract_id,
            "interval": params.interval
        }

        # Add pagination parameters
        if params.size:
            query_params["size"] = params.size
        if params.offset_data:
            query_params["offsetData"] = params.offset_data

        # Add time filters
        if params.filter_start_time_inclusive > 0:
            query_params["filterStartTimeInclusive"] = str(params.filter_start_time_inclusive)
        if params.filter_end_time_exclusive > 0:
            query_params["filterEndTimeExclusive"] = str(params.filter_end_time_exclusive)

        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/quote/getKline"

        try:
            async with self.async_client.session.get(url, params=query_params) as response:
                if response.status != 200:
                    try:
                        error_detail = await response.json()
                        raise ValueError(f"request failed with status code: {response.status}, response: {error_detail}")
                    except:
                        text = await response.text()
                        raise ValueError(f"request failed with status code: {response.status}, response: {text}")

                resp_data = await response.json()

                if resp_data.get("code") != "SUCCESS":
                    error_param = resp_data.get("errorParam")
                    if error_param:
                        raise ValueError(f"request failed with error params: {error_param}")
                    raise ValueError(f"request failed with code: {resp_data.get('code')}")

                return resp_data

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"request failed: {str(e)}")

    async def get_order_book_depth(self, params: GetOrderBookDepthParams) -> Dict[str, Any]:
        """
        Get the order book depth for a contract.

        Args:
            params: Order book depth query parameters

        Returns:
            Dict[str, Any]: The order book depth

        Raises:
            ValueError: If the request fails
        """
        url = f"{self.async_client.base_url}/api/v1/public/quote/getDepth"
        query_params = {
            "contractId": params.contract_id,
            "level": str(params.limit)  # The API expects 'level', not 'limit'
        }

        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/quote/getDepth"

        try:
            async with self.async_client.session.get(url, params=query_params) as response:
                if response.status != 200:
                    try:
                        error_detail = await response.json()
                        raise ValueError(f"request failed with status code: {response.status}, response: {error_detail}")
                    except:
                        text = await response.text()
                        raise ValueError(f"request failed with status code: {response.status}, response: {text}")

                resp_data = await response.json()

                if resp_data.get("code") != "SUCCESS":
                    error_param = resp_data.get("errorParam")
                    if error_param:
                        raise ValueError(f"request failed with error params: {error_param}")
                    raise ValueError(f"request failed with code: {resp_data.get('code')}")

                return resp_data

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"request failed: {str(e)}")

    async def get_multi_contract_k_line(self, params: GetMultiContractKLineParams) -> Dict[str, Any]:
        """
        Get the K-line data for multiple contracts.

        Args:
            params: Multi-contract K-line query parameters

        Returns:
            Dict[str, Any]: The K-line data for multiple contracts

        Raises:
            ValueError: If the request fails
        """
        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/quote/getMultiContractKline"
        query_params = {
            "contractIdList": ",".join(params.contract_id_list),
            "interval": params.interval,
            "limit": str(params.limit)
        }

        try:
            async with self.async_client.session.get(url, params=query_params) as response:
                if response.status != 200:
                    try:
                        error_detail = await response.json()
                        raise ValueError(f"request failed with status code: {response.status}, response: {error_detail}")
                    except:
                        text = await response.text()
                        raise ValueError(f"request failed with status code: {response.status}, response: {text}")

                resp_data = await response.json()

                if resp_data.get("code") != "SUCCESS":
                    error_param = resp_data.get("errorParam")
                    if error_param:
                        raise ValueError(f"request failed with error params: {error_param}")
                    raise ValueError(f"request failed with code: {resp_data.get('code')}")

                return resp_data

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"request failed: {str(e)}")
