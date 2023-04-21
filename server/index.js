const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const {
	hexToBytes,
	toHex,
	utf8ToBytes,
} = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');
const secp = require('@noble/secp256k1');

const hashTransaction = (recipient, amount) => {
	return keccak256(utf8toBytes(recipient + amount));
};

app.use(cors());
app.use(express.json());

const balances = {
	'c3cac58347534ddf0d4396e15b90cf886168ff57': 100,
	'1d584b2129e960342c40d5a750cfa5c1a37f7f75': 50,
	'8751bc70aaba1ef2180127cc3c781f4cfa8168ab': 75,
};

app.get('/balance/:address', (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post('/send', (req, res) => {
	const { sender, recipient, amount, signature, txHash } = req.body;

	const [sign, recBit] = signature;
	const signed = new Uint8Array(Object.values(sign));
	const hash = new Uint8Array(Object.values(txHash));
	const pubKey = secp.recoverPublicKey(hash, signed, recBit);

  const address = toHex(keccak256(pubKey.slice(1)).slice(-20))

	setInitialBalance(pubKey);
	setInitialBalance(recipient);

	if (balances[address] < amount) {
		res.status(400).send({ message: 'Not enough funds!' });
	} else {
		balances[address] -= amount;
		balances[recipient] += amount;
		res.send({ balance: balances[address] });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}
