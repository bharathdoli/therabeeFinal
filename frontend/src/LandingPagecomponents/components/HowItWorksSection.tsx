import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { UserPlus, Search, CreditCard, Video, TrendingUp } from "lucide-react";

interface HowItWorksSectionProps {
  darkMode?: boolean
}

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Parents and therapists register with secure verification and background checks.",
    number: "01"
  },
  {
    icon: Search,
    title: "Browse Therapists",
    description: "Explore verified therapist profiles, specializations, and real-time availability.",
    number: "02"
  },
  {
    icon: CreditCard,
    title: "Book & Pay",
    description: "Secure appointment booking with integrated payments via Stripe and Razorpay.",
    number: "03"
  },
  {
    icon: Video,
    title: "Attend Session",
    description: "Join high-quality video sessions powered by Zoom with interactive therapy tools.",
    number: "04"
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Receive detailed progress reports, session summaries, and milestone updates.",
    number: "05"
  }
];

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ darkMode = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="how-it-works" 
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
            How <span className={darkMode ? 'text-accent-blue' : 'text-[#1A1A1A]'}>
              Therabee
            </span> Works
          </h2>
          <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get started with therapy in just 5 simple steps. Our streamlined process 
            makes it easy for families to connect with the right therapist.
          </p>
          <div className={`w-24 h-1 rounded-full mx-auto mt-6 ${
            darkMode ? 'bg-accent-blue' : 'bg-[#1A1A1A]'
          }`} />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2">
            <div className={`w-0.5 h-full ${
              darkMode ? 'bg-accent-blue/40' : 'bg-accent-blue/30'
            }`} />
          </div>

          {/* Steps */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={index}
                  className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                >
                  {/* Spacer for right-aligned items */}
                  {!isEven && <div className="flex-1 hidden lg:block"></div>}

                  {/* For left boxes: Box first, then circle */}
                  {isEven && (
                    <>
                      {/* Content */}
                      <div className="flex-1 w-full">
                        <div className={`rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border ${
                          darkMode 
                            ? 'bg-black border-gray-700' 
                            : 'bg-gradient-to-br from-white to-accent-blue/5 border-accent-blue/20'
                        }`}>
                          <div className="flex items-center justify-center lg:justify-start mb-4">
                            <span className={`text-4xl sm:text-5xl lg:text-6xl font-bold mr-4 ${
                              darkMode ? 'text-accent-blue/20' : 'text-black'
                            }`}>
                              {step.number}
                            </span>
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                              darkMode ? 'bg-accent-blue/40' : 'bg-black'
                            }`}>
                              <step.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                darkMode ? 'text-white' : 'text-white'
                              }`} />
                            </div>
                          </div>
                          <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center lg:text-left ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-sm sm:text-base leading-relaxed text-center lg:text-left ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Center Circle (Desktop) */}
                      <div className="hidden lg:flex items-center justify-center relative z-10 w-16">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-accent-blue/40' : 'bg-accent-blue/50'
                        }`}>
                          <div className={`w-8 h-8 rounded-full ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                          }`} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* For right boxes: Circle first, then box */}
                  {!isEven && (
                    <>
                      {/* Center Circle (Desktop) */}
                      <div className="hidden lg:flex items-center justify-center relative z-10 w-16">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-accent-blue/40' : 'bg-accent-blue/50'
                        }`}>
                          <div className={`w-8 h-8 rounded-full ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                          }`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 w-full">
                        <div className={`rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border ${
                          darkMode 
                            ? 'bg-black border-gray-700' 
                            : 'bg-gradient-to-br from-white to-accent-blue/5 border-accent-blue/20'
                        }`}>
                          <div className="flex items-center justify-center lg:justify-start mb-4">
                            <span className={`text-4xl sm:text-5xl lg:text-6xl font-bold mr-4 ${
                              darkMode ? 'text-accent-blue/20' : 'text-black'
                            }`}>
                              {step.number}
                            </span>
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                              darkMode ? 'bg-accent-blue/40' : 'bg-black'
                            }`}>
                              <step.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                darkMode ? 'text-white' : 'text-white'
                              }`} />
                            </div>
                          </div>
                          <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center lg:text-left ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-sm sm:text-base leading-relaxed text-center lg:text-left ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Spacer for left-aligned items */}
                  {isEven && <div className="flex-1 hidden lg:block"></div>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
