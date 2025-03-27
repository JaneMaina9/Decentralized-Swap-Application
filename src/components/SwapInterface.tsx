import React, { useState } from 'react';
import { ArrowDownIcon, RefreshCwIcon } from 'lucide-react';
import WalletConnect from './WalletConnect';
import TokenSelector from './TokenSelector';
import { useDApp } from './DAppContext';
const SwapInterface = () => {
  const {
    connected,
    tokens,
    pendingTx,
    executeSwap
  } = useDApp();
  const [fromToken, setFromToken] = useState<any>(null);
  const [toToken, setToToken] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('0');
  const handleFromTokenSelect = (token: any) => {
    setFromToken(token);
    if (toToken) {
      calculateEstimatedAmount(amount, token, toToken);
    }
  };
  const handleToTokenSelect = (token: any) => {
    setToToken(token);
    if (fromToken && amount) {
      calculateEstimatedAmount(amount, fromToken, token);
    }
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (fromToken && toToken) {
      calculateEstimatedAmount(value, fromToken, toToken);
    }
  };
  const calculateEstimatedAmount = (inputAmount: string, from: any, to: any) => {
    const amount = parseFloat(inputAmount || '0');
    if (amount <= 0 || isNaN(amount)) {
      setEstimatedAmount('0');
      return;
    }
    const rates: Record<string, Record<string, number>> = {
      ETH: {
        WETH: 1,
        USDC: 2500,
        USDT: 2500,
        BNB: 15
      },
      WETH: {
        ETH: 1,
        USDC: 2500,
        USDT: 2500,
        BNB: 15
      },
      USDC: {
        ETH: 0.0004,
        WETH: 0.0004,
        USDT: 1,
        BNB: 0.006
      },
      USDT: {
        ETH: 0.0004,
        WETH: 0.0004,
        USDC: 1,
        BNB: 0.006
      },
      BNB: {
        ETH: 0.067,
        WETH: 0.067,
        USDC: 167,
        USDT: 167
      }
    };
    if (from.symbol === to.symbol) {
      setEstimatedAmount(inputAmount);
    } else {
      const rate = rates[from.symbol][to.symbol];
      const estimated = (amount * rate).toFixed(6);
      setEstimatedAmount(estimated);
    }
  };
  const handleSwapClick = async () => {
    if (fromToken && toToken && amount && parseFloat(amount) > 0) {
      await executeSwap(fromToken, toToken, amount);
    }
  };
  const handleSwitchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    if (fromToken && toToken && amount) {
      calculateEstimatedAmount(amount, toToken, fromToken);
    }
  };
  return <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <WalletConnect />
      <div className="space-y-4">
        <div>
          <TokenSelector label="From" tokens={tokens} selectedToken={fromToken} onSelect={handleFromTokenSelect} disabled={!connected} />
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-400">
                Amount
              </label>
              {fromToken && <span className="text-sm text-gray-400">
                  Balance: {fromToken.balance} {fromToken.symbol}
                </span>}
            </div>
            <input type="number" value={amount} onChange={handleAmountChange} placeholder="0.0" disabled={!connected || !fromToken} className="w-full bg-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-center">
          <button onClick={handleSwitchTokens} disabled={!connected || !fromToken || !toToken} className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50">
            <ArrowDownIcon className="w-5 h-5 text-blue-400" />
          </button>
        </div>
        <div>
          <TokenSelector label="To" tokens={tokens} selectedToken={toToken} onSelect={handleToTokenSelect} disabled={!connected} />
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-400">
                Estimated Amount
              </label>
              {toToken && <span className="text-sm text-gray-400">
                  Balance: {toToken.balance} {toToken.symbol}
                </span>}
            </div>
            <div className="w-full bg-gray-700 rounded-lg p-3 text-white">
              {estimatedAmount} {toToken?.symbol || ''}
            </div>
          </div>
        </div>
        <button onClick={handleSwapClick} disabled={!connected || !fromToken || !toToken || !amount || parseFloat(amount) <= 0 || !!pendingTx} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          {pendingTx === 'pending' ? <>
              <RefreshCwIcon className="w-5 h-5 animate-spin" />
              Transaction Processing...
            </> : pendingTx ? 'Transaction Confirmed!' : !connected ? 'Connect Wallet to Swap' : !fromToken || !toToken ? 'Select Tokens' : !amount || parseFloat(amount) <= 0 ? 'Enter an Amount' : `Swap ${fromToken.symbol} for ${toToken.symbol}`}
        </button>
        {pendingTx && pendingTx !== 'pending' && <div className="mt-2 text-center">
            <a href={`https://etherscan.io/tx/${pendingTx}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
              View on Etherscan
            </a>
          </div>}
      </div>
    </div>;
};
export default SwapInterface;