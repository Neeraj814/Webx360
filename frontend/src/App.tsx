import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import EditProfile from './components/EditProfile';

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";

// User Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Browse from "./pages/Browse";
import JobDescription from "./pages/JobDescription";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Admin Pages
// 🟢 IMPORTANT: Alag components use karein Public aur Admin ke liye
import Companies from "./pages/Companies"; // Ye Public Page hai (Cards wala)
//import AdminCompanies from "./components/admin/AdminCompanies"; // 👈 Ye Table wala component hona chahiye
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import AdminDashboard from "./components/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* 🟢 Public Companies Page (Cards style) */}
            <Route path="/companies" element={<Companies />} />

            {/* ---------- USER ROUTES ---------- */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/description/:id"
              element={
                <ProtectedRoute>
                  <JobDescription />
                </ProtectedRoute>
              }
            />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            
            {/* 🟢 Companies Management (Table style) */}
            { /* 🔴 Ab yahan Admin-specific component load hoga 
            <Route
              path="/admin/companies"
              element={
                <AdminRoute>
                 
                  <AdminCompanies /> 
                </AdminRoute>
              }
            />
            */}
            <Route
              path="/admin/companies/create"
              element={
                <AdminRoute>
                  <CompanyCreate />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/companies/:id"
              element={
                <AdminRoute>
                  <CompanySetup />
                </AdminRoute>
              }
            />

            {/* Jobs Management */}
            <Route
              path="/admin/jobs"
              element={
                <AdminRoute>
                  <AdminJobs />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/jobs/create"
              element={
                <AdminRoute>
                  <PostJob />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/jobs/:id/applicants"
              element={
                <AdminRoute>
                  <Applicants />
                </AdminRoute>
              }
            />

            {/* ---------- 404 ---------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
