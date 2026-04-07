import React from 'react';
import { useSelector } from 'react-redux';
import { Activity, Clock, Database } from 'lucide-react';

const LiveStatus = () => {
    const { allAdminJobs } = useSelector((store) => store.job);
    const { companies } = useSelector((store) => store.company);

    const latestJob = allAdminJobs && allAdminJobs.length > 0 ? allAdminJobs[0] : null;
    const latestCompany = companies && companies.length > 0 ? companies[0] : null;

    return (
        <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center justify-between mb-4 border-b pb-2 border-slate-100">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-slate-700 text-sm">System Activity</h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full animate-pulse font-bold">
                    LIVE SYNC
                </span>
            </div>
            
            <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <div className={`h-2 w-2 mt-1.5 rounded-full ${latestJob ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300'}`} />
                    <div>
                        <p className="text-sm text-slate-800">
                            {latestJob ? (
                                <>New job posted: <span className="font-bold">{latestJob.title}</span></>
                            ) : (
                                "No recent job posts"
                            )}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 
                            {latestJob ? new Date(latestJob.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </p>
                    </div>
                </li>

                <li className="flex items-start gap-3">
                    <div className={`h-2 w-2 mt-1.5 rounded-full ${latestCompany ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-slate-300'}`} />
                    <div>
                        <p className="text-sm text-slate-800">
                            {latestCompany ? (
                                <>Registered: <span className="font-bold">{latestCompany.name}</span></>
                            ) : (
                                "No companies registered"
                            )}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Database className="w-3 h-3" /> MySQL Instance Active
                        </p>
                    </div>
                </li>
            </ul>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase flex items-center gap-2">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full"></span>
                    SYNCED WITH: <span className="text-slate-600 font-bold">MYSQL_LOCAL_XAMPP</span>
                </p>
            </div>
        </div>
    );
};

export default LiveStatus;
