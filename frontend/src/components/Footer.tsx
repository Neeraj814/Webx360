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
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container py-12 mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-4">
          
          {/* --- BRAND SECTION --- */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shadow-sm transition-all duration-300 group-hover:bg-primary/20">
                <Lottie
                  animationData={briefcaseAnimation}
                  loop={true}
                  className="h-6 w-6"
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-lg font-black tracking-tighter text-foreground">
                  <span className="text-muted-foreground/60 font-medium">Web</span>
                  <span className="text-primary italic">X</span>
                  <span className="text-foreground">360</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting talent with opportunity. WebX360 provides a seamless platform to find your dream job or the perfect candidate for your team.
            </p>
          </div>
          
          {/* --- JOB SEEKERS --- */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/jobs" className="hover:text-primary transition-colors flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-primary/40" /> Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-primary transition-colors flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-primary/40" /> Companies</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-primary/40" /> Career Resources</Link></li>
            </ul>
          </div>

          {/* --- RECRUITERS --- */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground mb-4">For Recruiters</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <button onClick={() => handleRecruiterAction("/admin/jobs/create")} className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" /> Post a Job
                </button>
              </li>
              <li>
                <button onClick={() => handleRecruiterAction("/admin/dashboard")} className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" /> Recruiter Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleRecruiterAction("/admin/companies")} className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary/40" /> Manage Companies
                </button>
              </li>
            </ul>
          </div>

          {/* --- COMPANY --- */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} WebX360 Job Portal. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">LinkedIn</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-primary cursor-pointer transition-colors">GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
