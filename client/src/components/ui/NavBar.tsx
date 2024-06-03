import React from 'react';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white font-bold">Elevacon</div>
      <div className="flex items-center space-x-4">
        {/* <input type="text" placeholder="Pesquisar..." className="p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" /> */}
        <img src="#" alt="Profile" className="rounded-full" />
      </div>
    </nav>
  );
};

export default NavBar;