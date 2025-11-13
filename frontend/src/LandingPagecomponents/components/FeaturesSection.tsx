import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Brain, Activity, MessageSquare, Heart, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturesSectionProps {
  darkMode?: boolean
}

const services = [
  {
    icon: Brain,
    title: "BEHAVIOR THERAPY",
    description: "Behavior therapy is crucial for helping children with autism and ADHD develop better self-regulation, reduce challenging behaviors, and improve attention and focus. It fosters positive social interactions, enhances adaptability across environments, and lays the foundation for long-term emotional and behavioral stability."
  },
  {
    icon: Activity,
    title: "OCCUPATIONAL THERAPY",
    description: "Occupational therapy supports children with autism and ADHD in improving sensory processing, motor coordination, and daily living skills. It helps them gain independence, manage sensory sensitivities, and engage more meaningfully in school, home, and social environments."
  },
  {
    icon: MessageSquare,
    title: "SPEECH THERAPY",
    description: "Speech therapy helps children with autism and ADHD strengthen their communication and language skills. It enables them to express needs and emotions effectively, enhances social communication and attention, and supports meaningful participation in interactions at home, school, and the community."
  },
  {
    icon: Heart,
    title: "CHILD/ADOLESCENT COUNSELLING",
    description: "Counselling provides emotional support for children with autism and ADHD by helping them understand and manage their feelings, build resilience, and cope with stress. It also addresses anxiety, low self-esteem, and peer challenges, promoting emotional balance and overall mental well-being."
  },
  {
    icon: Users,
    title: "PARENT COACHING",
    description: "Parent coaching equips caregivers of children with autism and ADHD with practical strategies to manage behaviors, establish structure and routines, and reinforce therapy goals at home. It strengthens the parent–child bond, promotes consistency across settings, and empowers families to support their child's long-term development and emotional growth."
  }
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ darkMode = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="features" 
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
            Our <span className={darkMode ? 'text-accent-blue' : 'text-[#1A1A1A]'}>
              Services
            </span>
          </h2>
          <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Comprehensive therapy services designed to support children with autism and ADHD 
            and empower their families.
          </p>
          <div className={`w-24 h-1 rounded-full mx-auto mt-6 ${
            darkMode ? 'bg-accent-blue' : 'bg-[#1A1A1A]'
          }`} />
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className={`group h-full border transition-all duration-300 ${
                darkMode 
                  ? 'border-gray-700 bg-black hover:border-accent-blue/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
                  : 'border-[#E6E6E6] bg-white hover:border-accent-blue/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'
              }`}>
              <CardHeader className="text-center pb-4">
                <motion.div 
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    darkMode ? 'bg-accent-blue/30 group-hover:bg-accent-blue/50' : 'bg-accent-blue/40 group-hover:bg-accent-blue/60'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <service.icon className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300 ${
                    darkMode ? 'text-accent-blue' : 'text-accent-blue'
                  }`} />
                </motion.div>
                <CardTitle className={`text-lg sm:text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className={`text-xs sm:text-sm font-semibold mb-2 ${
                    darkMode ? 'text-accent-blue' : 'text-accent-blue'
                  }`}>
                    Importance:
                  </p>
                </div>
                <p className={`text-sm sm:text-base leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {service.description}
                </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;