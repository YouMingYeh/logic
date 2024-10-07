'use client';

import type { NextPage } from 'next';
import { ResetPasswordForm } from '../../../modules/auth/components/ResetPasswordForm';
import Image from 'next/image';

const Page: NextPage = () => {
  return (
    <div className='mx-auto flex h-screen w-full flex-col justify-center gap-6 overflow-auto py-8 sm:w-[350px]'>
      <div className='flex flex-col gap-y-2 text-center'>
      <Image src="/logo.png" alt='logo' height='512' width='512' className='mx-auto h-16 w-16' />
        <h1 className='text-2xl font-semibold tracking-tight'>Reset Password</h1>
        <p className='text-muted-foreground text-sm'>
          Please enter your new password.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
};

export default Page;
