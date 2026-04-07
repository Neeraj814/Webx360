import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Loader2, Camera } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null as File | null
    });

    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, file: e.target.files?.[0] || null });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role || !input.file) {
            toast({ title: "Error", description: "All fields including profile photo are required.", variant: "destructive" });
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        setSubmitting(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (res.data.success) {
                toast({ title: "Success", description: res.data.message });
                navigate("/login");
            }
        } catch (err: any) {
            toast({
                title: "Signup Failed",
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
                    <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Create your account and start your journey.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {/* Full Name */}
                        <div>
                            <Label>Full Name</Label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input name="fullname" placeholder="Alex Johnson" className="pl-10" value={input.fullname} onChange={changeEventHandler} required />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input name="email" type="email" placeholder="you@example.com" className="pl-10" value={input.email} onChange={changeEventHandler} required />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <Label>Phone Number</Label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input name="phoneNumber" placeholder="9876543210" className="pl-10" value={input.phoneNumber} onChange={changeEventHandler} required />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <Label>Password</Label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input name="password" type="password" placeholder="••••••••" className="pl-10" value={input.password} onChange={changeEventHandler} required />
                            </div>
                        </div>

                        {/* Role & File Upload */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer w-4 h-4" />
                                        <Label className="font-normal">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer w-4 h-4" />
                                        <Label className="font-normal">Recruiter</Label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Profile Photo</Label>
                                <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer text-xs" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-primary hover:underline">Log In</Link>
                    </p>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
