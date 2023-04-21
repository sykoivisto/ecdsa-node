import { useState } from 'react';
import server from './server';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import * as secp256k1 from '@noble/secp256k1';

function Transfer({ privateKey, address, setBalance }) {
	const [sendAmount, setSendAmount] = useState('');
	const [recipient, setRecipient] = useState('');



	const setValue = (setter) => (evt) => setter(evt.target.value);

	async function transfer(evt) {
		evt.preventDefault();

		try {

      const tx = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient
      }

      const txHash = keccak256(utf8ToBytes(JSON.stringify(tx)));

      const signature = await secp256k1.sign(txHash, privateKey, {recovered:true});

			const {
				data: { balance },
			} = await server.post(`send`, {
				sender: address,
				amount: parseInt(sendAmount),
				recipient,
				signature,
				txHash
			});
			setBalance(balance);
		} catch (ex) {
			alert(ex.response.data.message);
		}
	}

	return (
		<form className='container transfer' onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder='1, 2, 3...'
					value={sendAmount}
					onChange={setValue(setSendAmount)}
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder='Type an address, for example: 0x2'
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<input type='submit' className='button' value='Transfer' />
		</form>
	);
}

export default Transfer;
