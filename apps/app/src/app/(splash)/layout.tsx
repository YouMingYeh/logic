import type { ReactNode } from 'react';
import { NavBar } from '../../components/layouts/Navbar';
import Footer from '../../modules/splash/components/Footer';

const LandingLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-screen flex-col overflow-auto'>
      <header>
        <NavBar />
      </header>
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
