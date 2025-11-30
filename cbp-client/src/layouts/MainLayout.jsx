import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

/**
 * MainLayout - Main application shell with sidebar and header
 * Uses React Router's Outlet to render child page components
 */
const MainLayout = () => {
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

