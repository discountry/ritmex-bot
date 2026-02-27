---
title: "Error Code | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/error-code"
fetched_at: "2026-01-27T05:28:09.524Z"
---
# Error Codes

> Here is the error JSON payload:

```
{  "code":-1121,  "msg":"Invalid symbol."}
```

Errors consist of two parts: an error code and a message.  
Codes are universal,but messages can vary.

## 10xx - General Server or Network issues[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

### \-1000 UNKNOWN[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   An unknown error occurred while processing the request.

### \-1001 DISCONNECTED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Internal error; unable to process your request. Please try again.

### \-1002 UNAUTHORIZED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   You are not authorized to execute this request.

### \-1008 TOO\_MANY\_REQUESTS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Too many requests queued.
-   Too much request weight used; please use the websocket for live updates to avoid polling the API.
-   Too much request weight used; current limit is %s request weight per %s %s. Please use the websocket for live updates to avoid polling the API.
-   Way too much request weight used; IP banned until %s. Please use the websocket for live updates to avoid bans.

### \-1014 UNKNOWN\_ORDER\_COMPOSITION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Unsupported order combination.

### \-1015 TOO\_MANY\_ORDERS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Too many new orders.
-   Too many new orders; current limit is %s orders per %s.

### \-1016 SERVICE\_SHUTTING\_DOWN[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   This service is no longer available.

### \-1020 UNSUPPORTED\_OPERATION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   This operation is not supported.

### \-1021 INVALID\_TIMESTAMP[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Timestamp for this request is outside of the recvWindow.
-   Timestamp for this request was 1000ms ahead of the server's time.

### \-1022 INVALID\_SIGNATURE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Signature for this request is not valid.

## 11xx - 2xxx Request issues[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

### \-1100 ILLEGAL\_CHARS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Illegal characters found in a parameter.
-   Illegal characters found in a parameter. %s
-   Illegal characters found in parameter `%s`; legal range is `%s`.

### \-1101 TOO\_MANY\_PARAMETERS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Too many parameters sent for this endpoint.
-   Too many parameters; expected `%s` and received `%s`.
-   Duplicate values for a parameter detected.

### \-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   A mandatory parameter was not sent, was empty/null, or malformed.
-   Mandatory parameter `%s` was not sent, was empty/null, or malformed.
-   Param `%s` or `%s` must be sent, but both were empty/null!

### \-1103 UNKNOWN\_PARAM[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   An unknown parameter was sent.

### \-1104 UNREAD\_PARAMETERS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Not all sent parameters were read.
-   Not all sent parameters were read; read `%s` parameter(s) but was sent `%s`.

### \-1105 PARAM\_EMPTY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   A parameter was empty.
-   Parameter `%s` was empty.

### \-1106 PARAM\_NOT\_REQUIRED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   A parameter was sent when not required.
-   Parameter `%s` sent when not required.

### \-1111 BAD\_PRECISION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Precision is over the maximum defined for this asset.

### \-1115 INVALID\_TIF[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid timeInForce.

### \-1116 INVALID\_ORDER\_TYPE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid orderType.

### \-1117 INVALID\_SIDE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid side.

### \-1118 EMPTY\_NEW\_CL\_ORD\_ID[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   New client order ID was empty.

### \-1119 EMPTY\_ORG\_CL\_ORD\_ID[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Original client order ID was empty.

### \-1120 BAD\_INTERVAL[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid interval.

### \-1121 BAD\_SYMBOL[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid symbol.

### \-1125 INVALID\_LISTEN\_KEY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   This listenKey does not exist.

### \-1127 MORE\_THAN\_XX\_HOURS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Lookup interval is too big.
-   More than %s hours between startTime and endTime.

### \-1128 BAD\_CONTRACT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid underlying

### \-1129 BAD\_CURRENCY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid asset。

### \-1130 INVALID\_PARAMETER[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid data sent for a parameter.
-   Data sent for paramter `%s` is not valid.

### \-1131 BAD\_RECV\_WINDOW[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   recvWindow must be less than 60000

### \-2010 NEW\_ORDER\_REJECTED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   NEW\_ORDER\_REJECTED

### \-2013 NO\_SUCH\_ORDER[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Order does not exist.

### \-2014 BAD\_API\_KEY\_FMT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   API-key format invalid.

### \-2015 INVALID\_API\_KEY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid API-key, IP, or permissions for action.

### \-2018 BALANCE\_NOT\_SUFFICIENT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Balance is insufficient.

### \-2027 OPTION\_MARGIN\_NOT\_SUFFICIENT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Option margin is insufficient.

## 3xxx-5xxx Filters and other issues[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

### \-3029 TRANSFER\_FAILED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Asset transfer fail.

### \-4001 PRICE\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Price less than 0.

### \-4002 PRICE\_GREATER\_THAN\_MAX\_PRICE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Price greater than max price.

### \-4003 QTY\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quantity less than zero.

### \-4004 QTY\_LESS\_THAN\_MIN\_QTY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quantity less than min quantity.

### \-4005 QTY\_GREATER\_THAN\_MAX\_QTY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quantity greater than max quantity.

### \-4013 PRICE\_LESS\_THAN\_MIN\_PRICE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Price less than min price.

### \-4029 INVALID\_TICK\_SIZE\_PRECISION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Tick size precision is invalid.

### \-4030 INVALID\_QTY\_PRECISION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Step size precision is invalid.

### \-4055 AMOUNT\_MUST\_BE\_POSITIVE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Amount must be positive.

### \-4056 INVALID\_AMOUNT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Amount is invalid.

### \-4078 OPTIONS\_COMMON\_ERROR[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   options internal error

### \-5001 USER\_EXIST[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Option user already exist

### \-5002 USER\_NOT\_ACCESS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Option user not access

### \-5003 BAD\_INVITE\_CODE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid invite code

### \-5004 USED\_INVITE\_CODE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invite code has bean used

### \-5005 BLACK\_COUNTRY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Black country

### \-5006 ITEMS\_EXIST[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Items '%s' already exist

### \-5007 USER\_API\_EXIST[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   User api already exist

### \-5008 KYC\_NOT\_PASS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   User kyc not pass

### \-5009 IP\_COUNTRY\_BLACK[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Restricted jurisdiction ip address

### \-5010 NOT\_ENOUGH\_POSITION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   User doesn't have enough position to sell

### \-6001 INVALID\_MMP\_WINDOW\_TIME\_LIMIT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid mmp window time limit

### \-6002 INVALID\_MMP\_FROZEN\_TIME\_LIMIT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid mmp frozen time limit

### \-6003 INVALID\_UNDERLYING[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid underlying

### \-6004 MMP\_UNDERLYING\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Underlying not found

### \-6005 IS\_NOT\_MARKET\_MAKER[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   It is not market maker

### \-6006 MMP\_RULES\_NOT\_EXISTING[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Mmp rules are not existing

### \-6007 MMP\_ERROR\_UNKNOWN[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Mmp unknown error

### \-6008 INVALID\_LIMIT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   parameter 'limit' is invalid.

### \-6009 INVALID\_COUNTDOWN\_TIME[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   countdownTime must be no less than 5000 or equal to 0

### \-6010 OPEN\_INTEREST\_ERR\_DATA[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   open interest error data.

### \-6011 EXCEED\_MAXIMUM\_BATCH\_ORDERS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Maximum 10 orders in one batchOrder request.

### \-6012 EXCEED\_MAXIMUM\_BLOCK\_ORDER\_LEGS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Exceed maximum number of legs in one block order request.

### \-6013 BLOCK\_ORDER\_LEGS\_WITH\_DUPLICATE\_SYMBOL[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Duplicate symbol in one block order request.

### \-6014 GRFQ\_INVALID\_LEGS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid legs

### \-6015 GRFQ\_QTY\_IS\_NOT\_MULTIPLE\_OF\_MINIMUM\_QTY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quantity is not multiple of minimum quantity

### \-6016 GRFQ\_QUOTE\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quote is not found

### \-6017 GRFQ\_QUOTE\_NOT\_ENOUGH\_QTY\_LEFT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Not enough quantity left

### \-6018 GRFQ\_QUOTE\_REQUEST\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quote request is not found

### \-6019 GRFQ\_QUOTE\_INVALID\_EXPIRE\_TIME[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid quote expire time

### \-6020 GRFQ\_QUOTE\_EXPIRED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quote expired

### \-6021 GRFQ\_INVALID\_SIDE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid side

### \-6022 GRFQ\_INVALID\_USER[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Not Global RFQ user

### \-6023 SELF\_TRADE\_PREVENTION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Self trade prevention

### \-6024 CHANGE\_USER\_FLAG\_FAILED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Change user flag failed

### \-6025 GRFQ\_INVALID\_QUOTE\_PRICE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid quote price

### \-6026 INVALID\_QTY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid qty

### \-6027 INVALID\_PRICE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid price

### \-6028 ORDER\_IS\_FINAL[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Order is in final state

### \-6029 PARAMETER\_IS\_REQUIRED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   %s is required

### \-6030 INVALID\_TIME\_INTERVAL[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid time interval.

### \-6031 START\_TIME\_GREATER\_THAN\_END\_TIME[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Start time is greater than end time.

### \-6032 HAS\_OPEN\_ORDER[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Has open order.

### \-6033 HAS\_NEGATIVE\_BALANCE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Has negative balance.

### \-6034 HAS\_POSITION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Has position.

### \-6035 NO\_NEED\_TO\_CHANGE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   No need to change.

### \-6036 NO\_PERMISSION\_TO\_CHANGE[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   no permission to change.

### \-6037 NO\_RECORDS\_FOUND[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   No records found.

### \-6038 SCALE\_NOT\_MATCH[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   scale not match.

### \-6039 INVALID\_STEP\_SIZE\_PRECISION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Step size precision is invalid.

### \-6040 INVALID\_QTYLIMIT\_DELTALIMIT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Invalid qtyLimit or deltaLimit.

### \-6041 START\_TRADING\_MUST\_SLOWLY[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Start Trading Must Slowly..

### \-6042 INDEX\_COMMISSION\_NOT\_MATCH[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Index Commission Not Match..

### \-6043 INDEX\_RISKPARAMETER\_NOT\_MATCH[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Index RiskParameter Not Match..

### \-6044 CLI\_ORD\_ID\_ERROR[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   clientOrderId is duplicated

### \-6045 REDUCE\_ONLY\_REJECT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Reduce-only order rejected. The new reduce-only order conflicts with existing open orders. Please cancel the conflicting orders and resubmit.

### \-6046 FOK\_ORDER\_REJECT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Due to the order could not be filled immediately, the FOK order has been rejected.

### \-6047 GTX\_ORDER\_REJECT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Due to the order could not be executed as maker, the Post Only order will be rejected.

### \-6048 INVALID\_BLOCK\_ORDER[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Block order parameter is invalid

### \-6049 SYMBOL\_NOT\_TRADING[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   this symbol is not in trading status

### \-6050 MAX\_OPEN\_ORDERS\_ON\_SYMBOL\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Maximum open orders reached for this symbol. Please cancel existing orders and try again.

### \-6051 MAX\_OPEN\_ORDERS\_ON\_INDEX\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Maximum open orders reached for this underlying. Please cancel existing orders and try again.

### \-6052 MAX\_SHORT\_POSITION\_ON\_SYMBOL\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Maximum short position size reached for this symbol

### \-6053 MAX\_SHORT\_POSITION\_ON\_INDEX\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Maximum short position size reached for this underlying

### \-6054 MAX\_QUANTITY\_ON\_SINGLE\_ORDER\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Quantity greater than max quantity

### \-6055 USER\_LIQUIDATING[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   User is in liquidation process

### \-6056 REDUCE\_ONLY\_MARGIN\_CHECK\_FAILED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Reduce-only order failed. Your new reduce-only order, when combined with existing same-side open orders, would flip your position and cause insufficient margin. Please cancel those open orders and try again.

### \-6057 WRITER\_CANT\_NAKED\_SELL[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   The current symbol is not eligible for option writing.

### \-6058 MMP\_TRIGGERED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   MMP triggered. Please reset MMP config

### \-6059 USER\_IN\_LIQUIDATION[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   User is in liquidation process

### \-6060 LOCKED\_BALANCE\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   OTC order fail due to unable to lock balance

### \-6061 LOCKED\_OTC\_ORDER\_NOT\_FOUNT[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   OTC order fail due to unable to lock order

### \-6062 INVALID\_USER\_STATUS[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Operation is not supported for current user status

### \-6063 CANCEL\_REJECTED[​](https://developers.binance.com/docs/derivatives/options-trading/error-code)

-   Cancel rejected by system

-   [10xx - General Server or Network issues](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1000 UNKNOWN](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1001 DISCONNECTED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1002 UNAUTHORIZED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1008 TOO\_MANY\_REQUESTS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1014 UNKNOWN\_ORDER\_COMPOSITION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1015 TOO\_MANY\_ORDERS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1016 SERVICE\_SHUTTING\_DOWN](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1020 UNSUPPORTED\_OPERATION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1021 INVALID\_TIMESTAMP](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1022 INVALID\_SIGNATURE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
-   [11xx - 2xxx Request issues](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1100 ILLEGAL\_CHARS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1101 TOO\_MANY\_PARAMETERS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1103 UNKNOWN\_PARAM](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1104 UNREAD\_PARAMETERS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1105 PARAM\_EMPTY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1106 PARAM\_NOT\_REQUIRED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1111 BAD\_PRECISION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1115 INVALID\_TIF](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1116 INVALID\_ORDER\_TYPE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1117 INVALID\_SIDE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1118 EMPTY\_NEW\_CL\_ORD\_ID](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1119 EMPTY\_ORG\_CL\_ORD\_ID](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1120 BAD\_INTERVAL](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1121 BAD\_SYMBOL](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1125 INVALID\_LISTEN\_KEY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1127 MORE\_THAN\_XX\_HOURS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1128 BAD\_CONTRACT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1129 BAD\_CURRENCY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1130 INVALID\_PARAMETER](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-1131 BAD\_RECV\_WINDOW](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-2010 NEW\_ORDER\_REJECTED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-2013 NO\_SUCH\_ORDER](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-2014 BAD\_API\_KEY\_FMT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-2015 INVALID\_API\_KEY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-2018 BALANCE\_NOT\_SUFFICIENT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-2027 OPTION\_MARGIN\_NOT\_SUFFICIENT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
-   [3xxx-5xxx Filters and other issues](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-3029 TRANSFER\_FAILED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4001 PRICE\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4002 PRICE\_GREATER\_THAN\_MAX\_PRICE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4003 QTY\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4004 QTY\_LESS\_THAN\_MIN\_QTY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4005 QTY\_GREATER\_THAN\_MAX\_QTY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4013 PRICE\_LESS\_THAN\_MIN\_PRICE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4029 INVALID\_TICK\_SIZE\_PRECISION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4030 INVALID\_QTY\_PRECISION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4055 AMOUNT\_MUST\_BE\_POSITIVE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4056 INVALID\_AMOUNT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-4078 OPTIONS\_COMMON\_ERROR](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5001 USER\_EXIST](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5002 USER\_NOT\_ACCESS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5003 BAD\_INVITE\_CODE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5004 USED\_INVITE\_CODE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5005 BLACK\_COUNTRY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5006 ITEMS\_EXIST](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5007 USER\_API\_EXIST](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5008 KYC\_NOT\_PASS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5009 IP\_COUNTRY\_BLACK](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-5010 NOT\_ENOUGH\_POSITION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6001 INVALID\_MMP\_WINDOW\_TIME\_LIMIT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6002 INVALID\_MMP\_FROZEN\_TIME\_LIMIT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6003 INVALID\_UNDERLYING](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6004 MMP\_UNDERLYING\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6005 IS\_NOT\_MARKET\_MAKER](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6006 MMP\_RULES\_NOT\_EXISTING](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6007 MMP\_ERROR\_UNKNOWN](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6008 INVALID\_LIMIT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6009 INVALID\_COUNTDOWN\_TIME](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6010 OPEN\_INTEREST\_ERR\_DATA](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6011 EXCEED\_MAXIMUM\_BATCH\_ORDERS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6012 EXCEED\_MAXIMUM\_BLOCK\_ORDER\_LEGS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6013 BLOCK\_ORDER\_LEGS\_WITH\_DUPLICATE\_SYMBOL](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6014 GRFQ\_INVALID\_LEGS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6015 GRFQ\_QTY\_IS\_NOT\_MULTIPLE\_OF\_MINIMUM\_QTY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6016 GRFQ\_QUOTE\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6017 GRFQ\_QUOTE\_NOT\_ENOUGH\_QTY\_LEFT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6018 GRFQ\_QUOTE\_REQUEST\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6019 GRFQ\_QUOTE\_INVALID\_EXPIRE\_TIME](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6020 GRFQ\_QUOTE\_EXPIRED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6021 GRFQ\_INVALID\_SIDE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6022 GRFQ\_INVALID\_USER](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6023 SELF\_TRADE\_PREVENTION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6024 CHANGE\_USER\_FLAG\_FAILED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6025 GRFQ\_INVALID\_QUOTE\_PRICE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6026 INVALID\_QTY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6027 INVALID\_PRICE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6028 ORDER\_IS\_FINAL](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6029 PARAMETER\_IS\_REQUIRED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6030 INVALID\_TIME\_INTERVAL](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6031 START\_TIME\_GREATER\_THAN\_END\_TIME](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6032 HAS\_OPEN\_ORDER](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6033 HAS\_NEGATIVE\_BALANCE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6034 HAS\_POSITION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6035 NO\_NEED\_TO\_CHANGE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6036 NO\_PERMISSION\_TO\_CHANGE](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6037 NO\_RECORDS\_FOUND](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6038 SCALE\_NOT\_MATCH](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6039 INVALID\_STEP\_SIZE\_PRECISION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6040 INVALID\_QTYLIMIT\_DELTALIMIT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6041 START\_TRADING\_MUST\_SLOWLY](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6042 INDEX\_COMMISSION\_NOT\_MATCH](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6043 INDEX\_RISKPARAMETER\_NOT\_MATCH](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6044 CLI\_ORD\_ID\_ERROR](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6045 REDUCE\_ONLY\_REJECT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6046 FOK\_ORDER\_REJECT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6047 GTX\_ORDER\_REJECT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6048 INVALID\_BLOCK\_ORDER](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6049 SYMBOL\_NOT\_TRADING](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6050 MAX\_OPEN\_ORDERS\_ON\_SYMBOL\_EXCEEDED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6051 MAX\_OPEN\_ORDERS\_ON\_INDEX\_EXCEEDED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6052 MAX\_SHORT\_POSITION\_ON\_SYMBOL\_EXCEEDED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6053 MAX\_SHORT\_POSITION\_ON\_INDEX\_EXCEEDED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6054 MAX\_QUANTITY\_ON\_SINGLE\_ORDER\_EXCEEDED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6055 USER\_LIQUIDATING](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6056 REDUCE\_ONLY\_MARGIN\_CHECK\_FAILED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6057 WRITER\_CANT\_NAKED\_SELL](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6058 MMP\_TRIGGERED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6059 USER\_IN\_LIQUIDATION](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6060 LOCKED\_BALANCE\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6061 LOCKED\_OTC\_ORDER\_NOT\_FOUNT](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6062 INVALID\_USER\_STATUS](https://developers.binance.com/docs/derivatives/options-trading/error-code)
    -   [\-6063 CANCEL\_REJECTED](https://developers.binance.com/docs/derivatives/options-trading/error-code)
