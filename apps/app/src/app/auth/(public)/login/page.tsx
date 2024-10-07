import type { NextPage } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from 'ui';
import { LoginAuthForm } from '../../../../modules/auth/components/LoginAuthForm';
import { SplashImage } from '../../../../components/other/splash-image';

const Page: NextPage = () => {
  return (
    <>
      <div className='flex flex-col gap-y-2 text-center' >
        <SplashImage />
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-muted-foreground text-sm'>
          Please enter your email and password to login.
        </p>
      </div>
      <Suspense fallback={<Skeleton className='h-16 w-full' />}>
        <LoginAuthForm />
      </Suspense>
      <p className='text-muted-foreground px-8 text-center text-sm'>
        <Link
          className='hover:text-brand underline underline-offset-4'
          href='/auth/register'
        >
          Don't have an account? Register
        </Link>
      </p>
    </>
  );
};

export default Page;
