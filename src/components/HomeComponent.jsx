'use client';

import { useState } from "react";
import styles from "../app/page.module.css";
import * as frame from '@farcaster/frame-sdk';

export default function HomeComponent() {
  const [lines, setLines] = useState([]);

  const handleGenerate = async () => {
    const message = 'By signing this message, you are creating a unique anonymous key for your account. This does not initiate a blockchain transaction or cost any gas fees.'

    // switch to Base if we're not already on it
    await frame.sdk.wallet.ethProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }] // Base mainnet chainId
    });

    const accounts = await frame.sdk.wallet.ethProvider.request({
      method: 'eth_requestAccounts'
    });

    const walletAddress = accounts[0];

    const chainId = await provider.request({ method: 'eth_chainId' });

    const typedData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        AuthorizationMessage: [ // Using a descriptive type name
          { name: 'title', type: 'string' }, // Add user-friendly fields
          { name: 'description', type: 'string' },
          { name: 'userAddress', type: 'address' },
          { name: 'nonce', type: 'uint256' }
        ]
      },
      primaryType: 'AuthorizationMessage',
      domain: {
        name: 'Anonymous Gripes',
        version: '1',
        chainId: parseInt(chainId, 16),
        verifyingContract: '0x0000000000000000000000000000000000000000'
      },
      message: {
        title: 'Generate zero-knowledge proof',
        description: message,
        userAddress: userAddress,
        nonce: 1
      }
    };

    try {
      const signature = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_signTypedData_v4',
        params: [walletAddress, JSON.stringify(typedData)],
        from: walletAddress,
      })

      setLines([...lines, signature]);
    } catch (error) {
      console.error('Error generating signature:', error);
      setLines([...lines, 'Error generating signature' + error.message]);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.textboxContainer}>
          <div className={styles.textbox}>
            {lines.map((line, index) => (
              <div key={index} className={styles.line}>
                {line}
              </div>
            ))}
          </div>
          <button 
            onClick={handleGenerate}
            className={styles.generateButton}
          >
            Generate zk proof
          </button>
        </div>
      </main>
    </div>
  );
} 