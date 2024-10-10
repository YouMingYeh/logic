'use client';
import { Button, Icons, useToast } from 'ui';
import { signInWithGoogle } from '../../../app/auth/actions';

export const LoginWithGoogleButton = () => {
  const { toast } = useToast();
  const onClick = async () => {
    const error = await signInWithGoogle();
    if (error) {
      toast({ title: error.message, variant: 'destructive' });
    }
  };
  return null
  return (
    <Button onClick={onClick} type='button' variant='outline' disabled className='overflow-ellipsis'>
      <Icons.Google className='mr-2 h-4 w-4 fill-current' />
      Login with Google (Under construction 👷‍♂️)
    </Button>
  );
};
