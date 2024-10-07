import type { DefaultValues, FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import type { Schema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type ReactNode } from 'react';

export type AppFormProps<T extends FieldValues> = {
  onSubmit: (input: T) => void;
  shouldUnregister?: boolean;
  defaultValues?: DefaultValues<T>;
  children: ReactNode;
  schema: Schema<T>;
};

export function AppForm<T extends FieldValues>({
  defaultValues,
  onSubmit,
  children,
  schema,
  shouldUnregister = true,
}: AppFormProps<T>) {
  const methods = useForm<T>({
    mode: 'onChange',
    shouldUseNativeValidation: false,
    defaultValues,
    resolver: zodResolver(schema),
    shouldUnregister,
    delayError: 2000,
  });

  const handleSubmit = methods.handleSubmit(onSubmit);

  const reset = methods.reset;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <form className='h-full w-full' onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  );
}
