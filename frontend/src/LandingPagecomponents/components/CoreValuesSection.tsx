import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, DollarSign, Lightbulb, GraduationCap } from "lucide-react";

interface CoreValuesSectionProps {
  darkMode?: boolean
}

const coreValues = [
  {
    icon: Globe,
    title: "Accessibility",
    description: "Therapy without borders"
  },
  {
    icon: DollarSign,
    title: "Affordability",
    description: "Quality care within every families reach"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Embracing technology and creativity to make therapy engaging and effective"
  },
  {
    icon: GraduationCap,
    title: "Expert-lead, Research Driven",
    description: "Bringing knowledge and care together for real results"
  }
];

const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ darkMode = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="core-values" 
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
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Core <span className={darkMode ? 'text-accent-blue' : 'text-[#1A1A1A]'}>
              Values
            </span>
          </h2>
          <div className={`w-24 h-1 rounded-full mx-auto mt-6 ${
            darkMode ? 'bg-accent-blue' : 'bg-[#1A1A1A]'
          }`} />
        </motion.div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`group h-full p-6 sm:p-8 rounded-2xl border transition-all duration-300 text-center ${
                darkMode 
                  ? 'border-gray-700 bg-black hover:border-accent-blue/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
                  : 'border-[#E6E6E6] bg-white hover:border-accent-blue/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'
              }`}>
                <motion.div 
                  className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    darkMode ? 'bg-accent-blue/30 group-hover:bg-accent-blue/50' : 'bg-accent-blue/40 group-hover:bg-accent-blue/60'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <value.icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 ${
                    darkMode ? 'text-accent-blue' : 'text-accent-blue'
                  }`} />
                </motion.div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {value.title}
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;

