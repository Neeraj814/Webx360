import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Or any spinner you have

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // 1. Get user and the loading status from your auth state
  const { user, loading } = useSelector((store: any) => store.auth);

  // 2. If the app is still fetching the user profile, show a spinner
  // This prevents the "fake" redirect to login during a page refresh
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="ml-2 font-bold">Verifying Session...</span>
      </div>
    );
  }

  // 3. If definitely no user after loading, go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 4. Check the role - make sure your DB uses "recruiter" (case sensitive!)
  if (user.role !== "recruiter") {
    console.log("Access Denied: User role is", user.role);
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;