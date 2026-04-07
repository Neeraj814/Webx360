import React from 'react';
import { useSelector } from 'react-redux';
import { Building2, Briefcase, Users, Plus, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


import useGetAdminCompanies from '@/hooks/useGetAdminCompanies'; 
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'; 
import Navbar from "@/components/shared/Navbar";

const LiveStatus = ({ jobs, companies, totalApplicants }: { jobs: any[], companies: any[], totalApplicants: number }) => {
    
    const latestJob = jobs && jobs.length > 0 ? [...jobs].reverse()[0] : null;
    const latestCompany = companies && companies.length > 0 ? [...companies].reverse()[0] : null;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-50">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-800 tracking-tight">System Activity Feed</h3>
                </div>
                <span className="flex items-center gap-2 text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black animate-pulse border border-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    LIVE SYNC ACTIVE
                </span>
            </div>
            
            <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                    <div className={`h-2.5 w-2.5 mt-1.5 rounded-full ${latestJob ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-slate-300'}`} />
                    <div>
                        <p className="text-sm text-slate-700 font-medium">
                            {latestJob ? <>Recent Post: <span className="text-blue-600 font-bold">{latestJob.title}</span></> : "Waiting for job posts..."}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                           <Clock className="w-3 h-3"/> {latestJob ? `Posted ${new Date(latestJob.createdAt).toLocaleDateString()}` : 'System Ready'}
                        </p>
                    </div>
                </li>

                <li className="flex items-start gap-4 group">
                    <div className={`h-2.5 w-2.5 mt-1.5 rounded-full ${latestCompany ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'bg-slate-300'}`} />
                    <div>
                        <p className="text-sm text-slate-700 font-medium">
                            {latestCompany ? <>New Entity: <span className="text-orange-600 font-bold">{latestCompany.name}</span></> : "No companies registered."}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                           {totalApplicants} {totalApplicants === 1 ? 'applicant' : 'applicants'} currently in queue
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    
    useGetAdminCompanies();
    useGetAllAdminJobs();

    const navigate = useNavigate();
    
    
    const { user } = useSelector((store: any) => store.auth);
    const { allAdminJobs } = useSelector((store: any) => store.job);
    const { companies } = useSelector((store: any) => store.company); 

    const totalApplicants = allAdminJobs?.reduce((acc: number, job: any) => acc + (job.applications?.length || 0), 0);

    const stats = [
        {
            label: "Total Companies",
            value: companies?.length || 0,
            icon: <Building2 className="text-blue-600" />,
            path: "/admin/companies", // 
            color: "group-hover:border-blue-200"
        },
        {
            label: "Active Jobs",
            value: allAdminJobs?.length || 0,
            icon: <Briefcase className="text-purple-600" />,
            path: "/admin/jobs",
            color: "group-hover:border-purple-200"
        },
        {
            label: "Total Applicants",
            value: totalApplicants || 0,
            icon: <Users className="text-emerald-600" />,
            path: "/admin/jobs", 
            color: "group-hover:border-emerald-200"
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Admin Overview</h1>
                        <p className="text-slate-500 font-semibold mt-2 text-lg">
                            Welcome back, <span className="text-[#6A38C2] font-black">{user?.fullname}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate("/admin/companies/create")} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                            <Plus className="w-5 h-5" /> Register Company
                        </button>
                        <button onClick={() => navigate("/admin/jobs/create")} className="flex items-center gap-2 px-8 py-3.5 bg-[#6A38C2] text-white rounded-2xl font-bold hover:bg-[#5b30a6] transition-all active:scale-95 shadow-lg">
                            <Briefcase className="w-5 h-5" /> Post Job
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                console.log("Ji Babuji, moving to:", stat.path);
                                navigate(stat.path);
                            }}
                            className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden ${stat.color} z-10`}
                        >
                            <div className="relative z-20 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                    <h3 className="text-6xl font-black mt-4 text-slate-900 tracking-tighter">{stat.value}</h3>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] group-hover:bg-opacity-80 transition-colors">
                                    {React.cloneElement(stat.icon as React.ReactElement, { size: 32 })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-2xl shadow-slate-200/40">
                    <LiveStatus jobs={allAdminJobs} companies={companies} totalApplicants={totalApplicants} />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
