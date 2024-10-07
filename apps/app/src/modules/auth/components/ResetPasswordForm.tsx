'use client';
import type { FC } from 'react';
import React, { useState } from 'react';
import { Button, useToast } from 'ui';
import { useRouter } from 'next/navigation';
import { AppForm } from '../../../components/form/AppForm';
import type { ResetPasswordFormValues } from '../validations/ResetPasswordSchema';
import { resetPasswordSchema } from '../validations/ResetPasswordSchema';
import { FormInputField } from '../../../components/form/FormInputField';
import createSupabaseClientClient from '../../../../lib/supabase/client';

export const ResetPasswordForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const { toast } = useToast();

  const onSubmit = async ({ password }: ResetPasswordFormValues) => {
    setIsLoading(true);
    const supabase = createSupabaseClientClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    try {
      if (error) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully.',
      });
      push('/');
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
      <AppForm onSubmit={onSubmit} schema={resetPasswordSchema}>
        <div className='flex flex-col gap-4'>
          <FormInputField<ResetPasswordFormValues>
            label='Password'
            path='password'
            placeholder='********'
            type='password'
          />
          <FormInputField<ResetPasswordFormValues>
            label='Confirm Password'
            path='confirmPassword'
            placeholder='********'
            type='password'
          />
          <Button loading={isLoading} type='submit'>
            Reset Password
          </Button>
        </div>
      </AppForm>
    </div>
  );
};
