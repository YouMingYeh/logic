import type { NextPage } from 'next';
import Link from 'next/link';
import { RegisterWithEmailAndPasswordAuthForm } from '../../../../modules/auth/components/RegisterWithEmailAndPasswordAuthForm';
import { SplashImage } from '../../../../components/other/splash-image';

const Page: NextPage = () => {
  return (
    <>
      <div className='flex flex-col gap-y-2 text-center'>
        <SplashImage />
        <h1 className='text-2xl font-semibold tracking-tight'>Register Now</h1>
        <p className='text-muted-foreground text-sm'>
          Please enter your email, password, and confirm password to register.
        </p>
      </div>
      <RegisterWithEmailAndPasswordAuthForm />
      <p className='text-muted-foreground px-8 text-center text-sm'>
        <Link
          className='hover:text-brand underline underline-offset-4'
          href='/auth/login'
        >
          Already have an account? Login
        </Link>
      </p>
    </>
  );
};

export default Page;
