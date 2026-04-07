import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import LatestJobs from "@/components/LatestJobs";
import FeaturedJobs from "@/components/FeaturedJobs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs"; 
import useGetAllCompanies from "@/hooks/useGetAllCompanies"; 
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs(); 
  useGetAllCompanies(); 

  const { user } = useSelector((store: any) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <FeaturedJobs /> 
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
