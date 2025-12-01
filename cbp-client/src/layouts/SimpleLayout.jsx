import { Outlet } from 'react-router-dom';

/**
 * SimpleLayout - Simplified layout without sidebar
 * Just logo in header and main content
 */
const SimpleLayout = () => {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
      {/* Header with Logo */}
      <header 
        className="border-b"
        style={{
          height: '64px',
          borderBottom: '1px solid rgba(229, 229, 229, 1)',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px'
        }}
      >
        <img 
          src="https://www.updapt.com/static/media/updapt-logo-green.f49fc6e4.png" 
          alt="Updapt Logo" 
          style={{ height: '36px', width: 'auto' }}
        />
      </header>

      {/* Main Content */}
      <main 
        className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default SimpleLayout;


