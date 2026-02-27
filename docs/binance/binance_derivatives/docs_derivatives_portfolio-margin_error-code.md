---
title: "Error Code | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/error-code"
fetched_at: "2026-01-27T05:28:19.180Z"
---
# Error Codes

> Here is the error JSON payload:

```
{  "code":-1121,  "msg":"Invalid symbol."}
```

Errors consist of two parts: an error code and a message.  
Codes are universal,but messages can vary.

## 10xx - General Server or Network issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

### \-1000 UNKNOWN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   An unknown error occured while processing the request.

### \-1001 DISCONNECTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Internal error; unable to process your request. Please try again.

### \-1002 UNAUTHORIZED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   You are not authorized to execute this request.

### \-1003 TOO\_MANY\_REQUESTS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Too many requests; current limit is %s requests per minute. Please use the websocket for live updates to avoid polling the API.
-   Way too many requests; IP banned until %s. Please use the websocket for live updates to avoid bans.

### \-1004 DUPLICATE\_IP[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   This IP is already on the white list

### \-1005 NO\_SUCH\_IP[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   No such IP has been white listed

### \-1006 UNEXPECTED\_RESP[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   An unexpected response was received from the message bus. Execution status unknown.

### \-1007 TIMEOUT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Timeout waiting for response from backend server. Send status unknown; execution status unknown.

### \-1008 Request Throttled[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Request throttled by system-level protection. Reduce-only/close-position orders are exempt. Please try again.

### \-1010 ERROR\_MSG\_RECEIVED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   ERROR\_MSG\_RECEIVED.

### \-1011 NON\_WHITE\_LIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   This IP cannot access this route.

### \-1013 INVALID\_MESSAGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   INVALID\_MESSAGE.

### \-1014 UNKNOWN\_ORDER\_COMPOSITION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Unsupported order combination.

### \-1015 TOO\_MANY\_ORDERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Too many new orders.
-   Too many new orders; current limit is %s orders per %s.

### \-1016 SERVICE\_SHUTTING\_DOWN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   This service is no longer available.

### \-1020 UNSUPPORTED\_OPERATION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   This operation is not supported.

### \-1021 INVALID\_TIMESTAMP[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Timestamp for this request is outside of the recvWindow.
-   Timestamp for this request was 1000ms ahead of the server's time.

### \-1022 INVALID\_SIGNATURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Signature for this request is not valid.

### \-1023 START\_TIME\_GREATER\_THAN\_END\_TIME[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Start time is greater than end time.

## 11xx - Request issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

### \-1100 ILLEGAL\_CHARS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Illegal characters found in a parameter.
-   Illegal characters found in parameter '%s'; legal range is '%s'.

### \-1101 TOO\_MANY\_PARAMETERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Too many parameters sent for this endpoint.
-   Too many parameters; expected '%s' and received '%s'.
-   Duplicate values for a parameter detected.

### \-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   A mandatory parameter was not sent, was empty/null, or malformed.
-   Mandatory parameter '%s' was not sent, was empty/null, or malformed.
-   Param '%s' or '%s' must be sent, but both were empty/null!

### \-1103 UNKNOWN\_PARAM[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   An unknown parameter was sent.

### \-1104 UNREAD\_PARAMETERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Not all sent parameters were read.
-   Not all sent parameters were read; read '%s' parameter(s) but was sent '%s'.

### \-1105 PARAM\_EMPTY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   A parameter was empty.
-   Parameter '%s' was empty.

### \-1106 PARAM\_NOT\_REQUIRED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   A parameter was sent when not required.
-   Parameter '%s' sent when not required.

### \-1108 BAD\_ASSET[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid asset.

### \-1109 BAD\_ACCOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid account.

### \-1110 BAD\_INSTRUMENT\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid symbolType.

### \-1111 BAD\_PRECISION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Precision is over the maximum defined for this asset.

### \-1112 NO\_DEPTH[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   No orders on book for symbol.

### \-1113 WITHDRAW\_NOT\_NEGATIVE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Withdrawal amount must be negative.

### \-1114 TIF\_NOT\_REQUIRED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   TimeInForce parameter sent when not required.

### \-1115 INVALID\_TIF[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid timeInForce.

### \-1116 INVALID\_ORDER\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid orderType.

### \-1117 INVALID\_SIDE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid side.

### \-1118 EMPTY\_NEW\_CL\_ORD\_ID[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   New client order ID was empty.

### \-1119 EMPTY\_ORG\_CL\_ORD\_ID[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Original client order ID was empty.

### \-1120 BAD\_INTERVAL[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid interval.

### \-1121 BAD\_SYMBOL[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid symbol.

### \-1125 INVALID\_LISTEN\_KEY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   This listenKey does not exist. Please use `POST /papi/v1/listenKey` to recreate `listenKey`

### \-1127 MORE\_THAN\_XX\_HOURS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Lookup interval is too big.
-   More than %s hours between startTime and endTime.

### \-1128 OPTIONAL\_PARAMS\_BAD\_COMBO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Combination of optional parameters invalid.

### \-1130 INVALID\_PARAMETER[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid data sent for a parameter.
-   Data sent for parameter '%s' is not valid.

### \-1136 INVALID\_NEW\_ORDER\_RESP\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid newOrderRespType.

## 20xx - Processing Issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

### \-2010 NEW\_ORDER\_REJECTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   NEW\_ORDER\_REJECTED

### \-2011 CANCEL\_REJECTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   CANCEL\_REJECTED

### \-2013 NO\_SUCH\_ORDER[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Order does not exist.

### \-2014 BAD\_API\_KEY\_FMT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   API-key format invalid.

### \-2015 REJECTED\_MBX\_KEY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid API-key, IP, or permissions for action.

### \-2016 NO\_TRADING\_WINDOW[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   No trading window could be found for the symbol. Try ticker/24hrs instead.

### \-2018 BALANCE\_NOT\_SUFFICIENT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Balance is insufficient.

### \-2019 MARGIN\_NOT\_SUFFICIEN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Margin is insufficient.

### \-2020 UNABLE\_TO\_FILL[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Unable to fill.

### \-2021 ORDER\_WOULD\_IMMEDIATELY\_TRIGGER[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Order would immediately trigger.

### \-2022 REDUCE\_ONLY\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   ReduceOnly Order is rejected.
-   This indicates the new reduce-only order conflicts with existing open orders; cancel the existing order and resubmit the reduce-only order.

### \-2023 USER\_IN\_LIQUIDATION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   User in liquidation mode now.

### \-2024 POSITION\_NOT\_SUFFICIENT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Position is not sufficient.

### \-2025 MAX\_OPEN\_ORDER\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Reach max open order limit.

### \-2026 REDUCE\_ONLY\_ORDER\_TYPE\_NOT\_SUPPORTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   This OrderType is not supported when reduceOnly.

### \-2027 MAX\_LEVERAGE\_RATIO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Exceeded the maximum allowable position at current leverage.

### \-2028 MIN\_LEVERAGE\_RATIO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Leverage is smaller than permitted: insufficient margin balance.

## 40xx - Filters and other Issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

### \-4000 INVALID\_ORDER\_STATUS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid order status.

### \-4001 PRICE\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price less than 0.

### \-4002 PRICE\_GREATER\_THAN\_MAX\_PRICE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price greater than max price.

### \-4003 QTY\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Quantity less than zero.

### \-4004 QTY\_LESS\_THAN\_MIN\_QTY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Quantity less than min quantity.

### \-4005 QTY\_GREATER\_THAN\_MAX\_QTY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Quantity greater than max quantity.

### \-4006 STOP\_PRICE\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Stop price less than zero.

### \-4007 STOP\_PRICE\_GREATER\_THAN\_MAX\_PRICE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Stop price greater than max price.

### \-4008 TICK\_SIZE\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Tick size less than zero.

### \-4009 MAX\_PRICE\_LESS\_THAN\_MIN\_PRICE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Max price less than min price.

### \-4010 MAX\_QTY\_LESS\_THAN\_MIN\_QTY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Max qty less than min qty.

### \-4011 STEP\_SIZE\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Step size less than zero.

### \-4012 MAX\_NUM\_ORDERS\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Max mum orders less than zero.

### \-4013 PRICE\_LESS\_THAN\_MIN\_PRICE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price less than min price.

### \-4014 PRICE\_NOT\_INCREASED\_BY\_TICK\_SIZE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price not increased by tick size.

### \-4015 INVALID\_CL\_ORD\_ID\_LEN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Client order id is not valid.
-   Client order id length should not be more than 36 chars

### \-4016 PRICE\_HIGHTER\_THAN\_MULTIPLIER\_UP[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price is higher than mark price multiplier cap.

### \-4017 MULTIPLIER\_UP\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Multiplier up less than zero.

### \-4018 MULTIPLIER\_DOWN\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Multiplier down less than zero.

### \-4019 COMPOSITE\_SCALE\_OVERFLOW[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Composite scale too large.

### \-4020 TARGET\_STRATEGY\_INVALID[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Target strategy invalid for orderType '%s',reduceOnly '%b'.

### \-4021 INVALID\_DEPTH\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid depth limit.
-   '%s' is not valid depth limit.

### \-4022 WRONG\_MARKET\_STATUS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   market status sent is not valid.

### \-4023 QTY\_NOT\_INCREASED\_BY\_STEP\_SIZE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Qty not increased by step size.

### \-4024 PRICE\_LOWER\_THAN\_MULTIPLIER\_DOWN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price is lower than mark price multiplier floor.

### \-4025 MULTIPLIER\_DECIMAL\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Multiplier decimal less than zero.

### \-4026 COMMISSION\_INVALID[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Commission invalid.
-   `%s` less than zero.
-   `%s` absolute value greater than `%s`

### \-4027 INVALID\_ACCOUNT\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid account type.

### \-4028 INVALID\_LEVERAGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid leverage
-   Leverage `%s` is not valid
-   Leverage `%s` already exist with `%s`

### \-4029 INVALID\_TICK\_SIZE\_PRECISION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Tick size precision is invalid.

### \-4030 INVALID\_STEP\_SIZE\_PRECISION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Step size precision is invalid.

### \-4031 INVALID\_WORKING\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid parameter working type
-   Invalid parameter working type: `%s`

### \-4032 EXCEED\_MAX\_CANCEL\_ORDER\_SIZE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Exceed maximum cancel order size.
-   Invalid parameter working type: `%s`

### \-4033 INSURANCE\_ACCOUNT\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Insurance account not found.

### \-4044 INVALID\_BALANCE\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Balance Type is invalid.

### \-4045 MAX\_STOP\_ORDER\_EXCEEDED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Reach max stop order limit.

### \-4046 NO\_NEED\_TO\_CHANGE\_MARGIN\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   No need to change margin type.

### \-4047 THERE\_EXISTS\_OPEN\_ORDERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Margin type cannot be changed if there exists open orders.

### \-4048 THERE\_EXISTS\_QUANTITY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Margin type cannot be changed if there exists position.

### \-4049 ADD\_ISOLATED\_MARGIN\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Add margin only support for isolated position.

### \-4050 CROSS\_BALANCE\_INSUFFICIENT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Cross balance insufficient.

### \-4051 ISOLATED\_BALANCE\_INSUFFICIENT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Isolated balance insufficient.

### \-4052 NO\_NEED\_TO\_CHANGE\_AUTO\_ADD\_MARGIN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   No need to change auto add margin.

### \-4053 AUTO\_ADD\_CROSSED\_MARGIN\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Auto add margin only support for isolated position.

### \-4054 ADD\_ISOLATED\_MARGIN\_NO\_POSITION\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Cannot add position margin: position is 0.

### \-4055 AMOUNT\_MUST\_BE\_POSITIVE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Amount must be positive.

### \-4056 INVALID\_API\_KEY\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid api key type.

### \-4057 INVALID\_RSA\_PUBLIC\_KEY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid api public key

### \-4058 MAX\_PRICE\_TOO\_LARGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   maxPrice and priceDecimal too large,please check.

### \-4059 NO\_NEED\_TO\_CHANGE\_POSITION\_SIDE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   No need to change position side.

### \-4060 INVALID\_POSITION\_SIDE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid position side.

### \-4061 POSITION\_SIDE\_NOT\_MATCH[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Order's position side does not match user's setting.

### \-4062 REDUCE\_ONLY\_CONFLICT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid or improper reduceOnly value.

### \-4063 INVALID\_OPTIONS\_REQUEST\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid options request type

### \-4064 INVALID\_OPTIONS\_TIME\_FRAME[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid options time frame

### \-4065 INVALID\_OPTIONS\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid options amount

### \-4066 INVALID\_OPTIONS\_EVENT\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid options event type

### \-4067 POSITION\_SIDE\_CHANGE\_EXISTS\_OPEN\_ORDERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Position side cannot be changed if there exists open orders.

### \-4068 POSITION\_SIDE\_CHANGE\_EXISTS\_QUANTITY[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Position side cannot be changed if there exists position.

### \-4069 INVALID\_OPTIONS\_PREMIUM\_FEE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid options premium fee

### \-4070 INVALID\_CL\_OPTIONS\_ID\_LEN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Client options id is not valid.
-   Client options id length should be less than 32 chars

### \-4071 INVALID\_OPTIONS\_DIRECTION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid options direction

### \-4072 OPTIONS\_PREMIUM\_NOT\_UPDATE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   premium fee is not updated, reject order

### \-4073 OPTIONS\_PREMIUM\_INPUT\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   input premium fee is less than 0, reject order

### \-4074 OPTIONS\_AMOUNT\_BIGGER\_THAN\_UPPER[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Order amount is bigger than upper boundary or less than 0, reject order

### \-4075 OPTIONS\_PREMIUM\_OUTPUT\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   output premium fee is less than 0, reject order

### \-4076 OPTIONS\_PREMIUM\_TOO\_DIFF[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   original fee is too much higher than last fee

### \-4077 OPTIONS\_PREMIUM\_REACH\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   place order amount has reached to limit, reject order

### \-4078 OPTIONS\_COMMON\_ERROR[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   options internal error

### \-4079 INVALID\_OPTIONS\_ID[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   invalid options id
-   invalid options id: %s
-   duplicate options id %d for user %d

### \-4080 OPTIONS\_USER\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   user not found
-   user not found with id: %s

### \-4081 OPTIONS\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   options not found
-   options not found with id: %s

### \-4082 INVALID\_BATCH\_PLACE\_ORDER\_SIZE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid number of batch place orders.
-   Invalid number of batch place orders: %s

### \-4083 PLACE\_BATCH\_ORDERS\_FAIL[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Fail to place batch orders.

### \-4084 UPCOMING\_METHOD[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Method is not allowed currently. Upcoming soon.

### \-4085 INVALID\_NOTIONAL\_LIMIT\_COEF[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid notional limit coefficient

### \-4086 INVALID\_PRICE\_SPREAD\_THRESHOLD[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid price spread threshold

### \-4087 REDUCE\_ONLY\_ORDER\_PERMISSION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   User can only place reduce only order

### \-4088 NO\_PLACE\_ORDER\_PERMISSION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   User can not place order currently

### \-4104 INVALID\_CONTRACT\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid contract type

### \-4114 INVALID\_CLIENT\_TRAN\_ID\_LEN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   clientTranId is not valid
-   Client tran id length should be less than 64 chars

### \-4115 DUPLICATED\_CLIENT\_TRAN\_ID[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   clientTranId is duplicated
-   Client tran id should be unique within 7 days

### \-4118 REDUCE\_ONLY\_MARGIN\_CHECK\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   ReduceOnly Order Failed. Please check your existing position and open orders
-   This indicates the new reduce-only order conflicts with existing open orders; cancel the existing order and resubmit the reduce-only order.

### \-4131 MARKET\_ORDER\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   The counterparty's best price does not meet the PERCENT\_PRICE filter limit

### \-4135 INVALID\_ACTIVATION\_PRICE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid activation price

### \-4137 QUANTITY\_EXISTS\_WITH\_CLOSE\_POSITION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Quantity must be zero with closePosition equals true

### \-4138 REDUCE\_ONLY\_MUST\_BE\_TRUE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Reduce only must be true with closePosition equals true

### \-4139 ORDER\_TYPE\_CANNOT\_BE\_MKT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Order type can not be market if it's unable to cancel

### \-4140 INVALID\_OPENING\_POSITION\_STATUS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid symbol status for opening position

### \-4141 SYMBOL\_ALREADY\_CLOSED[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Symbol is closed

### \-4142 STRATEGY\_INVALID\_TRIGGER\_PRICE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   REJECT: take profit or stop order will be triggered immediately

### \-4144 INVALID\_PAIR[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid pair

### \-4161 ISOLATED\_LEVERAGE\_REJECT\_WITH\_POSITION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Leverage reduction is not supported in Isolated Margin Mode with open positions

### \-4164 MIN\_NOTIONAL[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Order's notional must be no smaller than 5.0 (unless you choose reduce only)
-   Order's notional must be no smaller than %s (unless you choose reduce only)

### \-4165 INVALID\_TIME\_INTERVAL[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Invalid time interval
-   Maximum time interval is %s days

### \-4183 PRICE\_HIGHTER\_THAN\_STOP\_MULTIPLIER\_UP[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price is higher than stop price multiplier cap.
-   Limit price can't be higher than %s.

### \-4184 PRICE\_LOWER\_THAN\_STOP\_MULTIPLIER\_DOWN[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Price is lower than stop price multiplier floor.
-   Limit price can't be lower than %s.

## 50xx/51xxx - Order Execution Issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

### \-5021 FOK\_ORDER\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Due to the order could not be filled immediately, the FOK order has been rejected.

### \-5022 GTX\_ORDER\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Due to the order could not be executed as maker, the Post Only order will be rejected.

### \-5028 ME\_RECVWINDOW\_REJECT[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   The requested timestamp is outside the recvWindow of the matching engine

### \-5041 TOO\_MANY\_REQUESTS\_IN\_QUEUE[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Time out for too many requests from this account queueing at the same time.

### \-51078 NET\_ASSET\_MUST\_LTE\_RATIO[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   Fail to retrieve margin assets.

### \-51007 HAS\_PENDING\_TRANSACTION[​](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)

-   You have pending borrow or repayment, please try again later

-   [10xx - General Server or Network issues](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1000 UNKNOWN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1001 DISCONNECTED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1002 UNAUTHORIZED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1003 TOO\_MANY\_REQUESTS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1004 DUPLICATE\_IP](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1005 NO\_SUCH\_IP](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1006 UNEXPECTED\_RESP](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1007 TIMEOUT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1008 Request Throttled](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1010 ERROR\_MSG\_RECEIVED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1011 NON\_WHITE\_LIST](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1013 INVALID\_MESSAGE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1014 UNKNOWN\_ORDER\_COMPOSITION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1015 TOO\_MANY\_ORDERS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1016 SERVICE\_SHUTTING\_DOWN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1020 UNSUPPORTED\_OPERATION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1021 INVALID\_TIMESTAMP](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1022 INVALID\_SIGNATURE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1023 START\_TIME\_GREATER\_THAN\_END\_TIME](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
-   [11xx - Request issues](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1100 ILLEGAL\_CHARS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1101 TOO\_MANY\_PARAMETERS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1103 UNKNOWN\_PARAM](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1104 UNREAD\_PARAMETERS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1105 PARAM\_EMPTY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1106 PARAM\_NOT\_REQUIRED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1108 BAD\_ASSET](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1109 BAD\_ACCOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1110 BAD\_INSTRUMENT\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1111 BAD\_PRECISION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1112 NO\_DEPTH](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1113 WITHDRAW\_NOT\_NEGATIVE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1114 TIF\_NOT\_REQUIRED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1115 INVALID\_TIF](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1116 INVALID\_ORDER\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1117 INVALID\_SIDE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1118 EMPTY\_NEW\_CL\_ORD\_ID](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1119 EMPTY\_ORG\_CL\_ORD\_ID](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1120 BAD\_INTERVAL](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1121 BAD\_SYMBOL](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1125 INVALID\_LISTEN\_KEY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1127 MORE\_THAN\_XX\_HOURS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1128 OPTIONAL\_PARAMS\_BAD\_COMBO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1130 INVALID\_PARAMETER](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-1136 INVALID\_NEW\_ORDER\_RESP\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
-   [20xx - Processing Issues](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2010 NEW\_ORDER\_REJECTED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2011 CANCEL\_REJECTED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2013 NO\_SUCH\_ORDER](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2014 BAD\_API\_KEY\_FMT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2015 REJECTED\_MBX\_KEY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2016 NO\_TRADING\_WINDOW](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2018 BALANCE\_NOT\_SUFFICIENT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2019 MARGIN\_NOT\_SUFFICIEN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2020 UNABLE\_TO\_FILL](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2021 ORDER\_WOULD\_IMMEDIATELY\_TRIGGER](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2022 REDUCE\_ONLY\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2023 USER\_IN\_LIQUIDATION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2024 POSITION\_NOT\_SUFFICIENT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2025 MAX\_OPEN\_ORDER\_EXCEEDED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2026 REDUCE\_ONLY\_ORDER\_TYPE\_NOT\_SUPPORTED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2027 MAX\_LEVERAGE\_RATIO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-2028 MIN\_LEVERAGE\_RATIO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
-   [40xx - Filters and other Issues](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4000 INVALID\_ORDER\_STATUS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4001 PRICE\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4002 PRICE\_GREATER\_THAN\_MAX\_PRICE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4003 QTY\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4004 QTY\_LESS\_THAN\_MIN\_QTY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4005 QTY\_GREATER\_THAN\_MAX\_QTY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4006 STOP\_PRICE\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4007 STOP\_PRICE\_GREATER\_THAN\_MAX\_PRICE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4008 TICK\_SIZE\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4009 MAX\_PRICE\_LESS\_THAN\_MIN\_PRICE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4010 MAX\_QTY\_LESS\_THAN\_MIN\_QTY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4011 STEP\_SIZE\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4012 MAX\_NUM\_ORDERS\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4013 PRICE\_LESS\_THAN\_MIN\_PRICE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4014 PRICE\_NOT\_INCREASED\_BY\_TICK\_SIZE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4015 INVALID\_CL\_ORD\_ID\_LEN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4016 PRICE\_HIGHTER\_THAN\_MULTIPLIER\_UP](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4017 MULTIPLIER\_UP\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4018 MULTIPLIER\_DOWN\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4019 COMPOSITE\_SCALE\_OVERFLOW](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4020 TARGET\_STRATEGY\_INVALID](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4021 INVALID\_DEPTH\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4022 WRONG\_MARKET\_STATUS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4023 QTY\_NOT\_INCREASED\_BY\_STEP\_SIZE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4024 PRICE\_LOWER\_THAN\_MULTIPLIER\_DOWN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4025 MULTIPLIER\_DECIMAL\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4026 COMMISSION\_INVALID](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4027 INVALID\_ACCOUNT\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4028 INVALID\_LEVERAGE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4029 INVALID\_TICK\_SIZE\_PRECISION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4030 INVALID\_STEP\_SIZE\_PRECISION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4031 INVALID\_WORKING\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4032 EXCEED\_MAX\_CANCEL\_ORDER\_SIZE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4033 INSURANCE\_ACCOUNT\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4044 INVALID\_BALANCE\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4045 MAX\_STOP\_ORDER\_EXCEEDED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4046 NO\_NEED\_TO\_CHANGE\_MARGIN\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4047 THERE\_EXISTS\_OPEN\_ORDERS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4048 THERE\_EXISTS\_QUANTITY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4049 ADD\_ISOLATED\_MARGIN\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4050 CROSS\_BALANCE\_INSUFFICIENT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4051 ISOLATED\_BALANCE\_INSUFFICIENT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4052 NO\_NEED\_TO\_CHANGE\_AUTO\_ADD\_MARGIN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4053 AUTO\_ADD\_CROSSED\_MARGIN\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4054 ADD\_ISOLATED\_MARGIN\_NO\_POSITION\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4055 AMOUNT\_MUST\_BE\_POSITIVE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4056 INVALID\_API\_KEY\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4057 INVALID\_RSA\_PUBLIC\_KEY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4058 MAX\_PRICE\_TOO\_LARGE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4059 NO\_NEED\_TO\_CHANGE\_POSITION\_SIDE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4060 INVALID\_POSITION\_SIDE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4061 POSITION\_SIDE\_NOT\_MATCH](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4062 REDUCE\_ONLY\_CONFLICT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4063 INVALID\_OPTIONS\_REQUEST\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4064 INVALID\_OPTIONS\_TIME\_FRAME](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4065 INVALID\_OPTIONS\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4066 INVALID\_OPTIONS\_EVENT\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4067 POSITION\_SIDE\_CHANGE\_EXISTS\_OPEN\_ORDERS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4068 POSITION\_SIDE\_CHANGE\_EXISTS\_QUANTITY](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4069 INVALID\_OPTIONS\_PREMIUM\_FEE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4070 INVALID\_CL\_OPTIONS\_ID\_LEN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4071 INVALID\_OPTIONS\_DIRECTION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4072 OPTIONS\_PREMIUM\_NOT\_UPDATE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4073 OPTIONS\_PREMIUM\_INPUT\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4074 OPTIONS\_AMOUNT\_BIGGER\_THAN\_UPPER](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4075 OPTIONS\_PREMIUM\_OUTPUT\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4076 OPTIONS\_PREMIUM\_TOO\_DIFF](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4077 OPTIONS\_PREMIUM\_REACH\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4078 OPTIONS\_COMMON\_ERROR](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4079 INVALID\_OPTIONS\_ID](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4080 OPTIONS\_USER\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4081 OPTIONS\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4082 INVALID\_BATCH\_PLACE\_ORDER\_SIZE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4083 PLACE\_BATCH\_ORDERS\_FAIL](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4084 UPCOMING\_METHOD](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4085 INVALID\_NOTIONAL\_LIMIT\_COEF](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4086 INVALID\_PRICE\_SPREAD\_THRESHOLD](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4087 REDUCE\_ONLY\_ORDER\_PERMISSION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4088 NO\_PLACE\_ORDER\_PERMISSION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4104 INVALID\_CONTRACT\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4114 INVALID\_CLIENT\_TRAN\_ID\_LEN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4115 DUPLICATED\_CLIENT\_TRAN\_ID](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4118 REDUCE\_ONLY\_MARGIN\_CHECK\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4131 MARKET\_ORDER\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4135 INVALID\_ACTIVATION\_PRICE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4137 QUANTITY\_EXISTS\_WITH\_CLOSE\_POSITION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4138 REDUCE\_ONLY\_MUST\_BE\_TRUE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4139 ORDER\_TYPE\_CANNOT\_BE\_MKT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4140 INVALID\_OPENING\_POSITION\_STATUS](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4141 SYMBOL\_ALREADY\_CLOSED](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4142 STRATEGY\_INVALID\_TRIGGER\_PRICE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4144 INVALID\_PAIR](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4161 ISOLATED\_LEVERAGE\_REJECT\_WITH\_POSITION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4164 MIN\_NOTIONAL](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4165 INVALID\_TIME\_INTERVAL](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4183 PRICE\_HIGHTER\_THAN\_STOP\_MULTIPLIER\_UP](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-4184 PRICE\_LOWER\_THAN\_STOP\_MULTIPLIER\_DOWN](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
-   [50xx/51xxx - Order Execution Issues](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-5021 FOK\_ORDER\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-5022 GTX\_ORDER\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-5028 ME\_RECVWINDOW\_REJECT](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-5041 TOO\_MANY\_REQUESTS\_IN\_QUEUE](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-51078 NET\_ASSET\_MUST\_LTE\_RATIO](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
    -   [\-51007 HAS\_PENDING\_TRANSACTION](https://developers.binance.com/docs/derivatives/portfolio-margin/error-code)
