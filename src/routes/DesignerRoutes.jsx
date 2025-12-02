import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import SellerCustomizationRequests from '../pages/customization/SellerCustomizationRequests';
import ProductManagement from '../pages/ProductManagement';
import UploadDesign from '../pages/UploadDesign';

const DesignerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="customizations" element={<SellerCustomizationRequests />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="upload" element={<UploadDesign />} />
                <Route path="approvals" element={<div className="p-8">Design Approvals (Coming Soon)</div>} />
                <Route path="techpacks" element={<div className="p-8">Tech Packs (Coming Soon)</div>} />
                <Route path="odm" element={<div className="p-8">ODM Links (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default DesignerRoutes;
