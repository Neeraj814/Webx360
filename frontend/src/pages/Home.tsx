import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import LatestJobs from "@/components/LatestJobs";
import FeaturedJobs from "@/components/FeaturedJobs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs"; 
import useGetAllCompanies from "@/hooks/useGetAllCompanies"; // Added this hook
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Fetch both Jobs and Companies on mount so the page isn't empty
  useGetAllJobs(); 
  useGetAllCompanies(); 

  const { user } = useSelector((store: any) => store.auth);
  const navigate = useNavigate();

  // ✅ FIXED: Removed the automatic redirect to /admin/companies.
  // Now, both Students and Recruiters (Babuji) can see the Home/Hero section.
  useEffect(() => {
    // Only redirect if there is a specific logic needed, 
    // otherwise, leave this empty so everyone stays on the Home page.
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* This will now be visible to everyone! */}
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      
      {/* This section will now show your companies if you've created them */}
      <FeaturedJobs /> 
      
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;