---
title: "Data Sources | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/data-sources"
fetched_at: "2026-02-26T10:38:10.185Z"
---
-   The API system is asynchronous, so some delay in the response is normal and expected.
-   Each endpoint has a data source indicating where the data is being retrieved, and thus which endpoints have the most up-to-date response.

These are the three sources, ordered by least to most potential for delays in data updates.

-   **Matching Engine** - the data is from the Matching Engine
-   **Memory** - the data is from a server's local or external memory
-   **Database** - the data is taken directly from a database

Some endpoints can have more than 1 data source. (e.g. Memory => Database) This means that the endpoint will check the first Data Source, and if it cannot find the value it's looking for it will check the next one.
