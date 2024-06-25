import { AlignJustify, CircleUserRound } from 'lucide-react';
import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

const NavBar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className=" bg-gray-800 p-4 flex justify-between items-center ">
        <div>
          <AlignJustify className="text-white cursor-pointer z-50 fixed" onClick={handleClick} />
        </div>
        <div className="text-white font-bold">Elevacon</div>
        <div className="flex items-center space-x-4">
          <CircleUserRound className="text-white cursor-pointer" />
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="">
          <Sidebar/>
        </div>
      )}
    </>
  );
};

export default NavBar;
