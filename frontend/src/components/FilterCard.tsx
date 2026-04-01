import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, DollarSign, RotateCcw } from "lucide-react";

// Update these to match your MongoDB data values exactly
const jobTypes = ["Full-time", "Part-time", "Remote", "Internship"];
const locations = ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Noida"];
const salaryRanges = ["0-40k", "42k-1lakh", "1lakh-5lakh"];

interface FilterCardProps {
  selectedTypes: string[];
  selectedLocation: string;
  salaryRange: string;
  onToggleType: (type: string) => void;
  onSelectLocation: (loc: string) => void;
  onSelectSalary: (range: string) => void;
  onClearAll: () => void;
}

const FilterCard = ({
  selectedTypes,
  selectedLocation,
  salaryRange,
  onToggleType,
  onSelectLocation,
  onSelectSalary,
  onClearAll,
}: FilterCardProps) => {
  const hasFilters =
    selectedTypes.length > 0 || selectedLocation !== "" || salaryRange !== "";

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Filters
        </h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            onClick={onClearAll}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Job Type */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-semibold text-foreground">
            Job Type
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => onToggleType(type)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTypes.includes(type)
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-semibold text-foreground">
            Location
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => onSelectLocation(selectedLocation === loc ? "" : loc)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedLocation === loc
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/5"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-semibold text-foreground">
            Salary Range
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {salaryRanges.map((range) => (
            <button
              key={range}
              onClick={() => onSelectSalary(salaryRange === range ? "" : range)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                salaryRange === range
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent/5"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterCard;