import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AllPackagesPage from './pages/AllPackagesPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyReviewsPage from './pages/MyReviewsPage';
import AboutUsPage from './pages/AboutUsPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ContactPage from './pages/ContactPage';
import PhoneVerificationPage from './pages/PhoneVerificationPage';
import GlobalNavbar from './components/GlobalNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';
import AddPackagePage from './pages/admin/AddPackagePage';
import EditPackagePage from './pages/admin/EditPackagePage';
import AdminContactsPage from './pages/admin/AdminContactsPage';
import AdminBlogsPage from './pages/admin/AdminBlogsPage';
import BlogProcessPage from './pages/admin/BlogProcessPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import Chatbot from './components/Chatbot';
import ImpactPage from './pages/ImpactPage';
import ImpactDetailsPage from './pages/ImpactDetailsPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <GlobalNavbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/packages" element={<AllPackagesPage />} />
          <Route path="/package/:slug" element={<PackageDetailsPage />} />
          <Route path="/plan-my-trip" element={<ItineraryBuilderPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/impact/:slug" element={<ImpactDetailsPage />} />
          <Route path="/verify-phone" element={<PhoneVerificationPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes (Customer) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-reviews" element={<MyReviewsPage />} />
            {/* Add other customer protected routes here */}
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
            <Route path="/admin/bookings" element={<AdminLayout><AdminBookingsPage /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
            <Route path="/admin/packages" element={<AdminLayout><AdminPackagesPage /></AdminLayout>} />
            <Route path="/admin/packages/add" element={<AdminLayout><AddPackagePage /></AdminLayout>} />
            <Route path="/admin/packages/edit/:id" element={<AdminLayout><EditPackagePage /></AdminLayout>} />
            <Route path="/admin/contacts" element={<AdminLayout><AdminContactsPage /></AdminLayout>} />
            <Route path="/admin/blogs" element={<AdminLayout><AdminBlogsPage /></AdminLayout>} />
            <Route path="/admin/blogs/add" element={<AdminLayout><BlogProcessPage /></AdminLayout>} />
            <Route path="/admin/blogs/edit/:id" element={<AdminLayout><BlogProcessPage /></AdminLayout>} />
          </Route>
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;
