2 Signature
How To Sign Message
How To GET Your L2 Private Key
To sign messages on Layer 2, you need to obtain your L2 private key. This key is used to generate signatures that authorize various actions on the platform.


How To GET Your L2 Private Key
Warning: Keep your private key secure and never share it with anyone. Anyone with access to your private key can sign messages on your behalf.

Signature Algorithm
The signature algorithm used is Ecdsa (Elliptic Curve Digital Signature Algorithm). This algorithm ensures that signatures are secure and verifiable.

L2Signature for Operations (e.g., Order, Transfer, Withdraw): This will use Pedersen hash for signing. However, this hash computation will consume significantly more CPU resources.

<!-- logo -->
<h1 align='center'>StarkWare Crypto Utils</h1>

<!-- tag line -->
<h4 align='center'> Signatures, keys and Pedersen hash on STARK friendly elliptic curve</h4>

<!-- primary badges -->
<p align="center">
  <a href="https://www.w3schools.com/js/">
    <img src='https://badges.aleen42.com/src/javascript.svg' />
  </a> 
  <a href="https://www.npmjs.com/package/@starkware-industries/starkware-crypto-utils">
    <img src='https://img.shields.io/npm/v/@starkware-industries/starkware-crypto-utils?label=npm' />
  </a>
  <a href="https://starkware.co/">
    <img src="https://img.shields.io/badge/powered_by-StarkWare-navy">
  </a>
</p>

## Installation

```bash
// using npm
npm i @starkware-industries/starkware-crypto-utils

// using yarn
yarn add @starkware-industries/starkware-crypto-utils
```

## How to use it

```js
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');
```

## API

```javascript

{
    prime,
    ec: starkEc,
    constantPoints,
    shiftPoint,
    maxEcdsaVal, // Data.
    pedersen,
    getLimitOrderMsgHash,
    getTransferMsgHash,
    sign,
    verify,
    assertInRange,
    getTransferMsgHashWithFee,
    getLimitOrderMsgHashWithFee // Function.

    asset: {
      getAssetType,
      getAssetId // Function.
    },

    keyDerivation: {
      StarkExEc: ec.n, // Data.
      getPrivateKeyFromEthSignature,
      privateToStarkKey,
      getKeyPairFromPath,
      getAccountPath,
      grindKey // Function.
    },

    messageUtils: {
      assertInRange // Function.
    }
}
```

## Usage

### Signing a StarkEx order

```javascript
const starkwareCrypto = require('@starkware-libs/starkware-crypto-utils');
const testData = require('test/config/signature_test_data.json');

const privateKey = testData.meta_data.party_a_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) ===
    testData.settlement.party_a_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
        Expected: ${testData.settlement.party_a_order.public_key.substring(2)}`
);

const {party_a_order: partyAOrder} = testData.settlement;
const msgHash = starkwareCrypto.getLimitOrderMsgHash(
  partyAOrder.vault_id_sell, // - vault_sell (uint31)
  partyAOrder.vault_id_buy, // - vault_buy (uint31)
  partyAOrder.amount_sell, // - amount_sell (uint63 decimal str)
  partyAOrder.amount_buy, // - amount_buy (uint63 decimal str)
  partyAOrder.token_sell, // - token_sell (hex str with 0x prefix < prime)
  partyAOrder.token_buy, // - token_buy (hex str with 0x prefix < prime)
  partyAOrder.nonce, // - nonce (uint31)
  partyAOrder.expiration_timestamp // - expiration_timestamp (uint22)
);

assert(
  msgHash === testData.meta_data.party_a_order.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.party_a_order.message_hash.substring(2)
);

const msgSignature = starkwareCrypto.sign(keyPair, msgHash);
const {r, s} = msgSignature;

assert(starkwareCrypto.verify(publicKey, msgHash, msgSignature));
assert(
  r.toString(16) === partyAOrder.signature.r.substring(2),
  `Got: ${r.toString(16)}. Expected: ${partyAOrder.signature.r.substring(2)}`
);
assert(
  s.toString(16) === partyAOrder.signature.s.substring(2),
  `Got: ${s.toString(16)}. Expected: ${partyAOrder.signature.s.substring(2)}`
);

// The following is the JSON representation of an order:
console.log('Order JSON representation: ');
console.log(partyAOrder);
console.log('\n');
```

### StarkEx key serialization

```javascript
const starkwareCrypto = require('@starkware-libs/starkware-crypto-utils');

const pubXStr = publicKey.pub.getX().toString('hex');
const pubYStr = publicKey.pub.getY().toString('hex');

// Verify Deserialization.
const pubKeyDeserialized = starkwareCrypto.ec.keyFromPublic(
  {x: pubXStr, y: pubYStr},
  'hex'
);
assert(starkwareCrypto.verify(pubKeyDeserialized, msgHash, msgSignature));
```

### Signing a StarkEx order with fee

```javascript
const privateKey = testData.meta_data.party_a_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) ===
    testData.settlement.party_a_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
        Expected: ${testData.settlement.party_a_order.public_key.substring(2)}`
);

const {party_a_order: partyAOrder} = testData.settlement;
const feeInfo = testData.fee_info_user;
const msgHash = starkwareCrypto.getLimitOrderMsgHashWithFee(
  partyAOrder.vault_id_sell, // - vault_sell (uint64)
  partyAOrder.vault_id_buy, // - vault_buy (uint64)
  partyAOrder.amount_sell, // - amount_sell (uint63 decimal str)
  partyAOrder.amount_buy, // - amount_buy (uint63 decimal str)
  partyAOrder.token_sell, // - token_sell (hex str with 0x prefix < prime)
  partyAOrder.token_buy, // - token_buy (hex str with 0x prefix < prime)
  partyAOrder.nonce, // - nonce (uint31)
  partyAOrder.expiration_timestamp, // - expiration_timestamp (uint22)
  feeInfo.token_id, // - token (hex str with 0x prefix < prime)
  feeInfo.source_vault_id, // - fee_source_vault_id (uint31)
  feeInfo.fee_limit // - amount (uint63 decimal str)
);

assert(
  msgHash ===
    testData.meta_data.party_a_order_with_fee.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.party_a_order_with_fee.message_hash.substring(2)
);

// The following is the JSON representation of an order:
console.log('Order With Fee JSON representation: ');
// Fee info is added to the order, and will be also be seen in the JSON of Settlement.
partyAOrder.fee_info = feeInfo; // eslint-disable-line
console.log(partyAOrder);
console.log('\n');
```

### StarkEx transfer

```javascript
const starkwareCrypto = require('@starkware-libs/starkware-crypto-utils');
const testData = require('test/config/signature_test_data.json');

const privateKey = testData.meta_data.transfer_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) === testData.transfer_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
            Expected: ${testData.transfer_order.public_key.substring(2)}`
);

const transfer = testData.transfer_order;
const msgHash = starkwareCrypto.getTransferMsgHash(
  transfer.amount, // - amount (uint63 decimal str)
  transfer.nonce, // - nonce (uint31)
  transfer.sender_vault_id, // - sender_vault_id (uint31)
  transfer.token, // - token (hex str with 0x prefix < prime)
  transfer.target_vault_id, // - target_vault_id (uint31)
  transfer.target_public_key, // - target_public_key (hex str with 0x prefix < prime)
  transfer.expiration_timestamp // - expiration_timestamp (uint22)
);

assert(
  msgHash === testData.meta_data.transfer_order.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.transfer_order.message_hash.substring(2)
);

// The following is the JSON representation of a transfer:
console.log('Transfer JSON representation: ');
console.log(transfer);
console.log('\n');
```

### StarkEx conditional transfer

```javascript
const starkwareCrypto = require('@starkware-libs/starkware-crypto-utils');
const testData = require('test/config/signature_test_data.json');

const privateKey =
  testData.meta_data.conditional_transfer_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) ===
    testData.conditional_transfer_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
        Expected: ${testData.conditional_transfer_order.public_key.substring(
          2
        )}`
);

const transfer = testData.conditional_transfer_order;
const msgHash = starkwareCrypto.getTransferMsgHash(
  transfer.amount, // - amount (uint63 decimal str)
  transfer.nonce, // - nonce (uint31)
  transfer.sender_vault_id, // - sender_vault_id (uint31)
  transfer.token, // - token (hex str with 0x prefix < prime)
  transfer.target_vault_id, // - target_vault_id (uint31)
  transfer.target_public_key, // - target_public_key (hex str with 0x prefix < prime)
  transfer.expiration_timestamp, // - expiration_timestamp (uint22)
  transfer.condition // - condition (hex str with 0x prefix < prime)
);

assert(
  msgHash ===
    testData.meta_data.conditional_transfer_order.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.conditional_transfer_order.message_hash.substring(2)
);

// The following is the JSON representation of a transfer:
console.log('Conditional Transfer JSON representation: ');
console.log(transfer);
console.log('\n');
```

### StarkEx transfer with fee

```javascript
const privateKey = testData.meta_data.transfer_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) === testData.transfer_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
        Expected: ${testData.transfer_order.public_key.substring(2)}`
);

const transfer = testData.transfer_order;
const feeInfo = testData.fee_info_user;
const msgHash = starkwareCrypto.getTransferMsgHashWithFee(
  transfer.amount, // - amount (uint63 decimal str)
  transfer.nonce, // - nonce (uint31)
  transfer.sender_vault_id, // - sender_vault_id (uint64)
  transfer.token, // - token (hex str with 0x prefix < prime)
  transfer.target_vault_id, // - target_vault_id (uint64)
  transfer.target_public_key, // - target_public_key (hex str with 0x prefix < prime)
  transfer.expiration_timestamp, // - expiration_timestamp (uint22)
  feeInfo.token_id, // - token (hex str with 0x prefix < prime)
  feeInfo.source_vault_id, // - fee_source_vault_id (uint64)
  feeInfo.fee_limit // - amount (uint63 decimal str)
);

assert(
  msgHash ===
    testData.meta_data.transfer_order_with_fee.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.transfer_order.message_hash.substring(2)
);

// The following is the JSON representation of a transfer:
console.log('Transfer With Fee JSON representation: ');
console.log(transfer);
console.log('\n');
```

### StarkEx conditional Transfer with fee

```javascript
const privateKey =
  testData.meta_data.conditional_transfer_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) ===
    testData.conditional_transfer_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
        Expected: ${testData.conditional_transfer_order.public_key.substring(
          2
        )}`
);

const transfer = testData.conditional_transfer_order;
const feeInfo = testData.fee_info_user;
const msgHash = starkwareCrypto.getTransferMsgHashWithFee(
  transfer.amount, // - amount (uint63 decimal str)
  transfer.nonce, // - nonce (uint31)
  transfer.sender_vault_id, // - sender_vault_id (uint64)
  transfer.token, // - token (hex str with 0x prefix < prime)
  transfer.target_vault_id, // - target_vault_id (uint64)
  transfer.target_public_key, // - target_public_key (hex str with 0x prefix < prime)
  transfer.expiration_timestamp, // - expiration_timestamp (uint22)
  feeInfo.token_id, // - token (hex str with 0x prefix < prime)
  feeInfo.source_vault_id, // - fee_source_vault_id (uint64)
  feeInfo.fee_limit, // - amount (uint63 decimal str)
  transfer.condition // - condition (hex str with 0x prefix < prime)
);

assert(
  msgHash ===
    testData.meta_data.conditional_transfer_order_with_fee.message_hash.substring(
      2
    ),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.conditional_transfer_order.message_hash.substring(2)
);

// The following is the JSON representation of a transfer:
console.log('Conditional Transfer With Fee JSON representation: ');
console.log(transfer);
console.log('\n');
```

### Adding a matching order to create a settlement

```javascript
const starkwareCrypto = require('@starkware-libs/starkware-crypto-utils');
const testData = require('test/config/signature_test_data.json');

const privateKey = testData.meta_data.party_b_order.private_key.substring(2);
const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, 'hex');
const publicKey = starkwareCrypto.ec.keyFromPublic(
  keyPair.getPublic(true, 'hex'),
  'hex'
);
const publicKeyX = publicKey.pub.getX();

assert(
  publicKeyX.toString(16) ===
    testData.settlement.party_b_order.public_key.substring(2),
  `Got: ${publicKeyX.toString(16)}.
        Expected: ${testData.settlement.party_b_order.public_key.substring(2)}`
);

const {party_b_order: partyBOrder} = testData.settlement;
const msgHash = starkwareCrypto.getLimitOrderMsgHash(
  partyBOrder.vault_id_sell, // - vault_sell (uint31)
  partyBOrder.vault_id_buy, // - vault_buy (uint31)
  partyBOrder.amount_sell, // - amount_sell (uint63 decimal str)
  partyBOrder.amount_buy, // - amount_buy (uint63 decimal str)
  partyBOrder.token_sell, // - token_sell (hex str with 0x prefix < prime)
  partyBOrder.token_buy, // - token_buy (hex str with 0x prefix < prime)
  partyBOrder.nonce, // - nonce (uint31)
  partyBOrder.expiration_timestamp // - expiration_timestamp (uint22)
);

assert(
  msgHash === testData.meta_data.party_b_order.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.party_b_order.message_hash.substring(2)
);

const msgSignature = starkwareCrypto.sign(keyPair, msgHash);
const {r, s} = msgSignature;

assert(starkwareCrypto.verify(publicKey, msgHash, msgSignature));
assert(
  r.toString(16) === partyBOrder.signature.r.substring(2),
  `Got: ${r.toString(16)}. Expected: ${partyBOrder.signature.r.substring(2)}`
);
assert(
  s.toString(16) === partyBOrder.signature.s.substring(2),
  `Got: ${s.toString(16)}. Expected: ${partyBOrder.signature.s.substring(2)}`
);

// The following is the JSON representation of a settlement:
console.log('Settlement JSON representation: ');
console.log(testData.settlement);
```

## Valid transfer with sender_vault_id=2\*\*63+10

```javascript
const transfer = testData.transfer_order_2nd_valid_range;
const feeInfo = testData.fee_info_user;

const msgHash = starkwareCrypto.getTransferMsgHashWithFee(
  transfer.amount, // - amount (uint63 decimal str)
  transfer.nonce, // - nonce (uint31)
  transfer.sender_vault_id, // - sender_vault_id (uint64)
  transfer.token, // - token (hex str with 0x prefix < prime)
  transfer.target_vault_id, // - target_vault_id (uint64)
  transfer.target_public_key, // - target_public_key (hex str with 0x prefix < prime)
  transfer.expiration_timestamp, // - expiration_timestamp (uint22)
  feeInfo.token_id, // - token (hex str with 0x prefix < prime)
  feeInfo.source_vault_id, // - fee_source_vault_id (uint64)
  feeInfo.fee_limit, // - amount (uint63 decimal str)
  transfer.condition // - condition (hex str with 0x prefix < prime)
);

assert(
  msgHash ===
    testData.meta_data.transfer_order_2nd_valid_range.message_hash.substring(2),
  `Got: ${msgHash}. Expected: ` +
    testData.meta_data.transfer_order_2nd_valid_range.message_hash.substring(2)
);

// The following is the JSON representation of a transfer with sender_vault_id in the second
// valid range:
console.log('Transfer JSON representation: ');
console.log(transfer);
console.log('\n');
```

## License

[Apache License 2.0](LICENSE.md)

Java L2Signature Demo
Below is a Java implementation of the Ecdsa signature algorithm. This example demonstrates how to sign a message using a private key.

Copy

    public static CreateOrderRequest signOrder(
            CreateOrderRequest request,
            Contract contract,
            Coin quotelCoin,
            PrivateKey privateKey) {
        BigInteger msgHash = L2SignUtil.hashLimitOrder(
                request.getSide() == OrderSide.BUY,
                BigIntUtil.toBigInt(quotelCoin.getStarkExAssetId()),
                BigIntUtil.toBigInt(contract.getStarkExSyntheticAssetId()),
                BigIntUtil.toBigInt(quotelCoin.getStarkExAssetId()),
                UnsignedLong.valueOf(new BigDecimal(request.getL2Value())
                        .multiply(new BigDecimal(BigIntUtil.toBigInt(quotelCoin.getStarkExResolution())))
                        .toBigIntegerExact()),
                UnsignedLong.valueOf(new BigDecimal(request.getL2Size())
                        .multiply(new BigDecimal(BigIntUtil.toBigInt(contract.getStarkExResolution())))
                        .toBigIntegerExact()),
                UnsignedLong.valueOf(new BigDecimal(request.getL2LimitFee())
                        .multiply(new BigDecimal(BigIntUtil.toBigInt(quotelCoin.getStarkExResolution())))
                        .toBigIntegerExact()),
                UnsignedLong.fromLongBits(request.getAccountId()),
                UnsignedInteger.valueOf(request.getL2Nonce()),
                UnsignedInteger.valueOf(request.getL2ExpireTime() / (60 * 60 * 1000L)));
        Signature signature = Ecdsa.sign(msgHash, privateKey);
        return request.toBuilder()
                .setL2Signature(L2Signature.newBuilder()
                        .setR(BigIntUtil.toHexStr(signature.r))
                        .setS(BigIntUtil.toHexStr(signature.s))
                        .build())
                .build();
    }

    public static BigInteger hashLimitOrder(
            boolean isBuyingSynthetic,
            BigInteger assetIdCollateral,
            BigInteger assetIdSynthetic,
            BigInteger assetIdFee,
            UnsignedLong amountCollateral,
            UnsignedLong amountSynthetic,
            UnsignedLong maxAmountFee,
            UnsignedLong positionId,
            UnsignedInteger nonce,
            UnsignedInteger expirationTimestamp) {
        BigInteger assetIdSell;
        BigInteger assetIdBuy;
        UnsignedLong amountSell;
        UnsignedLong amountBuy;
        if (isBuyingSynthetic) {
            assetIdSell = assetIdCollateral;
            assetIdBuy = assetIdSynthetic;
            amountSell = amountCollateral;
            amountBuy = amountSynthetic;
        } else {
            assetIdSell = assetIdSynthetic;
            assetIdBuy = assetIdCollateral;
            amountSell = amountSynthetic;
            amountBuy = amountCollateral;
        }
        BigInteger packedMessage0 = amountSell.bigIntegerValue();
        packedMessage0 = packedMessage0.shiftLeft(64).add(amountBuy.bigIntegerValue());
        packedMessage0 = packedMessage0.shiftLeft(64).add(maxAmountFee.bigIntegerValue());
        packedMessage0 = packedMessage0.shiftLeft(32).add(nonce.bigIntegerValue());

        BigInteger packedMessage1 = BigInteger.valueOf(3);
        packedMessage1 = packedMessage1.shiftLeft(64).add(positionId.bigIntegerValue());
        packedMessage1 = packedMessage1.shiftLeft(64).add(positionId.bigIntegerValue());
        packedMessage1 = packedMessage1.shiftLeft(64).add(positionId.bigIntegerValue());
        packedMessage1 = packedMessage1.shiftLeft(32).add(expirationTimestamp.bigIntegerValue());
        packedMessage1 = packedMessage1.shiftLeft(17);

        BigInteger msg = pedersenHash(assetIdSell, assetIdBuy);
        msg = pedersenHash(msg, assetIdFee);
        msg = pedersenHash(msg, packedMessage0);
        msg = pedersenHash(msg, packedMessage1);
        return msg;
    }

    public static BigInteger pedersenHash(BigInteger... input) {
        BigInteger[][] points = PEDERSEN_POINTS;
        Point shiftPoint = new Point(points[0][0], points[0][1]);
        for (int i = 0; i < input.length; i++) {
            BigInteger x = input[i];
            for (int j = 0; j < 252; j++) {
                int pos = 2 + i * 252 + j;
                Point pt = new Point(points[pos][0], points[pos][1]);
                if (x.and(BigInteger.ONE).intValue() != 0) {
                    shiftPoint = EcMath.add(shiftPoint, pt, Curve.secp256k1.A, Curve.secp256k1.P);
                }
                x = x.shiftRight(1);
            }
        }
        return shiftPoint.x;
    }

    public static Signature sign(BigInteger msgHash, PrivateKey privateKey) {
        Curve curve = privateKey.curve;
        BigInteger randNum = new BigInteger(curve.N.toByteArray().length * 8 - 1, new SecureRandom()).abs().add(BigInteger.ONE);
        Point randomSignPoint = EcMath.multiply(curve.G, randNum, curve.N, curve.A, curve.P);
        BigInteger r = randomSignPoint.x.mod(curve.N);
        BigInteger s = ((msgHash.add(r.multiply(privateKey.secret))).multiply(EcMath.inv(randNum, curve.N))).mod(curve.N);
        return Signature.create(r, s);
    }
Signature Construction Guide
This section provides detailed instructions on constructing signatures for various actions on the platform.

Withdrawal Signature
Used to authorize withdrawing assets from Layer 2 to an Ethereum address.

Parameters
assetIdCollateral - Asset ID for the collateral token from meta_data.coinList.starkExAssetId

positionId - User's account ID in Layer 2

ethAddress - Destination Ethereum address for withdrawal

nonce - Unique transaction identifier to prevent replay attacks

expirationTimestamp - Unix timestamp when signature expires

amount - Amount to withdraw in base units

Calculation
The following TypeScript function constructs the withdrawal message for signing:

Copy
// Construct withdrawal message for signing
function getWithdrawalToAddressMsg({
  assetIdCollateral,
  positionId,
  ethAddress, 
  nonce,
  expirationTimestamp,
  amount
}) {
  // Pack parameters into 256-bit words
  const w1 = assetIdCollateral;
  let w5 = BigInt(withdrawalToAddress); // Constant identifier
  w5 = (w5 << 64) + BigInt(positionId);
  w5 = (w5 << 32) + BigInt(nonce); 
  w5 = (w5 << 64) + BigInt(amount);
  w5 = (w5 << 32) + BigInt(expirationTimestamp);
  w5 = w5 << 49;

  // Calculate Pedersen hash
  return pedersen([
    pedersen([w1, ethAddress]),
    w5.toString(16)
  ]);
}
Limit Order Signature
Used to authorize a limit order for perpetual trading.

Parameters
assetIdSynthetic - Synthetic asset ID from meta_data.contractList.starkExSyntheticAssetId

assetIdCollateral - Collateral asset ID from meta_data.coinList.starkExAssetId

isBuyingSynthetic - true for buy orders, false for sell orders

assetIdFee - Fee token asset ID from meta_data.coinList.starkExAssetId

amountSynthetic - Amount of synthetic asset

amountCollateral - Amount of collateral asset

maxAmountFee - Maximum fee amount allowed

nonce - Unique order identifier

positionId - User's position ID

expirationTimestamp - Unix timestamp when order expires

Calculation
The following TypeScript function constructs the limit order message for signing:

Copy
function getLimitOrderMsg({
  assetIdSynthetic,
  assetIdCollateral,
  isBuyingSynthetic,
  assetIdFee,
  amountSynthetic,
  amountCollateral,
  maxAmountFee,
  nonce,
  positionId,
  expirationTimestamp
}) {
  // Determine sell/buy assets based on order side
  const [assetIdSell, assetIdBuy] = isBuyingSynthetic 
    ? [assetIdCollateral, assetIdSynthetic]
    : [assetIdSynthetic, assetIdCollateral];
  const [amountSell, amountBuy] = isBuyingSynthetic
    ? [amountCollateral, amountSynthetic] 
    : [amountSynthetic, amountCollateral];

  // Pack order data into 256-bit words
  const w1 = assetIdSell;
  const w2 = assetIdBuy;
  const w3 = assetIdFee;

  // Calculate message hash
  let msg = pedersen([w1, w2]);
  msg = pedersen([msg, w3]);

  let w4 = BigInt(amountSell);
  w4 = (w4 << 64) + BigInt(amountBuy);
  w4 = (w4 << 64) + BigInt(maxAmountFee);
  w4 = (w4 << 32) + BigInt(nonce);
  msg = pedersen([msg, w4.toString(16)]);

  let w5 = BigInt(limitOrderWithFees); // Constant identifier
  w5 = (w5 << 64) + BigInt(positionId);
  w5 = (w5 << 64) + BigInt(positionId);
  w5 = (w5 << 64) + BigInt(positionId);
  w5 = (w5 << 32) + BigInt(expirationTimestamp);
  w5 = w5 << 17;

  return pedersen([msg, w5.toString(16)]);
}
Transfer Signature
Used to authorize transfers between Layer 2 accounts.

Parameters
assetId - Asset ID being transferred

receiverPublicKey - Recipient's public key

senderPositionId - Sender's position ID

receiverPositionId - Recipient's position ID

srcFeePositionId - Fee source position ID

nonce - Unique transfer identifier

amount - Transfer amount

expirationTimestamp - Unix timestamp when transfer expires

assetIdFee - Fee token asset ID (optional, default '0')

maxAmountFee - Maximum fee amount (optional, default '0')

Calculation
The following TypeScript function constructs the transfer message for signing:

Copy
function getTransferMsg({
  assetId,
  receiverPublicKey,
  senderPositionId,
  receiverPositionId,
  srcFeePositionId,
  nonce,
  amount,
  expirationTimestamp,
  assetIdFee = '0',
  maxAmountFee = '0'
}) {
  // Pack transfer data into 256-bit words
  const w1 = assetId;
  const w2 = assetIdFee;
  const w3 = receiverPublicKey;

  let w4 = BigInt(senderPositionId);
  w4 = (w4 << 64) + BigInt(receiverPositionId);
  w4 = (w4 << 64) + BigInt(srcFeePositionId); 
  w4 = (w4 << 32) + BigInt(nonce);

  let w5 = BigInt(transfer); // Constant identifier
  w5 = (w5 << 64) + BigInt(amount);
  w5 = (w5 << 64) + BigInt(maxAmountFee);
  w5 = (w5 << 32) + BigInt(expirationTimestamp);
  w5 = w5 << 81;

  // Calculate message hash
  let msg = pedersen([w1, w2]);
  msg = pedersen([msg, w3]);
  msg = pedersen([msg, w4.toString(16)]);
  return pedersen([msg, w5.toString(16)]);
}
For more details on the signature construction, see the StarkEx documentation.