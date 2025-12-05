import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import LeadManagement from '../pages/LeadManagement';
import OdmLeads from '../pages/OdmLeads';
import OemLeads from '../pages/OemLeads';
import Costing from '../pages/Costing';
import ProductManagement from '../pages/ProductManagement';
import SellerCustomizationRequests from '../pages/customization/SellerCustomizationRequests';
import SellerDocuments from '../pages/SellerDocuments';

const SellerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="customizations" element={<SellerCustomizationRequests />} />
                <Route path="odm-leads" element={<OdmLeads />} />
                <Route path="leads" element={<LeadManagement />} /> {/* Legacy route */}
                <Route path="costing" element={<Costing />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<div className="p-8">Buyer Orders (Coming Soon)</div>} />
                <Route path="documents" element={<SellerDocuments />} />
                <Route path="pi" element={<div className="p-8">PI Generation (Coming Soon)</div>} />
                <Route path="production" element={<div className="p-8">Production Tracker (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default SellerRoutes;
