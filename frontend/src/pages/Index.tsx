import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedJobs from "@/components/FeaturedJobs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <CategorySection />
    <FeaturedJobs />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
