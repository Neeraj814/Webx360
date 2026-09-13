import React from "react";
import { useSelector } from "react-redux";
import { Building2 } from "lucide-react";

/**
 * A continuous marquee of hiring companies, shown just under the hero.
 * Real data from the store (not decorative placeholders) — falls back
 * to a quiet message if nothing has loaded yet.
 */
const CompanyMarquee: React.FC = () => {
  const { companies } = useSelector((store: any) => store.company);

  const list = companies && companies.length > 0 ? companies : [];
  if (list.length === 0) return null;

  const track = [...list, ...list];

  return (
    <div className="border-y border-border bg-muted/30 py-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Companies hiring on WebX360
        </p>
      </div>
      <div className="flex w-max gap-12 marquee-track">
        {track.map((c: any, i: number) => (
          <div key={`${c._id || c.name}-${i}`} className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            {c.logo ? (
              <img src={c.logo} alt={c.name} className="h-6 w-6 rounded object-cover" />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-display text-lg text-foreground whitespace-nowrap">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyMarquee;
