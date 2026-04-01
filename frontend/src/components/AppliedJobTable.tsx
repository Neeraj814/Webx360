import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';

// Enhanced status styles to match your design system
const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const AppliedJobTable = () => {
  // ✅ Extracting real data from Redux instead of mock data
  const { allAppliedJobs } = useSelector((store: any) => store.job);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Application History
        </h2>
        <Badge variant="secondary" className="px-3 py-1 rounded-full opacity-70">
          {allAppliedJobs?.length || 0} Total Applications
        </Badge>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-heading font-bold text-zinc-700">Company</TableHead>
              <TableHead className="font-heading font-bold text-zinc-700">Job Title</TableHead>
              <TableHead className="font-heading font-bold text-zinc-700 text-center">Date</TableHead>
              <TableHead className="font-heading font-bold text-zinc-700 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAppliedJobs && allAppliedJobs.length > 0 ? (
              allAppliedJobs.map((appliedJob: any) => (
                <TableRow key={appliedJob._id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary group-hover:scale-110 transition-transform">
                        {appliedJob.job?.company?.logo ? (
                            <img src={appliedJob.job?.company?.logo} alt="logo" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                            appliedJob.job?.company?.name?.charAt(0) || "C"
                        )}
                      </div>
                      <span className="font-bold text-foreground">{appliedJob.job?.company?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {appliedJob.job?.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {/* Formatting the MongoDB date string */}
                    {appliedJob?.createdAt ? new Date(appliedJob.createdAt).toLocaleDateString("en-GB") : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={`capitalize font-bold px-3 py-1 rounded-lg ${statusStyles[appliedJob.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
                    >
                      {appliedJob.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-medium">No applications found</span>
                    <p className="text-sm">Start searching for jobs to see your history here.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default AppliedJobTable;