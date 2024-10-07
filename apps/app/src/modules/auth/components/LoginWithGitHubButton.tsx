'use client';
import { Icons, buttonVariants, cn, useToast } from 'ui';
import { signInWithGithub } from '../../../app/auth/actions';

export const LoginWithGitHubButton = () => {
  const { toast } = useToast();
  const onClick = async () => {
    const error = await signInWithGithub();
    if (error) {
      toast({ title: error.message, variant: 'destructive' });
    }
  };
  return (
    <button
      className={cn(buttonVariants({ variant: 'outline' }))}
      onClick={onClick}
      type='button'
    >
      <Icons.Github className='mr-2 h-4 w-4' />
      Github
    </button>
  );
};
