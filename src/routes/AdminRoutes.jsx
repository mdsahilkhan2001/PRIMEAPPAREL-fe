import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import Settings from '../pages/Settings';
import ProductManagement from '../pages/ProductManagement';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ledger" element={<div className="p-8">Financial Ledger (Coming Soon)</div>} />
                <Route path="analytics" element={<div className="p-8">Analytics (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
