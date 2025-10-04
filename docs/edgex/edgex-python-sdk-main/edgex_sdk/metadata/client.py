from typing import Dict, Any

from ..internal.async_client import AsyncClient


class Client:
    """Client for metadata-related API endpoints."""

    def __init__(self, async_client: AsyncClient):
        """
        Initialize the metadata client.

        Args:
            async_client: The async client for common functionality
        """
        self.async_client = async_client

    async def get_metadata(self) -> Dict[str, Any]:
        """
        Get the exchange metadata.

        Returns:
            Dict[str, Any]: The exchange metadata

        Raises:
            ValueError: If the request fails
        """
        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/meta/getMetaData"

        try:
            async with self.async_client.session.get(url) as response:
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

    async def get_server_time(self) -> Dict[str, Any]:
        """
        Get the current server time.

        Returns:
            Dict[str, Any]: The server time information

        Raises:
            ValueError: If the request fails
        """
        # Public endpoint - use simple GET request
        await self.async_client._ensure_session()

        url = f"{self.async_client.base_url}/api/v1/public/meta/getServerTime"

        try:
            async with self.async_client.session.get(url) as response:
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
