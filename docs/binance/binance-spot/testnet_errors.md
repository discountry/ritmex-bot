---
title: "Errors | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors"
fetched_at: "2026-02-26T10:38:09.991Z"
---
# Error codes for Binance SPOT Testnet

Errors consist of two parts: an error code and a message. Codes are universal, but messages can vary. Here is the error JSON payload:

```
{    "code": -1121,    "msg": "Invalid symbol."}
```

## 10xx - General Server or Network issues[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

### \-1000 UNKNOWN[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   An unknown error occurred while processing the request.

### \-1001 DISCONNECTED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Internal error; unable to process your request. Please try again.

### \-1002 UNAUTHORIZED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   You are not authorized to execute this request.

### \-1003 TOO\_MANY\_REQUESTS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Too many requests queued.
-   Too much request weight used; current limit is %s request weight per %s. Please use WebSocket Streams for live updates to avoid polling the API.
-   Way too much request weight used; IP banned until %s. Please use WebSocket Streams for live updates to avoid bans.

### \-1006 UNEXPECTED\_RESP[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   An unexpected response was received from the message bus. Execution status unknown.

### \-1007 TIMEOUT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Timeout waiting for response from backend server. Send status unknown; execution status unknown.

### \-1008 SERVER\_BUSY[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Server is currently overloaded with other requests. Please try again in a few minutes.

### \-1013 INVALID\_MESSAGE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   The request is rejected by the API. (i.e. The request didn't reach the Matching Engine.)
-   Potential error messages can be found in [Filter Failures](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors) or [Failures during order placement](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors).

### \-1014 UNKNOWN\_ORDER\_COMPOSITION[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Unsupported order combination.

### \-1015 TOO\_MANY\_ORDERS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Too many new orders.
-   Too many new orders; current limit is %s orders per %s.

### \-1016 SERVICE\_SHUTTING\_DOWN[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   This service is no longer available.

### \-1020 UNSUPPORTED\_OPERATION[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   This operation is not supported.

### \-1021 INVALID\_TIMESTAMP[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Timestamp for this request is outside of the recvWindow.
-   Timestamp for this request was 1000ms ahead of the server's time.

### \-1022 INVALID\_SIGNATURE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Signature for this request is not valid.

### \-1033 COMP\_ID\_IN\_USE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `SenderCompId(49)` is currently in use. Concurrent use of the same SenderCompId within one account is not allowed.

### \-1034 TOO\_MANY\_CONNECTIONS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Too many concurrent connections; current limit is '%s'.
-   Too many connection attempts for account; current limit is %s per '%s'.
-   Too many connection attempts from IP; current limit is %s per '%s'.

### \-1035 LOGGED\_OUT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Please send [Logout`<5>`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/fix-api) message to close the session.

## 11xx - Request issues[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

### \-1100 ILLEGAL\_CHARS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Illegal characters found in a parameter.
-   Illegal characters found in parameter '%s'; legal range is '%s'.

### \-1101 TOO\_MANY\_PARAMETERS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Too many parameters sent for this endpoint.
-   Too many parameters; expected '%s' and received '%s'.
-   Duplicate values for a parameter detected.

### \-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A mandatory parameter was not sent, was empty/null, or malformed.
-   Mandatory parameter '%s' was not sent, was empty/null, or malformed.
-   Param '%s' or '%s' must be sent, but both were empty/null!
-   Required tag '%s' missing.
-   Field value was empty or malformed.
-   '%s' contains unexpected value. Cannot be greater than %s.

### \-1103 UNKNOWN\_PARAM[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   An unknown parameter was sent.
-   Undefined Tag.

### \-1104 UNREAD\_PARAMETERS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Not all sent parameters were read.
-   Not all sent parameters were read; read '%s' parameter(s) but was sent '%s'.

### \-1105 PARAM\_EMPTY[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A parameter was empty.
-   Parameter '%s' was empty.

### \-1106 PARAM\_NOT\_REQUIRED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A parameter was sent when not required.
-   Parameter '%s' sent when not required.
-   A tag '%s' was sent when not required.

### \-1108 PARAM\_OVERFLOW[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Parameter '%s' overflowed.

### \-1111 BAD\_PRECISION[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Parameter '%s' has too much precision.

### \-1112 NO\_DEPTH[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   No orders on book for symbol.

### \-1114 TIF\_NOT\_REQUIRED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   TimeInForce parameter sent when not required.

### \-1115 INVALID\_TIF[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid timeInForce.

### \-1116 INVALID\_ORDER\_TYPE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid orderType.

### \-1117 INVALID\_SIDE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid side.

### \-1118 EMPTY\_NEW\_CL\_ORD\_ID[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   New client order ID was empty.

### \-1119 EMPTY\_ORG\_CL\_ORD\_ID[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Original client order ID was empty.

### \-1120 BAD\_INTERVAL[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid interval.

### \-1121 BAD\_SYMBOL[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid symbol.

### \-1122 INVALID\_SYMBOLSTATUS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid symbolStatus.

### \-1125 INVALID\_LISTEN\_KEY[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   This listenKey does not exist.

### \-1127 MORE\_THAN\_XX\_HOURS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Lookup interval is too big.
-   More than %s hours between startTime and endTime.

### \-1128 OPTIONAL\_PARAMS\_BAD\_COMBO[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Combination of optional parameters invalid.
-   Combination of optional fields invalid. Recommendation: '%s' and '%s' must both be sent.
-   Fields \[%s\] must be sent together or omitted entirely.
-   Invalid `MDEntryType (269)` combination. BID and OFFER must be requested together.
-   Conflicting fields: \['%s'...\]

### \-1130 INVALID\_PARAMETER[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid data sent for a parameter.
-   Data sent for parameter '%s' is not valid.

### \-1134 BAD\_STRATEGY\_TYPE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `strategyType` was less than 1000000.
-   `TargetStrategy (847)` was less than 1000000.

### \-1135 INVALID\_JSON[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid JSON Request.
-   JSON sent for parameter '%s' is not valid

### \-1139 INVALID\_TICKER\_TYPE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid ticker type.

### \-1145 INVALID\_CANCEL\_RESTRICTIONS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `cancelRestrictions` has to be either `ONLY_NEW` or `ONLY_PARTIALLY_FILLED`.

### \-1151 DUPLICATE\_SYMBOLS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Symbol is present multiple times in the list.

### \-1152 INVALID\_SBE\_HEADER[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid `X-MBX-SBE` header; expected `<SCHEMA_ID>:<VERSION>`.
-   Invalid SBE message header.

### \-1153 UNSUPPORTED\_SCHEMA\_ID[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Unsupported SBE schema ID or version specified in the `X-MBX-SBE` header.
-   Invalid SBE schema ID or version specified.

### \-1155 SBE\_DISABLED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   SBE is not enabled.

### \-1158 OCO\_ORDER\_TYPE\_REJECTED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Order type not supported in OCO.
-   If the order type provided in the `aboveType` and/or `belowType` is not supported.

### \-1160 OCO\_ICEBERGQTY\_TIMEINFORCE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Parameter '%s' is not supported if `aboveTimeInForce`/`belowTimeInForce` is not GTC.
-   If the order type for the above or below leg is `STOP_LOSS_LIMIT`, and `icebergQty` is provided for that leg, the `timeInForce` has to be `GTC` else it will throw an error.
-   `TimeInForce (59)` must be `GTC (1)` when `MaxFloor (111)` is used.

### \-1161 DEPRECATED\_SCHEMA[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Unable to encode the response in SBE schema 'x'. Please use schema 'y' or higher.

### \-1165 BUY\_OCO\_LIMIT\_MUST\_BE\_BELOW[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A limit order in a buy OCO must be below.

### \-1166 SELL\_OCO\_LIMIT\_MUST\_BE\_ABOVE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A limit order in a sell OCO must be above.

### \-1168 BOTH\_OCO\_ORDERS\_CANNOT\_BE\_LIMIT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   At least one OCO order must be contingent.

### \-1169 INVALID\_TAG\_NUMBER[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid tag number.

### \-1170 TAG\_NOT\_DEFINED\_IN\_MESSAGE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Tag '%s' not defined for this message type.

### \-1171 TAG\_APPEARS\_MORE\_THAN\_ONCE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Tag '%s' appears more than once.

### \-1172 TAG\_OUT\_OF\_ORDER[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Tag '%s' specified out of required order.

### \-1173 GROUP\_FIELDS\_OUT\_OF\_ORDER[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Repeating group '%s' fields out of order.

### \-1174 INVALID\_COMPONENT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Component '%s' is incorrectly populated on '%s' order. Recommendation: '%s'

### \-1175 RESET\_SEQ\_NUM\_SUPPORT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Continuation of sequence numbers to new session is currently unsupported. Sequence numbers must be reset for each new session.

### \-1176 ALREADY\_LOGGED\_IN[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   [Logon`<A>`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/fix-api) should only be sent once.

### \-1177 GARBLED\_MESSAGE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `CheckSum(10)` contains an incorrect value.
-   `BeginString (8)` is not the first tag in a message.
-   `MsgType (35)` is not the third tag in a message.
-   `BodyLength (9)` does not contain the correct byte count.
-   Only printable ASCII characters and SOH (Start of Header) are allowed.
-   Tag specified without a value.
-   Invalid encodingType.

### \-1178 BAD\_SENDER\_COMPID[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `SenderCompId(49)` contains an incorrect value. The SenderCompID value should not change throughout the lifetime of a session.

### \-1179 BAD\_SEQ\_NUM[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `MsgSeqNum(34)` contains an unexpected value. Expected: '%d'.

### \-1180 EXPECTED\_LOGON[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   [Logon`<A>`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/fix-api) must be the first message in the session.

### \-1181 TOO\_MANY\_MESSAGES[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Too many messages; current limit is '%d' messages per '%s'.

### \-1182 PARAMS\_BAD\_COMBO[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Conflicting fields: \[%s\]

### \-1183 NOT\_ALLOWED\_IN\_DROP\_COPY\_SESSIONS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Requested operation is not allowed in DropCopy sessions.

### \-1184 DROP\_COPY\_SESSION\_NOT\_ALLOWED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   DropCopy sessions are not supported on this server. Please reconnect to a drop copy server.

### \-1185 DROP\_COPY\_SESSION\_REQUIRED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Only DropCopy sessions are supported on this server. Either reconnect to order entry server or send `DropCopyFlag (9406)` field.

### \-1186 NOT\_ALLOWED\_IN\_ORDER\_ENTRY\_SESSIONS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Requested operation is not allowed in order entry sessions.

### \-1187 NOT\_ALLOWED\_IN\_MARKET\_DATA\_SESSIONS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Requested operation is not allowed in market data sessions.

### \-1188 INCORRECT\_NUM\_IN\_GROUP\_COUNT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Incorrect NumInGroup count for repeating group '%s'.

### \-1189 DUPLICATE\_ENTRIES\_IN\_A\_GROUP[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Group '%s' contains duplicate entries.

### \-1190 INVALID\_REQUEST\_ID[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   `MDReqID (262)` contains a subscription request id that is already in use on this connection.
-   `MDReqID (262)` contains an unsubscription request id that does not match any active subscription.

### \-1191 TOO\_MANY\_SUBSCRIPTIONS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Too many subscriptions. Connection may create up to '%s' subscriptions at a time.
-   Similar subscription is already active on this connection. Symbol='%s', active subscription id: '%s'.

### \-1194 INVALID\_TIME\_UNIT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid value for time unit; expected either MICROSECOND or MILLISECOND.

### \-1196 BUY\_OCO\_STOP\_LOSS\_MUST\_BE\_ABOVE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A stop loss order in a buy OCO must be above.

### \-1197 SELL\_OCO\_STOP\_LOSS\_MUST\_BE\_BELOW[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A stop loss order in a sell OCO must be below.

### \-1198 BUY\_OCO\_TAKE\_PROFIT\_MUST\_BE\_BELOW[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A take profit order in a buy OCO must be below.

### \-1199 SELL\_OCO\_TAKE\_PROFIT\_MUST\_BE\_ABOVE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   A take profit order in a sell OCO must be above.

### \-1210 INVALID\_PEG\_PRICE\_TYPE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid pegPriceType.

### \-1211 INVALID\_PEG\_OFFSET\_TYPE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid pegOffsetType.

### \-1220 SYMBOL\_DOES\_NOT\_MATCH\_STATUS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   The symbol's status does not match the requested symbolStatus.

### \-1221 INVALID\_SBE\_MESSAGE\_FIELD[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid/missing field(s) in SBE message.

### \-1222 OPO\_WORKING\_MUST\_BE\_BUY[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Working order in an OPO list must be a bid.

### \-1223 OPO\_PENDING\_MUST\_BE\_SELL[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Pending orders in an OPO list must be asks.

### \-1224 WORKING\_PARAM\_REQUIRED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Working order must include the '{param}' tag.

### \-1225 PENDING\_PARAM\_NOT\_REQUIRED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Pending orders should not include the '%s' tag.

### \-2010 NEW\_ORDER\_REJECTED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   NEW\_ORDER\_REJECTED

### \-2011 CANCEL\_REJECTED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   CANCEL\_REJECTED

### \-2013 NO\_SUCH\_ORDER[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Order does not exist.

### \-2014 BAD\_API\_KEY\_FMT[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   API-key format invalid.

### \-2015 REJECTED\_MBX\_KEY[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Invalid API-key, IP, or permissions for action.

### \-2016 NO\_TRADING\_WINDOW[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   No trading window could be found for the symbol. Try ticker/24hrs instead.

### \-2026 ORDER\_ARCHIVED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Order was canceled or expired with no executed qty over 90 days ago and has been archived.

### \-2035 SUBSCRIPTION\_ACTIVE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   User Data Stream subscription already active.

### \-2036 SUBSCRIPTION\_INACTIVE[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   User Data Stream subscription not active.

### \-2039 CLIENT\_ORDER\_ID\_INVALID[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Client order ID is not correct for this order ID.

### \-2042 MAXIMUM\_SUBSCRIPTION\_IDS[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   Maximum subscription ID reached for this connection.

## Messages for -1010 ERROR\_MSG\_RECEIVED, -2010 NEW\_ORDER\_REJECTED, -2011 CANCEL\_REJECTED, and -2038 ORDER\_AMEND\_REJECTED[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

This code is sent when an error has been returned by the matching engine. The following messages which will indicate the specific error:

Error message

Description

"Unknown order sent."

The order (by either `orderId`, `clOrdId`, `origClOrdId`) could not be found.

"Duplicate order sent."

The `clOrdId` is already in use.

"Market is closed."

The symbol is not trading.

"Account has insufficient balance for requested action."

Not enough funds to complete the action.

"Market orders are not supported for this symbol."

`MARKET` is not enabled on the symbol.

"Iceberg orders are not supported for this symbol."

`icebergQty` is not enabled on the symbol.

"Stop loss orders are not supported for this symbol."

`STOP_LOSS` is not enabled on the symbol.

"Stop loss limit orders are not supported for this symbol."

`STOP_LOSS_LIMIT` is not enabled on the symbol.

"Take profit orders are not supported for this symbol."

`TAKE_PROFIT` is not enabled on the symbol.

"Take profit limit orders are not supported for this symbol."

`TAKE_PROFIT_LIMIT` is not enabled on the symbol.

"Order amend is not supported for this symbol."

Order amend keep priority is not enabled on the symbol.

"Price \* QTY is zero or less."

`price` \* `quantity` is too low.

"IcebergQty exceeds QTY."

`icebergQty` must be less than the order quantity.

"This action is disabled on this account."

Contact customer support; some actions have been disabled on the account.

"This account may not place or cancel orders."

Contact customer support; the account has trading ability disabled.

"Unsupported order combination"

The `orderType`, `timeInForce`, `stopPrice`, and/or `icebergQty` combination isn't allowed.

"Order would trigger immediately."

The order's stop price is not valid when compared to the last traded price.

"Cancel order is invalid. Check origClOrdId and orderId."

No `origClOrdId` or `orderId` was sent in.

"Order would immediately match and take."

`LIMIT_MAKER` order type would immediately match and trade, and not be a pure maker order.

"The relationship of the prices for the orders is not correct."

The prices set in the `OCO` is breaking the Price restrictions.  
If the `aboveType` is `LIMIT_MAKER` and the `belowType` is either a `STOP_LOSS` or `STOP_LOSS_LIMIT`:  
`abovePrice` > Last Traded Price > `belowStopPrice`.  
If the `aboveType` is `STOP_LOSS` or `STOP_LOSS_LIMIT`, and the `belowType` is `LIMIT_MAKER`:  
`aboveStopPrice` > Last Traded Price > `belowPrice`.

"OCO orders are not supported for this symbol"

`OCO` is not enabled on the symbol.

"Quote order qty market orders are not support for this symbol."

`MARKET` orders using the parameter `quoteOrderQty` are not enabled on the symbol.

"Trailing stop orders are not supported for this symbol."

Orders using `trailingDelta` are not enabled on the symbol.

"Order cancel-replace is not supported for this symbol."

`POST /api/v3/order/cancelReplace` (REST API) or `order.cancelReplace` (WebSocket API) is not enabled on the symbol.

"This symbol is not permitted for this account."

Account and symbol do not have the same permissions. (e.g. `SPOT`, `MARGIN`, etc)

"This symbol is restricted for this account."

Account is unable to trade on that symbol. (e.g. An `ISOLATED_MARGIN` account cannot place `SPOT` orders.)

"Order was not canceled due to cancel restrictions."

Either `cancelRestrictions` was set to `ONLY_NEW` but the order status was not `NEW`  
or  
`cancelRestrictions` was set to `ONLY_PARTIALLY_FILLED` but the order status was not `PARTIALLY_FILLED`.

"Rest API trading is not enabled." / "WebSocket API trading is not enabled."

Order is being placed or a server that is not configured to allow access to `TRADE` endpoints.

"FIX API trading is not enabled.

Order is placed on a FIX server that is not TRADE enabled.

"Order book liquidity is less than `LOT_SIZE` filter minimum quantity."

Quote quantity market orders cannot be placed when the order book liquidity is less than minimum quantity configured for the `LOT_SIZE` filter.

"Order book liquidity is less than `MARKET_LOT_SIZE` filter minimum quantity."

Quote quantity market orders cannot be placed when the order book liquidity is less than the minimum quantity for `MARKET_LOT_SIZE` filter.

"Order book liquidity is less than symbol minimum quantity."

Quote quantity market orders cannot be placed when there are no orders on the book.

"Order amend (quantity increase) is not supported."

`newQty` must be less than the order quantity.

"The requested action would change no state; rejecting".

The request sent would not have changed the status quo.  
  
(e.g. `newQty` cannot equal the order quantity.)

"Pegged orders are not supported for this symbol."

`pegInstructionsAllowed` has not been enabled.

"This order type may not use pegged price."

You are using parameter `pegPriceType` with an unsupported order type. (e.g. `MARKET`)

"This price peg cannot be used with this order type."

You are using `pegPriceType`\=`MARKET_PEG` for a `LIMIT_MAKER` order.

"Order book liquidity is too low for this pegged order."

The order book doesn’t have the best price level to peg the price to.

OPO orders are not supported for this symbol.

Order amend (pending OPO order) is not supported.

You cannot amend the pending quantity of an OPO order

## Errors regarding placing orders via cancelReplace[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

### \-2021 Order cancel-replace partially failed[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   This code is sent when either the cancellation of the order failed or the new order placement failed but not both.

### \-2022 Order cancel-replace failed.[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

-   This code is sent when both the cancellation of the order failed and the new order placement failed.

## Filter failures[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)

Error message

Description

"Filter failure: PRICE\_FILTER"

`price` is too high, too low, and/or not following the tick size rule for the symbol.

"Filter failure: PERCENT\_PRICE"

`price` is X% too high or X% too low from the average weighted price over the last Y minutes.

"Filter failure: LOT\_SIZE"

`quantity` is too high, too low, and/or not following the step size rule for the symbol.

"Filter failure: MIN\_NOTIONAL"

`price` \* `quantity` is too low to be a valid order for the symbol.

"Filter failure: NOTIONAL"

`price` \* `quantity` is not within range of the `minNotional` and `maxNotional`

"Filter failure: ICEBERG\_PARTS"

`ICEBERG` order would break into too many parts; icebergQty is too small.

"Filter failure: MARKET\_LOT\_SIZE"

`MARKET` order's `quantity` is too high, too low, and/or not following the step size rule for the symbol.

"Filter failure: MAX\_POSITION"

The account's position has reached the maximum defined limit.  
This is composed of the sum of the balance of the base asset, and the sum of the quantity of all open `BUY` orders.

"Filter failure: MAX\_NUM\_ORDERS"

Account has too many open orders on the symbol.

"Filter failure: MAX\_NUM\_ALGO\_ORDERS"

Account has too many open stop loss and/or take profit orders on the symbol.

"Filter failure: MAX\_NUM\_ICEBERG\_ORDERS"

Account has too many open iceberg orders on the symbol.

"Filter failure: MAX\_NUM\_ORDER\_AMENDS"

Account has made too many amendments to a single order on the symbol.

"Filter failure: MAX\_NUM\_ORDER\_LISTS"

Account has too many open order lists on the symbol.

"Filter failure: TRAILING\_DELTA"

`trailingDelta` is not within the defined range of the filter for that order type.

"Filter failure: EXCHANGE\_MAX\_NUM\_ORDERS"

Account has too many open orders on the exchange.

"Filter failure: EXCHANGE\_MAX\_NUM\_ALGO\_ORDERS"

Account has too many open stop loss and/or take profit orders on the exchange.

"Filter failure: EXCHANGE\_MAX\_NUM\_ICEBERG\_ORDERS"

Account has too many open iceberg orders on the exchange.

"Filter failure: EXCHANGE\_MAX\_NUM\_ORDER\_LISTS"

Account has too many open order lists on the exchange.

-   [10xx - General Server or Network issues](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1000 UNKNOWN](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1001 DISCONNECTED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1002 UNAUTHORIZED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1003 TOO\_MANY\_REQUESTS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1006 UNEXPECTED\_RESP](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1007 TIMEOUT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1008 SERVER\_BUSY](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1013 INVALID\_MESSAGE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1014 UNKNOWN\_ORDER\_COMPOSITION](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1015 TOO\_MANY\_ORDERS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1016 SERVICE\_SHUTTING\_DOWN](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1020 UNSUPPORTED\_OPERATION](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1021 INVALID\_TIMESTAMP](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1022 INVALID\_SIGNATURE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1033 COMP\_ID\_IN\_USE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1034 TOO\_MANY\_CONNECTIONS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1035 LOGGED\_OUT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
-   [11xx - Request issues](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1100 ILLEGAL\_CHARS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1101 TOO\_MANY\_PARAMETERS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1103 UNKNOWN\_PARAM](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1104 UNREAD\_PARAMETERS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1105 PARAM\_EMPTY](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1106 PARAM\_NOT\_REQUIRED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1108 PARAM\_OVERFLOW](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1111 BAD\_PRECISION](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1112 NO\_DEPTH](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1114 TIF\_NOT\_REQUIRED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1115 INVALID\_TIF](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1116 INVALID\_ORDER\_TYPE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1117 INVALID\_SIDE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1118 EMPTY\_NEW\_CL\_ORD\_ID](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1119 EMPTY\_ORG\_CL\_ORD\_ID](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1120 BAD\_INTERVAL](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1121 BAD\_SYMBOL](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1122 INVALID\_SYMBOLSTATUS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1125 INVALID\_LISTEN\_KEY](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1127 MORE\_THAN\_XX\_HOURS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1128 OPTIONAL\_PARAMS\_BAD\_COMBO](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1130 INVALID\_PARAMETER](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1134 BAD\_STRATEGY\_TYPE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1135 INVALID\_JSON](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1139 INVALID\_TICKER\_TYPE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1145 INVALID\_CANCEL\_RESTRICTIONS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1151 DUPLICATE\_SYMBOLS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1152 INVALID\_SBE\_HEADER](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1153 UNSUPPORTED\_SCHEMA\_ID](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1155 SBE\_DISABLED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1158 OCO\_ORDER\_TYPE\_REJECTED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1160 OCO\_ICEBERGQTY\_TIMEINFORCE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1161 DEPRECATED\_SCHEMA](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1165 BUY\_OCO\_LIMIT\_MUST\_BE\_BELOW](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1166 SELL\_OCO\_LIMIT\_MUST\_BE\_ABOVE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1168 BOTH\_OCO\_ORDERS\_CANNOT\_BE\_LIMIT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1169 INVALID\_TAG\_NUMBER](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1170 TAG\_NOT\_DEFINED\_IN\_MESSAGE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1171 TAG\_APPEARS\_MORE\_THAN\_ONCE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1172 TAG\_OUT\_OF\_ORDER](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1173 GROUP\_FIELDS\_OUT\_OF\_ORDER](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1174 INVALID\_COMPONENT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1175 RESET\_SEQ\_NUM\_SUPPORT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1176 ALREADY\_LOGGED\_IN](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1177 GARBLED\_MESSAGE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1178 BAD\_SENDER\_COMPID](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1179 BAD\_SEQ\_NUM](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1180 EXPECTED\_LOGON](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1181 TOO\_MANY\_MESSAGES](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1182 PARAMS\_BAD\_COMBO](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1183 NOT\_ALLOWED\_IN\_DROP\_COPY\_SESSIONS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1184 DROP\_COPY\_SESSION\_NOT\_ALLOWED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1185 DROP\_COPY\_SESSION\_REQUIRED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1186 NOT\_ALLOWED\_IN\_ORDER\_ENTRY\_SESSIONS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1187 NOT\_ALLOWED\_IN\_MARKET\_DATA\_SESSIONS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1188 INCORRECT\_NUM\_IN\_GROUP\_COUNT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1189 DUPLICATE\_ENTRIES\_IN\_A\_GROUP](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1190 INVALID\_REQUEST\_ID](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1191 TOO\_MANY\_SUBSCRIPTIONS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1194 INVALID\_TIME\_UNIT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1196 BUY\_OCO\_STOP\_LOSS\_MUST\_BE\_ABOVE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1197 SELL\_OCO\_STOP\_LOSS\_MUST\_BE\_BELOW](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1198 BUY\_OCO\_TAKE\_PROFIT\_MUST\_BE\_BELOW](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1199 SELL\_OCO\_TAKE\_PROFIT\_MUST\_BE\_ABOVE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1210 INVALID\_PEG\_PRICE\_TYPE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1211 INVALID\_PEG\_OFFSET\_TYPE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1220 SYMBOL\_DOES\_NOT\_MATCH\_STATUS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1221 INVALID\_SBE\_MESSAGE\_FIELD](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1222 OPO\_WORKING\_MUST\_BE\_BUY](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1223 OPO\_PENDING\_MUST\_BE\_SELL](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1224 WORKING\_PARAM\_REQUIRED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-1225 PENDING\_PARAM\_NOT\_REQUIRED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2010 NEW\_ORDER\_REJECTED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2011 CANCEL\_REJECTED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2013 NO\_SUCH\_ORDER](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2014 BAD\_API\_KEY\_FMT](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2015 REJECTED\_MBX\_KEY](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2016 NO\_TRADING\_WINDOW](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2026 ORDER\_ARCHIVED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2035 SUBSCRIPTION\_ACTIVE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2036 SUBSCRIPTION\_INACTIVE](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2039 CLIENT\_ORDER\_ID\_INVALID](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2042 MAXIMUM\_SUBSCRIPTION\_IDS](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
-   [Messages for -1010 ERROR\_MSG\_RECEIVED, -2010 NEW\_ORDER\_REJECTED, -2011 CANCEL\_REJECTED, and -2038 ORDER\_AMEND\_REJECTED](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
-   [Errors regarding placing orders via cancelReplace](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2021 Order cancel-replace partially failed](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   [\-2022 Order cancel-replace failed.](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
-   [Filter failures](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
