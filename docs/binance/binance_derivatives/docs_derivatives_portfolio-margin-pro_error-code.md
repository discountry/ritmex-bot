---
title: "Error Code | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code"
fetched_at: "2026-01-27T05:28:15.422Z"
---
# Error Codes

> The error JSON payload:

```
{  "code":-1121,  "msg":"Invalid symbol."}
```

Errors consist of two parts: an error code and a message. Codes are universal, but messages can vary.

## 10xx - General Server or Network issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-1000 UNKNOWN[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   An unknown error occurred while processing the request.
-   An unknown error occurred while processing the request.\[%s\]

### \-1001 DISCONNECTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Internal error; unable to process your request. Please try again.

### \-1002 UNAUTHORIZED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You are not authorized to execute this request.

### \-1003 TOO\_MANY\_REQUESTS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too much request weight used; current limit is %s request weight per %s. Please use WebSocket Streams for live updates to avoid polling the API.
-   Way too much request weight used; IP banned until %s. Please use WebSocket Streams for live updates to avoid bans.

### \-1004 SERVER\_BUSY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Server is busy, please wait and try again

### \-1006 UNEXPECTED\_RESP[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   An unexpected response was received from the message bus. Execution status unknown.

### \-1007 TIMEOUT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Timeout waiting for response from backend server. Send status unknown; execution status unknown.

### \-1008 SERVER\_BUSY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Spot server is currently overloaded with other requests. Please try again in a few minutes.

### \-1014 UNKNOWN\_ORDER\_COMPOSITION[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Unsupported order combination.

### \-1015 TOO\_MANY\_ORDERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too many new orders.
-   Too many new orders; current limit is %s orders per %s.

### \-1016 SERVICE\_SHUTTING\_DOWN[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This service is no longer available.

### \-1020 UNSUPPORTED\_OPERATION[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This operation is not supported.

### \-1021 INVALID\_TIMESTAMP[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Timestamp for this request is outside of the recvWindow.
-   Timestamp for this request was 1000ms ahead of the server's time.

### \-1022 INVALID\_SIGNATURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Signature for this request is not valid.

### \-1099 Not found, authenticated, or authorized[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This replaces error code -1999

## 11xx - 2xxx Request issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-1100 ILLEGAL\_CHARS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Illegal characters found in a parameter.
-   Illegal characters found in a parameter. %s
-   Illegal characters found in parameter `%s`; legal range is `%s`.

### \-1101 TOO\_MANY\_PARAMETERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too many parameters sent for this endpoint.
-   Too many parameters; expected `%s` and received `%s`.
-   Duplicate values for a parameter detected.

### \-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   A mandatory parameter was not sent, was empty/null, or malformed.
-   Mandatory parameter `%s` was not sent, was empty/null, or malformed.
-   Param `%s` or `%s` must be sent, but both were empty/null!

### \-1103 UNKNOWN\_PARAM[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   An unknown parameter was sent.

### \-1104 UNREAD\_PARAMETERS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Not all sent parameters were read.
-   Not all sent parameters were read; read `%s` parameter(s) but was sent `%s`.

### \-1105 PARAM\_EMPTY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   A parameter was empty.
-   Parameter `%s` was empty.

### \-1106 PARAM\_NOT\_REQUIRED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   A parameter was sent when not required.
-   Parameter `%s` sent when not required.

### \-1111 BAD\_PRECISION[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Precision is over the maximum defined for this asset.

### \-1112 NO\_DEPTH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   No orders on book for symbol.

### \-1114 TIF\_NOT\_REQUIRED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   TimeInForce parameter sent when not required.

### \-1115 INVALID\_TIF[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid timeInForce.

### \-1116 INVALID\_ORDER\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid orderType.

### \-1117 INVALID\_SIDE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid side.

### \-1118 EMPTY\_NEW\_CL\_ORD\_ID[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   New client order ID was empty.

### \-1119 EMPTY\_ORG\_CL\_ORD\_ID[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Original client order ID was empty.

### \-1120 BAD\_INTERVAL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid interval.

### \-1121 BAD\_SYMBOL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid symbol.

### \-1125 INVALID\_LISTEN\_KEY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This listenKey does not exist.

### \-1127 MORE\_THAN\_XX\_HOURS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Lookup interval is too big.
-   More than %s hours between startTime and endTime.

### \-1128 OPTIONAL\_PARAMS\_BAD\_COMBO[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Combination of optional parameters invalid.

### \-1130 INVALID\_PARAMETER[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid data sent for a parameter.
-   Data sent for parameter `%s` is not valid.

### \-1131 BAD\_RECV\_WINDOW[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   recvWindow must be less than 60000

### \-1134 BAD\_STRATEGY\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   `strategyType` was less than 1000000.

#### \-1145 INVALID\_CANCEL\_RESTRICTIONS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   `cancelRestrictions` has to be either `ONLY_NEW` or `ONLY_PARTIALLY_FILLED`.

#### \-1151 DUPLICATE\_SYMBOLS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Symbol is present multiple times in the list.

### \-2010 NEW\_ORDER\_REJECTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   NEW\_ORDER\_REJECTED

### \-2011 CANCEL\_REJECTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   CANCEL\_REJECTED

### \-2013 NO\_SUCH\_ORDER[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Order does not exist.

### \-2014 BAD\_API\_KEY\_FMT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   API-key format invalid.

### \-2015 REJECTED\_MBX\_KEY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid API-key, IP, or permissions for action.

### \-2016 NO\_TRADING\_WINDOW[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   No trading window could be found for the symbol. Try ticker/24hrs instead.

#### \-2026 ORDER\_ARCHIVED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Order was canceled or expired with no executed qty over 90 days ago and has been archived.

## 3xxx-5xxx SAPI-specific issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-3000 INNER\_FAILURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Internal server error.

### \-3001 NEED\_ENABLE\_2FA[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Please enable 2FA first.

### \-3002 ASSET\_DEFICIENCY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   We don't have this asset.

### \-3003 NO\_OPENED\_MARGIN\_ACCOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Margin account does not exist.

### \-3004 TRADE\_NOT\_ALLOWED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Trade not allowed.

### \-3005 TRANSFER\_OUT\_NOT\_ALLOWED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Transferring out not allowed.

### \-3006 EXCEED\_MAX\_BORROWABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Your borrow amount has exceed maximum borrow amount.

### \-3007 HAS\_PENDING\_TRANSACTION[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You have pending transaction, please try again later.

### \-3008 BORROW\_NOT\_ALLOWED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Borrow not allowed.

### \-3009 ASSET\_NOT\_MORTGAGEABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This asset are not allowed to transfer into margin account currently.

### \-3010 REPAY\_NOT\_ALLOWED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repay not allowed.

### \-3011 BAD\_DATE\_RANGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Your input date is invalid.

### \-3012 ASSET\_ADMIN\_BAN\_BORROW[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Borrow is banned for this asset.

### \-3013 LT\_MIN\_BORROWABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Borrow amount less than minimum borrow amount.

### \-3014 ACCOUNT\_BAN\_BORROW[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Borrow is banned for this account.

### \-3015 REPAY\_EXCEED\_LIABILITY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repay amount exceeds borrow amount.

### \-3016 LT\_MIN\_REPAY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repay amount less than minimum repay amount.

### \-3017 ASSET\_ADMIN\_BAN\_MORTGAGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This asset are not allowed to transfer into margin account currently.

### \-3018 ACCOUNT\_BAN\_MORTGAGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Transferring in has been banned for this account.

### \-3019 ACCOUNT\_BAN\_ROLLOUT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Transferring out has been banned for this account.

### \-3020 EXCEED\_MAX\_ROLLOUT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Transfer out amount exceeds max amount.

### \-3021 PAIR\_ADMIN\_BAN\_TRADE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Margin account are not allowed to trade this trading pair.

### \-3022 ACCOUNT\_BAN\_TRADE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You account's trading is banned.

### \-3023 WARNING\_MARGIN\_LEVEL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You can't transfer out/place order under current margin level.

### \-3024 FEW\_LIABILITY\_LEFT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The unpaid debt is too small after this repayment.

### \-3025 INVALID\_EFFECTIVE\_TIME[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Your input date is invalid.

### \-3026 VALIDATION\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Your input param is invalid.

### \-3027 NOT\_VALID\_MARGIN\_ASSET[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Not a valid margin asset.

### \-3028 NOT\_VALID\_MARGIN\_PAIR[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Not a valid margin pair.

### \-3029 TRANSFER\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Transfer failed.

### \-3036 ACCOUNT\_BAN\_REPAY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This account is not allowed to repay.

### \-3037 PNL\_CLEARING[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   PNL is clearing. Wait a second.

### \-3038 LISTEN\_KEY\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Listen key not found.

### \-3041 BALANCE\_NOT\_CLEARED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Balance is not enough

### \-3042 PRICE\_INDEX\_NOT\_FOUND[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   PriceIndex not available for this margin pair.

### \-3043 TRANSFER\_IN\_NOT\_ALLOWED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Transferring in not allowed.

### \-3044 SYSTEM\_BUSY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   System busy.

### \-3045 SYSTEM[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The system doesn't have enough asset now.

### \-3999 NOT\_WHITELIST\_USER[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This function is only available for invited users.

### \-4001 CAPITAL\_INVALID[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid operation.

### \-4002 CAPITAL\_IG[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid get.

### \-4003 CAPITAL\_IEV[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Your input email is invalid.

### \-4004 CAPITAL\_UA[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You don't login or auth.

### \-4005 CAPAITAL\_TOO\_MANY\_REQUEST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too many new requests.

### \-4006 CAPITAL\_ONLY\_SUPPORT\_PRIMARY\_ACCOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Support main account only.

### \-4007 CAPITAL\_ADDRESS\_VERIFICATION\_NOT\_PASS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Address validation is not passed.

### \-4008 CAPITAL\_ADDRESS\_TAG\_VERIFICATION\_NOT\_PASS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Address tag validation is not passed.

### \-4010 CAPITAL\_WHITELIST\_EMAIL\_CONFIRM[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   White list mail has been confirmed.

### \-4011 CAPITAL\_WHITELIST\_EMAIL\_EXPIRED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   White list mail is invalid.

### \-4012 CAPITAL\_WHITELIST\_CLOSE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   White list is not opened.

### \-4013 CAPITAL\_WITHDRAW\_2FA\_VERIFY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   2FA is not opened.

### \-4014 CAPITAL\_WITHDRAW\_LOGIN\_DELAY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Withdraw is not allowed within 2 min login.

### \-4015 CAPITAL\_WITHDRAW\_RESTRICTED\_MINUTE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Withdraw is limited.

### \-4016 CAPITAL\_WITHDRAW\_RESTRICTED\_PASSWORD[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Within 24 hours after password modification, withdrawal is prohibited.

### \-4017 CAPITAL\_WITHDRAW\_RESTRICTED\_UNBIND\_2FA[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Within 24 hours after the release of 2FA, withdrawal is prohibited.

### \-4018 CAPITAL\_WITHDRAW\_ASSET\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   We don't have this asset.

### \-4019 CAPITAL\_WITHDRAW\_ASSET\_PROHIBIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Current asset is not open for withdrawal.

### \-4021 CAPITAL\_WITHDRAW\_AMOUNT\_MULTIPLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Asset withdrawal must be an %s multiple of %s.

### \-4022 CAPITAL\_WITHDRAW\_MIN\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Not less than the minimum pick-up quantity %s.

### \-4023 CAPITAL\_WITHDRAW\_MAX\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Within 24 hours, the withdrawal exceeds the maximum amount.

### \-4024 CAPITAL\_WITHDRAW\_USER\_NO\_ASSET[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You don't have this asset.

### \-4025 CAPITAL\_WITHDRAW\_USER\_ASSET\_LESS\_THAN\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The number of hold asset is less than zero.

### \-4026 CAPITAL\_WITHDRAW\_USER\_ASSET\_NOT\_ENOUGH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You have insufficient balance.

### \-4027 CAPITAL\_WITHDRAW\_GET\_TRAN\_ID\_FAILURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Failed to obtain tranId.

### \-4028 CAPITAL\_WITHDRAW\_MORE\_THAN\_FEE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The amount of withdrawal must be greater than the Commission.

### \-4029 CAPITAL\_WITHDRAW\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The withdrawal record does not exist.

### \-4030 CAPITAL\_WITHDRAW\_CONFIRM\_SUCCESS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Confirmation of successful asset withdrawal.

### \-4031 CAPITAL\_WITHDRAW\_CANCEL\_FAILURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Cancellation failed.

### \-4032 CAPITAL\_WITHDRAW\_CHECKSUM\_VERIFY\_FAILURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Withdraw verification exception.

### \-4033 CAPITAL\_WITHDRAW\_ILLEGAL\_ADDRESS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Illegal address.

### \-4034 CAPITAL\_WITHDRAW\_ADDRESS\_CHEAT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The address is suspected of fake.

### \-4035 CAPITAL\_WITHDRAW\_NOT\_WHITE\_ADDRESS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This address is not on the whitelist. Please join and try again.

### \-4036 CAPITAL\_WITHDRAW\_NEW\_ADDRESS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The new address needs to be withdrawn in {0} hours.

### \-4037 CAPITAL\_WITHDRAW\_RESEND\_EMAIL\_FAIL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Re-sending Mail failed.

### \-4038 CAPITAL\_WITHDRAW\_RESEND\_EMAIL\_TIME\_OUT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Please try again in 5 minutes.

### \-4039 CAPITAL\_USER\_EMPTY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The user does not exist.

### \-4040 CAPITAL\_NO\_CHARGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This address not charged.

### \-4041 CAPITAL\_MINUTE\_TOO\_SMALL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Please try again in one minute.

### \-4042 CAPITAL\_CHARGE\_NOT\_RESET[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This asset cannot get deposit address again.

### \-4043 CAPITAL\_ADDRESS\_TOO\_MUCH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   More than 100 recharge addresses were used in 24 hours.

### \-4044 CAPITAL\_BLACKLIST\_COUNTRY\_GET\_ADDRESS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This is a blacklist country.

### \-4045 CAPITAL\_GET\_ASSET\_ERROR[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Failure to acquire assets.

### \-4046 CAPITAL\_AGREEMENT\_NOT\_CONFIRMED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Agreement not confirmed.

### \-4047 CAPITAL\_DATE\_INTERVAL\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Time interval must be within 0-90 days

### \-4060 CAPITAL\_WITHDRAW\_USER\_ASSET\_LOCK\_DEPOSIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   As your deposit has not reached the required block confirmations, we have temporarily locked {0} asset

### \-5001 ASSET\_DRIBBLET\_CONVERT\_SWITCH\_OFF[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Don't allow transfer to micro assets.

### \-5002 ASSET\_ASSET\_NOT\_ENOUGH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You have insufficient balance.

### \-5003 ASSET\_USER\_HAVE\_NO\_ASSET[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   You don't have this asset.

### \-5004 USER\_OUT\_OF\_TRANSFER\_FLOAT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The residual balances have exceeded 0.001BTC, Please re-choose.
-   The residual balances of %s have exceeded 0.001BTC, Please re-choose.

### \-5005 USER\_ASSET\_AMOUNT\_IS\_TOO\_LOW[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The residual balances of the BTC is too low
-   The residual balances of %s is too low, Please re-choose.

### \-5006 USER\_CAN\_NOT\_REQUEST\_IN\_24\_HOURS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Only transfer once in 24 hours.

### \-5007 AMOUNT\_OVER\_ZERO[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Quantity must be greater than zero.

### \-5008 ASSET\_WITHDRAW\_WITHDRAWING\_NOT\_ENOUGH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Insufficient amount of returnable assets.

### \-5009 PRODUCT\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Product does not exist.

### \-5010 TRANSFER\_FAIL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Asset transfer fail.

### \-5011 FUTURE\_ACCT\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   future account not exists.

### \-5012 TRANSFER\_PENDING[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Asset transfer is in pending.

### \-5021 PARENT\_SUB\_HAVE\_NO\_RELATION[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This parent sub have no relation

### \-5012 FUTURE\_ACCT\_OR\_SUBRELATION\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   future account or sub relation not exists.

## 6XXX - Savings Issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-6001 DAILY\_PRODUCT\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Daily product not exists.

### \-6003 DAILY\_PRODUCT\_NOT\_ACCESSIBLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Product not exist or you don't have permission

### \-6004 DAILY\_PRODUCT\_NOT\_PURCHASABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Product not in purchase status

### \-6005 DAILY\_LOWER\_THAN\_MIN\_PURCHASE\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Smaller than min purchase limit

### \-6006 DAILY\_REDEEM\_AMOUNT\_ERROR[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Redeem amount error

### \-6007 DAILY\_REDEEM\_TIME\_ERROR[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Not in redeem time

### \-6008 DAILY\_PRODUCT\_NOT\_REDEEMABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Product not in redeem status

### \-6009 REQUEST\_FREQUENCY\_TOO\_HIGH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Request frequency too high

### \-6011 EXCEEDED\_USER\_PURCHASE\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Exceeding the maximum num allowed to purchase per user

### \-6012 BALANCE\_NOT\_ENOUGH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Balance not enough

### \-6013 PURCHASING\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Purchasing failed

### \-6014 UPDATE\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Exceed up-limit allowed to purchased

### \-6015 EMPTY\_REQUEST\_BODY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Empty request body

### \-6016 PARAMS\_ERR[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Parameter err

### \-6017 NOT\_IN\_WHITELIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Not in whitelist

### \-6018 ASSET\_NOT\_ENOUGH[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Asset not enough

### \-6019 PENDING[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Need confirm

### \-6020 PROJECT\_NOT\_EXISTS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Project not exists

## 70xx - Futures[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-7001 FUTURES\_BAD\_DATE\_RANGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Date range is not supported.

### \-7002 FUTURES\_BAD\_TYPE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Data request type is not supported.

## 20xxx - Futures/Spot Algo[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-20121[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid symbol.

### \-20124[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid algo id or it has been completed.

### \-20130[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid data sent for a parameter.

### \-20132[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The client algo id is duplicated.

### \-20194[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Duration is too short to execute all required quantity.

### \-20195[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The total size is too small.

### \-20196[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The total size is too large.

### \-20198[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Reach the max open orders allowed.

### \-20204[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The notional of USD is less or more than the limit.

## Filter failures[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

Error message

Description

"Filter failure: PRICE\_FILTER"

`price` is too high, too low, and/or not following the tick size rule for the symbol.

"Filter failure: PERCENT\_PRICE"

`price` is X% too high or X% too low from the average weighted price over the last Y minutes.

"Filter failure: PERCENT\_PRICE\_BY\_SIDE"

`price` is X% too high or Y% too low from the `lastPrice` on that side (i.e. BUY/SELL)

"Filter failure: LOT\_SIZE"

`quantity` is too high, too low, and/or not following the step size rule for the symbol.

"Filter failure: MIN\_NOTIONAL"

`price` \* `quantity` is too low to be a valid order for the symbol.

"Filter failure: ICEBERG\_PARTS"

`ICEBERG` order would break into too many parts; icebergQty is too small.

"Filter failure: MARKET\_LOT\_SIZE"

`MARKET` order's `quantity` is too high, too low, and/or not following the step size rule for the symbol.

"Filter failure: MAX\_POSITION"

The account's position has reached the maximum defined limit.  
  
This is composed of the sum of the balance of the base asset, and the sum of the quantity of all open `BUY`orders.

"Filter failure: MAX\_NUM\_ORDERS"

Account has too many open orders on the symbol.

"Filter failure: MAX\_NUM\_ALGO\_ORDERS"

Account has too many open stop loss and/or take profit orders on the symbol.

"Filter failure: MAX\_NUM\_ICEBERG\_ORDERS"

Account has too many open iceberg orders on the symbol.

"Filter failure: TRAILING\_DELTA"

`trailingDelta` is not within the defined range of the filter for that order type.

"Filter failure: EXCHANGE\_MAX\_NUM\_ORDERS"

Account has too many open orders on the exchange.

"Filter failure: EXCHANGE\_MAX\_NUM\_ALGO\_ORDERS"

Account has too many open stop loss and/or take profit orders on the exchange.

## 10xxx - Crypto Loans[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-10001 SYSTEM\_MAINTENANCE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The system is under maintenance, please try again later.

### \-10002 INVALID\_INPUT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid input parameters.

### \-10005 NO\_RECORDS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   No records found.

### \-10007 COIN\_NOT\_LOANABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This coin is not loanable.

### \-10008 COIN\_NOT\_LOANABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This coin is not loanable

### \-10009 COIN\_NOT\_COLLATERAL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This coin can not be used as collateral.

### \-10010 COIN\_NOT\_COLLATERAL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This coin can not be used as collateral.

### \-10011 INSUFFICIENT\_ASSET[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Insufficient spot assets.

### \-10012 INVALID\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid repayment amount.

### \-10013 INSUFFICIENT\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Insufficient collateral amount.

### \-10015 DEDUCTION\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Collateral deduction failed.

### \-10016 LOAN\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Failed to provide loan.

### \-10017 REPAY\_EXCEED\_DEBT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repayment amount exceeds debt.

### \-10018 INVALID\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid repayment amount.

### \-10019 CONFIG\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Configuration does not exists.

### \-10020 UID\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   User ID does not exist.

### \-10021 ORDER\_NOT\_EXIST[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Order does not exist.

### \-10022 INVALID\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid adjustment amount.

### \-10023 ADJUST\_LTV\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Failed to adjust LTV.

### \-10024 ADJUST\_LTV\_NOT\_SUPPORTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   LTV adjustment not supported.

### \-10025 REPAY\_FAILED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repayment failed.

### \-10026 INVALID\_PARAMETER[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid parameter.

### \-10028 INVALID\_PARAMETER[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Invalid parameter.

### \-10029 AMOUNT\_TOO\_SMALL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Loan amount is too small.

### \-10030 AMOUNT\_TOO\_LARGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Loan amount is too much.

### \-10031 QUOTA\_REACHED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Individual loan quota reached.

### \-10032 REPAY\_NOT\_AVAILABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repayment is temporarily unavailable.

### \-10034 REPAY\_NOT\_AVAILABLE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repay with collateral is not available currently, please try to repay with borrowed coin.

### \-10039 AMOUNT\_TOO\_SMALL[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repayment amount is too small.

### \-10040 AMOUNT\_TOO\_LARGE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Repayment amount is too large.

### \-10041 INSUFFICIENT\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Due to high demand, there are currently insufficient loanable assets for {0}. Please adjust your borrow amount or try again tomorrow.

### \-10042 ASSET\_NOT\_SUPPORTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   asset %s is not supported

### \-10043 ASSET\_NOT\_SUPPORTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   {0} borrowing is currently not supported.

### \-10044 QUOTA\_REACHED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Collateral amount has reached the limit. Please reduce your collateral amount or try with other collaterals.

### \-10045 COLLTERAL\_REPAY\_NOT\_SUPPORTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The loan coin does not support collateral repayment. Please try again later.

### \-10046 EXCEED\_MAX\_ADJUSTMENT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Collateral Adjustment exceeds the maximum limit. Please try again.

### \-10047 REGION\_NOT\_SUPPORTED[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This coin is currently not supported in your location due to local regulations.

## 13xxx - BLVT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-13000 BLVT\_FORBID\_REDEEM[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Redeption of the token is forbiden now

### \-13001 BLVT\_EXCEED\_DAILY\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Exceeds individual 24h redemption limit of the token

### \-13002 BLVT\_EXCEED\_TOKEN\_DAILY\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Exceeds total 24h redemption limit of the token

### \-13003 BLVT\_FORBID\_PURCHASE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Subscription of the token is forbiden now

### \-13004 BLVT\_EXCEED\_DAILY\_PURCHASE\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Exceeds individual 24h subscription limit of the token

### \-13005 BLVT\_EXCEED\_TOKEN\_DAILY\_PURCHASE\_LIMIT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Exceeds total 24h subscription limit of the token

### \-13006 BLVT\_PURCHASE\_LESS\_MIN\_AMOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Subscription amount is too small

### \-13007 BLVT\_PURCHASE\_AGREEMENT\_NOT\_SIGN[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The Agreement is not signed

## 12xxx - Liquid Swap[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-12014 TOO MANY REQUESTS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   More than 1 request in 2 seconds
    

## 18xxx - Binance Code[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-18002[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The total amount of codes you created has exceeded the 24-hour limit, please try again after UTC 0

### \-18003[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too many codes created in 24 hours, please try again after UTC 0

### \-18004[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too many invalid redeem attempts in 24 hours, please try again after UTC 0

### \-18005[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Too many invalid verify attempts, please try later

### \-18006[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The amount is too small, please re-enter

### \-18007[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   This token is not currently supported, please re-enter

## 21xxx - Portfolio Margin Account[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-21001 USER\_IS\_NOT\_UNIACCOUNT[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Request ID is not a Portfolio Margin Account.

### \-21002 UNI\_ACCOUNT\_CANT\_TRANSFER\_FUTURE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Portfolio Margin Account doesn't support transfer from margin to futures.

### \-21003 NET\_ASSET\_MUST\_LTE\_RATIO[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   Fail to retrieve margin assets.

### \-21004 USER\_NO\_LIABILITY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   User doesn’t have portfolio margin bankruptcy loan

### \-21005 NO\_ENOUGH\_ASSET[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   User’s spot wallet doesn’t have enough BUSD to repay portfolio margin bankruptcy loan

### \-21006 HAD\_IN\_PROCESS\_REPAY[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   User had portfolio margin bankruptcy loan repayment in process

### \-21007 IN\_FORCE\_LIQUIDATION[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   User failed to repay portfolio margin bankruptcy loan since liquidation was in process

### \-21015 ENDPOINT\_GONE[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

-   The endpoint has been deprecated and removed
    

## Order Rejection Issues[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

Error messages like these are indicated when the error is coming specifically from the matching engine:

-   `-1010 ERROR_MSG_RECEIVED`
-   `-2010 NEW_ORDER_REJECTED`
-   `-2011 CANCEL_REJECTED`

The following messages which will indicate the specific error:

Error message

Description

"Unknown order sent."

The order (by either `orderId`, `clientOrderId`, `origClientOrderId`) could not be found.

"Duplicate order sent."

The `clientOrderId` is already in use.

"Market is closed."

The symbol is not trading.

"Account has insufficient balance for requested action."

Not enough funds to complete the action.

"Market orders are not supported for this symbol."

`MARKET` is not enabled on the symbol.

"Iceberg orders are not supported for this symbol."

`icebergQty` is not enabled on the symbol

"Stop loss orders are not supported for this symbol."

`STOP_LOSS` is not enabled on the symbol

"Stop loss limit orders are not supported for this symbol."

`STOP_LOSS_LIMIT` is not enabled on the symbol

"Take profit orders are not supported for this symbol."

`TAKE_PROFIT` is not enabled on the symbol

"Take profit limit orders are not supported for this symbol."

`TAKE_PROFIT_LIMIT` is not enabled on the symbol

"Price \* QTY is zero or less."

`price` \* `quantity` is too low

"IcebergQty exceeds QTY."

`icebergQty` must be less than the order quantity

"This action is disabled on this account."

Contact customer support; some actions have been disabled on the account.

"This account may not place or cancel orders."

Contact customer support; the account has trading ability disabled.

"Unsupported order combination"

The `orderType`, `timeInForce`, `stopPrice`, and/or `icebergQty` combination isn't allowed.

"Order would trigger immediately."

The order's stop price is not valid when compared to the last traded price.

"Cancel order is invalid. Check origClientOrderId and orderId."

No `origClientOrderId` or `orderId` was sent in.

"Order would immediately match and take."

`LIMIT_MAKER` order type would immediately match and trade, and not be a pure maker order.

"The relationship of the prices for the orders is not correct."

The prices set in the `OCO` is breaking the Price rules.  
  
The rules are:  
  
`SELL Orders`: Limit Price > Last Price > Stop Price  
  
`BUY Orders`: Limit Price < Last Price < Stop Price

"OCO orders are not supported for this symbol"

`OCO` is not enabled on the symbol.

"Quote order qty market orders are not support for this symbol."

`MARKET` orders using the parameter `quoteOrderQty` are not enabled on this symbol.

"Trailing stop orders are not supported for this symbol."

Orders using `trailingDelta` are not enabled on the symbol.

"Order cancel-replace is not supported for this symbol."

`POST /api/v3/order/cancelReplace` (REST API) or `order.cancelReplace` (WebSocket API) is on enabled the symbol.

"This symbol is not permitted for this account."

Account and symbol do not have the same permissions. (e.g. `SPOT`, `MARGIN`, etc)

"This symbol is restricted for this account."

Account is unable to trade on that symbol. (e.g. An `ISOLATED_MARGIN` account cannot place `SPOT` orders.)

"Order was not canceled due to cancel restrictions."

Either `cancelRestrictions` was set to `ONLY_NEW` but the order status was not `NEW`  
or  
`cancelRestrictions` was set to `ONLY_PARTIALLY_FILLED` but the order status was not `PARTIALLY_FILLED`.

## Errors regarding POST /api/v3/order/cancelReplace[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

### \-2021 Order cancel-replace partially failed[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

This code is sent when either the cancellation of the order failed or the new order placement failed but not both.

### \-2022 Order cancel-replace failed.[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)

This code is sent when both the cancellation of the order failed and the new order placement failed.

-   [10xx - General Server or Network issues](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1000 UNKNOWN](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1001 DISCONNECTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1002 UNAUTHORIZED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1003 TOO\_MANY\_REQUESTS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1004 SERVER\_BUSY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1006 UNEXPECTED\_RESP](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1007 TIMEOUT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1008 SERVER\_BUSY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1014 UNKNOWN\_ORDER\_COMPOSITION](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1015 TOO\_MANY\_ORDERS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1016 SERVICE\_SHUTTING\_DOWN](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1020 UNSUPPORTED\_OPERATION](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1021 INVALID\_TIMESTAMP](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1022 INVALID\_SIGNATURE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1099 Not found, authenticated, or authorized](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [11xx - 2xxx Request issues](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1100 ILLEGAL\_CHARS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1101 TOO\_MANY\_PARAMETERS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1102 MANDATORY\_PARAM\_EMPTY\_OR\_MALFORMED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1103 UNKNOWN\_PARAM](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1104 UNREAD\_PARAMETERS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1105 PARAM\_EMPTY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1106 PARAM\_NOT\_REQUIRED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1111 BAD\_PRECISION](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1112 NO\_DEPTH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1114 TIF\_NOT\_REQUIRED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1115 INVALID\_TIF](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1116 INVALID\_ORDER\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1117 INVALID\_SIDE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1118 EMPTY\_NEW\_CL\_ORD\_ID](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1119 EMPTY\_ORG\_CL\_ORD\_ID](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1120 BAD\_INTERVAL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1121 BAD\_SYMBOL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1125 INVALID\_LISTEN\_KEY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1127 MORE\_THAN\_XX\_HOURS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1128 OPTIONAL\_PARAMS\_BAD\_COMBO](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1130 INVALID\_PARAMETER](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1131 BAD\_RECV\_WINDOW](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-1134 BAD\_STRATEGY\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2010 NEW\_ORDER\_REJECTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2011 CANCEL\_REJECTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2013 NO\_SUCH\_ORDER](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2014 BAD\_API\_KEY\_FMT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2015 REJECTED\_MBX\_KEY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2016 NO\_TRADING\_WINDOW](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [3xxx-5xxx SAPI-specific issues](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3000 INNER\_FAILURE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3001 NEED\_ENABLE\_2FA](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3002 ASSET\_DEFICIENCY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3003 NO\_OPENED\_MARGIN\_ACCOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3004 TRADE\_NOT\_ALLOWED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3005 TRANSFER\_OUT\_NOT\_ALLOWED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3006 EXCEED\_MAX\_BORROWABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3007 HAS\_PENDING\_TRANSACTION](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3008 BORROW\_NOT\_ALLOWED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3009 ASSET\_NOT\_MORTGAGEABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3010 REPAY\_NOT\_ALLOWED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3011 BAD\_DATE\_RANGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3012 ASSET\_ADMIN\_BAN\_BORROW](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3013 LT\_MIN\_BORROWABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3014 ACCOUNT\_BAN\_BORROW](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3015 REPAY\_EXCEED\_LIABILITY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3016 LT\_MIN\_REPAY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3017 ASSET\_ADMIN\_BAN\_MORTGAGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3018 ACCOUNT\_BAN\_MORTGAGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3019 ACCOUNT\_BAN\_ROLLOUT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3020 EXCEED\_MAX\_ROLLOUT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3021 PAIR\_ADMIN\_BAN\_TRADE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3022 ACCOUNT\_BAN\_TRADE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3023 WARNING\_MARGIN\_LEVEL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3024 FEW\_LIABILITY\_LEFT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3025 INVALID\_EFFECTIVE\_TIME](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3026 VALIDATION\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3027 NOT\_VALID\_MARGIN\_ASSET](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3028 NOT\_VALID\_MARGIN\_PAIR](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3029 TRANSFER\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3036 ACCOUNT\_BAN\_REPAY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3037 PNL\_CLEARING](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3038 LISTEN\_KEY\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3041 BALANCE\_NOT\_CLEARED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3042 PRICE\_INDEX\_NOT\_FOUND](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3043 TRANSFER\_IN\_NOT\_ALLOWED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3044 SYSTEM\_BUSY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3045 SYSTEM](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-3999 NOT\_WHITELIST\_USER](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4001 CAPITAL\_INVALID](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4002 CAPITAL\_IG](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4003 CAPITAL\_IEV](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4004 CAPITAL\_UA](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4005 CAPAITAL\_TOO\_MANY\_REQUEST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4006 CAPITAL\_ONLY\_SUPPORT\_PRIMARY\_ACCOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4007 CAPITAL\_ADDRESS\_VERIFICATION\_NOT\_PASS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4008 CAPITAL\_ADDRESS\_TAG\_VERIFICATION\_NOT\_PASS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4010 CAPITAL\_WHITELIST\_EMAIL\_CONFIRM](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4011 CAPITAL\_WHITELIST\_EMAIL\_EXPIRED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4012 CAPITAL\_WHITELIST\_CLOSE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4013 CAPITAL\_WITHDRAW\_2FA\_VERIFY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4014 CAPITAL\_WITHDRAW\_LOGIN\_DELAY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4015 CAPITAL\_WITHDRAW\_RESTRICTED\_MINUTE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4016 CAPITAL\_WITHDRAW\_RESTRICTED\_PASSWORD](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4017 CAPITAL\_WITHDRAW\_RESTRICTED\_UNBIND\_2FA](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4018 CAPITAL\_WITHDRAW\_ASSET\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4019 CAPITAL\_WITHDRAW\_ASSET\_PROHIBIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4021 CAPITAL\_WITHDRAW\_AMOUNT\_MULTIPLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4022 CAPITAL\_WITHDRAW\_MIN\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4023 CAPITAL\_WITHDRAW\_MAX\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4024 CAPITAL\_WITHDRAW\_USER\_NO\_ASSET](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4025 CAPITAL\_WITHDRAW\_USER\_ASSET\_LESS\_THAN\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4026 CAPITAL\_WITHDRAW\_USER\_ASSET\_NOT\_ENOUGH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4027 CAPITAL\_WITHDRAW\_GET\_TRAN\_ID\_FAILURE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4028 CAPITAL\_WITHDRAW\_MORE\_THAN\_FEE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4029 CAPITAL\_WITHDRAW\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4030 CAPITAL\_WITHDRAW\_CONFIRM\_SUCCESS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4031 CAPITAL\_WITHDRAW\_CANCEL\_FAILURE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4032 CAPITAL\_WITHDRAW\_CHECKSUM\_VERIFY\_FAILURE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4033 CAPITAL\_WITHDRAW\_ILLEGAL\_ADDRESS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4034 CAPITAL\_WITHDRAW\_ADDRESS\_CHEAT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4035 CAPITAL\_WITHDRAW\_NOT\_WHITE\_ADDRESS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4036 CAPITAL\_WITHDRAW\_NEW\_ADDRESS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4037 CAPITAL\_WITHDRAW\_RESEND\_EMAIL\_FAIL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4038 CAPITAL\_WITHDRAW\_RESEND\_EMAIL\_TIME\_OUT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4039 CAPITAL\_USER\_EMPTY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4040 CAPITAL\_NO\_CHARGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4041 CAPITAL\_MINUTE\_TOO\_SMALL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4042 CAPITAL\_CHARGE\_NOT\_RESET](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4043 CAPITAL\_ADDRESS\_TOO\_MUCH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4044 CAPITAL\_BLACKLIST\_COUNTRY\_GET\_ADDRESS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4045 CAPITAL\_GET\_ASSET\_ERROR](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4046 CAPITAL\_AGREEMENT\_NOT\_CONFIRMED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4047 CAPITAL\_DATE\_INTERVAL\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-4060 CAPITAL\_WITHDRAW\_USER\_ASSET\_LOCK\_DEPOSIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5001 ASSET\_DRIBBLET\_CONVERT\_SWITCH\_OFF](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5002 ASSET\_ASSET\_NOT\_ENOUGH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5003 ASSET\_USER\_HAVE\_NO\_ASSET](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5004 USER\_OUT\_OF\_TRANSFER\_FLOAT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5005 USER\_ASSET\_AMOUNT\_IS\_TOO\_LOW](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5006 USER\_CAN\_NOT\_REQUEST\_IN\_24\_HOURS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5007 AMOUNT\_OVER\_ZERO](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5008 ASSET\_WITHDRAW\_WITHDRAWING\_NOT\_ENOUGH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5009 PRODUCT\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5010 TRANSFER\_FAIL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5011 FUTURE\_ACCT\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5012 TRANSFER\_PENDING](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5021 PARENT\_SUB\_HAVE\_NO\_RELATION](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-5012 FUTURE\_ACCT\_OR\_SUBRELATION\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [6XXX - Savings Issues](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6001 DAILY\_PRODUCT\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6003 DAILY\_PRODUCT\_NOT\_ACCESSIBLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6004 DAILY\_PRODUCT\_NOT\_PURCHASABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6005 DAILY\_LOWER\_THAN\_MIN\_PURCHASE\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6006 DAILY\_REDEEM\_AMOUNT\_ERROR](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6007 DAILY\_REDEEM\_TIME\_ERROR](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6008 DAILY\_PRODUCT\_NOT\_REDEEMABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6009 REQUEST\_FREQUENCY\_TOO\_HIGH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6011 EXCEEDED\_USER\_PURCHASE\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6012 BALANCE\_NOT\_ENOUGH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6013 PURCHASING\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6014 UPDATE\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6015 EMPTY\_REQUEST\_BODY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6016 PARAMS\_ERR](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6017 NOT\_IN\_WHITELIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6018 ASSET\_NOT\_ENOUGH](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6019 PENDING](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-6020 PROJECT\_NOT\_EXISTS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [70xx - Futures](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-7001 FUTURES\_BAD\_DATE\_RANGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-7002 FUTURES\_BAD\_TYPE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [20xxx - Futures/Spot Algo](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20121](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20124](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20130](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20132](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20194](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20195](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20196](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20198](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-20204](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [Filter failures](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [10xxx - Crypto Loans](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10001 SYSTEM\_MAINTENANCE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10002 INVALID\_INPUT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10005 NO\_RECORDS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10007 COIN\_NOT\_LOANABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10008 COIN\_NOT\_LOANABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10009 COIN\_NOT\_COLLATERAL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10010 COIN\_NOT\_COLLATERAL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10011 INSUFFICIENT\_ASSET](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10012 INVALID\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10013 INSUFFICIENT\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10015 DEDUCTION\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10016 LOAN\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10017 REPAY\_EXCEED\_DEBT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10018 INVALID\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10019 CONFIG\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10020 UID\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10021 ORDER\_NOT\_EXIST](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10022 INVALID\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10023 ADJUST\_LTV\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10024 ADJUST\_LTV\_NOT\_SUPPORTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10025 REPAY\_FAILED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10026 INVALID\_PARAMETER](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10028 INVALID\_PARAMETER](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10029 AMOUNT\_TOO\_SMALL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10030 AMOUNT\_TOO\_LARGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10031 QUOTA\_REACHED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10032 REPAY\_NOT\_AVAILABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10034 REPAY\_NOT\_AVAILABLE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10039 AMOUNT\_TOO\_SMALL](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10040 AMOUNT\_TOO\_LARGE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10041 INSUFFICIENT\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10042 ASSET\_NOT\_SUPPORTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10043 ASSET\_NOT\_SUPPORTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10044 QUOTA\_REACHED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10045 COLLTERAL\_REPAY\_NOT\_SUPPORTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10046 EXCEED\_MAX\_ADJUSTMENT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-10047 REGION\_NOT\_SUPPORTED](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [13xxx - BLVT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13000 BLVT\_FORBID\_REDEEM](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13001 BLVT\_EXCEED\_DAILY\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13002 BLVT\_EXCEED\_TOKEN\_DAILY\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13003 BLVT\_FORBID\_PURCHASE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13004 BLVT\_EXCEED\_DAILY\_PURCHASE\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13005 BLVT\_EXCEED\_TOKEN\_DAILY\_PURCHASE\_LIMIT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13006 BLVT\_PURCHASE\_LESS\_MIN\_AMOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-13007 BLVT\_PURCHASE\_AGREEMENT\_NOT\_SIGN](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [12xxx - Liquid Swap](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-12014 TOO MANY REQUESTS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [18xxx - Binance Code](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-18002](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-18003](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-18004](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-18005](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-18006](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-18007](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [21xxx - Portfolio Margin Account](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21001 USER\_IS\_NOT\_UNIACCOUNT](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21002 UNI\_ACCOUNT\_CANT\_TRANSFER\_FUTURE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21003 NET\_ASSET\_MUST\_LTE\_RATIO](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21004 USER\_NO\_LIABILITY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21005 NO\_ENOUGH\_ASSET](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21006 HAD\_IN\_PROCESS\_REPAY](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21007 IN\_FORCE\_LIQUIDATION](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-21015 ENDPOINT\_GONE](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [Order Rejection Issues](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
-   [Errors regarding POST /api/v3/order/cancelReplace](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2021 Order cancel-replace partially failed](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
    -   [\-2022 Order cancel-replace failed.](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/error-code)
