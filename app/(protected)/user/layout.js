import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/employee/Sidebar';

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <div className="flex flex-1 min-full ">
        <Sidebar />
        <main
          className="flex-1  overflow-x-hidden
         pt-[76px] ml-[180px] "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
