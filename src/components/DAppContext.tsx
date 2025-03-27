import React, { useState, createContext, useContext } from 'react';
// Updated token data
const TOKENS = [{
  symbol: 'ETH',
  name: 'Ethereum',
  balance: '1.45',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
}, {
  symbol: 'WETH',
  name: 'Wrapped Ethereum',
  balance: '2.35',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
}, {
  symbol: 'USDC',
  name: 'USD Coin',
  balance: '2,500.00',
  logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
}, {
  symbol: 'USDT',
  name: 'Tether USD',
  balance: '1,800.50',
  logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
}, {
  symbol: 'BNB',
  name: 'Binance Coin',
  balance: '12.75',
  logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
}];

// Add wallet options data
const WALLETS = [{
  id: 'metamask',
  name: 'MetaMask',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
}, {
  id: 'coinbase',
  name: 'Coinbase Wallet',
  logo: 'https://storage.googleapis.com/coinbase-wallet-assets/icons/wallet-icon.png'
}, {
  id: 'backpack',
  name: 'Backpack',
  logo: 'https://backpack.app/_next/static/media/logomark.d31cabd2.svg'
}, {
  id: 'rabby',
  name: 'Rabby Wallet',
  logo: 'https://rabby.io/assets/logo.svg'
}, {
  id: 'haha',
  name: 'Haha Wallet',
  logo: 'https://www.hahawallet.com/favicon.ico'
}];
type Token = {
  symbol: string;
  name: string;
  balance: string;
  logo: string;
};
type Wallet = {
  id: string;
  name: string;
  logo: string;
};
type DAppContextType = {
  connected: boolean;
  connecting: boolean;
  account: string | null;
  tokens: Token[];
  pendingTx: string | null;
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  connect: (walletId: string) => void;
  disconnect: () => void;
  executeSwap: (fromToken: Token, toToken: Token, amount: string) => Promise<void>;
};
const DAppContext = createContext<DAppContextType | undefined>(undefined);
export function DAppProvider({
  children
}: {
  children: ReactNode;
}) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [pendingTx, setPendingTx] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const connect = (walletId: string) => {
    setConnecting(true);
    const wallet = WALLETS.find(w => w.id === walletId);
    setSelectedWallet(wallet || null);
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    }, 1500);
  };
  const disconnect = () => {
    setConnected(false);
    setAccount(null);
    setSelectedWallet(null);
  };
  const executeSwap = async (fromToken: Token, toToken: Token, amount: string) => {
    setPendingTx('pending');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPendingTx('0x123...abc');
    setTimeout(() => setPendingTx(null), 5000);
  };
  return <DAppContext.Provider value={{
    connected,
    connecting,
    account,
    tokens: TOKENS,
    pendingTx,
    wallets: WALLETS,
    selectedWallet,
    connect,
    disconnect,
    executeSwap
  }}>
      {children}
    </DAppContext.Provider>;
}
export function useDApp() {
  const context = useContext(DAppContext);
  if (context === undefined) {
    throw new Error('useDApp must be used within a DAppProvider');
  }
  return context;
}