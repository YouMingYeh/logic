import Image from 'next/image';

export default function Loading() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='space-y-6'>
        <Image
          src='/loading.svg'
          className='h-32 w-32'
          alt='Loading'
          width={128}
          height={128}
        />
        <div className='flex items-center justify-center'>
          <p className='text-lg font-semibold'>logic</p>
        </div>
      </div>
    </div>
  );
}
