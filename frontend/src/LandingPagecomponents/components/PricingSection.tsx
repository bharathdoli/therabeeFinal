import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Zap, Crown, Star, ArrowRight } from "lucide-react";

interface PricingSectionProps {
  darkMode?: boolean
}

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for families just beginning their therapy journey",
    icon: Zap,
    features: [
      "Up to 4 therapy sessions per month",
      "Basic progress tracking",
      "Email support",
      "Secure video sessions",
      "Calendar integration",
      "Basic reports"
    ],
    buttonText: "Sign In",
    isPopular: false
  },
  {
    name: "Standard",
    price: "$59",
    period: "/month",
    description: "Most popular choice for regular therapy sessions",
    icon: Star,
    features: [
      "Up to 8 therapy sessions per month",
      "Advanced progress tracking",
      "Priority email & chat support",
      "HD video sessions with recording",
      "Smart scheduling assistant",
      "Detailed progress reports",
      "Family portal access",
      "Mobile app included"
    ],
    buttonText: "Sign In",
    isPopular: true
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Comprehensive solution for intensive therapy programs",
    icon: Crown,
    features: [
      "Unlimited therapy sessions",
      "Premium progress analytics",
      "24/7 phone & chat support",
      "4K video sessions with recording",
      "AI-powered scheduling",
      "Comprehensive progress reports",
      "Multi-family management",
      "API access",
      "Custom integrations",
      "Dedicated account manager"
    ],
    buttonText: "Sign In",
    isPopular: false
  }
];

const PricingSection: React.FC<PricingSectionProps> = ({ darkMode = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="pricing" 
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
            Choose Your <span className={darkMode ? 'text-accent-blue' : 'text-[#1A1A1A]'}>
              Perfect Plan
            </span>
          </h2>
          <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Flexible pricing options designed to fit your family's needs and budget. 
            All plans include our core security and privacy features.
          </p>
          <div className={`w-24 h-1 rounded-full mx-auto mt-6 ${
            darkMode ? 'bg-accent-blue' : 'bg-[#1A1A1A]'
          }`} />
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <Card 
                className={`relative border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full ${
                  plan.isPopular 
                    ? `ring-2 ${darkMode ? 'ring-accent-blue' : 'ring-accent-blue'}` 
                    : ''
                } ${
                  darkMode 
                    ? 'bg-black border-gray-700' 
                    : 'bg-white border-[#E6E6E6]'
                }`}
              >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg ${
                    darkMode 
                      ? 'bg-accent-blue text-white' 
                      : 'bg-black text-white'
                  }`}>
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8">
                {/* Plan Icon */}
                <div className={`mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  plan.isPopular 
                    ? darkMode ? 'bg-accent-blue/40' : 'bg-accent-blue/50' 
                    : darkMode 
                      ? 'bg-accent-blue/20' 
                      : 'bg-accent-blue/30'
                }`}>
                  <plan.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${
                    plan.isPopular ? 'text-white' : darkMode ? 'text-white' : 'text-[#1A1A1A]'
                  }`} />
                </div>

                {/* Plan Name */}
                <CardTitle className={`text-xl sm:text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {plan.name}
                </CardTitle>

                {/* Price */}
                <div className="mb-4">
                  <span className={`text-3xl sm:text-4xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm sm:text-base ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {plan.period}
                  </span>
                </div>

                {/* Description */}
                <p className={`text-sm sm:text-base ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                {/* Features List */}
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        darkMode 
                          ? 'bg-accent-blue' 
                          : 'bg-accent-blue'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link to="/login">
                  <Button 
                    className={`w-full text-base sm:text-lg py-4 sm:py-6 font-semibold transition-colors duration-300 flex items-center justify-center ${
                      plan.isPopular 
                        ? `${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-[#1A1A1A]'}` 
                        : darkMode 
                          ? 'border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white' 
                          : 'border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                    }`}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div 
          className="text-center mt-12 sm:mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <div className={`rounded-2xl p-4 sm:p-6 max-w-md mx-auto shadow-xl border ${
            darkMode 
              ? 'bg-black border-gray-700' 
              : 'bg-white border-[#E6E6E6]'
          }`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
              darkMode ? 'bg-accent-blue' : 'bg-accent-blue'
            }`}>
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className={`font-semibold text-base sm:text-lg mb-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              30-Day Money Back Guarantee
            </h3>
            <p className={`text-xs sm:text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;