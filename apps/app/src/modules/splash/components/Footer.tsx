import Link from 'next/link';
import { ThemeToggle } from '../../../components/layouts/ThemeToggle';

export default function Footer() {
  return (
    <footer className='container'>
      <div className='mx-auto flex max-w-6xl items-center justify-between py-4 md:py-6'>
        <p className='text-center text-sm leading-loose sm:text-left'>
          Built by logic team.
        </p>
        {/* Privacy Policy & Terms of Services & contact us */}

        <ThemeToggle />
      </div>

      <div className='mx-auto flex max-w-6xl items-center justify-between py-4 md:py-6'>
        <p>
          {/* all right reserved */}

          <Link
            className='text-muted-foreground text-sm underline-offset-4 hover:underline'
            href='/privacy'
          >
            Privacy Policy
          </Link>
          <span className='mx-2'>|</span>
          <Link
            className='text-muted-foreground text-sm underline-offset-4 hover:underline'
            href='/terms'
          >
            Terms of Service
          </Link>
          <span className='mx-2'>|</span>
          <Link
            className='text-muted-foreground text-sm underline-offset-4 hover:underline'
            href='mailto:b10705052@ntu.edu.tw'
          >
            Contact Us
          </Link>
          <br />
          <span className='text-muted-foreground text-sm'>
            © 2024 logic. All rights reserved.
          </span>
        </p>
      </div>
    </footer>
  );
}
