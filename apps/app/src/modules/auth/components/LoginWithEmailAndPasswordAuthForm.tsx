'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Button, Label, useToast } from 'ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from '../../../app/auth/actions';
import { FormInputField } from '../../../components/form/FormInputField';
import { AppForm } from '../../../components/form/AppForm';
import type { LoginEmailAndPasswordFormValues } from '../validations';
import { loginWithEmailAndPasswordSchema } from '../validations';

const LoginWithEmailAndPasswordAuthForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const { toast } = useToast();

  const onSubmit = async (formValues: LoginEmailAndPasswordFormValues) => {
    setIsLoading(true);

    const { error } = await signInWithEmailAndPassword(formValues);

    try {
      if (error) {
        toast({ title: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Success', description: 'Logged in successfully.' });
      push('/app');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <AppForm onSubmit={onSubmit} schema={loginWithEmailAndPasswordSchema}>
        <div className='flex flex-col gap-4'>
          <FormInputField<LoginEmailAndPasswordFormValues>
            label='Email'
            path='email'
            placeholder='name@example.com'
          />

          <div className='flex flex-col gap-1'>
            <FormInputField<LoginEmailAndPasswordFormValues>
              label='Password'
              path='password'
              placeholder='********'
              type='password'
            />
            <p className='text-muted-foreground text-right text-xs'>
              <Link
                className='hover:text-brand hover:underline hover:underline-offset-4'
                href='/auth/forgot-password'
              >
                Forgot Password?
              </Link>
            </p>
          </div>
          <Label className='text-muted-foreground text-sm'>
            ❗ Remember to check your email after registration first.
          </Label>
          <Button loading={isLoading} type='submit'>
            Login
          </Button>
        </div>
      </AppForm>
    </div>
  );
};
export default LoginWithEmailAndPasswordAuthForm;
