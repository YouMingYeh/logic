import type { ReactNode } from 'react';
import React from 'react';

const PublicAuthLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className='mx-auto flex h-screen w-full flex-col justify-center gap-6 overflow-auto sm:w-[400px] p-1'>
      {children}
    </div>
  );
};

export default PublicAuthLayout;
