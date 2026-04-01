import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

const Login = () => {
  // Using a single state object is cleaner for forms
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
      // Pass the input object or individual fields based on your AuthContext definition
      await login(input.email, input.password, input.role);
      
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      
      // Dynamic navigation based on role
      if (input.role === "recruiter") {
        navigate("/admin/companies");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Login Failed",
        // Show the actual message from your backend ('Incorrect email', etc.)
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
      <div className="container flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center">Log In</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Welcome back! Sign in to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
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

            {/* Password Field */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
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

            {/* Role Selection */}
            <div className="py-2">
              <Label>Select Role</Label>
              <RadioGroup 
                value={input.role} 
                onValueChange={(value) => setInput({...input, role: value})} 
                className="flex gap-6 mt-3"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="student" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer font-normal">Student</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="recruiter" id="r2" />
                  <Label htmlFor="r2" className="cursor-pointer font-normal">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;