'use client';

import { useState } from "react";
import styles from "../app/page.module.css";
import * as frame from '@farcaster/frame-sdk';

export default function HomeComponent() {
  const [lines, setLines] = useState([]);

  const handleGenerate = async () => {
    const message = 'Generating zero-knowledge proof for Anonymous Gripes app'

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
        DeterministicKey: [
          { name: 'userAddress', type: 'address' },
          { name: 'appId', type: 'string' },
          { name: 'nonce', type: 'uint256' }
        ]
      },
      primaryType: 'DeterministicKey',
      domain: {
        name: 'Anonymous Gripes',
        version: '1',
        chainId: parseInt(chainId, 16),
        verifyingContract: '0x0000000000000000000000000000000000000000'
      },
      message: {
        userAddress: userAddress,
        appId: 'anonymous-gripes',
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