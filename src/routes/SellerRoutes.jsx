import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import LeadManagement from '../pages/LeadManagement';
import Costing from '../pages/Costing';

const SellerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="leads" element={<LeadManagement />} />
                <Route path="costing" element={<Costing />} />
                <Route path="orders" element={<div className="p-8">Buyer Orders (Coming Soon)</div>} />
                <Route path="pi" element={<div className="p-8">PI Generation (Coming Soon)</div>} />
                <Route path="production" element={<div className="p-8">Production Tracker (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default SellerRoutes;
