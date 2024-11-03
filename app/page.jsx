import { redirect } from 'next/navigation';

const user = null;
export default function Home() {
  user ? redirect('/user/my-overview') : redirect('/admin/my-overview');
}
