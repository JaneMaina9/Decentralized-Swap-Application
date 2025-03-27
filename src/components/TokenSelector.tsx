import React, { useEffect, useState, useRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
type Token = {
  symbol: string;
  name: string;
  balance: string;
  logo: string;
};
type TokenSelectorProps = {
  label: string;
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  disabled?: boolean;
};
const TokenSelector = ({
  label,
  tokens,
  selectedToken,
  onSelect,
  disabled = false
}: TokenSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <button type="button" onClick={() => !disabled && setIsOpen(!isOpen)} className={`w-full flex items-center justify-between bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={disabled}>
        {selectedToken ? <div className="flex items-center gap-2">
            <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
            <span className="text-white font-medium">
              {selectedToken.symbol}
            </span>
          </div> : <span className="text-gray-400">Select token</span>}
        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
      </button>
      {isOpen && <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto">
          {tokens.map(token => <div key={token.symbol} onClick={() => {
        onSelect(token);
        setIsOpen(false);
      }} className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer">
              <div className="flex items-center gap-2">
                <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                <div>
                  <div className="text-white font-medium">{token.symbol}</div>
                  <div className="text-gray-400 text-sm">{token.name}</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                Balance: {token.balance}
              </div>
            </div>)}
        </div>}
    </div>;
};
export default TokenSelector;