import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Loader2, Camera, ArrowRight } from "lucide-react";
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
            <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">

                {/* --- LEFT: BRAND PANEL --- */}
                <div className="relative hidden overflow-hidden bg-ink px-12 py-16 lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

                    <div className="relative z-10">
                        <span className="font-display text-2xl font-semibold text-ink-foreground">
                            WebX<span className="text-primary">360</span>
                        </span>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <p className="font-display text-3xl leading-tight text-ink-foreground text-balance">
                            Real openings, posted by companies that are actually hiring.
                        </p>
                        <p className="mt-4 text-sm text-ink-muted">
                            Create a free profile as a student or a recruiter and get matched to what's next.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-8 border-t border-ink-foreground/10 pt-6">
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink-foreground">2 min</p>
                            <p className="text-xs text-ink-muted mt-0.5">To set up a profile</p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink-foreground">Free</p>
                            <p className="text-xs text-ink-muted mt-0.5">Always, for students</p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: FORM --- */}
                <div className="flex items-center justify-center px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-sm"
                    >
                        <h1 className="font-display text-3xl font-semibold text-foreground">Create your account</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Start your search or start hiring — takes a minute.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                            <div>
                                <Label>Full name</Label>
                                <div className="relative mt-1.5">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input name="fullname" placeholder="Alex Johnson" className="pl-10" value={input.fullname} onChange={changeEventHandler} required />
                                </div>
                            </div>

                            <div>
                                <Label>Email</Label>
                                <div className="relative mt-1.5">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input name="email" type="email" placeholder="you@example.com" className="pl-10" value={input.email} onChange={changeEventHandler} required />
                                </div>
                            </div>

                            <div>
                                <Label>Phone number</Label>
                                <div className="relative mt-1.5">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input name="phoneNumber" placeholder="9876543210" className="pl-10" value={input.phoneNumber} onChange={changeEventHandler} required />
                                </div>
                            </div>

                            <div>
                                <Label>Password</Label>
                                <div className="relative mt-1.5">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input name="password" type="password" placeholder="••••••••" className="pl-10" value={input.password} onChange={changeEventHandler} required />
                                </div>
                            </div>

                            <div>
                                <Label>I am a</Label>
                                <div className="mt-2.5 grid grid-cols-2 gap-3">
                                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${input.role === 'student' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                                        <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="hidden" />
                                        Student
                                    </label>
                                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${input.role === 'recruiter' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                                        <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="hidden" />
                                        Recruiter
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Label>Profile photo</Label>
                                <div className="relative mt-1.5">
                                    <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer pl-10 text-xs file:text-xs" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full gap-2 font-semibold mt-2" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
s
