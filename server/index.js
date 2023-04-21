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
	'04f35d13560c6b37e51fe2325f2af6e0e4d6cb9f634263254cdba22f26b38dcd2ccb701657b11cd102bf46ef48fed30fe651eaa3a7f1571de85c5c4f8cb824c498': 100,
	'041a5e8ff1be70fa5230bc9a1351bbffe9565f9b9595d8b477300a47bdc4f7988dd914964d6e7e136b952e9f5a7f8cf9de4d6effe31aa9059ca240491ef413866f': 50,
	'047998429fa2f949a28db5b16238fa964b493932de9a941547e47c812219af7c0a9857f0e90063a893008f35663a5955d99c66d8c6935a6ec086d9fda08909bac4': 75,
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
	const pubKey = toHex(secp.recoverPublicKey(hash, signed, recBit));


	setInitialBalance(pubKey);
	setInitialBalance(recipient);

	if (balances[pubKey] < amount) {
		res.status(400).send({ message: 'Not enough funds!' });
	} else {
		balances[pubKey] -= amount;
		balances[recipient] += amount;
		res.send({ balance: balances[pubKey] });
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
