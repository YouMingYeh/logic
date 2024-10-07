import type { ZodType } from 'zod';
import { z } from 'zod';

export type RegisterEmailAndPasswordFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const registerWithEmailAndPasswordSchema: ZodType<RegisterEmailAndPasswordFormValues> =
  z
    .object({
      email: z
        .string({
          invalid_type_error: 'Email is required',
          required_error: 'Email is required.',
        })
        .email({
          message: 'Invalid email.',
        }),
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
