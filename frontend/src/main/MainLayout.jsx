import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidbar';

function MainLayout() {
  return (
    <div className="w-screen h-screen flex justify-start items-start overflow-hidden">
      <main className="w-full h-full flex justify-center items-start overflow-y-scroll scrollbar-thin scroll-smooth">
        <div className="w-full max-w-[90rem] flex flex-col justify-start items-center">
          <Outlet />
          <div className="h-20"></div>
        </div>
      </main>
      <Sidebar />
    </div>
  );
}

export default MainLayout;
