'use client';
import { Button } from 'ui';
import { signOut } from '../../auth/actions';

export default function LogoutButton() {
  const logout = async () => {
    await signOut();
  };
  return (
    <Button onClick={logout} type='button'>
      Logout
    </Button>
  );
}
