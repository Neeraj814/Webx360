import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Lottie from "lottie-react";
import briefcaseAnimation from "@/assets/icons8-briefcase.json";

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth);
  const userData = user?.user ? user.user : user;

  // Logic for recruiter-only links
  const handleRecruiterAction = (path: string) => {
    if (!userData) {
      toast.error("Please login first!");
      navigate("/login");
    } else if (userData.role !== 'recruiter') {
      toast.error("Only recruiters can access this, Babuji!");
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg hero-gradient">
                <Lottie
                  animationData={briefcaseAnimation}
                  loop={true}
                  className="h-full w-full"
                />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                Web<span className="text-primary">X</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Connecting talent with opportunity. Find your dream job or the perfect candidate.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">For Job Seekers</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {/* Clickable Links */}
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-primary transition-colors">Companies</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors">Career Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">For Recruiters</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {/* Clickable with Recruiter Check */}
              <li>
                <button onClick={() => handleRecruiterAction("/admin/jobs/create")} className="hover:text-primary transition-colors">
                  Post a Job
                </button>
              </li>
              
              <li>
                <button onClick={() => handleRecruiterAction("/admin/dashboard")} className="hover:text-primary transition-colors">
                  Recruiter Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} WebX Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;