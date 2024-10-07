import type { ZodType } from 'zod';
import { z } from 'zod';

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export const resetPasswordSchema: ZodType<ResetPasswordFormValues> = z
  .object({
    password: z
      .string({
        required_error: 'Password is required.',
        invalid_type_error: 'Password is required.',
      })
      .min(6, { message: 'Password must be at least 6 characters long.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: 'Password must contain at least one letter and one number.',
      }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required.',
      invalid_type_error: 'Confirm password is required.',
    }),
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
