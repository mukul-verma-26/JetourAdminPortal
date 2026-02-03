import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { BookingsScreen } from './features/bookings';
import { CustomersScreen } from './features/customers';
import { TechniciansScreen } from './features/technicians';
import { DriversScreen } from './features/drivers';
import { ServiceVansScreen } from './features/serviceVans';
import { InventoryScreen } from './features/inventory';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<BookingsScreen />} />
          <Route path="customers" element={<CustomersScreen />} />
          <Route path="technicians" element={<TechniciansScreen />} />
          <Route path="drivers" element={<DriversScreen />} />
          <Route path="service-vans" element={<ServiceVansScreen />} />
          <Route path="inventory" element={<InventoryScreen />} />
          <Route path="schedule" element={<PlaceholderPage />} />
          <Route path="reports" element={<PlaceholderPage />} />
          <Route path="settings" element={<PlaceholderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
