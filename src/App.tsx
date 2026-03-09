import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HealthCenter from "./pages/HealthCenter";
import Sanitation from "./pages/Sanitation";
import Immunization from "./pages/Immunization";
import Wastewater from "./pages/Wastewater";
import Surveillance from "./pages/Surveillance";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ResidentPortal from "./pages/ResidentPortal";
import ResidentHealth from "./pages/ResidentHealth";
import ResidentPermits from "./pages/ResidentPermits";
import ResidentComplaints from "./pages/ResidentComplaints";
import ResidentRequest from "./pages/ResidentRequest";
import ResidentQRCode from "./pages/ResidentQRCode";
import EstablishmentManagement from "./pages/EstablishmentManagement";
import InspectionManagement from "./pages/InspectionManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const isPortalUser = user?.role === 'citizen' || user?.role === 'business_owner';

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isPortalUser ? '/portal' : '/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={isPortalUser ? '/portal' : '/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Staff Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health-center" element={<HealthCenter />} />
        <Route path="/sanitation" element={<Sanitation />} />
        <Route path="/immunization" element={<Immunization />} />
        <Route path="/wastewater" element={<Wastewater />} />
        <Route path="/surveillance" element={<Surveillance />} />
        <Route path="/inspections" element={<InspectionManagement />} />
        <Route path="/establishments" element={<EstablishmentManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />

        {/* Portal Routes (Citizen & Business Owner) */}
        <Route path="/portal" element={<ResidentPortal />} />
        <Route path="/portal/health" element={<ResidentHealth />} />
        <Route path="/portal/permits" element={<ResidentPermits />} />
        <Route path="/portal/complaints" element={<ResidentComplaints />} />
        <Route path="/portal/request" element={<ResidentRequest />} />
        <Route path="/portal/qrcode" element={<ResidentQRCode />} />
        <Route path="/portal/establishments" element={<EstablishmentManagement />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/resident" element={<Navigate to="/portal" replace />} />
      <Route path="/resident/*" element={<Navigate to="/portal" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
