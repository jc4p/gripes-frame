'use client';

import { useState, useRef, useEffect } from "react";
import styles from "../app/page.module.css";
import * as frame from '@farcaster/frame-sdk';

export default function HomeComponent() {
  const [lines, setLines] = useState([]);
  const linesRef = useRef([]);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const addLine = (line) => {
    const newLines = [...linesRef.current, line];
    linesRef.current = newLines;
    setLines(newLines);
  };

  const handleGenerate = async () => {
    const message = 'By signing this message, you are creating a unique anonymous key for your account. This does not initiate a blockchain transaction or cost any gas fees.'

    addLine('Attempting to switch to Base...');

    // switch to Base if we're not already on it
    await frame.sdk.wallet.ethProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }] // Base mainnet chainId
    });

    addLine('Switched to Base, getting accounts...');

    const accounts = await frame.sdk.wallet.ethProvider.request({
      method: 'eth_requestAccounts'
    });

    const walletAddress = accounts[0];

    addLine('Got wallet address: ' + walletAddress);

    addLine('Getting chainId...');

    const chainId = await frame.sdk.wallet.ethProvider.request({ method: 'eth_chainId' });

    addLine('Got chainId: ' + parseInt(chainId, 16));

    const typedData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Message: [
          { name: 'content', type: 'string' },
          { name: 'userAddress', type: 'address' }
        ]
      },
      primaryType: 'Message',
      domain: {
        name: 'Anonymous Gripes',
        version: '1',
        chainId: parseInt(chainId, 16),
        verifyingContract: '0x0000000000000000000000000000000000000000'
      },
      message: {
        content: message,
        userAddress: walletAddress
      }
    };

    addLine('Requesting message signature...');

    try {
      const signature = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_signTypedData_v4',
        params: [walletAddress, JSON.stringify(typedData)],
        from: walletAddress,
      })

      addLine('Signature: ' + signature);
    } catch (error) {
      console.error('Error generating signature:', error);
      addLine('Error generating signature: ' + error.message);
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