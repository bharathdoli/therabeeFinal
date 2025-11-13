import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Star, Quote, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface TestimonialsSectionProps {
  darkMode?: boolean
}

const testimonials = [
  {
    name: "Parent of a 7-year-old",
    role: "with ADHD and learning challenges",
    content: "TheraBee has been a turning point for us. The therapists not only helped our son focus and communicate better, but also guided us as parents to support him at home. Every milestone, no matter how small, is celebrated here. We've felt seen, supported, and truly cared for every step of the way. It's more than a therapy center — it's a place filled with hope and heart.",
    rating: 5,
    avatar: "P1"
  },
  {
    name: "Parent of a 5-year-old",
    role: "with Speech Delay",
    content: "Online therapy at TheraBee has been a blessing for us. The team adapted everything — from activities to parent involvement — so smoothly. My daughter actually looks forward to her sessions! It's convenient, consistent, and still full of warmth and care.",
    rating: 5,
    avatar: "P2"
  }
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ darkMode = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }).map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <section 
      id="testimonials" 
      ref={ref}
      className={`py-12 sm:py-16 lg:py-20 transition-colors duration-300 ${
        darkMode 
          ? 'bg-black' 
          : 'bg-[#F9F9F9]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            What Our <span className={darkMode ? 'text-accent-blue' : 'text-[#1A1A1A]'}>
              Community
            </span> Says
          </h2>
          <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Hear from families and therapists who have experienced the difference 
            that Therabee makes in their therapy journey.
          </p>
          <div className={`w-24 h-1 rounded-full mx-auto mt-6 ${
            darkMode ? 'bg-accent-blue' : 'bg-[#1A1A1A]'
          }`} />
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4 sm:px-6"
                >
                  <Card className={`border shadow-lg hover:shadow-xl max-w-4xl mx-auto transition-shadow duration-300 ${
                    darkMode 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-white border-[#E6E6E6]'
                  }`}>
                    <CardContent className="p-6 sm:p-8 text-center">
                      {/* Quote Icon */}
                      <div className="mb-4 sm:mb-6">
                        <Quote className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto ${
                          darkMode ? 'text-accent-blue/20' : 'text-accent-blue/30'
                        }`} />
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className={`text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 italic ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        "{testimonial.content}"
                      </blockquote>

                      {/* Rating */}
                      <div className="flex justify-center mb-4 sm:mb-6">
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-center space-x-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold shadow-lg ${
                          darkMode 
                            ? 'bg-accent-blue text-white' 
                            : 'bg-accent-blue text-white'
                        }`}>
                          {testimonial.avatar}
                        </div>
                        <div className="text-left">
                          <div className={`font-semibold text-sm sm:text-base ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {testimonial.name}
                          </div>
                          <div className={`text-xs sm:text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <motion.div 
            className="flex justify-center mt-6 sm:mt-8 space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? darkMode 
                      ? 'bg-accent-blue' 
                      : 'bg-accent-blue'
                    : darkMode 
                      ? 'bg-accent-blue/30 hover:bg-accent-blue/50' 
                      : 'bg-accent-blue/30 hover:bg-accent-blue/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Box */}
        <motion.div 
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <div className={`rounded-2xl p-8 sm:p-12 lg:p-16 shadow-lg max-w-6xl mx-auto border ${
            darkMode 
              ? 'bg-black border-gray-700' 
              : 'bg-white border-[#E6E6E6]'
          }`}>
            <h3 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Ready to take next step?
            </h3>
            <p className={`text-base sm:text-lg md:text-xl mb-8 sm:mb-10 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              join families growing with therabee
            </p>
            <Link to="/login">
              <button className={`px-8 sm:px-12 py-4 sm:py-5 md:py-6 font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300 text-lg sm:text-xl md:text-2xl flex items-center justify-center mx-auto ${
                darkMode 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-[#1A1A1A]'
              }`}>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
