import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/layout/AdminLayout'
import { CustomerLayout } from './components/layout/CustomerLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import SearchPage from './pages/public/SearchPage'
import PromotionsPage from './pages/public/PromotionsPage'
import NewArrivalsPage from './pages/public/NewArrivalsPage'
import ComparePage from './pages/public/ComparePage'
import CartPage from './pages/public/CartPage'
import CheckoutPage from './pages/public/CheckoutPage'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import DashboardPage from './pages/customer/DashboardPage'
import ProfilePage from './pages/customer/ProfilePage'
import AddressesPage from './pages/customer/AddressesPage'
import WishlistPage from './pages/customer/WishlistPage'
import OrdersPage from './pages/customer/OrdersPage'
import OrderDetailPage from './pages/customer/OrderDetailPage'
import NotificationsPage from './pages/customer/NotificationsPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReviews from './pages/admin/AdminReviews'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import AdminStock from './pages/admin/AdminStock'
import AdminReturns from './pages/admin/AdminReturns'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="produkte" element={<ProductsPage />} />
        <Route path="produkte/:slug" element={<ProductDetailPage />} />
        <Route path="suche" element={<SearchPage />} />
        <Route path="aktionen" element={<PromotionsPage />} />
        <Route path="neuheiten" element={<NewArrivalsPage />} />
        <Route path="vergleich" element={<ComparePage />} />
        <Route path="warenkorb" element={<CartPage />} />
        <Route path="kasse" element={<CheckoutPage />} />
        <Route path="anmelden" element={<LoginPage />} />
        <Route path="registrieren" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="konto" element={<CustomerLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profil" element={<ProfilePage />} />
            <Route path="adressen" element={<AddressesPage />} />
            <Route path="wunschliste" element={<WishlistPage />} />
            <Route path="bestellungen" element={<OrdersPage />} />
            <Route path="bestellungen/:id" element={<OrderDetailPage />} />
            <Route path="benachrichtigungen" element={<NotificationsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="benutzer" element={<AdminUsers />} />
          <Route path="produkte" element={<AdminProducts />} />
          <Route path="kategorien" element={<AdminCategories />} />
          <Route path="bestellungen" element={<AdminOrders />} />
          <Route path="zahlungen" element={<AdminPayments />} />
          <Route path="bewertungen" element={<AdminReviews />} />
          <Route path="aktionen" element={<AdminPromotions />} />
          <Route path="analysen" element={<AdminAnalytics />} />
          <Route path="einstellungen" element={<AdminSettings />} />
          <Route path="lager" element={<AdminStock />} />
          <Route path="retouren" element={<AdminReturns />} />
        </Route>
      </Route>
    </Routes>
  )
}
