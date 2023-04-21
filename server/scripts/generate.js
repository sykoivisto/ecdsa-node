const secp = require("@noble/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();

console.log('private key', toHex(privateKey))

const publicKey = secp.getPublicKey(privateKey);

console.log('public key', toHex(publicKey))

const address = keccak256(publicKey.slice(1)).slice(-20)

console.log('address', toHex(address))