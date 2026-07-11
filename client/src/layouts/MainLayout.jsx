import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-layout">
      {mobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileSidebar} />
      )}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header collapsed={sidebarCollapsed} onMenuToggle={toggleMobileSidebar} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
