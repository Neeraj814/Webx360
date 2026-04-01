import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LatestJobCardProps {
    job: any;
    index: number;
}

const LatestJobCards = ({ job, index }: LatestJobCardProps) => {
    const navigate = useNavigate();

    // ✅ FIXED: Corrected math for daysAgo
    const daysAgoFunction = (mongodbTime: any) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - createdAt.getTime();
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return days === 0 ? "Today" : `${days}d ago`;
    }

    const handleApply = (e: React.MouseEvent) => {
        e.preventDefault(); // ✅ Stops the <Link> from triggering
        navigate(`/description/${job?._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -5 }}
        >
            <Link
                to={`/description/${job?._id}`}
                className="group block rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
                <div className="flex items-start gap-4">
                    {/* COMPANY LOGO */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 font-heading text-sm font-bold text-primary border border-primary/5">
                        {job?.company?.logo ? (
                            <img src={job?.company?.logo} alt="logo" className="h-full w-full object-cover" />
                        ) : (
                            job?.company?.name?.charAt(0) || "C"
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {job?.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-0.5">{job?.company?.name}</p>
                            </div>
                            {/* SALARY BADGE */}
                            <span className="text-sm font-bold text-primary whitespace-nowrap bg-primary/5 px-2 py-1 rounded-lg">
                                {job?.salary} LPA
                            </span>
                        </div>

                        {/* SUB-INFO */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-medium text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job?.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {daysAgoFunction(job?.createdAt)}
                            </span>
                            {job?.position && (
                                <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {job?.position} Pos.
                                </span>
                            )}
                        </div>

                        {/* SKILLS & APPLY BUTTON */}
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                            <div className="flex flex-wrap gap-1.5">
                                {(job?.requirements || []).slice(0, 2).map((req: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-[10px] font-medium px-2 py-0 bg-secondary/30 border-none">
                                        {req}
                                    </Badge>
                                ))}
                                {job?.requirements?.length > 2 && (
                                    <span className="text-[10px] text-muted-foreground self-center">+{job.requirements.length - 2}</span>
                                )}
                            </div>
                            
                            <Button 
                                onClick={handleApply}
                                size="sm" 
                                className="h-8 rounded-lg text-[11px] font-bold px-4 bg-primary hover:bg-primary/90 flex items-center gap-2 group/btn"
                            >
                                Apply Now
                                <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default LatestJobCards;