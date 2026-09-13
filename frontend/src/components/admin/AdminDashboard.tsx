import React from 'react';
import { useSelector } from 'react-redux';
import { Building2, Briefcase, Users, Plus, Activity, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useGetAdminCompanies from '@/hooks/useGetAdminCompanies';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import Navbar from "@/components/shared/Navbar";

const LiveStatus = ({ jobs, companies, totalApplicants }: { jobs: any[], companies: any[], totalApplicants: number }) => {

    const latestJob = jobs && jobs.length > 0 ? [...jobs].reverse()[0] : null;
    const latestCompany = companies && companies.length > 0 ? [...companies].reverse()[0] : null;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-ink-foreground/10 pb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-semibold text-ink-foreground">Activity</h3>
                </div>
                <span className="flex items-center gap-2 text-[10px] bg-primary/15 text-primary px-3 py-1 rounded-full font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                    Live
                </span>
            </div>

            <ul className="space-y-6">
                <li className="flex items-start gap-4">
                    <div className={`h-2 w-2 mt-1.5 rounded-full ${latestJob ? 'bg-primary' : 'bg-ink-foreground/20'}`} />
                    <div>
                        <p className="text-sm text-ink-foreground/90 font-medium">
                            {latestJob ? <>New role posted: <span className="text-primary font-semibold">{latestJob.title}</span></> : "Waiting for job posts..."}
                        </p>
                        <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {latestJob ? new Date(latestJob.createdAt).toLocaleDateString() : 'System ready'}
                        </p>
                    </div>
                </li>

                <li className="flex items-start gap-4">
                    <div className={`h-2 w-2 mt-1.5 rounded-full ${latestCompany ? 'bg-accent' : 'bg-ink-foreground/20'}`} />
                    <div>
                        <p className="text-sm text-ink-foreground/90 font-medium">
                            {latestCompany ? <>Company registered: <span className="text-accent font-semibold">{latestCompany.name}</span></> : "No companies registered yet."}
                        </p>
                        <p className="text-xs text-ink-muted mt-0.5">
                            {totalApplicants} {totalApplicants === 1 ? 'applicant' : 'applicants'} in the pipeline
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
            label: "Companies",
            value: companies?.length || 0,
            icon: <Building2 />,
            path: "/admin/companies",
        },
        {
            label: "Active jobs",
            value: allAdminJobs?.length || 0,
            icon: <Briefcase />,
            path: "/admin/jobs",
        },
        {
            label: "Applicants",
            value: totalApplicants || 0,
            icon: <Users />,
            path: "/admin/jobs",
        },
    ];

    return (
        <div className="min-h-screen bg-muted/40">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="font-display text-4xl font-semibold text-foreground tracking-tight">Recruiter workspace</h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, <span className="text-primary font-semibold">{user?.fullname}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate("/admin/companies/create")} className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl font-semibold text-sm hover:bg-muted transition-all active:scale-95 shadow-sm">
                            <Plus className="w-4 h-4" /> Register company
                        </button>
                        <button onClick={() => navigate("/admin/jobs/create")} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-md">
                            <Briefcase className="w-4 h-4" /> Post a job
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(stat.path)}
                            className="group text-left bg-card p-7 rounded-2xl shadow-sm border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                                    <h3 className="font-display text-5xl font-semibold mt-3 text-foreground">{stat.value}</h3>
                                </div>
                                <div className="p-4 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}
                                </div>
                            </div>
                            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                Manage <ArrowUpRight className="h-3 w-3" />
                            </span>
                        </button>
                    ))}
                </div>

                <div className="bg-ink text-ink-foreground rounded-2xl p-8 md:p-10 elevated-shadow">
                    <LiveStatus jobs={allAdminJobs} companies={companies} totalApplicants={totalApplicants} />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
