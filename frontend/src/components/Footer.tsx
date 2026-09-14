import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Lottie from "lottie-react";
import briefcaseAnimation from "@/assets/icons8-briefcase.json";

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth);
  const userData = user?.user ? user.user : user;

  const handleRecruiterAction = (path: string) => {
    if (!userData) {
      toast.error("Please log in first");
      navigate("/login");
    } else if (userData.role !== "recruiter") {
      toast.error("Only recruiter accounts can access this");
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* --- BRAND --- */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Lottie animationData={briefcaseAnimation} loop className="h-6 w-6 invert brightness-0 contrast-200" />
              </div>
              <span className="font-display text-xl font-semibold text-ink-foreground">
                WebX<span className="text-primary">360</span>
              </span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              A place where students find real opportunities and recruiters find the people worth hiring.
            </p>
          </div>

          {/* --- JOB SEEKERS --- */}
          <div>
            <h4 className="font-display text-sm font-semibold text-ink-foreground mb-4">For job seekers</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse jobs</Link></li>
              <li><Link to="/companies" className="hover:text-primary transition-colors">Companies</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors">Career resources</Link></li>
            </ul>
          </div>

          {/* --- RECRUITERS --- */}
          <div>
            <h4 className="font-display text-sm font-semibold text-ink-foreground mb-4">For recruiters</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li>
                <button onClick={() => handleRecruiterAction("/admin/jobs/create")} className="hover:text-primary transition-colors text-left">
                  Post a job
                </button>
              </li>
              <li>
                <button onClick={() => handleRecruiterAction("/admin/dashboard")} className="hover:text-primary transition-colors text-left">
                  Recruiter dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleRecruiterAction("/admin/companies")} className="hover:text-primary transition-colors text-left">
                  Manage companies
                </button>
              </li>
            </ul>
          </div>

          {/* --- COMPANY --- */}
          <div>
            <h4 className="font-display text-sm font-semibold text-ink-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><Link to="/about" className="hover:text-primary transition-colors">About us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact support</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-ink-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} WebX360. All rights reserved.</p>
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
