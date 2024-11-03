import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/employee/Sidebar';

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ">{children}</main>
      </div>
    </div>
  );
}
