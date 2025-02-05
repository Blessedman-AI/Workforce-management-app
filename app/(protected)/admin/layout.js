import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/dashboard/Navbar';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 h-full">
        <ErrorBoundary description="Problem loading sidebar">
          <AdminSidebar />
        </ErrorBoundary>
        <main className="flex-1 pt-[76px] ml-[222px] mr-[12px]">
          {children}
        </main>
      </div>
    </div>
  );
}
