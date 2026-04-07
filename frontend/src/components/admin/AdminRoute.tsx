import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((store: any) => store.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="ml-2 font-bold">Verifying Session...</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "recruiter") {
    console.log("Access Denied: User role is", user.role);
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
