import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import LeadManagement from '../pages/LeadManagement';
import Costing from '../pages/Costing';
import ProductManagement from '../pages/ProductManagement';
import SellerCustomizationRequests from '../pages/customization/SellerCustomizationRequests';

const SellerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="customizations" element={<SellerCustomizationRequests />} />
                <Route path="leads" element={<LeadManagement />} />
                <Route path="costing" element={<Costing />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<div className="p-8">Buyer Orders (Coming Soon)</div>} />
                <Route path="pi" element={<div className="p-8">PI Generation (Coming Soon)</div>} />
                <Route path="production" element={<div className="p-8">Production Tracker (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default SellerRoutes;
