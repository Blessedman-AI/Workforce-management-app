import { ChevronDown, Radius } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  return (
    <header className="z-[1] flex  items-center justify-between py-2 px-4  shadow-md">
      <div className="flex items-center">
        <Image src="/images/logo1.png" alt="logo" width={44} height={44} />
      </div>

      <div className=" flex items-center gap-2 ">
        <Image
          src="/images/noavatar.png"
          width={0}
          height={0}
          alt="Profile"
          style={{ width: '50px', height: 'auto', borderRadius: '50%' }}
        />

        <span className="font-medium">Po Porpov</span>
        <ChevronDown size={26} color="#8e49ff" />
      </div>
    </header>
  );
};

export default Navbar;
