'use client';

import type { FC } from 'react';
import { Suspense, lazy, useState } from 'react';
import { buttonVariants, cn, Icons, Skeleton } from 'ui';
import { LoginWithGoogleButton } from './LoginWithGoogleButton ';
import { LoginWithFacebookButton } from './LoginWithFacebookButton ';

enum AuthFormType {
  EmailAndPassword = 'emailAndPassword',
  MagicLink = 'magicLink',
}

const LoginWithEmailAndPasswordAuthForm = lazy(
  () => import('./LoginWithEmailAndPasswordAuthForm'),
);
const LoginWithEmailAuthForm = lazy(() => import('./LoginWithEmailAuthForm')); // Assuming you also have a component for this

const authFormMapper: Record<AuthFormType, JSX.Element> = {
  emailAndPassword: <LoginWithEmailAndPasswordAuthForm />,
  magicLink: <LoginWithEmailAuthForm />,
};

export const LoginAuthFormLoading: FC = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-8' />
      <Skeleton className='h-8' />
    </div>
  );
};

export const LoginAuthForm: FC = () => {
  const [currentForm, setCurrentForm] = useState<AuthFormType>(
    AuthFormType.EmailAndPassword,
  );

  const isMagicLinkForm = currentForm === AuthFormType.MagicLink;

  return (
    <div className='flex flex-col gap-6'>
      <Suspense fallback={<LoginAuthFormLoading />}>
        {authFormMapper[currentForm]}
      </Suspense>

      <div className='flex flex-col gap-6'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <button
            className={cn(buttonVariants({ variant: 'outline' }))}
            onClick={() => {
              setCurrentForm(
                isMagicLinkForm
                  ? AuthFormType.EmailAndPassword
                  : AuthFormType.MagicLink,
              );
            }}
            type='button'
          >
            <Icons.Mail className='mr-2 h-4 w-4' />
            {isMagicLinkForm ? 'Login with email and password' : 'Login with email OTP'}
          </button>
          <LoginWithGoogleButton />

          <LoginWithFacebookButton />
        </div>
      </div>
    </div>
  );
};
