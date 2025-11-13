import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "../../assets/hero-therapy-session.jpg";

interface HeroSectionProps {
  darkMode?: boolean
  onBookDemoClick?: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ darkMode = false, onBookDemoClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center transition-colors duration-300 overflow-hidden ${
        darkMode 
          ? 'bg-black' 
          : 'bg-[#F9F9F9]'
      }`}
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: darkMode 
            ? 'linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      ></div>
      

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-8">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className={`text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.1] tracking-tight ${
              darkMode ? 'text-white' : 'text-[#1A1A1A]'
            }`}>
              Nurturing your child's development with{" "}
              <span className={darkMode ? 'text-accent-blue' : 'text-[#1A1A1A]'}>
                Qualified Therapists
              </span>.
              <br className="hidden sm:block" />
              <span className={`text-3xl md:text-4xl lg:text-5xl font-semibold ${
                darkMode ? 'text-gray-300' : 'text-[#4D4D4D]'
              }`}>
                {" "}Anytime. Anywhere.
              </span>
            </h1>
            <p className={`text-base md:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal ${
              darkMode ? 'text-gray-300' : 'text-[#4D4D4D]'
            }`}>
              Therabee helps families access expert therapy that is simple, supportive and effective.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Link to="/login">
              <Button 
                size="lg" 
                className={`text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 font-bold transition-colors ${
                  darkMode 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-[#1A1A1A]'
                }`}
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={onBookDemoClick}
              className={`text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 font-bold transition-colors ${
                darkMode 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Book Demo Session
            </Button>
          </motion.div>

          {/* Partner Logos */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={heroImage}
              alt="Child having a therapy session with a professional therapist via video call"
              className="w-full h-auto rounded-2xl"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;