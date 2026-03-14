import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { BookingsScreen } from './features/bookings';
import { CustomersScreen } from './features/customers';
import { CustomerSalesDataScreen } from './features/customerSalesData';
import { TechniciansScreen } from './features/technicians';
import { DriversScreen } from './features/drivers';
import { ServiceVansScreen } from './features/serviceVans';
import { VehiclesScreen } from './features/vehicles';
import { SettingsScreen } from './features/settings';
import { PackagesProvider } from './features/settings/PackagesContext';
import { InventoryScreen } from './features/inventory';
import { ApproveInventoryPartsScreen } from './features/approveInventoryParts';
import { ScheduleScreen } from './features/schedule';
import PlaceholderPage from './pages/PlaceholderPage';
import { ToastContainer } from './components/shared/Toast';

function App() {
  return (
    <BrowserRouter>
      <PackagesProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<BookingsScreen />} />
          <Route path="customers" element={<CustomersScreen />} />
          <Route path="customer-sales-data" element={<CustomerSalesDataScreen />} />
          <Route path="technicians" element={<TechniciansScreen />} />
          <Route path="drivers" element={<DriversScreen />} />
          <Route path="service-vans" element={<ServiceVansScreen />} />
          <Route path="vehicles" element={<VehiclesScreen />} />
          <Route path="inventory" element={<InventoryScreen />} />
          <Route path="approve-inventory-parts" element={<ApproveInventoryPartsScreen />} />
          <Route path="schedule" element={<ScheduleScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </PackagesProvider>
    </BrowserRouter>
  );
}

export default App;
