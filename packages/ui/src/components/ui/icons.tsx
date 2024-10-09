import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Github,
  Loader2,
  Menu,
  Moon,
  SunMedium,
  User,
  X,
  Timer,
  Settings,
  Search,
  Home,
  FolderKanban,
  CreditCard,
  Plus,
  PlusCircle,
  HelpCircle,
  Wand,
  Folder,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Snail,
  Turtle,
  Squirrel,
  Bird,
  Bug,
  Rat,
  Egg,
  CircleOff,
  AlignJustify,
  StickyNote,
  Sparkles,
  Edit,
  Pause,
  Play,
  BookCopyIcon,
  RotateCw,
  Download,
  Receipt,
  Quote,
  LogOut,
  Facebook,
  MessageCircle,
  Mail,
  Check,
  Rocket,
  RefreshCcw,
  Send,
  Heart,
  MessageSquare,
  Bell,
  ScanSearch,
  LibraryBig,
  BellOffIcon,
  PawPrint,
  ArrowBigDown,
  Network,
  MoveRight,
  Trash2,
  Copy,
} from 'lucide-react';
import { forwardRef } from 'react';

const logo: LucideIcon = forwardRef((props: LucideProps, ref) => (
  <svg
    version='1.1'
    x='0px'
    y='0px'
    viewBox='0 0 362 362'
    width='256'
    height='362'
    xmlns='http://www.w3.org/2000/svg'
    ref={ref}
    {...props}
  >
    <defs />
    <path
      d='M 0 0 C 0.641 0.172 1.283 0.343 1.943 0.52 C 14.215 3.909 26.77 8.96 34 20 C 37.758 28.081 36.028 37.405 35.006 46.014 C 34.9 46.947 34.795 47.88 34.686 48.841 C 34.34 51.885 33.984 54.927 33.629 57.969 C 33.384 60.098 33.14 62.228 32.896 64.357 C 32.386 68.799 31.872 73.24 31.355 77.681 C 30.692 83.377 30.037 89.075 29.385 94.773 C 28.882 99.16 28.376 103.547 27.869 107.934 C 27.626 110.036 27.384 112.138 27.143 114.24 C 26.806 117.168 26.465 120.095 26.123 123.021 C 26.024 123.891 25.925 124.761 25.822 125.657 C 25.439 128.906 25.038 131.886 24 135 C 24.94 134.954 25.879 134.907 26.848 134.859 C 31.873 134.864 36.578 136.069 41.438 137.25 C 42.792 137.557 42.792 137.557 44.174 137.871 C 52.805 139.934 59.973 142.383 65 150 C 66.556 154.474 65.947 157.804 64.117 162.047 C 60.121 169.034 53.802 171.08 46.379 173.238 C 38.718 174.965 31.14 175.265 23.313 175.375 C 21.784 175.431 21.784 175.431 20.225 175.488 C 12.708 175.577 12.708 175.577 8.98 172.539 C 8.327 171.701 7.673 170.863 7 170 C 4.039 169.013 1.547 168.858 -1.548 168.76 C -9.546 168.489 -16.01 167.99 -22 162 C -24.696 161.904 -27.309 161.916 -30 162 C -51.027 162.296 -73.326 159.622 -90.348 146.141 C -92.483 143.374 -92.801 141.196 -93.25 137.75 C -93.4 136.672 -93.549 135.595 -93.703 134.484 C -93.801 133.665 -93.899 132.845 -94 132 C -94.762 131.781 -95.524 131.562 -96.309 131.336 C -107.219 127.985 -117.531 122.594 -123.508 112.438 C -127.88 103.843 -129.668 95.825 -127.316 86.203 C -123.136 75.033 -114.718 65.254 -104 60 C -103.34 60 -102.182 58.722 -102.275 58.063 C -102.691 55.106 -103.096 52.147 -103.5 49.188 C -103.715 47.68 -103.715 47.68 -103.934 46.143 C -106.572 26.606 -106.572 26.606 -101.664 19.902 C -92.036 8.896 -79.993 3.537 -66 0 C -64.853 -0.3 -63.705 -0.601 -62.523 -0.91 C -43.026 -5.179 -19.293 -5.199 0 0 Z M -99 94 C -98 97 -98 97 -98 97 L -99 94 Z M -98 97 C -97 101 -97 101 -97 101 L -98 97 Z'
      fill='#0F0F0F'
      transform='translate(163,97)'
    />
    <path
      d='M 0 0 C -0.881 15.485 -2.258 30.907 -3.797 46.34 C -4.23 50.686 -4.648 55.032 -5.033 59.383 C -5.411 63.639 -5.824 67.89 -6.262 72.14 C -6.422 73.747 -6.569 75.356 -6.703 76.965 C -7.755 89.453 -7.755 89.453 -10.843 93.292 C -12.846 94.822 -14.717 95.948 -17 97 C -17.901 97.519 -18.802 98.039 -19.73 98.574 C -32.464 104.344 -45.638 106.193 -59.5 106.125 C -60.685 106.131 -60.685 106.131 -61.895 106.137 C -78.022 106.11 -97.17 103.315 -110.512 93.617 C -112 92 -112 92 -112.75 88.25 C -112 85 -113.573 79.589 -114.272 79.488 C -126.293 77.557 -132.75 73.286 -141 64 C -145.721 57.422 -147.245 51.008 -146 43 C -144.089 36.051 -140.019 31.03 -135 26 C -134.465 25.453 -133.93 24.907 -133.379 24.344 C -128.598 19.849 -119.314 15.308 -120.334 14.968 C -120.676 17.005 -121.93 3.234 -121.928 -0.278 C -118.387 1.056 -114.291 3.956 -111 5.813 C -85.827 18.112 -49.15 18.182 -22.637 9.641 C -15.975 7.343 -9.62 4.578 -3.602 0.883 C -2 0 -2 0 0 0 Z'
      fill='#FBFBFB'
      transform='translate(189,144)'
    />
    <path
      d='M 0 0 C 0.721 0 1.441 0 2.184 0.001 C 23.06 0.062 42.838 4.435 58.786 19.216 C 60.882 23.043 59.323 26.939 58.909 31.287 C 59.828 33.186 43.83 16.351 28.447 14.202 C 18.928 12.149 9.41 12.099 -0.312 12.063 C -1.567 12.057 -2.822 12.051 -4.115 12.046 C -20.974 12.175 -40.337 14.616 -54.062 25.375 C -55.899 27.29 -59.12 30.285 -60.731 32.4 C -61.391 32.4 -62.013 25.168 -61.274 21.613 C -55.188 12.449 -44.275 8.852 -33.308 4.089 C -22.275 1.196 -11.351 -0.031 0 0 Z'
      fill='#F3F3F3'
      transform='translate(128.0625,100.625)'
    />
    <path
      d='M0 0 C0 3 0 3 0 3 Z '
      fill='#000000'
      transform='translate(227,260)'
    />
    <path
      d='M0 0 C1 4 1 4 1 4 Z '
      fill='#000000'
      transform='translate(229,253)'
    />
    <path
      d='M0 0 C4 1 4 1 4 1 Z '
      fill='#000000'
      transform='translate(200,232)'
    />
    <path
      d='M0 0 C0 3 0 3 0 3 Z '
      fill='#000000'
      transform='translate(43,167)'
    />
    <path
      d='M0 0 C0 3 0 3 0 3 Z '
      fill='#000000'
      transform='translate(61,114)'
    />
    <path
      d='M0 0 C4 1 4 1 4 1 Z '
      fill='#000000'
      transform='translate(154,94)'
    />
    <path
      d='M0 0 C3 1 3 1 3 1 Z '
      fill='#000000'
      transform='translate(217,268)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C3 1 3 1 3 1 Z '
      fill='#000000'
      transform='translate(90,254)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C3 1 3 1 3 1 Z '
      fill='#000000'
      transform='translate(217,237)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C3 1 3 1 3 1 Z '
      fill='#000000'
      transform='translate(81,100)'
    />
    <path
      d='M0 0 C3 1 3 1 3 1 Z '
      fill='#000000'
      transform='translate(84,99)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(173,272)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(146,264)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(144,263)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(94,255)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(82,250)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(75,246)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(215,236)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(57,226)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(55,225)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(53,224)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(50,222)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(55,157)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(70,106)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(185,105)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(72,105)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(182,103)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(75,103)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(77,102)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(79,101)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(173,99)'
    />
    <path
      d='M0 0 C2 1 2 1 2 1 Z '
      fill='#000000'
      transform='translate(87,98)'
    />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='' fill='#000000' transform='translate(0,0)' />
    <path d='M 72.829 177.894 C 72.915 175.323 72.122 173.411 69.989 173.769 C 63.21 174.908 51.869 186.306 55.116 196.729 C 57.991 205.96 72.975 208.448 77.436 207.493 C 79.597 207.03 76.705 202.942 76.837 202.389 C 75.237 201.451 65.101 200.718 62.535 198.072 C 56.891 192.253 58.673 184.424 72.829 177.894 Z' />
    <path d='M 71.363 203.646 C 71.94 203.531 73.77 205.718 73.856 202.77 C 74.02 197.191 71.826 184.203 70.381 179.559 C 69.63 177.146 69.004 179.484 67.744 179.019 C 63.839 181.398 68.39 205.457 71.363 203.646 Z' />
  </svg>
));

const Google: LucideIcon = forwardRef((props: LucideProps, ref) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width='100'
    height='100'
    viewBox='0 0 50 50'
    ref={ref}
    {...props}
  >
    <path d='M 26 2 C 13.308594 2 3 12.308594 3 25 C 3 37.691406 13.308594 48 26 48 C 35.917969 48 41.972656 43.4375 45.125 37.78125 C 48.277344 32.125 48.675781 25.480469 47.71875 20.9375 L 47.53125 20.15625 L 46.75 20.15625 L 26 20.125 L 25 20.125 L 25 30.53125 L 36.4375 30.53125 C 34.710938 34.53125 31.195313 37.28125 26 37.28125 C 19.210938 37.28125 13.71875 31.789063 13.71875 25 C 13.71875 18.210938 19.210938 12.71875 26 12.71875 C 29.050781 12.71875 31.820313 13.847656 33.96875 15.6875 L 34.6875 16.28125 L 41.53125 9.4375 L 42.25 8.6875 L 41.5 8 C 37.414063 4.277344 31.960938 2 26 2 Z M 26 4 C 31.074219 4 35.652344 5.855469 39.28125 8.84375 L 34.46875 13.65625 C 32.089844 11.878906 29.199219 10.71875 26 10.71875 C 18.128906 10.71875 11.71875 17.128906 11.71875 25 C 11.71875 32.871094 18.128906 39.28125 26 39.28125 C 32.550781 39.28125 37.261719 35.265625 38.9375 29.8125 L 39.34375 28.53125 L 27 28.53125 L 27 22.125 L 45.84375 22.15625 C 46.507813 26.191406 46.066406 31.984375 43.375 36.8125 C 40.515625 41.9375 35.320313 46 26 46 C 14.386719 46 5 36.609375 5 25 C 5 13.390625 14.386719 4 26 4 Z'></path>
  </svg>
));

export type Icon = LucideIcon;

export const Icons = {
  RefreshCcw,
  Copy,
  Trash2,
  MoveRight,
  Network,
  ArrowBigDown,
  PawPrint,
  ScanSearch,
  BellOffIcon,
  Bell,
  Heart,
  MessageSquare,
  Library: LibraryBig,
  Send,
  Rocket,
  Check,
  Mail,
  Facebook,
  logo,
  close: X,
  Spinner: Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Sun: SunMedium,
  Moon,
  Github,
  Menu,
  ShieldCheck,
  Timer,
  Settings,
  Search,
  Home,
  FolderKanban,
  CreditCard,
  Plus,
  PlusCircle,
  HelpCircle,
  Wand,
  Folder,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Snail,
  Turtle,
  Squirrel,
  Bird,
  Bug,
  Rat,
  Egg,
  CircleOff,
  AlignJustify,
  StickyNote,
  Sparkles,
  Edit,
  Pause,
  Play,
  Google,
  BookCopyIcon,
  RotateCw,
  Download,
  Receipt,
  Quote,
  LogOut,
  MessageCircle,
};

export function nameToIcon(name: string) {
  switch (name) {
    case 'cat':
      return <Icons.Cat />;
    case 'dog':
      return <Icons.Dog />;
    case 'fish':
      return <Icons.Fish />;
    case 'rabbit':
      return <Icons.Rabbit />;
    case 'snail':
      return <Icons.Snail />;
    case 'turtle':
      return <Icons.Turtle />;
    case 'squirrel':
      return <Icons.Squirrel />;
    case 'bird':
      return <Icons.Bird />;
    case 'bug':
      return <Icons.Bug />;
    case 'rat':
      return <Icons.Rat />;
    case 'egg':
      return <Icons.Egg />;
    default:
      return <Icons.logo />;
  }
}
