import React from 'react';
import SwapInterface from './components/SwapInterface';
import { DAppProvider } from './components/DAppContext';
export function App() {
  return <DAppProvider>
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Token Swap
          </h1>
          <SwapInterface />
        </div>
      </div>
    </DAppProvider>;
}