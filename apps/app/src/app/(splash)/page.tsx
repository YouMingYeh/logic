import type { NextPage } from 'next';
import { SplashHeader } from '../../modules/splash/components/SplashHeader';
import { SplashContent } from '../../modules/splash/components/SplashContent';
import { SplashImage } from '../../components/other/splash-image';
import CallToAction from '../../modules/splash/components/CallToAction';
import { Suspense, useMemo } from 'react';

const Page: NextPage = () => {

  return (
    <section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
      <div className='grid grid-cols-1 place-items-center md:grid-cols-2'>
        <div className='container order-2 mt-8 flex max-w-[64rem] flex-col items-center gap-4 text-center sm:order-1'>
          <SplashHeader />
          <SplashContent />
          <Suspense fallback={null}>
            <CallToAction />
          </Suspense>
        </div>

        <SplashImage className='order-1 sm:order-2' />
      </div>
    </section>
  );
};

export default Page;
