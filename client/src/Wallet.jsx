import server from './server';
import * as secp256k1 from '@noble/secp256k1';
import { hexToBytes, toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Wallet({
	address,
	setAddress,
	balance,
	setBalance,
	privateKey,
	setPrivateKey,
}) {
	async function onChange(evt) {
		const privateKey = evt.target.value;
		setPrivateKey(privateKey);
		const address = toHex(keccak256(secp256k1.getPublicKey(privateKey).slice(1)).slice(-20))

		setAddress(address);
		if (address) {
			const {
				data: { balance },
			} = await server.get(`balance/${address}`);
			setBalance(balance);
		} else {
			setBalance(0);
		}
	}

	return (
		<div className='container wallet'>
			<h1>Your Wallet</h1>

			<label>
				Private Key
				<input
					placeholder='Type a private key'
					value={privateKey}
					onChange={onChange}
				></input>
			</label>

			<div>Address: {address.slice(0,20)}...</div>

			<div className='balance'>Balance: {balance}</div>
		</div>
	);
}

export default Wallet;
