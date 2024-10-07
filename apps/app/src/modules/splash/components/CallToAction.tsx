import Link from 'next/link';
import { buttonVariants, cn, Icons } from 'ui';

export default function CallToAction() {
  return (
    <div className='relative mb-36 w-[24rem]'>
      <Link className={cn(buttonVariants({ size: 'lg' }))} href='/auth/login'>
        Make Better Decisions Now <Icons.Network className='ml-2' />
      </Link>
    </div>
  );
}
