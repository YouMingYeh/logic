'use client';
import { Icons, buttonVariants, cn, useToast } from 'ui';
import { signInWithFacebook } from '../../../app/auth/actions';

export const LoginWithFacebookButton = () => {
  const { toast } = useToast();
  const onClick = async () => {
    const error = await signInWithFacebook();
    if (error) {
      toast({ title: error.message, variant: 'destructive' });
    }
  };
  return (
    <button
      className={cn(buttonVariants({ variant: 'outline' }))}
      disabled
      onClick={onClick}
      type='button'
    >
      <Icons.Facebook className='mr-2 h-4 w-4' />
      Login with Facebook (Under construction 👷‍♂️)
    </button>
  );
};
