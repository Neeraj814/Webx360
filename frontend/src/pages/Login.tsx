import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.email.trim() || !input.password.trim()) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await login(input.email, input.password, input.role);

      toast({ title: "Welcome back!", description: "Logged in successfully." });

      if (input.role === "recruiter") {
        navigate("/admin/companies");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">

        {/* --- LEFT: BRAND PANEL --- */}
        <div className="relative hidden overflow-hidden bg-ink px-12 py-16 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10">
            <span className="font-display text-2xl font-semibold text-ink-foreground">
              WebX<span className="text-primary">360</span>
            </span>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="font-display text-3xl leading-tight text-ink-foreground text-balance">
              "Applied on Friday, had an interview scheduled by Monday."
            </p>
            <p className="mt-4 text-sm text-ink-muted">— A student who used WebX360 to land their first internship</p>
          </div>

          <div className="relative z-10 flex items-center gap-8 border-t border-ink-foreground/10 pt-6">
            <div>
              <p className="font-display text-2xl font-semibold text-ink-foreground">10k+</p>
              <p className="text-xs text-ink-muted mt-0.5">Students placed</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ink-foreground">400+</p>
              <p className="text-xs text-ink-muted mt-0.5">Partner companies</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: FORM --- */}
        <div className="flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <h1 className="font-display text-3xl font-semibold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to keep track of your applications.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={input.email}
                    onChange={changeEventHandler}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={input.password}
                    onChange={changeEventHandler}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>I'm signing in as</Label>
                <RadioGroup
                  value={input.role}
                  onValueChange={(value) => setInput({ ...input, role: value })}
                  className="mt-2.5 grid grid-cols-2 gap-3"
                >
                  <label
                    htmlFor="r1"
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${input.role === 'student' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    <RadioGroupItem value="student" id="r1" />
                    Student
                  </label>
                  <label
                    htmlFor="r2"
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${input.role === 'recruiter' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    <RadioGroupItem value="recruiter" id="r2" />
                    Recruiter
                  </label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full gap-2 font-semibold" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
