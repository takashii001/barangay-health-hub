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
import ResidentPortal from "./pages/ResidentPortal";
import ResidentHealth from "./pages/ResidentHealth";
import ResidentPermits from "./pages/ResidentPermits";
import ResidentComplaints from "./pages/ResidentComplaints";
import ResidentRequest from "./pages/ResidentRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'resident' ? '/resident' : '/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'resident' ? '/resident' : '/dashboard'} replace />
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
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Resident Routes */}
        <Route path="/resident" element={<ResidentPortal />} />
        <Route path="/resident/health" element={<ResidentHealth />} />
        <Route path="/resident/permits" element={<ResidentPermits />} />
        <Route path="/resident/complaints" element={<ResidentComplaints />} />
        <Route path="/resident/request" element={<ResidentRequest />} />
      </Route>

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
