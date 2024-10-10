import Link from 'next/link';
import { buttonVariants, cn, Icons } from 'ui';

export default function CallToAction() {
  const randomCTA = CTAs[Math.floor(Math.random() * CTAs.length)];
  return (
    <div className='relative mb-36 w-[24rem]'>
      <Link className={cn(buttonVariants({ size: 'lg' }))} href='/auth/login'>
        {randomCTA} <Icons.Network className='ml-2' />
      </Link>
    </div>
  );
}

const CTAs = [
  'Start Solving Smarter Today',
  'Elevate Your Thinking Now',
  'Unlock Strategic Insights',
  'Think Bigger, Act Smarter',
  'MLead with Clarity, Think with Confidence',
];
