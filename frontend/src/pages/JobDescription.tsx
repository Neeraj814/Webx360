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
  ExternalLink,
  Loader2,
  CheckCircle2,
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Normalize user identification across MySQL / MongoDB models
  const userId = user?._id || user?.id;

  const isInitiallyApplied = Boolean(
    singleJob?.applications?.some((app: any) => {
      const applicantId = typeof app === "object" ? (app?.applicant?._id || app?.applicant?.id || app?.applicant) : app;
      return applicantId === userId;
    })
  );

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  useEffect(() => {
    const fetchSingleJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });

        if (res.data?.success) {
          const job = res.data.job;
          dispatch(setSingleJob(job));

          const alreadyApplied = Array.isArray(job?.applications) && job.applications.some((app: any) => {
            const applicantId = typeof app === "object" ? (app?.applicant?._id || app?.applicant?.id || app?.applicant) : app;
            return applicantId === userId;
          });

          setIsApplied(Boolean(alreadyApplied));
        }
      } catch (error) {
        console.error("Failed to fetch job details:", error);
        toast({
          title: "Error",
          description: "Unable to retrieve job listing details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJob();
  }, [id, dispatch, userId]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in before applying for this role.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (singleJob?.isExternal && singleJob?.jobWebsite) {
      toast({
        title: "Redirecting to Career Site",
        description: "Opening the company's official job board...",
      });
      setTimeout(() => {
        window.open(singleJob.jobWebsite, "_blank", "noopener,noreferrer");
      }, 700);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        setIsApplied(true);
        const existingApplications = Array.isArray(singleJob?.applications) ? singleJob.applications : [];
        const updatedSingleJob = {
          ...singleJob,
          applications: [...existingApplications, { applicant: userId }],
        };
        dispatch(setSingleJob(updatedSingleJob));

        toast({
          title: "Application Submitted",
          description: res.data.message || "Your application was sent successfully.",
        });
      }
    } catch (error: any) {
      if (singleJob?.jobWebsite) {
        toast({
          title: "Direct Application Unavailable",
          description: "Redirecting to the official company careers page.",
        });
        window.open(singleJob.jobWebsite, "_blank", "noopener,noreferrer");
      } else {
        toast({
          title: "Application Failed",
          description: error.response?.data?.message || "Something went wrong while submitting.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: singleJob?.title || "Job Opportunity",
          text: `Check out this opening for ${singleJob?.title} at ${singleJob?.company?.name || "WebX360"}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Job posting link copied to clipboard.",
        });
      }
    } catch (err) {
      // User dismissed share dialog
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    toast({
      title: !isBookmarked ? "Job Saved" : "Bookmark Removed",
      description: !isBookmarked ? "Added to your saved positions list." : "Removed from saved positions.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground font-mono">Loading job specifications...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container py-24 text-center max-w-md mx-auto px-4">
          <h2 className="text-xl font-bold text-foreground font-heading">Job Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This vacancy might have expired or been removed by the employer.
          </p>
          <Button className="mt-6" onClick={() => navigate("/jobs")}>
            Browse Available Jobs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const companyName = typeof singleJob?.company === "string" ? singleJob.company : singleJob?.company?.name || "Hiring Company";
  const applicantCount = Array.isArray(singleJob?.applications) ? singleJob.applications.length : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="container py-8 max-w-6xl mx-auto px-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Listings
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Header Box */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-heading text-xl font-bold text-primary uppercase">
                    {companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                      {singleJob?.title}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">{companyName}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {singleJob?.jobType && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          {singleJob.jobType}
                        </Badge>
                      )}
                      {singleJob?.salary && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          {singleJob.salary} LPA
                        </Badge>
                      )}
                      {singleJob?.experienceLevel && (
                        <Badge variant="outline" className="text-xs font-medium">
                          {singleJob.experienceLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground mb-3">
                    Position Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                    {singleJob?.description || "No specific job overview provided."}
                  </p>
                </div>

                {/* Requirements */}
                <div className="pt-4 border-t">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-3">
                    Role Requirements & Specifications
                  </h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {Array.isArray(singleJob?.requirements) && singleJob.requirements.length > 0 ? (
                      singleJob.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>Hands-on experience and solid understanding of core modern engineering practices.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>Experience Level: {singleJob?.experienceLevel || "Fresher / Entry-Level"}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Right Action Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-5"
            >
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
                <Button
                  className={`w-full h-12 flex gap-2 rounded-xl font-semibold transition-all ${
                    isApplied ? "bg-muted text-muted-foreground cursor-not-allowed" : ""
                  }`}
                  size="lg"
                  onClick={handleApply}
                  disabled={isApplied || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : isApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Already Applied
                    </>
                  ) : singleJob?.isExternal ? (
                    <>
                      Apply on Official Site
                      <ExternalLink className="h-4 w-4" />
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className={`flex-1 gap-2 text-xs font-semibold ${isBookmarked ? "text-primary border-primary bg-primary/5" : ""}`}
                    onClick={handleToggleBookmark}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary" : ""}`} />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 text-xs font-semibold" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <div className="space-y-4 pt-5 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Work Location</p>
                      <p className="font-medium text-foreground">{singleJob?.location || "Remote"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Compensation</p>
                      <p className="font-medium text-foreground">
                        {singleJob?.salary ? `${singleJob.salary} LPA` : "Not Disclosed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Employment Type</p>
                      <p className="font-medium text-foreground">{singleJob?.jobType || "Full-time"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Applicants</p>
                      <p className="font-medium text-foreground">{applicantCount} candidate{applicantCount !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Date Posted</p>
                      <p className="font-medium text-foreground">
                        {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default JobDescription;
