import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 

const LatestJobs = () => {
  const { allJobs } = useSelector((store: any) => store.job);

  const latestJobs = allJobs?.length > 0 
    ? [...allJobs].reverse().slice(0, 6) 
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, 
      },
    },
  };

  return (
    <section className="py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Latest & <span className="text-primary">Top</span> Job Openings
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Discover your next career move from the most recent opportunities posted by top-tier companies.
            </p>
          </div>
          <Link to="/jobs" className="hidden md:block">
            <Button variant="ghost" className="group gap-2 hover:bg-primary/5 transition-colors">
              View All 
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {latestJobs.length > 0 ? (
            latestJobs.map((job: any, i: number) => (
              <LatestJobCards key={job?._id} job={job} index={i} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <ArrowRight className="h-8 w-8 text-muted-foreground rotate-45" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">No recent jobs available right now.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center md:hidden"
        >
          <Link to="/jobs">
            <Button variant="outline" className="gap-2 w-full h-12 shadow-sm">
              View All Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestJobs;
