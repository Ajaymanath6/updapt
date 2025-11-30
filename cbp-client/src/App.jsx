import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ESGConfigurationPage from './pages/ESGConfigurationPage';

/**
 * App - Main application component with routing
 */
function App() {
  return (
    <Routes>
      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route index element={<ESGConfigurationPage />} />
        <Route path="esg-configuration" element={<ESGConfigurationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
