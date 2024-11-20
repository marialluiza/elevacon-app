import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MiniDrawer from "../SideBar/Sidebar";

const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex min-h-screen">
      <MiniDrawer toggleSidebar={toggleSidebar} />
      <main
        style={{
          marginTop: "64px", // Altura padrão do AppBar em Material-UI
          flexGrow: 1,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
