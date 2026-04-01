import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import FilterCard from "@/components/FilterCard";
import LatestJobCards from "@/components/LatestJobCards";
import { useSelector, useDispatch } from "react-redux"; // Added
import useGetAllJobs from "@/hooks/useGetAllJobs"; // Custom hook to fetch jobs

const Browse = () => {
  // 1. Fetch all jobs from DB when page loads
  useGetAllJobs();

  // 2. Get real data from Redux
  const { allJobs } = useSelector((store: any) => store.job);
  
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");

  const toggleType = (type: string) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const clearAll = () => {
    setQuery("");
    setSelectedTypes([]);
    setSelectedLocation("");
    setSalaryRange("");
  };

  // 3. Updated Filter Logic for MongoDB Fields
  const filtered = useMemo(() => {
    if (!allJobs) return [];

    return allJobs.filter((job: any) => {
      // Check title, company name, or requirements (skills)
      const matchesQuery =
        !query ||
        job?.title?.toLowerCase().includes(query.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(query.toLowerCase()) ||
        job?.requirements?.some((req: string) => req.toLowerCase().includes(query.toLowerCase()));
      
      // Check Job Type (Full-time, Part-time, etc.)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job?.jobType);
      
      // Check Location
      const matchesLocation = !selectedLocation || job?.location === selectedLocation;
      
      // Check Category (Coming from Home Page)
      const matchesCategory = !initialCategory || job?.category === initialCategory;
      
      return matchesQuery && matchesType && matchesLocation && matchesCategory;
    });
  }, [allJobs, query, selectedTypes, selectedLocation, initialCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Browse Jobs
          </h1>
          <p className="mt-1 text-muted-foreground">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, company, or skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Filters */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FilterCard
                selectedTypes={selectedTypes}
                selectedLocation={selectedLocation}
                salaryRange={salaryRange}
                onToggleType={toggleType}
                onSelectLocation={setSelectedLocation}
                onSelectSalary={setSalaryRange}
                onClearAll={clearAll}
              />
            </div>
          </div>

          {/* Job Results List */}
          <div className="flex flex-col gap-4">
            {filtered.length > 0 ? (
              filtered.map((job: any, i: number) => (
                <LatestJobCards key={job?._id} job={job} index={i} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                   <Search className="h-8 w-8" />
                </div>
                <p className="font-heading text-lg font-semibold text-foreground">
                  No jobs found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search query or filters
                </p>
                <button 
                  onClick={clearAll}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browse;