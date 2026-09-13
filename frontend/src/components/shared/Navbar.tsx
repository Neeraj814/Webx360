import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import briefcaseAnimation from "@/assets/icons8-briefcase.json";
import {
  Menu, X, LogOut, User2, LayoutDashboard,
  ChevronRight, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { NavLink } from "../NavLink";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RootState {
  auth: {
    user: any | null;
  };
}

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "Browse", to: "/browse" },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store: RootState) => store.auth);
  const userData = user?.user ? user.user : user;

  const fullName = userData?.fullname || userData?.fullName || "";
  const profilePic = userData?.profile?.profilePhoto || userData?.profilePhoto || "";
  const userRole = userData?.role || "student";

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        setMobileOpen(false);
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl px-4">

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm transition-transform duration-300 group-hover:-rotate-3">
            <Lottie
              animationData={briefcaseAnimation}
              loop={true}
              className="h-6 w-6 invert brightness-0 contrast-200"
            />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            WebX<span className="text-primary">360</span>
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-foreground"
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/companies"
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            Companies
          </NavLink>

          {userRole === 'recruiter' && (
            <div className="flex items-center ml-2 pl-4 border-l border-border">
              <NavLink
                to="/admin/dashboard"
                className="group/admin flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-ink text-ink-foreground rounded-full hover:bg-ink/90 transition-all"
                activeClassName="ring-2 ring-primary/40"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Recruiter workspace
              </NavLink>
            </div>
          )}
        </nav>

        {/* --- DESKTOP USER ACTIONS --- */}
        <div className="hidden items-center gap-3 md:flex">
          {userData ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 rounded-full py-1 px-1 pl-3 border border-transparent hover:border-border hover:bg-muted/50 transition-all outline-none group">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {fullName ? fullName.split(" ")[0] : "Account"}
                  </span>
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={profilePic} className="object-cover" />
                    <AvatarFallback className="bg-primary text-white text-xs">{fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-2 shadow-2xl border-border mt-2" align="end">
                <div className="flex items-center gap-3 px-3 py-4 border-b mb-1 bg-muted/30 rounded-t-lg">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={profilePic} className="object-cover" />
                    <AvatarFallback>{fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold truncate text-foreground">{fullName}</p>
                    <p className="text-[11px] font-semibold text-primary capitalize">{userRole}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <Link to="/profile?edit=true">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 font-normal hover:bg-primary/5 hover:text-primary">
                      <User2 className="h-4 w-4" /> View profile
                    </Button>
                  </Link>

                  {userRole === 'recruiter' && (
                    <Link to="/admin/dashboard">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 font-normal hover:bg-primary/5 hover:text-primary">
                        <LayoutDashboard className="h-4 w-4" /> Recruiter dashboard
                      </Button>
                    </Link>
                  )}

                  <div className="border-t my-1" />

                  <Button
                    variant="ghost" size="sm"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/signup"><Button size="sm">Sign up</Button></Link>
            </div>
          )}
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="md:hidden text-foreground p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300 min-h-screen">

          {userData ? (
            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-2xl border border-border">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={profilePic} className="object-cover" />
                <AvatarFallback className="bg-primary text-white text-lg">{fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-base font-bold text-foreground">{fullName}</p>
                <p className="text-xs font-semibold text-primary capitalize">{userRole}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-2">
              <p className="text-sm font-semibold text-muted-foreground px-1">Welcome to WebX360</p>
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-center py-6 text-base font-semibold">Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-center py-6 text-base font-semibold">Create account</Button>
                </Link>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-1">Navigation</p>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all hover:bg-muted"
                activeClassName="bg-primary/10 text-primary"
              >
                {link.label}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>
            ))}
            <NavLink
              to="/companies"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all hover:bg-muted"
              activeClassName="bg-primary/10 text-primary"
            >
              Companies
              <ChevronRight className="h-4 w-4 opacity-50" />
            </NavLink>
          </nav>

          {userData && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-muted-foreground px-3 mb-1">Account</p>
              <Link
                to="/profile?edit=true"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-xl"
              >
                <Settings className="h-4 w-4 text-primary" />
                Profile settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-sm font-bold text-destructive hover:bg-destructive/5 rounded-xl mt-4"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
