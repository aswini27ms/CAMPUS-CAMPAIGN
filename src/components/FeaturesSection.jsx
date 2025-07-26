import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📢',
      title: 'Real-time Announcements',
      description: 'Get instant notifications about campus events, class cancellations, and important updates.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📅',
      title: 'Smart Timetables',
      description: 'Personalized class schedules with automatic updates and conflict detection.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🏠',
      title: 'Hostel Management',
      description: 'Room bookings, maintenance requests, and hostel services at your fingertips.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: '🔍',
      title: 'Lost & Found Hub',
      description: 'Report lost items and help others find their belongings with our community system.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '💬',
      title: 'Campus Community',
      description: 'Connect with classmates, join study groups, and participate in campus discussions.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Access all features seamlessly on any device with our responsive design.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Campus Life</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CampusLink brings together all essential student services in one powerful platform,
            designed to make your university experience smoother and more connected.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
