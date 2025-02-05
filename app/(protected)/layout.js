import SessionGuard from '@/helpers/sessionGuard';

export default function ProtectedLayout({ children }) {
  return <div>{children}</div>;
  // return <SessionGuard>{children}</SessionGuard>;
}
