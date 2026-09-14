import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

interface RootState {
    auth: {
        user: {
            role: string;
        } | null;
    };
    job: {
        allJobs: any[];
    };
    company: {
        companies: any[];
    };
}

const HeroSection: React.FC = () => {
    const { user } = useSelector((store: RootState) => store.auth);
    const { allJobs } = useSelector((store: RootState) => store.job);
    const { companies } = useSelector((store: RootState) => store.company);
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isRecruiter = user?.role === 'recruiter';

    const searchJobHandler = (): void => {
        dispatch(setSearchedQuery(query));
        isRecruiter ? navigate("/admin/jobs") : navigate("/browse");
    };

    const jobCount = allJobs?.length || 0;
    const companyCount = companies?.length || 0;

    return (
        <section className="relative overflow-hidden bg-background">
            <div className="container mx-auto max-w-7xl px-4 pt-14 pb-10 md:pt-20 md:pb-16">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

                    {/* --- LEFT: EDITORIAL COPY --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-xl"
                    >
                        <p className="text-sm font-semibold text-primary mb-4">
                            {isRecruiter ? "For teams hiring right now" : "For students starting out"}
                        </p>

                        <h1 className="font-display text-[2.6rem] leading-[1.05] md:text-6xl md:leading-[1.03] font-semibold text-foreground text-balance">
                            {isRecruiter
                                ? <>Hire the person who actually fits the role.</>
                                : <>Your first job shouldn't feel like a lottery.</>
                            }
                        </h1>

                        <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                            {isRecruiter
                                ? "Post a role, see qualified applicants the same day, and manage every stage from one dashboard."
                                : "WebX360 lists real openings from companies that are actively hiring — searchable by skill, location, and salary, no guesswork."
                            }
                        </p>

                        {/* Search Pill */}
                        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full">
                            <div className="flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5 sm:border-r sm:border-border">
                                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={isRecruiter ? "Role you're hiring for" : "Job title or company"}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
                                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="hidden flex-1 items-center gap-2.5 px-4 py-2.5 sm:flex">
                                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                            </div>
                            <Button
                                onClick={searchJobHandler}
                                className="h-11 shrink-0 gap-2 rounded-full px-6 font-semibold"
                            >
                                Search <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Live stat strip — a structural device, not decoration: real counts from the data */}
                        <div className="mt-9 flex items-center gap-8 border-t border-border pt-6">
                            <div>
                                <p className="font-display text-2xl font-semibold text-foreground">{jobCount.toLocaleString()}+</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Open roles</p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <p className="font-display text-2xl font-semibold text-foreground">{companyCount.toLocaleString()}+</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Hiring companies</p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <p className="font-display text-2xl font-semibold text-foreground">24h</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Avg. reply time</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT: VISUAL --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10" />
                        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border bg-muted">
                            <img
                                src={isRecruiter ? "/Recuiter-Home.png" : "/Student-Home.png"}
                                className={`h-full w-full object-cover ${isRecruiter ? "object-center" : "object-bottom"}`}
                                alt="People finding their next role on WebX360"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
