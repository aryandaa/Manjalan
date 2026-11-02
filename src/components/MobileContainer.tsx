import React from 'react';

export default function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-container selection:text-white">
      <div className="w-full min-h-screen flex flex-col relative">
        {children}
      </div>
    </div>
  );
}
