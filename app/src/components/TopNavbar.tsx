import styles from '../styles/TopNavbar.module.css'
import React, { useState, useEffect } from 'react';
import contractData from '../constants/contractData.json';
import {
  RpcProvider,
  Contract,
  CallData,
  WalletAccount,
  cairo,
} from 'starknet';
import { connect } from 'get-starknet';
import { getStarknetRpcUrl } from '../utils/env';
import { getSystemErrorMap } from 'util';


const shortenChips = (chips: string) => {
  while (chips.length < 19) {
    chips = '0' + chips;
  }
  if (chips.length <= 12) {
    return '0.0';
  }
  const shortened = chips.slice(0, -12);
  return `${shortened.slice(0, -6)}.${shortened.slice(-6)}`;
};

export default function TopNavbar() {
  const [availableChips, setAvailableChips] = useState('0');
  const [pokerContract, setPokerContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
      const handleConnectWallet = async () => {
        try {
          const selectedWalletSWO = await connect({ modalTheme: 'dark' });
          const wallet = await new WalletAccount(
            { nodeUrl: getStarknetRpcUrl() },
            selectedWalletSWO,
          );
  
          if (wallet) {
            setConnection(wallet);
            setAddress(wallet.walletProvider.selectedAddress);
          }
        } catch (error) {
          console.error('Error connecting wallet:', error);
          // toast.error("Failed to connect wallet. Please try again.");
        }
      };
  
      handleConnectWallet();
      fetchAvailableChips();
    }, [address]);

  const provider = new RpcProvider({
      nodeUrl: getStarknetRpcUrl(),
    });

  const getContract = async () => {
    if (pokerContract != null) {
      return pokerContract;
    }

    try {
      const { abi: contractAbi } = await provider.getClassAt(
        contractData.contractAddress,
      );
      if (contractAbi === undefined) {
        throw new Error('No ABI found for the contract.');
      }
      const contract = new Contract(
        contractAbi,
        contractData.contractAddress,
        provider,
      );
      setPokerContract(contract);
      return contract;
    } catch (error) {
      console.error('Error getting contract:', error);
      // toast.error(
      //   'Failed to interact with the game contract. Please try again.',
      // );
      return null;
    }
  };

  const fetchAvailableChips = async () => {
    const contract = await getContract();
    const balance = await contract.balanceOf(address);
    console.log(balance.toString());
    setAvailableChips(shortenChips(balance.toString()));
    // console.log('Available Chips:', balance);
    // console.log(shortenChips(balance.toString()));
  };



  return (
    <header className={styles.header}>
      <div className={styles.logo}>MeroDeck</div>
      <div className={styles.wallet}>Available Chips: {availableChips}</div>
    </header>
  )
}

