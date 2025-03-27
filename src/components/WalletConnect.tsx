import React, { useState } from 'react';
import { useDApp } from './DAppContext';
import { WalletIcon, LogOutIcon, Loader2Icon, XIcon } from 'lucide-react';
const WalletConnect = () => {
  const {
    connected,
    connecting,
    account,
    wallets,
    selectedWallet,
    connect,
    disconnect
  } = useDApp();
  const [showWalletList, setShowWalletList] = useState(false);
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  const handleWalletSelect = (walletId: string) => {
    connect(walletId);
    setShowWalletList(false);
  };
  if (connected && account) {
    return <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {selectedWallet && <img src={selectedWallet.logo} alt={selectedWallet.name} className="w-5 h-5" />}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-white font-medium">
                {formatAddress(account)}
              </span>
            </div>
          </div>
          <button onClick={disconnect} className="text-gray-400 hover:text-white transition-colors" aria-label="Disconnect wallet">
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>;
  }
  return <div className="mb-6 relative">
      {!showWalletList ? <button onClick={() => setShowWalletList(true)} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
          <WalletIcon className="w-5 h-5" />
          Connect Wallet
        </button> : <div className="absolute top-0 left-0 w-full bg-gray-800 rounded-lg shadow-xl p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Connect Wallet</h3>
            <button onClick={() => setShowWalletList(false)} className="text-gray-400 hover:text-white transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {wallets.map(wallet => <button key={wallet.id} onClick={() => handleWalletSelect(wallet.id)} disabled={connecting} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
                <img src={wallet.logo} alt={wallet.name} className="w-8 h-8" />
                <span className="text-white font-medium">{wallet.name}</span>
                {connecting && selectedWallet?.id === wallet.id && <Loader2Icon className="w-5 h-5 animate-spin ml-auto" />}
              </button>)}
          </div>
        </div>}
    </div>;
};
export default WalletConnect;