import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import BuyerDashboard from '../pages/buyer/BuyerDashboard';

const BuyerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<BuyerDashboard />} />
                <Route path="orders" element={<div className="p-8">My Orders (Coming Soon)</div>} />
                <Route path="track" element={<div className="p-8">Track Order (Coming Soon)</div>} />
                <Route path="wishlist" element={<div className="p-8">Wishlist (Coming Soon)</div>} />
                <Route path="documents" element={<div className="p-8">My Documents (Coming Soon)</div>} />
                <Route path="support" element={<div className="p-8">Support (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default BuyerRoutes;
