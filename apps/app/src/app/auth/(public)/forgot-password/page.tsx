import type { NextPage } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '../../../../modules/auth/components/ForgotPasswordForm';
import { SplashImage } from '../../../../components/other/splash-image';

const Page: NextPage = () => {
  return (
    <>
      <div className='flex flex-col gap-y-2 text-center'>
        <SplashImage />
        <h1 className='text-2xl font-semibold tracking-tight'>Forgot Password?</h1>
        <p className='text-muted-foreground text-sm'>
          Don't worry, enter your email and we'll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className='text-muted-foreground px-8 text-center text-sm'>
        Remember your password?{' '}
        <Link
          className='hover:text-brand underline underline-offset-4'
          href='/auth/login'
        >
          Login
        </Link>
      </p>
    </>
  );
};

export default Page;
