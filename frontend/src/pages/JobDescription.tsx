import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  ArrowLeft,
  Bookmark,
  Share2,
  ExternalLink, // Added for external redirect icon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";

const JobDescription = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { singleJob } = useSelector((store: any) => store.job);
  const { user } = useSelector((store: any) => store.auth);

  const isInitiallyApplied = singleJob?.applications?.some((app: any) => app.applicant === user?._id) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some((app: any) => app.applicant === user?._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [id, dispatch, user?._id]);

  // ✅ Updated handleApply with Redirect Logic
  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in before applying for a job.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Check if the job requires external application
    if (singleJob?.isExternal && singleJob?.jobWebsite) {
      toast({
        title: "External Application",
        description: "Redirecting to the official company website...",
      });
      
      // Delay slightly so user can read the toast
      setTimeout(() => {
        window.open(singleJob.jobWebsite, "_blank", "noopener,noreferrer");
      }, 1000);
      return;
    }

    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));

        toast({
          title: "Success",
          description: res.data.message,
        });
      }
    } catch (error: any) {
      // Fallback: If internal API fails but a website link exists, redirect anyway
      if (singleJob?.jobWebsite) {
        toast({
          title: "Redirecting...",
          description: "Internal application unavailable. Opening official site.",
        });
        window.open(singleJob.jobWebsite, "_blank");
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  if (!singleJob) return <div className="text-center py-20">Loading Job Details...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-xl border bg-card p-6 card-shadow">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-heading text-lg font-bold text-primary">
                  {singleJob?.company?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="font-heading text-2xl font-bold text-foreground">
                    {singleJob?.title}
                  </h1>
                  <p className="text-muted-foreground mt-1">{singleJob?.company?.name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {singleJob?.jobType}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {singleJob?.salary} LPA
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 card-shadow">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                Job Description
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {singleJob?.description}
              </p>

              <h3 className="font-heading text-base font-semibold text-foreground mt-6 mb-3">
                Requirements
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  Strong understanding of the core domain
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  Experience Level: {singleJob?.experienceLevel || "Fresher"}
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            <div className="rounded-xl border bg-card p-6 card-shadow space-y-5">
              <Button
                className={`w-full h-12 flex gap-2 ${
                  isApplied ? "bg-gray-400 cursor-not-allowed" : "bg-[#6A38C2] hover:bg-[#5b30a6]"
                }`}
                size="lg"
                onClick={handleApply}
                disabled={isApplied}
              >
                {/* ✅ Updated Button Text for External Jobs */}
                {isApplied 
                    ? "Already Applied" 
                    : singleJob?.isExternal 
                        ? "Apply on Official Site" 
                        : "Apply Now"
                }
                {singleJob?.isExternal && !isApplied && <ExternalLink className="h-4 w-4" />}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="font-medium text-foreground">{singleJob?.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Salary</p>
                    <p className="font-medium text-foreground">{singleJob?.salary} LPA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Posted</p>
                    <p className="font-medium text-foreground">
                      {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDescription;