import React from 'react';
import Navbar from '@/components/shared/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Contact, Mail, Pen, FileText, ExternalLink } from 'lucide-react';
import { Label } from '@/components/ui/label';
import AppliedJobTable from '@/components/AppliedJobTable';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { useNavigate } from 'react-router-dom';

interface RootState {
    auth: {
        user: {
            fullname: string;
            email: string;
            phoneNumber: string;
            profile: {
                bio: string;
                skills: string[];
                resume: string;
                resumeOriginalName: string;
                profilePhoto: string;
            };
        } | null;
    };
}

const Profile: React.FC = () => {
    useGetAppliedJobs();
    const { user } = useSelector((store: RootState) => store.auth);
    const navigate = useNavigate();
    const hasResume = !!user?.profile?.resume;

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
                
                {/* --- PROFILE HEADER CARD --- */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                    {/* Subtle decorative background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-1 ring-gray-100">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                    alt="profile"
                                />
                                <AvatarFallback className="bg-primary text-white text-2xl">
                                    {user?.fullname?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="text-center md:text-left">
                                <h1 className="font-bold text-3xl text-gray-900 tracking-tight">
                                    {user?.fullname || "User Name"}
                                </h1>
                                <p className="text-gray-600 mt-2 max-w-lg leading-relaxed text-[15px]">
                                    {user?.profile?.bio || "Crafting digital experiences as a Full Stack Developer."}
                                </p>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <Mail className="h-4 w-4" />
                                        <span>{user?.email || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <Contact className="h-4 w-4" />
                                        <span>{user?.phoneNumber || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/edit-profile")}
                            className="rounded-xl border-gray-200 hover:bg-primary hover:text-white transition-all duration-300 gap-2 shadow-sm"
                        >
                            <Pen className="h-4 w-4" />
                            <span>Edit Profile</span>
                        </Button>
                    </div>

                    {/* --- SKILLS SECTION --- */}
                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-5">
                            Expertise & Skills
                        </h2>
                        <div className="flex flex-wrap gap-2.5">
                            {user?.profile?.skills?.length > 0 ? (
                                user.profile.skills.map((item, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white hover:scale-105 transition-all cursor-default shadow-sm"
                                    >
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 italic">Add your technical skills...</span>
                            )}
                        </div>
                    </div>

                    {/* --- PROFESSIONAL RESUME CARD --- */}
                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-5">
                            Curriculum Vitae
                        </h2>
                        {hasResume ? (
                            <div className="group flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-primary/30 transition-all duration-300 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-red-50 text-red-500 group-hover:scale-110 transition-transform">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] md:max-w-xs">
                                            {user?.profile?.resumeOriginalName || "Professional_Resume.pdf"}
                                        </p>
                                        <p className="text-xs text-gray-500">Official Resume • PDF</p>
                                    </div>
                                </div>
                                <a
                                    href={user?.profile?.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors shadow-md"
                                >
                                    <span>View</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-400 hover:border-primary/40 transition-colors">
                                <p className="text-sm font-medium">No resume found in our records</p>
                                <Button 
                                    variant="link" 
                                    className="text-primary font-bold mt-1 h-auto p-0"
                                    onClick={() => navigate("/edit-profile")}
                                >
                                    Upload Document
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- APPLIED JOBS SECTION --- */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-bold text-xl text-gray-900">Application History</h2>    
                        <Badge variant="secondary" className="rounded-lg px-3 py-1">
                            Recent Activity
                        </Badge>
                    </div>
                    <AppliedJobTable />
                </div>
            </div>
        </div>
    );  
};

// Helper component for simple badge replacement if needed
const Badge = ({ children, className, variant }: any) => (
    <span className={`px-2 py-1 text-xs font-bold rounded ${className} ${variant === 'secondary' ? 'bg-gray-100 text-gray-600' : ''}`}>
        {children}
    </span>
);

export default Profile;