import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants, Icons } from 'ui';

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='mb-4 space-y-6'>
        <div className='flex items-center justify-center'>
          <Image src="/logo.png" alt='logo' height='512' width='512' className='h-32 w-32' />
        </div>
        <div className='flex items-center justify-center'>
          <p className='text-lg font-semibold'>Oops! 找不到頁面</p>
        </div>
      </div>
      <Link className={buttonVariants({})} href='/'>
        回到首頁
      </Link>
    </div>
  );
}
