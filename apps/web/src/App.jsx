
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ClickEffect from '@/components/ClickEffect.jsx';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';

// Layouts
import Header from '@/components/Header.jsx';
import TaglineBanner from '@/components/TaglineBanner.jsx';
// Sidebar available but rendered contextually
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import MatrixBackground from '@/components/MatrixBackground.jsx';

// Public Pages
import HomePage from '@/pages/HomePage.jsx';
import ProductsPage from '@/pages/ProductsPage.jsx';
import CalculatorPage from '@/pages/CalculatorPage.jsx';
import WorkspaceSimulatorPage from '@/pages/WorkspaceSimulatorPage.jsx';
import ResourcesPage from '@/pages/ResourcesPage.jsx';
import BlogListPage from '@/pages/BlogListPage.jsx';
import BlogDetailPage from '@/pages/BlogDetailPage.jsx';
import LLMDirectoryPage from '@/pages/LLMDirectoryPage.jsx';
import WorkloadsPage from '@/pages/WorkloadsPage.jsx';
import TriageWizardPage from '@/pages/TriageWizardPage.jsx';
import LaunchKitPage from '@/pages/LaunchKitPage.jsx';
import InstallHubPage from '@/pages/InstallHubPage.jsx';
import DockerInstallPage from '@/pages/DockerInstallPage.jsx';
import OllamaInstallPage from '@/pages/OllamaInstallPage.jsx';
import WindowsInstallPage from '@/pages/WindowsInstallPage.jsx';
import MacBookInstallPage from '@/pages/MacBookInstallPage.jsx';
import OdysseusPewdiepieInstallPage from '@/pages/OdysseusPewdiepieInstallPage.jsx';
import FixPage from '@/pages/FixPage.jsx';
import BenchmarkPage from '@/pages/BenchmarkPage.jsx';
import ComparisonPage from '@/pages/ComparisonPage.jsx';
import PurchaseProPage from '@/pages/PurchaseProPage.jsx';

// Other Existing Pages
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import PrivacyPage from '@/pages/PrivacyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import SearchPage from '@/pages/SearchPage.jsx';
import AgentSearchPage from '@/pages/AgentSearchPage.jsx';
import ShoppingCartPage from '@/pages/ShoppingCartPage.jsx';
import CheckoutPage from '@/pages/CheckoutPage.jsx';
import SuccessPage from '@/pages/SuccessPage.jsx';
import CancelPage from '@/pages/CancelPage.jsx';

// Admin/Dashboard Pages
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import BlogAdminPage from '@/pages/BlogAdminPage.jsx';
import BlogCreatePage from '@/pages/BlogCreatePage.jsx';
import BlogEditPage from '@/pages/BlogEditPage.jsx';
import ProductListPage from '@/pages/ProductListPage.jsx';
import ProductEditPage from '@/pages/ProductEditPage.jsx';
import UserListPage from '@/pages/UserListPage.jsx';
import UserEditPage from '@/pages/UserEditPage.jsx';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard.jsx';
import AdminSettingsPage from '@/pages/AdminSettingsPage.jsx';
import NeuralGridAdminDashboard from '@/pages/NeuralGridAdminDashboard.jsx';
import TestimonialsAdminPage from '@/pages/TestimonialsAdminPage.jsx';

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-transparent text-foreground font-sans selection:bg-accent selection:text-accent-foreground pb-16 md:pb-0">
      <div id="site-header" className="fixed top-0 left-0 right-0 z-40 flex flex-col">
        <TaglineBanner />
        <Header setIsCartOpen={setIsCartOpen} />
      </div>
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <main className="flex-1 pt-[140px] md:pt-[155px]">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <MatrixBackground />
            <Router>
              <Toaster position="top-right" richColors />
              <ClickEffect />
              <Routes>
                {/* Redirects */}
                <Route path="/odysseus-home" element={<Navigate to="/" replace />} />
                
                {/* Admin Auth Route (No layout) */}
                <Route path="/odysseus-admin-login" element={<AdminLoginPage />} />
                <Route path="/odysseus-zouhirmahjoubi" element={<Navigate to="/odysseus-admin-login" replace />} />

                {/* Secure Admin Routes */}
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/odysseus-admin/neural-grid-dashboard" element={<NeuralGridAdminDashboard />} />
                  <Route element={<AdminLayout />}>
                    <Route path="/odysseus-admin" element={<AdminDashboard />} />
                    
                    {/* Testimonials Admin Route */}
                    <Route path="/odysseus-admin/testimonials" element={<TestimonialsAdminPage />} />
                    
                    {/* Blog Admin Routes */}
                    <Route path="/odysseus-admin/blog" element={<BlogAdminPage />} />
                    <Route path="/odysseus-blog/new" element={<BlogCreatePage />} />
                    <Route path="/odysseus-blog/edit/:id" element={<BlogEditPage />} />
                    
                    {/* Admin management routes */}
                    <Route path="/odysseus-admin/products" element={<ProductListPage />} />
                    <Route path="/odysseus-admin/products/edit/:id" element={<ProductEditPage />} />
                    <Route path="/odysseus-admin/users" element={<UserListPage />} />
                    <Route path="/odysseus-admin/users/edit/:id" element={<UserEditPage />} />
                    <Route path="/odysseus-admin/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/odysseus-admin/settings" element={<AdminSettingsPage />} />
                  </Route>
                </Route>



                {/* Main App Routes - Wrapped in layout that includes Header, Footer & Banner */}
                <Route element={<MainLayout />}>
                  <Route path="/odysseus-workspace-simulator" element={<WorkspaceSimulatorPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/odysseus-Launch-Kit" element={<ProductsPage />} />
                  <Route path="/odysseus-calculator" element={<CalculatorPage />} />
                  <Route path="/odysseus-resources" element={<ResourcesPage />} />
                  <Route path="/odysseus-triage-wizard" element={<TriageWizardPage />} />
                  <Route path="/odysseus-launch-kit" element={<LaunchKitPage />} />
                  <Route path="/odysseus-llm-directory" element={<LLMDirectoryPage />} />
                  <Route path="/odysseus-workloads" element={<WorkloadsPage />} />
                  <Route path="/odysseus-comparison" element={<ComparisonPage />} />
                  <Route path="/odysseus-purchase-pro-license" element={<PurchaseProPage />} />
                  
                  {/* Newly Integrated Odysseus AI Routes */}
                  <Route path="/odysseus-ai-install" element={<InstallHubPage />} />
                  <Route path="/odysseus-install/docker" element={<DockerInstallPage />} />
                  <Route path="/odysseus-install/ollama" element={<OllamaInstallPage />} />
                  <Route path="/odysseus-install/windows" element={<WindowsInstallPage />} />
                  <Route path="/odysseus-install/macbook" element={<MacBookInstallPage />} />
                  <Route path="/odysseus-install-odysseus-pewdiepie" element={<OdysseusPewdiepieInstallPage />} />
                  <Route path="/odysseus-fix" element={<FixPage />} />
                  <Route path="/odysseus-benchmark" element={<BenchmarkPage />} />
                  <Route path="/guides/:slug" element={<BlogDetailPage />} />
                  
                  <Route path="/odysseus-about" element={<AboutPage />} />
                  <Route path="/odysseus-contact" element={<ContactPage />} />
                  <Route path="/odysseus-privacy" element={<PrivacyPage />} />
                  <Route path="/odysseus-terms" element={<TermsOfServicePage />} />
                  <Route path="/odysseus-cart" element={<ShoppingCartPage />} />
                  <Route path="/odysseus-checkout" element={<CheckoutPage />} />
                  <Route path="/odysseus-success" element={<SuccessPage />} />
                  <Route path="/odysseus-cancel" element={<CancelPage />} />
                  
                  {/* Public Blog Routes */}
                  <Route path="/odysseus-blog" element={<BlogListPage />} />
                  <Route path="/odysseus-blog/:slug" element={<BlogDetailPage />} />
                  
                  {/* Public Auth Routes */}
                  <Route path="/odysseus-login" element={<LoginPage />} />
                  <Route path="/odysseus-signup" element={<LoginPage />} />

                  {/* Search Routes */}
                  <Route path="/odysseus-search" element={<SearchPage />} />
                  <Route path="/odysseus-agents/search" element={<AgentSearchPage />} />
                  <Route path="/odysseus-blog/search" element={<BlogListPage />} />
                  <Route path="/odysseus-Launch-Kit/search" element={<ProductsPage />} />

                  {/* Catch-all Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* User Dashboard Routes (Dedicated cockpit layout without main header/footer) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/odysseus-dashboard" element={<DashboardPage />} />
                </Route>

              </Routes>
            </Router>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
