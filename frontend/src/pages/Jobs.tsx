import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button"; // Fixed path
import { Badge } from "@/components/ui/badge";   // Fixed path
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { useSelector } from "react-redux"; // Added to get real data
import useGetAllJobs from "@/hooks/useGetAllJobs"; // Hook to fetch from DB
import { jobTypes, locations } from "@/utils/filterOptions";

const Jobs = () => {
  // 1. Fetch jobs from the backend
  useGetAllJobs();

  // 2. Access jobs from Redux store instead of mock file
  const { allJobs } = useSelector((store: any) => store.job);

  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (type: string) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  // 3. Filter logic updated for MongoDB fields
  const filtered = useMemo(() => {
    if (!allJobs) return [];

    return allJobs.filter((job: any) => {
      const matchesQuery =
        !query ||
        job?.title?.toLowerCase().includes(query.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(query.toLowerCase()) ||
        job?.description?.toLowerCase().includes(query.toLowerCase());
      
      // Updated to use 'jobType' from your DB
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job?.jobType);
      const matchesLocation = !selectedLocation || job?.location === selectedLocation;
      const matchesCategory = !initialCategory || job?.category === initialCategory;
      
      return matchesQuery && matchesType && matchesLocation && matchesCategory;
    });
  }, [allJobs, query, selectedTypes, selectedLocation, initialCategory]);

  const activeFilterCount = selectedTypes.length + (selectedLocation ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {initialCategory ? `${initialCategory} Jobs` : "Browse Jobs"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search + Filter Toggle */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 rounded-xl border bg-card p-5 card-shadow">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Job Type</h3>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedTypes.includes(type)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Location</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedLocation === loc
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedLocation("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Job Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job: any, i: number) => (
              <JobCard key={job?._id} job={job} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">No jobs found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;