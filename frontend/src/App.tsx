import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UtilityLogsPage from "./pages/UtilityLogsPage";
import ChemicalPrepPage from "./pages/ChemicalPrepPage";
import AirValidationPage from "./pages/AirValidationPage";
import InstrumentsPage from "./pages/InstrumentsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import LogbooksPage from "./pages/LogbooksPage";
import LogbookBuilderPage from "./pages/LogbookBuilderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/utility-logs" element={<UtilityLogsPage />} />
              <Route path="/chemical-prep" element={<ChemicalPrepPage />} />
              <Route path="/air-validation" element={<AirValidationPage />} />
              <Route path="/instruments" element={<InstrumentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/logbooks" element={<LogbooksPage />} />
              <Route path="/logbook-builder" element={<LogbookBuilderPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
