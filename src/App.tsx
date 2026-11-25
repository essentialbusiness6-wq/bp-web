import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Preloader from './components/ui/Preloader';

// Public pages
import LandingPage from './features/landing/LandingPage';
import AboutPage from './features/about/AboutPage';
import BlogPage from './features/blog/BlogPage';
import CareersPage from './features/careers/CareersPage';
import ChangelogPage from './features/changelog/ChangelogPage';
import ContactPage from './features/contact/ContactPage';
import FeaturesPage from './features/features/FeaturesPage';
import IntegrationsPage from './features/integrations/IntegrationsPage';
import PricingPage from './features/pricing/PricingPage';
import PrivacyPolicyPage from './features/legal/PrivacyPolicyPage';
import TermsOfServicePage from './features/legal/TermsofServicePage';
import EntryPage from './features/onboarding/EntryPage';

// Auth pages
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';


import DashboardPage from './features/dashboard/pages/DashboardPage';
import InvoicesPage from './features/invoices/pages/InvoicePage';
import DraftsPage from './features/drafts/pages/DraftsPage';
import ClientsPage from './features/clients/pages/ClientsPage';
import PaymentsPage from './features/payments/pages/PaymentsPage';
import MePage from './features/me/pages/MePage';
import SettingsPage from './features/settings/pages/SettingsPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import BillingPage from './features/billing/pages/BillingPage';
import BillingSuccessPage from './features/billing/pages/BillingSuccesspage';
import CreateInvoicePage from './features/invoices/pages/CreateInvoicePage';
import FeedbackPage from './features/feedback/pages/FeedbackPage';
import PayInvoicePage from './features/public/pages/PayInvoicePage';
import RateUsPage from './features/rate/pages/RateUsPage';
import SecurityPage from './features/security/pages/SecurityPage';
import SharePage from './features/share/pages/SharePage';
import SupportPage from './features/support/pages/SupportPage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';
import InvoiceDetailsPage from './features/invoices/pages/InvoiceDetailsPage';
import RequestInvoicePage from './features/public/pages/RequestInvoicePage';
  
   
   
   
const PlaceholderPage = ({ title }: { title: string }) => (
  <main style={{ paddingTop: '140px', minHeight: '80vh', textAlign: 'center' }}>
    <h1>{title} Page</h1>
    <p style={{ color: 'var(--gray)' }}>This page is under development.</p>
  </main>
);

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Preloader onComplete={() => setIsLoading(false)} />
        
        {!isLoading && (
          <Router>
            <Routes>
              <Route path="/entry" element={<EntryPage />} />

              {/* Public Pages */}
              <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
              <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
              <Route path="/changelog" element={<PublicLayout><ChangelogPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
              <Route path="/integrations" element={<PublicLayout><IntegrationsPage /></PublicLayout>} />
              <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
              <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
              <Route path="/terms-of-service" element={<PublicLayout><TermsOfServicePage /></PublicLayout>} />

              {/* Auth Pages (No Header/Footer - use AuthLayout internally) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Placeholder for future authenticated pages */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/invoices" element={<InvoicesPage />} />
              <Route path="/dashboard/invoices/new" element={<CreateInvoicePage />} />
              <Route path="/dashboard/invoices/:id" element={<PlaceholderPage title="Invoice Details" />} />
              <Route path="/dashboard/drafts" element={<DraftsPage />} />
              <Route path="/dashboard/clients" element={<ClientsPage />} />
              <Route path="/dashboard/payments" element={<PaymentsPage />} />
              <Route path="/dashboard/me" element={<MePage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/notifications" element={<NotificationsPage />} />
              <Route path="/dashboard/billing" element={<BillingPage />} />
              <Route path="/dashboard/billing/success" element={<BillingSuccessPage />} />
              <Route path="/dashboard/feedback" element={<FeedbackPage />} />
              <Route path="/pay/:invoiceId" element={<PayInvoicePage />} />
              <Route path="/dashboard/rate" element={<RateUsPage />} />
              <Route path="/dashboard/security" element={<SecurityPage />} />
              <Route path="/dashboard/share" element={<SharePage />} /> 
              <Route path="/dashboard/support" element={<SupportPage />} />
              <Route path="/dashboard/transactions" element={<TransactionsPage />} />
              <Route path="/dashboard/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
               <Route path="/client/invoice-request" element={<RequestInvoicePage />} /> 
            </Routes>
          </Router>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}


   