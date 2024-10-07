'use client';

import { Button } from 'ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className='flex h-full w-full flex-col items-center justify-center gap-4'>
        <h2>Something went wrong!</h2>
        <pre>{error.message}</pre>
        <Button
          onClick={() => {
            reset();
          }}
        >
          Try again
        </Button>
      </body>
    </html>
  );
}
