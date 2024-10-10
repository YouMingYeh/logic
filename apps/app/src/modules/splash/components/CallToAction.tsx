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
  'Think Smarter Today',
  'Elevate Your Decision-Making',
  'Solve Big Problems',
  'Elevate Your Thinking',
  'Master Strategic Thinking',
  'Lead with Confidence',
];
