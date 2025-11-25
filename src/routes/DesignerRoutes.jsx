import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';

const DesignerRoutes = () => {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="approvals" element={<div className="p-8">Design Approvals (Coming Soon)</div>} />
                <Route path="techpacks" element={<div className="p-8">Tech Packs (Coming Soon)</div>} />
                <Route path="odm" element={<div className="p-8">ODM Links (Coming Soon)</div>} />
            </Route>
        </Routes>
    );
};

export default DesignerRoutes;
