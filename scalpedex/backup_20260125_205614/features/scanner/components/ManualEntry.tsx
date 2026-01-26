'use client';

import React, { useState } from 'react';

interface ManualEntryProps {
  onSubmit: (barcode: string) => void;
}

export function ManualEntry({ onSubmit }: ManualEntryProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const isValidBarcode = (code: string) => /^\d{8,13}$/.test(code);

  const handleSubmit = () => {
    if (isValidBarcode(manualBarcode)) {
      onSubmit(manualBarcode);
      setManualBarcode('');
    }
  };

  return (
    <div className="flex gap-2">
      <input 
        type="text"
        value={manualBarcode}
        onChange={(e) => setManualBarcode(e.target.value.replace(/[^\d]/g, ''))}
        placeholder="Ex: 0123456789"
        className={`flex-1 px-4 py-2.5 bg-black/20 rounded-lg 
                  border ${!manualBarcode || isValidBarcode(manualBarcode) 
                    ? 'border-violet-800/50 focus:border-violet-600' 
                    : 'border-red-500/50 focus:border-red-500'} 
                  text-white placeholder-violet-400 text-sm
                  focus:outline-none focus:ring-1 focus:ring-violet-600/50
                  transition-colors`}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        disabled={!isValidBarcode(manualBarcode)}
        className={`px-4 rounded-lg font-medium transition-all
                  ${isValidBarcode(manualBarcode)
                    ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                    : 'bg-violet-900/20 text-violet-400 cursor-not-allowed'}`}
      >
        OK
      </button>
    </div>
  );
}