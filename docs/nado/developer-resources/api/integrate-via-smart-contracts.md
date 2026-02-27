# Integrate via Smart Contracts

Smart contracts can use the <mark style="color:red;">`LinkSigner`</mark> transaction type (see [Link Signer](https://docs.nado.xyz/developer-resources/api/gateway/executes/link-signer)) to perform the following:

1. Deposit into Nado.
2. LinkSigner an externally owned account ([EOA](https://ethereum.org/en/developers/docs/accounts/#externally-owned-accounts-and-key-pairs)).
3. Have the externally owned account trade using the smart contract's assets on Nado.

## Setup: Depositing into Nado + Linking an EOA

1. Deposits are always on-chain, as such, users can simply have their smart contract call <mark style="color:red;">`depositCollateral`</mark> on our <mark style="color:red;">`Endpoint`</mark> contract (see [Contracts](https://docs.nado.xyz/developer-resources/api/broken-reference) for addresses).
2. The contract needs to have 1 USDT0 available to pay for slow-mode fee and approve the endpoint contract, assemble the bytes for a slow mode linked signer transaction, and submit it via [submitSlowModeTransaction](https://github.com/vertex-protocol/vertex-contracts/blob/1ab8c8ba11e9ddf82c4210a826aad0b899f342aa/contracts/Endpoint.sol#L258).

{% hint style="info" %}
You can find the requisite parsing logic in the [Endpoint](https://github.com/vertex-protocol/vertex-contracts/blob/1ab8c8ba11e9ddf82c4210a826aad0b899f342aa/contracts/Endpoint.sol#L429) contract.
{% endhint %}

### Example

```solidity
struct LinkSigner {
    bytes32 sender;
    bytes32 signer;
    uint64 nonce;
}

function linkNadoSigner(
        address nadoEndpoint,
        address externalAccount,
        address usdt0Address
    ) external {
    // 1. a slow mode fee of 1 USDT0 needs to be avaliable and approved
    ERC20 usdt0Token =  ERC20(usdt0Address);
    
    // NOTE: should double check the USDT0 decimals in the corresponding chain.
    // e.g: it's 1e6 on arbitrum, whereas it's 1e18 on blast, etc.
    uint256 SLOW_MODE_FEE = 1e6;
    usdt0Token.transferFrom(msg.sender, address(this), SLOW_MODE_FEE);
    usdt0Token.approve(nadoEndpoint, SLOW_MODE_FEE);
    
    // 2. assamble the link signer slow mode transaction
    bytes12 defaultSubaccountName = bytes12(abi.encodePacked("default"));
    bytes32 contractSubaccount = bytes32(
        abi.encodePacked(uint160(address(this)), defaultSubaccountName)
    );
    bytes32 externalSubaccount = bytes32(
        uint256(uint160(externalAccount)) << 96
    );
    LinkSigner memory linkSigner = LinkSigner(
        contractSubaccount,
        externalSubaccount,
        IEndpoint(nadoEndpoint).getNonce(externalAccount)
    );
    bytes memory txs = abi.encodePacked(
        uint8(19),
        abi.encode(linkSigner)
    );
    
    // 3. submit slow mode transaction
    IEndpoint(nadoEndpoint).submitSlowModeTransaction(txs);
}
```

Once the transaction is confirmed, it may take a few seconds for it to make its way into the Nado offchain sequencer. Afterwards, you can sign transactions that have sender <mark style="color:red;">`contractSubaccount`</mark> using <mark style="color:red;">`externalSubaccount`</mark>, and they will be accepted by the sequencer and the blockchain.
