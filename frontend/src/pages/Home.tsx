import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/HeroSection";
import CompanyMarquee from "@/components/CompanyMarquee";
import CategoryCarousel from "@/components/CategoryCarousel";
import LatestJobs from "@/components/LatestJobs";
import FeaturedJobs from "@/components/FeaturedJobs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const Home = () => {
  useGetAllJobs();
  useGetAllCompanies();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CompanyMarquee />
      <CategoryCarousel />
      <LatestJobs />
      <FeaturedJobs />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
