import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

// Import your CampusLink Lottie animation here
import campusAnimation from './assets/animations/campus-student.json';



const HeroSection = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: "🗣️",
      title: "Campus Feed",
      description: "Stay updated with announcements"
    },
    {
      icon: "🧳",
      title: "Lost & Found",
      description: "Report and find lost items"
    },
    {
      icon: "🛠️",
      title: "Hostel Support",
      description: "Quick hostel services"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10"></div>

      <div className="relative z-10">
        {/* Main Hero Section */}
        <motion.div 
          className="container mx-auto px-4 py-16 lg:py-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
            
            {/* Left Side - Text Section */}
            <motion.div 
              className="space-y-8 text-center lg:text-left"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                Streamline Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Campus Life
                </span>{" "}
                with One Click
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
                variants={itemVariants}
              >
                Announcements, timetables, and hostel services — all in one place
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Features
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual Section */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              variants={itemVariants}
            >
              <div className="w-full max-w-lg">
                <Lottie
                  animationData={campusAnimation}
                  loop={true}
                  autoplay={true}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Strip */}
        <motion.div 
          className="bg-white/70 backdrop-blur-sm border-t border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                  whileHover={{ 
                    translateY: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
