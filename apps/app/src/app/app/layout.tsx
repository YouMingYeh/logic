import type { ReactNode } from 'react';
import React, { Suspense } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {children}
    </div>
  );
};

export default Layout;
