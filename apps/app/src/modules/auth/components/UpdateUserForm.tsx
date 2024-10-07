'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Button, buttonVariants, cn, useToast } from 'ui';
import { z } from 'zod';
import Link from 'next/link';
import { AppForm } from '../../../components/form/AppForm';
import { FormInputField } from '../../../components/form/FormInputField';
import { updateUser } from '../actions';
import LogoutButton from '../../user/components/LogoutButton';

const updateUserFormSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+?\d+$/,
      'Phone number must be a string of numbers and may start with a plus',
    )
    .optional()
    .nullable(),
  email: z
    .string({
      invalid_type_error: 'Email is required',
      required_error: 'Email is required.',
    })
    .email({
      message: 'Invalid email.',
    })
    .optional()
    .nullable(),
});

type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

export const UpdateUserForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: UpdateUserFormValues) => {
    setIsLoading(true);

    const userData = {
      phone: data.phone || undefined,
      email: data.email || undefined,
    };

    const { error } = await updateUser(userData);

    try {
      if (error) {
        toast({ title: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'User updated!' });
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
    <AppForm onSubmit={onSubmit} schema={updateUserFormSchema}>
      <div className='flex flex-col gap-4'>
        <FormInputField
          label='Phone (Sorry, since we only support email for now, please leave it blank)'
          path='phone'
        />
        <FormInputField label='Email' path='email' />

        <Button disabled={isLoading} type='submit'>
          Save
        </Button>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>Or</span>
          </div>
        </div>
        <LogoutButton />
        <Link
          className={cn(buttonVariants({ variant: 'link' }))}
          href='/auth/reset-password'
          type='button'
        >
          Reset password?
        </Link>
      </div>
    </AppForm>
  );
};
