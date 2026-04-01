import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { useSelector } from "react-redux"; // Added

const FeaturedJobs: React.FC = () => {
  // 1. Get real data from Redux
  const { allJobs } = useSelector((store: any) => store.job);

  // 🔥 Container animation (stagger children)
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // 🔥 Item animation
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.section
      className="bg-muted/50 py-16 lg:py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        {/* Heading Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Featured Jobs
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked opportunities from top companies
            </p>
          </div>

          {/* Desktop Button */}
          <Link to="/jobs" className="hidden md:block">
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="gap-2 group">
                View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Animated Job Cards */}
        <motion.div
          className="mt-8 grid gap-5 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* 2. Map through real jobs instead of mockJobs */}
          {allJobs?.length > 0 ? (
            allJobs.slice(0, 4).map((job: any, i: number) => (
              <motion.div
                key={job._id} // Using MongoDB ID
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <JobCard job={job} index={i} />
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-2 text-center py-10">
              No featured jobs found at the moment.
            </p>
          )}
        </motion.div>

        {/* Mobile Button */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/jobs">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="gap-2 w-full h-12">
                View All Jobs <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedJobs;