import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Career from './pages/Career';
import Inquiry from './pages/Inquiry';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/auth/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

// Role-based Routes
import BuyerRoutes from './routes/BuyerRoutes';
import SellerRoutes from './routes/SellerRoutes';
import DesignerRoutes from './routes/DesignerRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Protected Dashboard Routes */}

        {/* Buyer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
          <Route path="/buyer/*" element={<BuyerRoutes />} />
        </Route>

        {/* Seller Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
          <Route path="/seller/*" element={<SellerRoutes />} />
        </Route>

        {/* Designer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['DESIGNER', 'ADMIN']} />}>
          <Route path="/designer/*" element={<DesignerRoutes />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        {/* Redirect legacy /dashboard to login for now */}
        <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
