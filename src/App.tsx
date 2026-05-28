import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import CategoriesPage from './pages/CategoriesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import RequireAddress from './components/RequireAddress';

import OrderDetailPage from './pages/OrderDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider>
          <Router>
          <div className="min-h-screen flex flex-col bg-primary-950 text-white">
          <Header />
          <CartDrawer />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/categorias/:id" element={<CategoryDetailPage />} />
              <Route path="/buscar" element={<SearchResultsPage />} />
              <Route path="/checkout" element={<RequireAddress><CheckoutPage /></RequireAddress>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/pedidos/:id" element={<OrderDetailPage />} />
            </Routes>
          </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
