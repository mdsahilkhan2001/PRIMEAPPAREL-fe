import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<div className="p-8">User Management (Coming Soon)</div>} />
                <Route path="ledger" element={<div className="p-8">Financial Ledger (Coming Soon)</div>} />
                <Route path="analytics" element={<div className="p-8">Analytics (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-8">System Settings (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
