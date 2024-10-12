import { AlignJustify, CircleUserRound } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../SideBar/Sidebar';

const NavBar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
<>
  <nav className="bg-gray-800 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
    <div>
      <AlignJustify className="text-white cursor-pointer z-50" onClick={handleClick} />
    </div>
    <div className="text-white font-bold cursor-pointer"><Link to="/">Elevacon</Link></div>
    <div className="flex items-center space-x-4">
      <CircleUserRound className="text-white cursor-pointer" />
    </div>
  </nav>

  <div className="pt-16"> {/* Adiciona um padding top para compensar a altura da header fixa */}
    {isSidebarOpen && (
      <div className="">
        <Sidebar />
      </div>
    )}
  </div>
</>

  );
};

export default NavBar;
