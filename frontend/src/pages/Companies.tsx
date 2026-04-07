import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Search, MapPin, Building2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setCompanies } from "@/redux/companySlice";
import { useNavigate } from "react-router-dom";

const Companies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        const fetchAllPublicCompanies = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${COMPANY_API_END_POINT}/getall`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.error("Error fetching public companies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPublicCompanies();
    }, [dispatch]);

    // 2. Get data from Redux
    const { companies } = useSelector((store: any) => store.company);
    const { user } = useSelector((store: any) => store.auth);

    // 3. Filter logic for the search bar
    const filteredCompanies = companies?.filter((company: any) => {
        if (!filterText) return true;
        return company?.name?.toLowerCase().includes(filterText.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Top Companies</h1>
                        <p className="mt-2 text-lg text-slate-600">
                            {loading ? "Loading organizations..." : `Explore ${companies?.length || 0} organizations hiring right now.`}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find your next workplace..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                </div>

                {/* Companies Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCompanies?.length > 0 ? (
                            filteredCompanies.map((c: any, i: number) => (
                                <motion.div
                                    key={c._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl hover:border-primary/30"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                                                {c.logo ? (
                                                    <img src={c.logo} alt={c.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Building2 className="h-8 w-8 text-slate-400" />
                                                )}
                                            </div>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 text-xs font-bold">
                                                {c.jobCount || 0} Openings
                                            </Badge>
                                        </div>

                                        <div className="mt-5">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                {c.name}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{c.location || "Remote / Global"}</span>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
                                            {c.description || "Leading the industry with innovation and a commitment to excellence."}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Verified Employer
                                        </span>
                                        <button 
                                            onClick={() => {
                                                if (user?.role === 'recruiter' && c.userId === user?._id) {
                                                    navigate(`/admin/companies/${c._id}`);
                                                } else {
                                                    navigate(`/jobs?company=${c.name}`);
                                                }
                                            }}
                                            className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4"
                                        >
                                            {user?.role === 'recruiter' && c.userId === user?._id ? 'Manage' : 'View Jobs'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <h2 className="text-xl font-semibold text-slate-900">No companies match your search</h2>
                                <p className="text-slate-500">Try adjusting your keywords.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Companies;
