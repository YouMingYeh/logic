'use client';
import type { NextPage } from 'next';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  useToast,
} from 'ui';
import { useRouter, useSearchParams } from 'next/navigation';
import createSupabaseClientClient from '../../../../../lib/supabase/client';
import { SplashImage } from '../../../../components/other/splash-image';

const Page: NextPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();
  const { push } = useRouter();

  const handleOnChange = async (otp: string) => {
    if (otp.length < 6) {
      return;
    }
    const supabase = createSupabaseClientClient();
    if (!email) {
      return;
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      toast({ title: 'Invalid OTP', description: 'Please try again.' });
      return;
    }

    toast({
      title: 'Success',
      description: 'OTP verified successfully.',
    });

    const { user } = data;

    if (!user) {
      return null;
    }

    setTimeout(() => {
      push('/app');
    }, 500);
  };

  return (
    <>
      <div className='flex flex-col gap-y-2 text-center'>
        <SplashImage />
        <h1 className='text-2xl font-semibold tracking-tight'>Enter OTP</h1>
        <p className='text-muted-foreground text-sm'>
          Please check your email for the OTP.
        </p>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <Label className='mb-2' htmlFor='otp'>
          Please enter the 6-digit OTP
        </Label>
        <InputOTP maxLength={6} onChange={handleOnChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </>
  );
};

export default Page;
