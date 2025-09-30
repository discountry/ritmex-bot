Welcome to the Lighter SDK and API Introduction. Here, we will go through everything from the system setup, to creating and cancelling all types of orders, to fetching exchange data.

Setting up an API KEY
In order to get started using the Lighter API, you must first set up an API_KEY_PRIVATE_KEY, as you will need it to sign any transaction you want to make. You can find how to do it in the following example. The BASE_URL will reflect if your key is generated on testnet or mainnet (for mainnet, just change the BASE_URL in the example to https://mainnet.zklighter.elliot.ai). Note that you also need to provide your ETH_PRIVATE_KEY.

You can setup up to 253 API keys (2 <= API_KEY_INDEX <= 254). The 0 index is the one reserved for the desktop, while 1 is the one reserved for the mobile. Finally, the 255 index can be used as a value for the api_key_index parameter of the apikeys method of the AccountApi for getting the data about all the API keys.

In case you do not know your ACCOUNT_INDEX, you can find it by querying the AccountApi for the data about your account, as shown in this example.

Account types
Lighter API users can operate under a Standard or Premium account. The Standard account is suitable for latency insensitive traders, providing 0 fees, while the premium one provides a latency suitable for HFTs at 0.2 bps maker and 2 bps taker fees. You can find more information about it in the Account Types section.

The Signer
In order to create a transaction (create/cancel/modify order), you need to use the SignerClient. For initializing it, use the following lines of code:

Initialize SignerClient

 client = lighter.SignerClient(  
        url=BASE_URL,  
        private_key=API_KEY_PRIVATE_KEY,  
        account_index=ACCOUNT_INDEX,  
        api_key_index=API_KEY_INDEX  
    )
The code for the signer can be found in the same repo, in the signer_client.py file. You may notice that it uses a binary for the signer: the code for it can be found in the lighter-go public repo, and you can compile it yourself using the justfile.

Nonces
When signing a transaction, you may need to provide a nonce (number used once). A nonce needs to be incremented each time you sign something. You can get the next nonce that you need to use using the TransactionApi’s next_nonce method or take care of incrementing it yourself. Note that each nonce is handled per API_KEY.

Signing a transaction
One can sign a transaction using the SignerClient’s sign_create_order, sign_modify_order, sign_cancel_order and its other similar methods. For actually pushing the transaction, you need to call send_tx or send_tx_batch using the TransactionApi. Here’s an example that includes such an operation.

Note that base_amount, price are to be passed as integers, and client_order_index is an unique (across all markets) identifier you provide for you to be able to reference this order later (e.g. if you want to cancel it).

The following values can be provided for the order_type parameter:

ORDER_TYPE_LIMIT
ORDER_TYPE_MARKET
ORDER_TYPE_STOP_LOSS
ORDER_TYPE_STOP_LOSS_LIMIT
ORDER_TYPE_TAKE_PROFIT
ORDER_TYPE_TAKE_PROFIT_LIMIT
ORDER_TYPE_TWAP
The following values can be provided for the time_in_force parameter:

ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL
ORDER_TIME_IN_FORCE_GOOD_TILL_TIME
ORDER_TIME_IN_FORCE_POST_ONLY
Signer Client Useful Wrapper Functions
The SignerClient provides several functions that sign and push a type of transaction. Here’s a list of some of them:

create_order - signs and pushes a create order transaction;
create_market_order - signs and pushes a create order transaction for a market order;
create_cancel_order - signs and pushes a cancel transaction for a certain order. Note that the order_index needs to equal the client_order_index of the order to cancel;
cancel_all_orders - signs and pushes a cancel all transactions. Note that, depending on the time_in_force provided, the transaction has different consequences:
ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL - ImmediateCancelAll;
ORDER_TIME_IN_FORCE_GOOD_TILL_TIME - ScheduledCancelAll;
ORDER_TIME_IN_FORCE_POST_ONLY - AbortScheduledCancelAll.
create_auth_token_with_expiry - creates an auth token (useful for getting data using the Api and Ws methods)
API
The SDK provides API classes that make calling the Lighter API easier. Here are some of them and the most important of their methods:

AccountApi - provides account data
account - get account data either by l1_address or index
accounts_by_l1_address - get data about all the accounts (master account and subaccounts)
apikeys - get data about the api keys of an account (use api_key_index = 255 for getting data about all the api keys)
TransactionApi - provides transaction related data
next_nonce - get next nonce to be used for signing a transaction using a certain api key
send_tx - push a transaction
send_tx_batch - push several transactions at once
OrderApi - provides data about orders, trades and the orderbook
order_book_details - get data about a specific market’s orderbook
order_books - get data about all markets’ orderbooks
You can find the rest here. We also provide an example showing how to use some of these. For the methods that require an auth token, you can generate one using the create_auth_token_with_expiry method of the SignerClient (the same applies to the websockets auth).

WebSockets
Lighter also provides access to essential info using websockets. A simple version of an WsClient for subscribing to account and orderbook updates is implemented here. You can also take it as an example implementation of such a client.

To get access to more data, you will need to connect to the websockets without the provided WsClient. You can find the streams you can connect to, how to connect, and the data they provide in the websockets section.