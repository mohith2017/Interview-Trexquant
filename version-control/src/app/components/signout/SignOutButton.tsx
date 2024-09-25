'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ClientSignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/api/auth/signout');
  };

  return (
    <Button className="bg-black" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
