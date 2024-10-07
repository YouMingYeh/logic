import type { FC } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
} from 'ui';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '../../auth/actions';

export const ProfileIconMenu: FC = () => {
  const { push } = useRouter();

  const onLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Icons.AlignJustify className='h-6 w-6' />
          <span className='sr-only'>Menu Toggle</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              push('/');
            }}
          >
            產品
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              push('/app');
            }}
          >
            主頁
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>登出</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
