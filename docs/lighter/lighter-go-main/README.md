# lighter-go

In its current form, this repo serves as a starting point for anyone who wants to trade on Lighter using GO.
It covers all the signing procedures in order to trade on Lighter with an API key.
Minimal HTTP calls are implemented 
On chain support, like depositing on Ethereum or modifying an API key directly with an Ethereum Tx are not supported yet. 

At the moment, its main purpose is to offer visibility on the code behind the precompiled libraries used by the Python SDK.
If you'd like to compile your own binaries, the commands are in the `justfile`