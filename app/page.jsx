import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log('client session👌:', session);

  if (
    !session ||
    (session?.user?.role !== 'owner' && session?.user?.role !== 'admin')
  ) {
    redirect('/signup');
  } else {
    redirect('/admin/my-overview');
  }
}
