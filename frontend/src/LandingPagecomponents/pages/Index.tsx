import HeroSection from "../components/HeroSection";
import VisionSection from "../components/VisionSection";
import FeaturesSection from "../components/FeaturesSection";
import CoreValuesSection from "../components/CoreValuesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <VisionSection />
      <FeaturesSection />
      <CoreValuesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
