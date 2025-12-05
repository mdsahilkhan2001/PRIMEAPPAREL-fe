import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import BuyerDashboard from '../pages/buyer/BuyerDashboard';
import CustomizationRequests from '../pages/customization/CustomizationRequests';
import BuyerOrders from '../pages/buyer/BuyerOrders';
import MyInquiries from '../pages/buyer/MyInquiries';
import MyDocuments from '../pages/buyer/MyDocuments';

const BuyerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<BuyerDashboard />} />
                <Route path="inquiries" element={<MyInquiries />} />
                <Route path="customizations" element={<CustomizationRequests />} />
                <Route path="orders" element={<BuyerOrders />} />
                <Route path="track" element={<div className="p-8">Track Order (Coming Soon)</div>} />
                <Route path="wishlist" element={<div className="p-8">Wishlist (Coming Soon)</div>} />
                <Route path="documents" element={<MyDocuments />} />
                <Route path="support" element={<div className="p-8">Support (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default BuyerRoutes;
