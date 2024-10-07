'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Button, Label, useToast } from 'ui';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '../../../app/auth/actions';
import { FormInputField } from '../../../components/form/FormInputField';
import { AppForm } from '../../../components/form/AppForm';
import type { EmailFormValues } from '../validations';
import { emailFormSchema } from '../validations';

const LoginWithEmailAuthForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { push } = useRouter();

  const onSubmit = async ({ email }: EmailFormValues) => {
    setIsLoading(true);

    const { error } = await signInWithEmail(email);

    try {
      if (error) {
        toast({ title: error.message, variant: 'destructive' });
        return;
      }

      toast({
        title: 'Please check your email',
        description:
          'We have sent you an email with instructions to login with the code.',
      });
      push(`/auth/otp?email=${email}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'You might not have registered with this email yet.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <AppForm onSubmit={onSubmit} schema={emailFormSchema}>
        <div className='flex flex-col gap-4'>
          <FormInputField<EmailFormValues>
            label='Email'
            path='email'
            placeholder='name@example.com'
          />
          <Label className='text-muted-foreground text-sm'>
            ❗You must have registered with this email to receive the code.
          </Label>
          <Button loading={isLoading} type='submit'>
            Send Login Code
          </Button>
        </div>
      </AppForm>
    </div>
  );
};
export default LoginWithEmailAuthForm;
