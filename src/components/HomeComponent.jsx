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

    const signature = await frame.sdk.wallet.ethProvider.request({
      method: 'eth_signTypedData_v4',
      params: [walletAddress, message],
      from: walletAddress,
    })

    setLines([...lines, signature]);
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