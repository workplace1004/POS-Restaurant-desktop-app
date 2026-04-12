import React from 'react';

export function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-black">
      <span
        className="inline-block w-14 h-14 border-4 border-black border-t-white rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="text-2xl font-medium">{label}</span>
    </div>
  );
}

