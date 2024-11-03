import Navbar from '@/components/dashboard/Navbar';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 h-full">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
