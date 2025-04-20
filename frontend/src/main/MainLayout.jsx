import React from 'react';
import Sidebar from '../components/Sidbar';

function MainLayout({ children }) {
  return (
    <div className="w-screen h-screen flex justify-start items-start overflow-hidden">
      <main className="w-full h-full flex justify-center items-start overflow-y-scroll scrollbar-thin scroll-smooth">
        {children}
      </main>
      <Sidebar />
    </div>
  );
}

export default MainLayout;
