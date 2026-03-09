import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import GlobalNavbar from './components/GlobalNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Chatbot from './components/Chatbot';
import PageLoader from './components/PageLoader';
import RouteTransitionLoader from './components/RouteTransitionLoader';
import ForSaleBanner from './components/ForSaleBanner';

// Lazy load all page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AllPackagesPage = lazy(() => import('./pages/AllPackagesPage'));
const PackageDetailsPage = lazy(() => import('./pages/PackageDetailsPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const MyReviewsPage = lazy(() => import('./pages/MyReviewsPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ItineraryBuilderPage = lazy(() => import('./pages/ItineraryBuilderPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PhoneVerificationPage = lazy(() => import('./pages/PhoneVerificationPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminPackagesPage = lazy(() => import('./pages/admin/AdminPackagesPage'));
const AddPackagePage = lazy(() => import('./pages/admin/AddPackagePage'));
const EditPackagePage = lazy(() => import('./pages/admin/EditPackagePage'));
const AdminContactsPage = lazy(() => import('./pages/admin/AdminContactsPage'));
const AdminBlogsPage = lazy(() => import('./pages/admin/AdminBlogsPage'));
const BlogProcessPage = lazy(() => import('./pages/admin/BlogProcessPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogDetailsPage = lazy(() => import('./pages/BlogDetailsPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const ImpactDetailsPage = lazy(() => import('./pages/ImpactDetailsPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen border-0">
      <ScrollToTop />
      <ForSaleBanner />
      {!isAdminRoute && <GlobalNavbar />}

      <main className={`flex-grow ${isAdminRoute ? 'h-screen w-full' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <RouteTransitionLoader>
            <Routes>
              {/* Public Routes */}
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
          </RouteTransitionLoader>
        </Suspense>
      </main>
      {!isAdminRoute && <Chatbot />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <MainLayout />
  );
}

export default App;
