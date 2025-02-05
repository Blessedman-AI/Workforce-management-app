'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/', // Redirect to home after logout
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect if signOut fails
      router.push('/');
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
}
